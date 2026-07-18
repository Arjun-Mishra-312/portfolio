# Arjun OS — Phase 0 Audit

## Ownership path

The plan’s default was a clean-room rebuild. Implementation uses the
[macOS-Portfolio](https://github.com/aakashsharma003/macOS-Portfolio) repository as an
**interaction reference** (window open/focus/minimize/maximize, dock, work-area edges)
while reimplementing state and UI in Next.js with `useReducer`, Tailwind, Framer Motion,
and `@use-gesture/react`.

Because OS behavior is informed by that MIT-licensed work, the MIT copyright and
permission notice are included in `docs/arjun-os/THIRD_PARTY.md` and the README Inspiration section.

Public branding: **Arjun OS** / **AI Island** only — no Apple product names or assets.

## Existing uncommitted work (preserved)

| Path | Status |
|------|--------|
| `components/portfolio/premium-portfolio.tsx` | Kept as content source / fallback |
| `app/page.tsx` | Will mount Arjun OS shell |
| `app/chat/page.tsx` | Keep; redirect toward `/?ai=open` later |
| `lib/openai-service.ts`, `lib/theme-context.tsx`, `app/globals.css` | Preserve and extend |

## Content inventory

### Verified (safe for UI + AI)

- Profile identity: Arjun Mishra, Vancouver BC, AI Engineer + HCI Researcher
- Experience: IFS Copperleaf, UBC SOCIUS Lab, UBC Teaching Assistant
- Projects: AI Accessibility Analyzer, LLM Pro Max, Re-Plate (with Devpost/GitHub where present)
- Assets: `/pfp.png`, project images, `/Resume.pdf`, gallery photos, Vancouver GLB
- Chat knowledge base: `lib/knowledge-base.json`

### Metrics (only when already in portfolio data)

- LLM Pro Max: 86% query relevancy (existing claim)
- Re-Plate: 100% expiration-date accuracy on test set (existing claim)
- Accessibility Analyzer: qualitative / WCAG-focused unless a verified numeric metric exists in source data

### Placeholder / deferred

- Dawn wallpaper (Dusk generated wallpaper added)
- High-contrast + reduced-transparency prefs UI (tokens first)
- Recruiter tour script (Phase 5)
- Full case-study chapters (Phase 3)

## Assets

| Asset | Location | Notes |
|-------|----------|-------|
| Dusk wallpaper | `public/wallpapers/vancouver-dusk.png` | Generated scenic Vancouver dusk |
| Profile photo | `public/pfp.png` | Verified |
| Resume | `public/Resume.pdf` | Verified |
| Design boards | `docs/arjun-os/` | Reference PNGs archived as available |
