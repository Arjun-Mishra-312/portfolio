# Case study depth and glass surfaces — 5 October 2026

This pass removes the generated Roadpack lifestyle figure from the Roadpack case study. The iPad capture now immediately follows “One shared state. Less coordination.” The Home and gallery art are retained.

The other five case studies now have product tours, scoped contributions, decision cards, system maps, detailed flows, and qualified outcomes. Architecture diagrams are explanatory HTML built from the project documentation; they are not screenshots of application features. Glass is confined to the chapter bar and small outcome/architecture widgets. Reduce transparency and high contrast switch those widgets to solid surfaces. Photos and long reading sections retain clear, solid backgrounds.

## Media provenance

Originals are in `assets/case-studies/`; optimized WebP derivatives and their dimensions are in `public/case-studies/`. `scripts/prepare-case-study-assets.cjs` resizes and converts originals without regenerating interface content. Runtime images use explicit dimensions and lazy loading.

| Assets | Source | Treatment |
| --- | --- | --- |
| buildstory-story, buildstory-recap | Live public story at https://buildstory.dev/u/arjun-mishra/vibe-social, captured 5 October 2026 after the user signed into the portal | Full browser viewport captures. The recap shows the Toolkit slide; these example statistics are not adoption claims. |
| buildstory-receipt | `C:/Users/arjun/Downloads/buildstory-arjun-mishra-vibe-social-redacted-receipt-dark.png` | Earlier exported example chapter; cost explicitly labelled estimated, not billed. |
| buildstory-turning-points, buildstory-redaction | Exact `source_screenshots/turning-points.png` and `redaction.png` entries from `C:/Users/arjun/Downloads/buildstory_launch_kit_dogfood_final.zip` | Original earlier product views, captioned accordingly. |
| mune-dashboard, mune-chat, mune-trends, mune-recurring | Four entries (02, 03, 04, 06) in `C:/Users/arjun/Downloads/mune_appstore_light_screenshots_2k.zip` | Original App Store artwork, including its existing device framing. No new UI synthesis. |
| research-architecture, research-trace, research-recall | `revision_architecture.pdf`, `revision_trace.pdf`, `b1_recall_ladder_revised.pdf` from `D:/SOCIUS/AI-Accessibility-v3/CHI 2026/arxiv_chi2027/source/figures` | Poppler renders of the original public v2 preprint figures. |
| llm-graph, llm-dependencies, llm-chat | https://devpost.com/software/llm-pro-max — original gallery files 003/024/210, 211, 387 | Original project screenshots downloaded via their observed image links. |
| replate-analyzer, replate-shelter, replate-request | https://devpost.com/software/replate-z3b5mg — original gallery files 003/363/114, 111, 113 | Original prototype screenshots downloaded via their observed image links. |
| replate-design | `C:/Users/arjun/Downloads/Replate Design System.png` | Local reference board; labelled as a design-system reference, not a product screenshot. |

The archived BuildStory connection screenshot was inspected but excluded from public output because it contains a dashboard connection code. The unused private/public marketing capture is also excluded. No private account dashboard, credentials, raw transcript, or new publication is included. Only the published example and user-provided export material appear in the portfolio.

## Content grounding

- BuildStory: `D:/Vibe-Story-Scanner/buildstory-scan/README.md`, `docs/architecture.md`, `docs/privacy.md`; `D:/Vibe social/docs/marketing-architecture.md`; the published example and the live recap/receipt interface. The open-source engine is distinguished from the hosted product. Narrative-mode and pattern-redaction limitations are retained.
- Mune: `D:/Finance App/Mune Arjun/Mune/docs/ios-litert-gemma.md`, the existing resume facts, App Store artwork, `Mune/Services/MunePlaidService.swift`, `MunePlaidItemStore.swift`, `backend/api/plaid.mjs`, and `backend/lib/plaid-stateless.mjs`. The AGENTS overview describes a stateless backend, but the active implementation retains authenticated server storage plus a stateless development mode. The portfolio therefore promises on-device AI, not universal stateless bank storage.
- Research: public v2 at https://arxiv.org/abs/2609.09379v2 and its local LaTeX sections/framework.tex. Original figures retain the human-validation qualification. 40 implemented requirements are distinguished from the 15 criteria with positive benchmark cases. CHI 2027 is a submission, not an acceptance.
- LLM Pro Max: https://devpost.com/software/llm-pro-max and https://github.com/gigabite-pro/LLM-pro-max; original interfaces and existing resume contribution/result facts. A team prototype, with no invented deployment scale or universal relevance guarantee.
- Re-Plate: https://devpost.com/software/replate-z3b5mg and https://github.com/Arjun-Mishra-312/re-plate; original prototype and existing resume contribution/result facts. Controlled test-set date accuracy is not a food-safety guarantee. Future driver/chat ideas remain future ideas.

No new OS features were added. Existing window behavior, project routes, chapter navigation, phone anchors, and external links are retained.

## Validation

- Production build and TypeScript check passed. All 32 unit tests passed.
- 38 focused browser cases passed across desktop, three phone profiles, and four iPad profiles: original media loads, chapter decisions and system flows, existing covers and links, Roadpack film playback and section order, plus glass accessibility in both themes.
- The eight glass checks include axe contrast checks and verify solid surfaces for reduced transparency and high contrast. Theme checks wait for inherited heading colors to finish transitioning before auditing the settled palette.
- Visually reviewed BuildStory's process and architecture, Mune's paired artwork and stacked phone cards, and the original research figure and glass widgets on iPad in both themes. Proof captures: `depth-glass-preview.png`, `depth-research-ipad.png`, and `depth-research-glass-ipad.png`.
- The 19 optimized runtime images total approximately 1.9 MB. Master captures remain separate from the public derivatives.
