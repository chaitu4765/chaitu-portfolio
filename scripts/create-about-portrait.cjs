const fs = require('node:fs');
const sharp = require('sharp');

async function main() {
  const input = process.argv[2];
  if (!input) throw new Error('Pass the path to the original About photo.');
  const original = fs.readFileSync(input);
  const { width, height } = await sharp(original).metadata();
  const lossless = await sharp(original).webp({ lossless: true, effort: 6 }).toBuffer();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>Ganta Krishna Chaitanya outdoors under a blue sky</title><desc>Original-resolution photograph embedded losslessly in an SVG container; not a vector tracing.</desc><image width="${width}" height="${height}" href="data:image/webp;base64,${lossless.toString('base64')}" preserveAspectRatio="xMidYMid meet"/></svg>`;
  fs.writeFileSync('public/images/chaitanya-about.svg', svg);
  const before = await sharp(original).ensureAlpha().raw().toBuffer();
  const after = await sharp(lossless).ensureAlpha().raw().toBuffer();
  if (!before.equals(after)) throw new Error('Lossless photo verification failed.');
  console.log(`About photo: ${width} × ${height}; original pixels preserved; SVG ${Buffer.byteLength(svg)} bytes.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
