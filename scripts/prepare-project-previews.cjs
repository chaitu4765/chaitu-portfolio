const fs = require('node:fs/promises');
const sharp = require('sharp');

// Homepage capture URLs are temporary; keep downloaded originals out of the site bundle.
async function main() {
  const sources = JSON.parse(await fs.readFile('.reference/homepages.json', 'utf8'));
  await fs.mkdir('public/images/projects', { recursive: true });
  const results = await Promise.all(sources.map(async ({ slug, screenshot, url }) => {
    const response = await fetch(screenshot);
    if (!response.ok) throw new Error(`${slug}: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(`.reference/${slug}-homepage.png`, bytes);
    const meta = await sharp(bytes).metadata();
    const output = `public/images/projects/${slug}.webp`;
    await sharp(bytes).resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 88, effort: 6 }).toFile(output);
    const stat = await fs.stat(output);
    return { slug, url, capturedAt: '2026-10-29', width: meta.width, height: meta.height, bytes: stat.size, originalBytes: bytes.length };
  }));
  await fs.writeFile('.reference/project-preview-sizes.json', JSON.stringify(results, null, 2));
  console.table(results);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
