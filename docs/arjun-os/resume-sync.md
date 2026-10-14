# Resume content sync — October 14, 2026

Source: Arjun's October 14 `Arjun_Resume.pdf`, copied unchanged to `public/Resume.pdf` (68,579 bytes), served as `/Resume.pdf?v=2026-10-14`.

SHA-256: `ec84f61fdb231ebd34fcb478b6d0a7c32fe51eb677f4e6ad8336322d062eb373`.

- Fixes the two errors in the September export: Hack the North 2024 is now the "Codegen Sponsor Prize" (not "Winner"), and the Data Validation Portal no longer claims "160+ employee hours".
- IFS Copperleaf is now "AI Engineering Intern → Jr. AI Implementations Engineer (Part-time)": "Offered a part-time role after the internship to keep building as a forward-deployed engineer". The site, tour and AI guide say "internship" to match (no "co-op").
- "Dean's Honours List" spelling, as on the résumé.
- The e2e test pins the new URL and SHA-256.

---

# Resume content sync — October 5, 2026

Source: the user-provided September 2026 `Arjun_Resume.pdf`. The downloadable `public/Resume.pdf` is an unchanged copy (68,578 bytes).

SHA-256: `bba60f0548f9d77e00e9c7f4707e484184d53b7bfdf7f6daf98da06df3c221d0`.

## Content

- Updated Home, Experience, Selected Work, Research, technical skills, education, site metadata, the recruiter tour, and the AI guide's data and navigation.
- IFS Copperleaf: AI Engineering Co-op followed by Jr. AI Implementations Engineer (part-time), October 2025–present. ROI Analytics Portal leadership adoption; The Data Validation Portal is described by what it does (data-quality checks before AI ingestion). **Never use the "160+ employee hours" figure: it was never measured.** The current Resume.pdf still contains it and needs a new export.
- UBC SOCIUS: February 2025–present; 40 WCAG-specific agents, 31 shared tools, 250 page–criterion records across 11 platforms. Recall and precision remain paired (86% / 56%); recall baselines are 36% axe-core and 67% uncued VLM.
- First-author Agentic Web Accessibility Auditing and second-author WRAP are **submitted to ACM CHI 2027**. The existing public preprint is retained; neither submission is represented as accepted.
- Teaching: September 2024–June 2025, 250+ students, and redesigned tutorials contributing to a 20% attendance increase.
- Added BuildStory and Mune, expanded Roadpack's engineering details, and preserved the film hero, real captures, and older case studies.
- Education: BSc Computer Science (AI Specialization), Commerce Minor, expected May 2027. Removed the outdated GPA claim from the knowledge base because the new resume does not provide a GPA.
- Resume actions use a versioned URL to avoid reusing a cached copy. AI timeline cards consume the canonical experience data.
- Experience columns now adapt to the app window's width, giving the current role more reading space in narrower windows.

## Public links checked

- [BuildStory website](https://buildstory.dev) and [open-source scanner](https://github.com/Arjun-Mishra-312/buildstory-scan), verified against the public repository and website.
- [Mune on the App Store](https://apps.apple.com/app/mune-private-finance-ai/id6777609206), verified from Arjun Mishra's developer listing. Its developer website is linked from that listing.
- Existing Roadpack and accessibility-preprint links retained.

BuildStory and Mune use simple vector symbols and typography. No product screenshots were fabricated.

## Validation

- Production build and 32 unit tests passed. Lint passed with the same five pre-existing warnings in unrelated UI components.
- Full Playwright run: 128 checks across eight desktop, iPhone, and iPad configurations; 35 device-specific skips. All applicable functionality passed after correcting a test's ambiguous `Research` region selector to match the app region exactly.
- Initial run: 92 passed, one selector failure, 35 skipped. Follow-up run: all 10 tour and screenshot-baseline checks passed without snapshot updates. This verifies the corrected failure and the reviewed visual baselines.
- New checks cover the served PDF's SHA-256, versioned resume action, BuildStory and Mune navigation / reload / external links, education and skills, current Copperleaf facts, CHI submission status, and new case studies across adaptive layouts.
- Home (including expanded technical skills), Roadpack, and Research passed the existing serious/critical automated accessibility checks in both themes on desktop and mobile.
- Reviewed the updated desktop and adaptive screenshots and manually checked the new Experience, BuildStory, Mune, and Home content in the in-app browser. Preview remains available at `http://localhost:3000/`.

Preview captures: `docs/design/arjun-os/resume-experience.png` and `docs/design/arjun-os/resume-buildstory.png`.
