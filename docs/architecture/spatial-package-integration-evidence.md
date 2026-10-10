# SPACE-001 — Package-integrated consumer composition evidence

- **Status:** Bounded experiment completed; not a consumer deployment, accepted API, or human usability verdict
- **Date:** 2026-10-09
- **Tracking:** [#87](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/87), parent [#79](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/79)
- **Proposal:** [RFC-0009](../decisions/RFC-0009-spatial-rhythm.md), still **proposed**
- **Prior actual public site-source rendering:** [Digitalis/Envuscator comparison](spatial-consumer-evidence.md)
- **Private implementation evidence:** Phyllotaxis PR #102, reviewed test head `369a8f4832055517d09e5488b20f6b03b55844aa`, merged as `6256072042e524c1d939ac8c8f27486084d71821`
- **Evidence provenance:** The private implementation candidate at the reviewed test head above passed its source-bound Nix quality gate. The underlying CI logs, images and short-retention evidence bundle remain under private implementation authority; this public record contains the source-safe aggregate observations and explicit limitations, not a publicly reproducible artifact.

## What actually ran

The **built, exported Phyllotaxis package** supplied `Stack`, `Container`, `Grid`, `Prose`, `ArticleHeader`, `ArticleMeta` and the emitted `chroma.css`, `venation.css` and `lamina.css`. Two **consumer-derived integration compositions** were rendered using React server markup:

1. **Utility technical status:** a page with four major sections, local nested `Stack`, grouped cards using `Grid`, a status table and native form controls, informed by patterns found in Digitalis Community.
2. **Editorial long-form:** a page with four prose sections, publication metadata, authored headings, paragraphs and a native anchor, informed by long-form technical article patterns.

These are **package-backed local test compositions**, *not* the unmodified Digitalis or Envuscator websites, nor demonstrations that either site has adopted the package. The earlier real-site source comparison and this package test are **complementary evidence, not one end-to-end integration**.

Three spacing treatments use the same content and stable `Stack gap="xl"` source API: baseline, targeted, and spacious. Targeted/spacious apply only a **consumer-owned, opt-in CSS class** and scoped test-only `--phyllotaxis-space-section` alias. No `Stack.gap="section"` prop is implemented. The suite asserts that the proposed role is absent from the built candidate's Chroma CSS, Venation CSS and inspection v1.

The alias is redeclared on coherent Utility/Editorial profile carriers so that nested surfaces resolve their own accepted profile spacing rather than inheriting a root-computed alias. Explicit light/dark Chroma schemes are tested independently of spacing treatments.

## Browser findings

Native-runner Chromium verified **48/48** combinations (two profiles × two schemes × four CSS viewport widths 320/375/768/1280 × three treatments), **2/2** real keyboard-Tab/focus-visible checks, and **6/6** distinctly labeled CSS-simulated text-stress cases (200% root font, WCAG-style spacing overrides, and longer heading text in each profile). **12 full-page light-mode screenshots** cover two profiles × 375/1280 widths × three treatments. No observed horizontal overflow in these supported tests.

For the 375px/light specimens:

| Profile | Baseline major gap | Targeted gap | Spacious gap | Page-height change (targeted / spacious) |
| --- | ---: | ---: | ---: | ---: |
| Utility | 32px | 48px | 64px | +48px / +96px |
| Editorial | 38.25px | 59.5px | 85px | +63.75px / +140.25px |

Each composition has four major sections, hence three `Stack` gap intervals. Measured bounding-box gaps matched computed values. Within each compared profile/scheme/width, local group gaps, grid/card/table insets, Prose paragraph margins, background and foreground colors were unchanged by the spacing treatment. Opposite nested coherent-profile surfaces retained their own baseline XL values even while their parent used an opt-in larger gap.

**CSS footprint observation:** concatenated package CSS source strings totalled 11,871 characters and the local experimental consumer stylesheet 2,028 characters. These are not minified bundle size, rendering cost, or a performance benchmark; the consumer stylesheet includes page styling beyond the candidate role.

## Found and controlled failure

The initial private CI captured two distinct issues **before** the passing exact-head run:

- Utility headings and labels needed ordinary narrow-layout word wrapping for the *compounded* 320px/200%-root-font stress test. The consumer example added bounded wrapping rules.
- The exported Editorial `ArticleHeader` h1 overflowed in the same compounded stress case because its large title lacked a suitable break opportunity. This remains a separate component-level design/accessibility qualification issue, [#98](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/98). The experiment uses a **consumer-local narrow-width title-wrap safeguard**; it has **not fixed or modified the built Lamina CSS or any public release**.

No earlier failed run should be represented as success. The final exact-head run succeeded with all six simulated stress scenarios after the consumer-scoped safeguard, and its manifest correctly records the exact reviewed PR source SHA rather than GitHub's temporary merge SHA.

## Decision impact and remaining gaps

**Disposition: continue RFC-0009 as proposed; do not create an ADR yet.** The experiment shows an opt-in large-section relationship is mechanically compatible with the existing package and can preserve component-local density, nested profile independence and scheme resolution. It **does not demonstrate that a new public `Stack.gap="section"` enum is necessary** rather than current `Stack gap="xl"` plus explicit consumer CSS. Nor does it establish a universally preferable gap size.

Outstanding gates for [#87](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/87):

- At least one **actual project consumer** imports the reviewed package in an isolated branch/build; compare Utility structured and Editorial long-form real contexts, keeping production main unchanged.
- Independent human scanning/readability judgement, supported real browser zoom and text-only resizing, Firefox, Safari/iOS, assistive technology, forced colors and long-content/localization coverage.
- Explicit comparison of adopted semantic role versus existing `xl`/consumer override, style import-order compatibility, token-inspection machine contract/versioning and actual paired performance measurements.
- Resolve or document the independent Lamina heading issue [#98](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/98) rather than silently attributing its overflow to the proposed spacing role.

**Boundary:** No stable API change, Chroma inspection schema modification, new density carrier, release publication or production consumer restyling is authorized by this evidence. Private implementation tests and evidence remain private; this public note records only portable observations and decision consequences.
