# Roadpack portfolio media

These app screenshots and recordings were supplied by Arjun. The launch film is the supplied finished film, including its existing cinematic footage. The interface captures are not recreated or painted.

| Runtime file | Supplied source |
| --- | --- |
| `launch.mp4` | `D:/Roadtrip_Idea/brag-output/brag-long-horizontal.mp4` |
| `trip-demo.mp4` | `C:/Users/arjun/Downloads/WhatsApp Video 2026-09-20 at 2.11.01 PM.mp4` |
| `photos-demo.mp4` | `C:/Users/arjun/Downloads/adding photo.mp4` |
| `screens/coffee.webp` | clipboard `07326f7e-5c4d-4e12-a97a-34170310e307.png` |
| `screens/stop-detail.webp` | clipboard `8d449c89-c9ff-4ff6-8c47-40dc970db836.png` |
| `screens/itinerary.webp` | clipboard `648fee0f-a0b6-4b0f-93b8-9b894edf6cb6.png` |
| `screens/map.webp` | clipboard `10992498-d8d0-4938-bdd5-e3bcace8b866.png` |
| `screens/ipad.webp` | clipboard `61b6339d-36cf-41a8-b3c6-2488a1f2cfb4.png` |
| `screens/vote.webp` | clipboard `4ed33bf4-0124-46bc-8aa5-a5b498829951.png` |
| `screens/activity.webp` | clipboard `a59597db-2009-40d1-95a7-3c573b6cbd87.png` |
| `screens/pack.webp` | clipboard `d815032a-8e5b-4edf-b6ee-82e4690639c4.png` |

All runtime paths are under `public/roadpack/`. Clipboard sources were in the user's LocalAppData Temp folder. `scripts/prepare-roadpack-media.cjs` performs only resizing and WebP encoding: 780px portrait and 1600px iPad, quality 88, no upscaling. Screenshots keep the native UI and map attribution.

FFmpeg outputs use H.264, AAC audio, and MP4 faststart. The launch export is 1280×720, CRF 25; recordings preserve their original dimensions at CRF 24. The complete duration and original audio are retained. No cuts or remix were added. The current film hero poster, `launch-hero.jpg`, is the original film's branded Roadpack lockup at 60 seconds, exported at 1280×720. Other posters come from source frames at 56 seconds (previous launch poster), 7 seconds (trip), and 2 seconds (photos).

`prepare-roadpack-captions.cjs` reads the original `brag-output/work/composition/long.html` voiceover timeline as JSON data, without executing the composition. It exports `launch-captions.vtt` and `lib/arjun-os/roadpack-launch-transcript.json`. Native captions, a text transcript, descriptive recording summaries, and native playback controls accompany the media. Movie sources are absent from the DOM until a visitor selects Play.

The launch film leads the case study and plays directly in its hero frame. It fits the initial window view without cropping; visitor-selected playback exposes native controls. The previous illustrated convoy interaction was removed following Arjun's review. The remaining interactive gallery uses the supplied real app captures.
