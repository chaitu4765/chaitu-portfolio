// Transport tests are isolated from the network and never send an email.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');

const compiled = ts.transpileModule(fs.readFileSync('src/lib/contact.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const input = { name: '  Test Visitor  ', email: ' visitor@example.com ', company: ' Example Team ', message: ' A test enquiry about a website. ' };
const config = { serviceId: 'test_service', templateId: 'test_template', publicKey: 'public_test_key' };

function fixture(response = () => Promise.resolve({ ok: true, status: 200 }), environment = 'production') {
  const calls = [];
  const context = {
    exports: {}, AbortController, setTimeout, clearTimeout, TypeError,
    process: { env: { NODE_ENV: environment } },
    fetch: async (...args) => { calls.push(args); return response(...args); },
  };
  vm.runInNewContext(compiled, context);
  return { ...context.exports, calls };
}

async function main() {
  const test = fixture();
  const validation = test.validateContact(input);
  assert.equal(Object.keys(validation.errors).length, 0);
  assert.equal(validation.fields.name, 'Test Visitor');
  assert.equal(validation.fields.email, 'visitor@example.com');
  assert.equal(Object.keys(test.validateContact({ name: '', company: '', email: 'invalid', message: 'short' }).errors).length, 3);
  assert.equal(Object.keys(test.validateContact({ ...input, company: '' }).errors).length, 0);
  assert.ok(test.validateContact({ ...input, name: 'a'.repeat(101) }).errors.name);
  assert.ok(test.validateContact({ ...input, message: 'a'.repeat(5001) }).errors.message);
  assert.ok(test.validateContact({ ...input, company: 'a'.repeat(141) }).errors.company);
  await assert.rejects(test.sendContact({ ...input, email: 'not-an-email' }, config), /check the form/);
  await assert.rejects(test.sendContact(input, { ...config, publicKey: '' }), /temporarily unavailable/);
  assert.equal(test.calls.length, 0, 'Invalid or unconfigured requests must never be submitted');

  await test.sendContact(input, config);
  assert.equal(test.calls.length, 1);
  const [url, request] = test.calls[0];
  assert.equal(url, 'https://api.emailjs.com/api/v1.0/email/send');
  assert.equal(request.method, 'POST');
  assert.equal(request.headers['Content-Type'], 'application/json');
  const body = JSON.parse(request.body);
  assert.equal(body.service_id, config.serviceId);
  assert.equal(body.template_id, config.templateId);
  assert.equal(body.user_id, config.publicKey);
  assert.equal(body.template_params.reply_to, 'visitor@example.com');
  assert.equal(body.template_params.from_name, 'Test Visitor');
  assert.match(body.template_params.message, /Email: visitor@example.com/);
  assert.match(body.template_params.message, /Company: Example Team/);
  assert.equal(body.template_params.message_body, input.message.trim());
  assert.equal('accessToken' in body, false, 'Never ship a private key');
  assert.equal('to_email' in body.template_params, false, 'Recipient must stay fixed in the EmailJS template');

  for (const code of [400, 403, 422, 429, 500]) {
    const failed = fixture(async () => ({ ok: false, status: code, text: async () => 'Provider error' }));
    await assert.rejects(failed.sendContact(input, config), code === 429 ? /sending limit/ : /could not be sent/);
    assert.equal(failed.calls.length, 1, 'Errors must not automatically retry or send duplicates');
  }
  const diagnostic = fixture(async () => ({ ok: false, status: 400, text: async () => 'The template ID not found' }), 'development');
  await assert.rejects(diagnostic.sendContact(input, config), /EmailJS 400: The template ID not found/);
  const offline = fixture(async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(offline.sendContact(input, config), /Check your connection/);
  const timeout = fixture((_, request) => new Promise((resolve, reject) => {
    request.signal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true });
  }));
  await assert.rejects(timeout.sendContact(input, config, 5), /Sending timed out/);
  assert.equal(timeout.calls.length, 1);
  console.log('PASS: validation, EmailJS payload, fixed-recipient contract, success, rejection, quota, diagnostics, offline handling, and timeout. No emails sent.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
