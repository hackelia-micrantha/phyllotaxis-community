# RFC-0004 — Utility composition patterns from consumer evidence

Status: **Accepted by [ADR-0003](ADR-0003-utility-composition-patterns.md)**  
Origin: [QART-0004](QART-0004-utility-composition-patterns.md)  
Evidence: [Utility consumer evidence — Digitalis community](../architecture/utility-evidence.md)  
Builds on: [Visual directive](../architecture/visual-directive.md), [Visual profiles](../architecture/visual-profiles.md), [RFC-0003](RFC-0003-consumer-experimentation-boundary.md)  
Tracks: #34  
Implementation follow-up: private `phyllotaxis#70`

## Decision under review

Promote the reusable Utility lessons demonstrated by a real community consumer without promoting site-specific styling or expanding Phyllotaxis into an arbitrary theme system.

The proposed decision is:

1. accept **flat low-chroma surface rhythm** as a first-class Utility composition technique;
2. publish a synthetic reference composition for compact introductions, border-sharing information grids, explicit state labels, and link-first action hierarchy;
3. clarify that technical long-form/reference material remains Utility unless the task is genuinely editorial;
4. add profile-aware Cambium advisory checks for common Utility anti-patterns;
5. keep current Chroma and Lamina stable APIs unchanged until additional consumer evidence proves a specific semantic role/component is repeatedly needed.

## Why now

RFC-0003 deliberately kept a consumer “pastel” experiment outside the stable Phyllotaxis API and said reusable success should return through normal design review.

The Digitalis Utility redesign produced a useful result while retaining the accepted constraints:

- system fonts;
- obvious links;
- compact density;
- simple borders;
- flat surfaces;
- no gradients, glass, blur, glow, shadow/elevation, decorative motion, or rounded-card composition;
- semantic HTML, responsive behavior, focus handling, and progressive enhancement.

The repeatable lesson is compositional, not a color palette.

## Utility surface rhythm

Utility MAY use restrained low-chroma background variation to separate adjacent regions when structure or scanning benefits.

The pattern must remain flat and document-like:

- surface variation supplements headings/borders; it does not replace semantics;
- adjacent regions should prefer shared borders/separators over floating cards;
- surface colors must remain low-chroma and contrast-valid with text/link/focus roles;
- no exact palette, number of accents, or color names become stable API;
- consumer/product identity stays outside Phyllotaxis.

This RFC does **not** add `surface-1`, `surface-2`, named pastel colors, or a generic palette scale to Chroma.

## Reference compositions

The public reference fixture demonstrates four patterns.

### Compact introduction

A bounded orientation region with title, summary, and obvious actions. It is intentionally smaller and flatter than a marketing hero.

No `Hero` Lamina component is proposed.

### Border-sharing information grid

Existing Venation Grid/Stack relationships compose contiguous cells with shared borders and compact spacing.

No new Venation primitive is proposed.

### Explicit state label

A small bordered label contains visible state text. Color may reinforce the state but must not be the only signal.

No generic `Badge` or `StatusLabel` Lamina component is proposed yet. A second independent consumer should justify that promotion.

### Link-first action hierarchy

Links remain links. A bounded action treatment is reserved for genuine action emphasis and must not become the default presentation for navigation.

## Technical long-form profile selection

Content length alone does not select Editorial.

Whitepapers, RFCs, specifications, API/reference documentation, runbooks, support material, and operational documentation remain Utility when the primary user task is inspection, lookup, or direct technical work.

Editorial is selected for narrative reading/media semantics, not merely because a page contains many paragraphs.

## Chroma impact

No stable Chroma role expansion is proposed in this RFC.

Consumers may continue using local post-Phyllotaxis overrides for bounded experiments under RFC-0003. Exact consumer palette values remain product-owned.

A later RFC may add semantic surface or state roles only when at least one additional independent consumer demonstrates that the current `canvas/surface/border/text/link/focus` contract cannot express the reusable need without duplicating product-local conventions.

## Lamina impact

No new stable Lamina component is proposed.

The reference patterns remain compositions of native HTML, existing Lamina semantics where applicable, and Venation relationships.

Promotion criteria remain repeated semantic reuse or accessibility-significant behavior.

## Venation impact

No API change.

Contiguous grids, compact stacks, and bounded containers are compositions of existing profile-neutral relationships.

## Cambium advisory checks

Cambium SHOULD be able to report profile-aware advisory findings when a declared Utility surface contains mechanically detectable patterns that commonly contradict the visual directive.

Initial advisory candidates:

| Signal | Default disposition |
| --- | --- |
| external webfont import/reference | warn; system-font-first is preferred |
| CSS gradient used as decoration | warn |
| `backdrop-filter` / blur / glass treatment | warn |
| broad box-shadow/elevation composition | warn |
| repeated large border radii used for ordinary content containers | warn |
| ornamental animation/reveal motion | warn |
| icon-only navigation where text alternative/label structure is absent | warn when mechanically provable |
| unusually large hero-like min-height/padding combinations | informational heuristic only |

These checks are advisory because CSS semantics and product requirements cannot be inferred perfectly from syntax.

Cambium MUST:

- avoid rewriting automatically from a heuristic alone;
- identify the exact declaration/source that triggered the finding;
- allow a documented product/accessibility exception;
- avoid flagging focus outlines, required state emphasis, native control rendering, or Editorial surfaces merely because they differ from Utility;
- prefer deterministic checks where the rule is exact and clearly bounded.

## Reference fixture

The synthetic reference implementation under `docs/examples/utility-reference.*` is evidence-bearing guidance, not a shipped package artifact.

It intentionally:

- uses system fonts;
- uses native semantic HTML;
- uses flat bordered regions;
- demonstrates low-chroma section rhythm with consumer-local values;
- demonstrates contiguous grids;
- keeps state text explicit;
- keeps navigation/actions link-first;
- contains no Digitalis branding or exact production palette.

## Decision lifecycle

ADR-0003 accepts this RFC. The accepted [visual directive](../architecture/visual-directive.md) and [visual profiles](../architecture/visual-profiles.md) are updated in the ADR delivery slice.

## Validation

Before ADR acceptance:

- [x] public docs clearly distinguish composition guidance from stable API;
- [x] reference fixture is usable without JavaScript;
- [x] reference fixture remains understandable with CSS disabled;
- [x] text/link/focus contrast is checked for the documented sample values; the weakest fixture foreground/background pair remains above 5:1;
- [x] no Digitalis-specific names/classes/copy are promoted;
- [x] no new stable Chroma/Lamina/Venation export is implied;
- [x] Cambium follow-up is tracked in private `phyllotaxis#70`.
- [x] ADR-0003 accepts RFC-0004 before accepted visual contracts change.

## Non-goals

- generic theme/plugin infrastructure;
- named pastel themes;
- a stable multi-step palette;
- a generic Card/Hero/Badge library;
- automatic CSS rewriting from heuristic findings;
- changing the Utility/Editorial profile carrier;
- changing experiment ownership defined by RFC-0003.
