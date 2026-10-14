# Life + Play media

Everything in `public/life/` is cut down from Arjun's originals for the web. Keep the originals out of the repo.

## Photos (`public/life/photos/*.webp`)

- Source: full-resolution phone photos (WhatsApp desktop transfers, Oct 11 2026) and the screenshots shared in chat.
- Encode: long edge ≤ 1600 px, WebP quality 78 (`ffmpeg -c:v libwebp -quality 78`). About 4.8 MB in total.
- People: hackathon teammates agreed to appear. Seoul and Japan trips were with family; only Arjun appears in those shots.
- The chess screenshot is intentionally not used: its "1300" is a single-game estimate, not a rating.

## Films (`public/life/films/*.mp4` + `.webp` poster)

Short muted loops, H.264 CRF 27–29, `+faststart`, 1–2.6 MB each. They load with `preload="none"` and only play while on screen (`components/arjun-os/motion/loop-video.tsx`).

| File | Source | Cut |
| --- | --- | --- |
| fuji-kawaguchiko | drone original 1777818708776.MP4 (2688×1512) | 0–12 s, 1280 wide |
| seoul-han-river | drone original 1779691305747.MOV | 8–18 s, 1280 wide |
| toronto-cn-tower | drone original 1783563359116.MOV | 4–14 s, 1280 wide |
| ubc-campus | drone original copy_4FD6AC65…(1).MOV | 3–13 s, 1280 wide |
| vancouver-fireworks | drone original 2707F32D….MP4 (vertical) | 20–30 s, 540 wide |
| tokyo-night-drive | Arjun's 41 s vertical edit | 0.2–6.2 s + 35–41 s (the full-frame shots; the middle is letterboxed) |
| win-hack-the-north | 23 s vertical phone clip | 14–23.3 s, announcement + team reaction |

For local film renders, use the originals in `C:\Users\arjun\Downloads`, not these loops.

## Film material (added 2026-10-14)

Built by `scripts/site-media.py` from the film projects in `videos/` (gitignored source):

- `public/films/introducing{,-60}.mp4/.jpg/.vtt`: 720p web encodes of the launch film (v11) and its 60-second cut (v3), posters from the "Introducing" title frame, and captions from the narration's word timings with the recorded script's text.
- `public/case-studies/mune-ask.mp4`: the affordability check from Arjun's screen recording (typing sped up 2.4x; the model's visible reasoning between question and answer is cut). `mune-insights`, `mune-budgets`, `mune-doordash`: real captures with a 9:41 status bar.
- `public/roadpack/surfaces/`: the real Lock Screen capture (carrier name masked), the Live Activity capture, and the app icon. The Dynamic Island and Siri views on the site are recreated from that Live Activity; Siri phrases are the app's own App Shortcut phrases.
- `public/life/films/f1-sim.mp4/.webp`: the F1 simulator clip (4.7 s, from Arjun's video).
- `public/3d/drone.glb`: the DJI Mini 3 Pro model by wishmaster88 (CC BY 4.0, credited on the Films album), standing in for Arjun's DJI Flip; textures to WebP and meshopt-compressed (6.9 MB → 2.5 MB). Loaded only when the Films album opens.
- `public/arjun-lake-avatar.webp`: the avatar, cropped from the Whistler lake photo.
- `app/opengraph-image.png` / `twitter-image.png`: the link-preview card, rendered from `scripts/og/og.html`.
