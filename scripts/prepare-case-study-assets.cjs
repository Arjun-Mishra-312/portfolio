const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

// Originals are preserved. These are size/format derivatives, never regenerated UI.
async function main() {
  const source = path.join(process.cwd(), 'assets/case-studies');
  const target = path.join(process.cwd(), 'public/case-studies');
  await fs.mkdir(target, { recursive: true });
  const files = (await fs.readdir(source)).filter(file => file.endsWith('.png') && !['buildstory-scanner.png', 'buildstory-private-public.png'].includes(file)).sort();
  const manifest = {};
  for (const file of files) {
    const name = path.parse(file).name;
    const info = await sharp(path.join(source, file)).resize({ width: name.startsWith('mune-') ? 1000 : 2000, withoutEnlargement: true }).webp({ quality: 90 }).toFile(path.join(target, name + '.webp'));
    manifest[name] = { width: info.width, height: info.height, bytes: info.size };
  }
  await fs.writeFile(path.join(target, 'dimensions.json'), JSON.stringify(manifest, null, 2) + '\n');
  // Contact sheets are inspection artifacts only; they never appear in the product.
  for (const [group, names] of Object.entries({
    'mune': ['mune-dashboard', 'mune-chat', 'mune-trends', 'mune-recurring'],
    'buildstory': ['buildstory-scanner', 'buildstory-redaction', 'buildstory-turning-points', 'buildstory-private-public'],
    'hackathons': ['llm-graph', 'llm-dependencies', 'llm-chat', 'replate-analyzer', 'replate-shelter', 'replate-request'],
  })) {
    const width = group === 'mune' ? 350 : 700;
    const height = group === 'mune' ? 760 : 500;
    const cols = group === 'mune' ? 4 : 2;
    const composites = [];
    for (let i = 0; i < names.length; i++) {
      const input = await sharp(path.join(source, names[i] + '.png')).resize(width, height, { fit: 'contain', background: '#e5e5e5' }).png().toBuffer();
      composites.push({ input, left: (i % cols) * width, top: Math.floor(i / cols) * height });
    }
    await sharp({ create: { width: width * cols, height: height * Math.ceil(names.length / cols), channels: 3, background: '#e5e5e5' } }).composite(composites).png().toFile(path.join(process.cwd(), 'tmp', group + '-contact-sheet.png'));
  }
  console.log(`Prepared ${files.length} authentic assets (${Math.round(Object.values(manifest).reduce((sum, item) => sum + item.bytes, 0) / 1024)} KB total).`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
