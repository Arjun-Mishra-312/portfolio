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
