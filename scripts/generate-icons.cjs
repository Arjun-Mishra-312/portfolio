// Original geometric artwork. Rebuild with: node scripts/generate-icons.cjs
// Uses the project's pinned Sharp development dependency.
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const icons = {
  home: {
    colors: ["#4797f3", "#2765d4"],
    shape: '<path d="m16 31 16-14 16 14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 31v14a3 3 0 0 0 3 3h6V36h6v12h6a3 3 0 0 0 3-3V31L32 20Z" fill="#fff"/>',
  },
  work: {
    colors: ["#9e7bea", "#7353c9"],
    shape: '<g fill="#fff"><rect x="18" y="18" width="12" height="12" rx="3"/><rect x="34" y="18" width="12" height="12" rx="3"/><rect x="18" y="34" width="12" height="12" rx="3"/><rect x="34" y="34" width="12" height="12" rx="3"/></g>',
  },
  experience: {
    colors: ["#547ee4", "#3653b8"],
    shape: '<path d="M25 23v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" fill="none" stroke="#fff" stroke-width="3.5"/><rect x="15" y="23" width="34" height="25" rx="5" fill="#fff"/><path d="M16 32c7 5 25 5 32 0" fill="none" stroke="#4266ce" stroke-width="2.5"/><rect x="29.5" y="32" width="5" height="7" rx="1.5" fill="#4266ce"/>',
  },
  research: {
    colors: ["#39bfa2", "#168675"],
    shape: '<circle cx="28" cy="28" r="11" fill="none" stroke="#fff" stroke-width="4.5"/><path d="m36 36 11 11" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>',
  },
  life: {
    colors: ["#f5b457", "#e68349"],
    shape: '<circle cx="42" cy="22" r="5" fill="#fff"/><path d="m14 46 12-19 10 14 5-7 9 12Z" fill="#fff"/>',
  },
  resume: {
    colors: ["#f7f8fc", "#e1e5ee"],
    shape: '<path d="M23 15h13l9 9v23a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3V18a3 3 0 0 1 3-3Z" fill="#66718b"/><path d="M36 15v9h9" fill="#b2b9c9"/><path d="M26 31h12M26 37h12M26 43h8" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
  },
};

async function generate() {
  const iconDir = path.join(root, "public/arjun-os/icons");
  await fs.mkdir(iconDir, { recursive: true });
  for (const [name, { colors, shape }] of Object.entries(icons)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><defs><linearGradient id="tile" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><path d="M32 2C45 2 52 2 57 7C62 12 62 19 62 32C62 45 62 52 57 57C52 62 45 62 32 62C19 62 12 62 7 57C2 52 2 45 2 32C2 19 2 12 7 7C12 2 19 2 32 2Z" fill="url(#tile)"/>${shape}</svg>\n`;
    await fs.writeFile(path.join(iconDir, `${name}.svg`), svg);
  }

  const mark = await fs.readFile(path.join(root, "assets/identity/mark.svg"));
  const outputs = [
    ["app/icon.png", 512],
    ["app/apple-icon.png", 180],
    ["public/favicon-16x16.png", 16],
    ["public/favicon-32x32.png", 32],
    ["public/favicon-48x48.png", 48],
  ];
  for (const [file, size] of outputs) {
    const png = await sharp(mark).resize(size, size).png().toBuffer();
    const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const corners = [0, size - 1, size * (size - 1), size * size - 1];
    if (info.channels !== 4 || corners.some((pixel) => data[pixel * 4 + 3] !== 0)) {
      throw new Error(`${file}: expected genuinely transparent corners`);
    }
    await fs.writeFile(path.join(root, file), png);
    console.log(`${file}: ${size}×${size} PNG, transparent corners verified`);
  }
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
