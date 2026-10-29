export type ContactFields = { name: string; company: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;
export type EmailJSConfig = { serviceId: string; templateId: string; publicKey: string };

export function validateContact(input: ContactFields) {
  const fields = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, value.trim()])) as ContactFields;
  const errors: ContactErrors = {};
  if (!fields.name || fields.name.length > 100) errors.name = 'Enter your name (up to 100 characters).';
  if (fields.company.length > 140) errors.company = 'Keep the company name under 140 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || fields.email.length > 254) errors.email = 'Enter a valid email address so I can reply.';
  if (fields.message.length < 10 || fields.message.length > 5000) errors.message = 'Write a message between 10 and 5,000 characters.';
  return { fields, errors };
}

export function emailTemplateParams(fields: ContactFields) {
  return {
    name: fields.name,
    from_name: fields.name,
    email: fields.email,
    from_email: fields.email,
    reply_to: fields.email,
    company: fields.company || 'Not provided',
    title: `Portfolio enquiry from ${fields.name}`,
    time: new Date().toISOString(),
    message_body: fields.message,
    // Also works with the standard EmailJS Contact Us template's {{message}}.
    message: `Name: ${fields.name}\nEmail: ${fields.email}\nCompany: ${fields.company || 'Not provided'}\n\n${fields.message}`,
  };
}

export async function sendContact(input: ContactFields, config: EmailJSConfig, timeoutMs = 15000) {
  const { fields, errors } = validateContact(input);
  if (Object.keys(errors).length) throw new Error('Please check the form fields and try again.');
  if (!config.serviceId || !config.templateId || !config.publicKey) {
    throw new Error('The form is temporarily unavailable. Please use the email link instead.');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        template_params: emailTemplateParams(fields),
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const detail = (await response.text()).replace(/[\r\n]+/g, ' ').slice(0, 350);
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`EmailJS ${response.status}: ${detail || 'The email service rejected this request.'}`);
      }
      if (response.status === 429) throw new Error('The email service has reached its sending limit. Please try later or email me directly.');
      throw new Error('Your message could not be sent. Please try again or use the email link.');
    }
  } catch (error) {
    if (controller.signal.aborted) throw new Error('Sending timed out. Your message may have gone through; please wait a moment before retrying.');
    if (error instanceof TypeError) throw new Error('Could not reach the email service. Check your connection or email me directly.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
