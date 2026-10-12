/* Caption timing comes from the supplied launch film's original voiceover timeline. */
const fs = require('node:fs');
const path = require('node:path');
const timelinePath = process.argv[2] || 'D:/Roadtrip_Idea/brag-output/work/composition/long.html';
const html = fs.readFileSync(timelinePath, 'utf8');
const match = html.match(/const VO = \[([\s\S]*?)\];/);
if (!match) throw new Error('Original voiceover timeline not found');
const voice = JSON.parse('[' + match[1].trim().replace(/,\s*$/, '') + ']');
const timestamp = seconds => {
  const ms = Math.round(seconds * 1000);
  return [Math.floor(ms / 3600000), Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60].map(v => String(v).padStart(2, '0')).join(':') + '.' + String(ms % 1000).padStart(3, '0');
};
const cues = voice.map(([id, start, end, at, text]) => id + '\n' + timestamp(at - .05) + ' --> ' + timestamp(at + end - start + .14) + '\n' + text);
fs.writeFileSync(path.join(__dirname, '../public/roadpack/launch-captions.vtt'), 'WEBVTT\n\n' + cues.join('\n\n') + '\n');
fs.writeFileSync(path.join(__dirname, '../lib/arjun-os/roadpack-launch-transcript.json'), JSON.stringify(voice.map(([, , , , text]) => text), null, 2) + '\n');
console.log('Prepared captions and text transcript for the original 65-second film.');
