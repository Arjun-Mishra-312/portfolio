# Portfolio refresh — implemented sprint

Implemented locally on October 4–5, 2026. Audience: people exploring Arjun's work and personality, with a slight emphasis on recruiters.

## What changed

- A transparent circular favicon, with real PNG exports at 16, 32, 48, 180, and 512 pixels. The generator checks every corner's alpha channel.
- Six consistent geometric dock icons, shared across desktop, phone, and tablet navigation. Focus and hover labels stay outside the compact dock.
- A new opening screen with immediate access to Roadpack, the public research preprint, a quick tour, resume, and contact.
- Apple-inspired neutral surfaces, system typography, quieter window outlines, and one blue for actions. Both themes and accessibility preferences remain supported.
- Roadpack leads Selected Work. Its case study includes all eight supplied screenshots, the supplied launch film, two actual app recordings, role, architecture, lessons, and verified App Store/product links.
- Roadpack opens with its complete launch film. A compact headline, an actual branded frame from the film, and a single Play control keep the full 16:9 frame visible in the opening view. The simulated Sea-to-Sky trip was removed following Arjun's review.
- Research presents the actual public preprint, authors, 86% recall together with 56% precision, dataset scope, and limitations. The four-step walkthrough interprets the public OpenStax evidence trace without inventing missing result payloads.
- The existing six-stop tour now features Roadpack and the public paper. AI grounding, project allowlists, navigation inference, knowledge entries, and suggested questions reflect the same current work.
- The intro runs once per session, skips direct links and reduced-motion visits, and completes even when animation frames are throttled in a background tab.
- Desktop and landscape tablet windows use nearly the full available workspace height with safe margins. Widths also increased for the portfolio apps. Home updates the canonical URL and stays Home after a reload.
- Minimize and restore travel between the window's center and its actual dock icon using transform-only motion. Close now runs its exit transition. Title-bar controls do not begin drag gestures, and reduced motion keeps windows stationary while fading.
- Interests is commented out in Life + Play on all layouts. Old persisted Interests selections fall back to Library. The photo gallery, Vancouver model, and LEGO collection remain available.
- Finishing polish keeps keyboard focus on native video controls after Play and on the source link at the end of the research walkthrough. Video focus outlines stay inside the frame. Older resume/skills answers describe the current interface and Roadpack stack; an unfinished professional answer and its suggestion were removed.

## Media and sources

The uploaded Apple reference is preserved at `docs/design/arjun-os/DESIGN-apple-reference.md`. It informs the design; it is not a separate workflow policy.

Roadpack media is documented in `docs/design/arjun-os/roadpack-media.md`. Videos load only after Play. The complete 64.8-second launch film was re-encoded from 115.5 MB to 12.4 MB; the 38-second and 10-second recordings are 2.5 MB and 0.7 MB. All eight screenshots together are about 782 KB as WebP. Original files were left intact. Launch captions and the transcript use its original timed voiceover script.

Research source: https://arxiv.org/abs/2609.09379v2
Public trace: https://arxiv.org/src/2609.09379v2/anc/worked_trace.json
Roadpack: https://roadpack.app
App Store: https://apps.apple.com/app/roadpack-travel-together/id6801922780

## Verification

Validation for the October 5 film and window revision:

- `npm run test`: 29 tests passed in four files. Includes window workspace sizing and assistant navigation/grounding. The removed trip's tests were removed with its implementation.
- `npm run lint`: passed with five pre-existing warnings in the shared carousel, canvas, dome gallery, and Safari components.
- `npm run build`: passed on Next.js 15.5.27, including type checking and all 11 static-page build tasks. Home's first load JavaScript is 213 KB, including 103 KB shared framework code.
- `PORTFOLIO_TEST_PORT=3000 npx playwright test`: 75 passed, 35 skipped because those checks target another device family, zero failures. Eight projects cover desktop Chromium, an iPhone-sized Chromium layout, small phone, large phone WebKit, and four iPad orientations/sizes in WebKit.
- The browser suite verifies the complete film hero fits the first view, actual launch-video decoding/duration on desktop and mobile Chromium, parsed captions, on-demand media mounting, real screenshot gallery, mouse/keyboard minimize and restore, browser history, tour exit, AI failure recovery, theme/accessibility settings, scroll restoration, and dock alignment.
- Scoped Axe audits found zero serious/critical violations on Roadpack and Research in both themes on desktop and phone, plus the initial desktop surface. Spotify's cross-origin internal document is excluded. This is automated coverage of those states, not a WCAG compliance certification.
- Review captures: `docs/design/arjun-os/sprint-home.png`, `sprint-roadpack-hero.png`, and `sprint-roadpack-phone.png`. `sprint-convoy.png` is retained only as a historical capture of the removed iteration.
- Inspected the final film hero, minimize/restore, and three active Life + Play collections in the in-app browser at a 1280×720 laptop viewport. The restored window keeps its original position and size. The full browser suite separately verifies real pointer dragging, keyboard snapping, close, and dock destination geometry.
- All 11 screenshot baselines were refreshed for the current copy and window dimensions, then passed a separate eight-project comparison run. The Home review capture waits for its opening transition to finish.
- Decoded every favicon export and confirmed all four corner alpha values are zero. `git diff --check` passes.

Browser tests can reuse the active preview with `PORTFOLIO_TEST_PORT=3000`; the default isolated port remains 3005. The preview is running the production build at http://localhost:3000/.

## Dependency review

Upgraded Next.js and its ESLint configuration from 14.2.3 to the patched 15.5.27 backport, preserving the existing React 18 and Three.js component stack. This addresses the maintainer's Windows server and AVIF image optimizer critical advisories, including [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) and [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4). Compatible updates also cover `fflate`, `glob`, brace expansion, and `nanoid`. A PostCSS override resolves Next's older bundled PostCSS to the project's patched 8.5.28 version; the production build was rerun after that change.

The final production dependency audit reports zero critical/moderate findings and six high findings in the existing Tailwind 3 pattern/glob dependency chain (`braces`, `chokidar`, `fast-glob`, `micromatch`, `tailwindcss`, and `tailwindcss-animate`). The complete audit, including development dependencies, reports 14 findings: 12 high and two moderate. These are recorded rather than hidden; the chain has no complete compatible fix reported by npm. No forced major Tailwind/React migration was applied in this UI sprint. The production audit is saved at `docs/arjun-os/validation/production-audit.json`.

No deployment or public product usage/revenue claims are part of this change. Existing role dates and the resume were retained because no updated replacements were supplied.
