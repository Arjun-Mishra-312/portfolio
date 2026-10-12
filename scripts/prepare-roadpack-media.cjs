/* Reproducible, lossless-content resize/encode of the user's supplied captures. */
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const sources = [
  ['coffee', '07326f7e-5c4d-4e12-a97a-34170310e307'],
  ['stop-detail', '8d449c89-c9ff-4ff6-8c47-40dc970db836'],
  ['itinerary', '648fee0f-a0b6-4b0f-93b8-9b894edf6cb6'],
  ['map', '10992498-d8d0-4938-bdd5-e3bcace8b866'],
  ['ipad', '61b6339d-36cf-41a8-b3c6-2488a1f2cfb4'],
  ['vote', '4ed33bf4-0124-46bc-8aa5-a5b498829951'],
  ['activity', 'a59597db-2009-40d1-95a7-3c573b6cbd87'],
  ['pack', 'd815032a-8e5b-4edf-b6ee-82e4690639c4'],
];
(async () => {
  const target = path.join(__dirname, '../public/roadpack/screens');
  await fs.mkdir(target, { recursive: true });
  for (const [name, id] of sources) {
    const source = path.join(process.env.LOCALAPPDATA, `Temp/codex-clipboard-${id}.png`);
    await sharp(source).resize({ width: name === 'ipad' ? 1600 : 780, withoutEnlargement: true }).webp({ quality: 88 }).toFile(path.join(target, `${name}.webp`));
  }
  console.log('Prepared 8 real Roadpack screenshots.');
})();
