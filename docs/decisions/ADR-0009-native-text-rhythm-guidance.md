# ADR-0009 — Accept native authored text-rhythm guidance without new APIs

- **Status:** Accepted — limited authoring/review guidance only
- **Date:** 2026-10-09
- **Decision owner:** Phyllotaxis public design authority; operator approved the native-first direction
- **Source:** [QART-0010](QART-0010-semantic-text-rhythm.md) and [RFC-0010](RFC-0010-native-text-rhythm-guidance.md)
- **Tracking:** [TEXT-001 / #81](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/81)
- **Supersedes:** None
- **Superseded by:** None

## Context

Phyllotaxis requires first-class space between ideas without duplicating layout/token ownership. The [live TEXT-001 comparison](https://hackelia-micrantha.github.io/phyllotaxis-community/examples/text-rhythm-comparison.html) contrasts continuation, a related thought, a true thematic rule and an optional asterism under Utility and Editorial. An existing accepted `Prose` contract already preserves author-supplied native HTML. Adding a new semantic component would increase the stable API without demonstrated consumer demand.

The decision owner approved the native-HTML plus existing-`Prose` direction and optional author-controlled ornaments. This is **not** an assertion that a screen-reader has been tested or that a visual preference is proven universally.

## Decision

**Accept RFC-0010 only as authoring/review guidance, with no new public component or contract.**

1. **Authored semantics have priority.** Ordinary paragraphs express continuation; appropriate headings/sections express an actual subsection; a genuine thematic boundary is represented by native `<hr>` where applicable. Neither margin size nor model output is a substitute for authored meaning.
2. **Keep existing `Prose`.** No `ConceptBreak`, `EditorialFlow`, new Lamina props, custom separator HTML carrier or document resegmentation is accepted. Authors retain control of all block order and boundaries.
3. **Ornaments are opt-in consumer presentation.** A modest `⁂`, `❧` or another understated glyph may visually accompany an existing thematic break, especially in Editorial. Utility remains restrained by default. No ornament is required by theme, content type or color scheme.
4. **Accessibility semantics remain native.** Preserve the `hr` as a semantic separator and ensure any separate ornament is purely decorative, for example `aria-hidden="true"`. If a particular rendering fails actual assistive-technology review, use the plain native rule and revise presentation. The Chromium accessibility tree is not a screen-reader certification.
5. **Space ownership is unchanged.** Chroma/Venation spacing values, density, reading measure, headings/paragraph margins and possible section roles belong exclusively to SPACE-001 / QART-0009 / proposed RFC-0009. TEXT-001 creates no parallel token or CSS default.
6. **AI is not authoring authority.** Reviewed, immutable **build-time** suggestions remain optional research, not accepted wire schemas, markup generation rights, default inference or reader-time dynamic behavior. No Amaryllis/runtime integration is introduced or required.
7. **Existing valid consumers stay valid.** This guidance creates no migrations, new machine conformance rules, versioned CLI/inspection obligations, private implementation duties, release authority or publishing effect.

## Rationale and alternatives

The native baseline represents the required meanings using broadly interoperable HTML and existing `Prose`, minimizing semantic duplication, output drift and migration. Author-owned ornamentation gives Editorial a stylistic option while preserving a minimal Utility baseline. There is insufficient repeated consumer evidence for another component or shared ornament token. Arbitrary margins, glyph-only separators, and automatic model-driven document changes are rejected as substitutes for content semantics.

## Evidence and explicitly unsupported claims

- [PR #83](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/83) established the public, script-free comparison.
- [PR #91](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/91) corrected the specimen layout and screenshot targeting; the updated public [Pages deployment](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37898457265) confirmed the live preview route.
- [PR #95](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/95) verified Chromium accessibility-tree `separator` roles and excluded ornamental `⁂` from that tree. [Exact landed-main browser CI](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37901608930) passed on `0601543762c5df94ac9f046d350d6943cf1a598f`.
- Real VoiceOver/NVDA announcement, editorial correctness of break placement, real browser zoom/OS text resize, Safari/iOS and representative consumer use **remain unverified**. The evidence does not establish WCAG conformance or justify normative styling/enforcement.

The approval supports choosing the conservative authoring direction **despite** those gaps. They remain blocking for stronger accessibility claims and any future normative API, not for recording this narrow no-change interpretation.

## Consequences and follow-up

- Existing semantic and package contracts remain unchanged; guidance can be adopted by authored prose immediately, with local presentation and plain native fallback.
- Public examples remain synthetic and non-normative; no change to `@micrantha/phyllotaxis`, releases, main-site deployment or private repository is required.
- [Issue #81](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/81) remains open for the [manual screen-reader protocol](../architecture/text-rhythm-review-plan.md#manual-assistive-technology-review-protocol), editorial review and any independently scoped build-time suggestion research.
- Reassess only if two independent real consumers demonstrate a missing semantic capability, a reproducible assistive-technology incompatibility, or a clearly governed need for a static authoring contract. Any such change starts a separate QART/RFC/ADR and compatibility/security analysis.

## Authority references

- [Accepted editorial/Lamina contract](../architecture/lamina-editorial-contract.md)
- [SPACE-001 requirement](../requirements/spatial-rhythm.md)
- [QART-0009](QART-0009-spatial-rhythm.md) and [proposed RFC-0009](RFC-0009-spatial-rhythm.md)
- [TEXT-001 requirement](../requirements/text-rhythm.md)
- [TEXT-001 manual review](../architecture/text-rhythm-review-plan.md)
