# Window interior refresh — October 2026

Scope: visual and UX redesign of the existing five OS applications. The dock, window lifecycle, tour, AI Island, routes, resume, film controls, evidence walkthrough, project chapters, and Life viewers remain the existing features.

## Reference interpretation

Read the four user-supplied saved HTML files as reference data, alongside DESIGN-apple.md. Their document structure uses a short introduction followed by large media, highlight galleries, distinct product stories, and quieter technical detail. The portfolio adopts that hierarchy, system typography, generous imagery, understated surfaces, and a single blue action color. No Apple artwork, branding, or product claims were copied.

- About: compact editorial introduction, a large Roadpack lifestyle card, a visual research card, and real BuildStory/Mune imagery.
- Work: six image-led project cards and consistent project heroes; the existing eight chapters become a compact horizontal index. Phone chapter anchors and project search remain.
- Roadpack: launch film first, original app recordings and screenshot selection, larger product photography further down.
- Research: editorial illustration, paper metadata and qualifications, legible metrics, and the existing source-linked evidence trace.
- Experience: quieter role navigation, readable content, and clearly qualified impact figures.
- Life: actual personal photographs, larger object stages, and existing album/model/gallery controls. Interests remains commented out.

Both themes share the same hierarchy. Small windows reflow by container width. Video remains click-to-load.

## Validation

- Production build succeeds. Five pre-existing lint warnings remain in the older shared carousel, canvas, dome, and Safari components.
- 32 unit tests pass.
- The expanded browser suite covered window lifecycle, reduced motion, resume integrity, film playback/captions, navigation, AI Island, responsive layouts, and both themes. Its two Life accessibility failures were fixed: selected album text contrast and keyboard access to the scrollable collection.
- The repair verification run passed all 20 checks, including Life accessibility in both themes and eight desktop, phone, and iPad screenshot baselines.
- After the final Work layout adjustment, 18 focused checks passed with four device-inapplicable skips. They cover all project heroes and chapter navigation, reading surfaces, Work accessibility, browser history, and project links across phone and iPad sizes.
- Visual review covers all five apps, the project covers, and phone/iPad layouts. Older LLM Pro Max and Re-Plate presentations retain their full composition using containment rather than cropping.
- All eight final screenshot baseline checks pass after the Roadpack lifestyle card sizing correction. Both regenerated landscape iPad captures were visually reviewed.
- Review captures are saved beside this document as refresh-*.png. The local production preview remains at http://localhost:3000/.

## Assets and provenance

| Runtime asset | Source / saved master | Use |
| --- | --- | --- |
| /editorial/roadpack-lifestyle.webp | [Roadpack PNG master](D:/Portfolio/portfolio/assets/editorial/roadpack-lifestyle.png) | Built-in ImageGen concept scene using the real /roadpack/screens/map.webp as reference. Anonymous traveler, not a photograph of Arjun. |
| /editorial/research-evidence.webp | [Research PNG master](D:/Portfolio/portfolio/assets/editorial/research-evidence.png) | Built-in ImageGen editorial concept, not a scientific diagram or experimental evidence. |
| /editorial/mune-screen.webp | https://askmune.app/assets/mune-chat-demo-poster.jpg; original public/editorial/mune-screen.jpg | Actual app capture retrieved from the product site using browser pageAssets. |
| /editorial/mune-icon.webp | https://askmune.app/assets/app-icon.png; original public/editorial/mune-icon.png | Original product icon. |
| /editorial/buildstory-home.webp | https://buildstory.dev; original public/editorial/buildstory-home.png | Unaltered live homepage viewport captured through CUA on October 5. The visible metrics belong to the site's labeled example report. |
| /LLM_Pro_Max.jpg, /Re-Plate.jpg | Existing portfolio product presentations | Real project UI presentations retained. |
| /experiences_photos/* | Existing personal collection | Documentary photography retained. |

Generated PNG masters were inspected before producing optimized WebP runtime derivatives. Original tool outputs remain in C:/Users/arjun/.codex/generated_images/01a10a66-08eb-77c0-8003-f7b3202e450d/.

## Built-in image-generation prompts

### Roadpack lifestyle
Create an original premium editorial lifestyle photograph for the Roadpack travel app portfolio. Landscape 3:2 composition. Close-up of an anonymous traveler's single left hand holding a black smartphone, outdoors at a calm British Columbia coastal mountain viewpoint, blue water and evergreen mountains softly out of focus in bright natural daylight. Phone is centered at x 63% of frame, entire device visible with breathing room top and bottom, straight upright nearly front-on, no exaggerated perspective. The supplied image is the actual Roadpack map screenshot: place it intact on the phone screen, preserving all wording, controls, layout and map exactly. Keep the entire screenshot in the screen, do not invent interface content. No person's face, no branding on phone, no words outside the screen, no Apple logo. Warm natural realistic skin, subtle fabric sleeve, credible anatomy. Elegant restrained commercial photography, beautiful optical lighting, documentary texture, no glossy sci-fi effect, no decorative icons. This is a concept lifestyle product image, not a photo of Arjun. Output a real PNG.

### Research editorial illustration
Create an original premium editorial still-life illustration for a human-computer interaction and web accessibility research portfolio. Landscape 3:2, warm off-white seamless studio background. A beautiful physical sculpture of three upright overlapping translucent frosted acrylic browser-window panels with simplified crisp charcoal interface rectangles, subtle tactile paper layers, fine blue connecting lines traveling from one panel through a cobalt-blue circular inspection lens to an orderly stack of small evidence cards. A few precise blue check markers. The composition communicates requirements becoming inspectable evidence. Sculptural physical materials, a considered museum-design object, delicate contact shadows, morning side light, realistic material rendering, mostly ivory and charcoal with only cobalt blue accent, generous negative space around the arrangement. Whole sculpture fits within image with room around all edges. No glowing neon, no gradients, no futuristic holograms, no wireframe brain, no robots, no invented metrics, no words or logos, no real website screenshots, no people. Editorial concept artwork, not a scientific diagram or literal system architecture. Sophisticated minimal design, clean legible silhouette even at 400px wide. Output an actual PNG.
