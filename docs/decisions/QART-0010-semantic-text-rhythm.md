# QART-0010 — Semantic text rhythm, optional ornaments, and AI suggestions

- **Status:** Resolved for authored semantic-boundary direction by [RFC-0010](RFC-0010-native-text-rhythm-guidance.md) and [ADR-0009](ADR-0009-native-text-rhythm-guidance.md); accessibility observations and optional build-time suggestion contracts remain unaccepted
- **Date:** 2026-10-08
- **Requirement:** [TEXT-001](../requirements/text-rhythm.md)
- **Issue:** [#81](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/81)
- **Adjacent (independent) spatial analysis:** [SPACE-001](../requirements/spatial-rhythm.md) / [QART-0009](QART-0009-spatial-rhythm.md)

## Question

How should Phyllotaxis present **conceptual separation inside text**, optionally with an ornament and AI-assisted suggestions, without confusing visual whitespace with authored meaning, duplicating the accepted `Prose` contract, or making reading depend on inference?

Existing `Prose` deliberately preserves authored HTML and does not generate, reorder, or infer content. Chroma supplies typography and spacing; Venation supplies layout relationships; authors own document meaning. Existing SPACE-001/QART-0009 separately evaluate section/component spacing and possible density selection. This QART concerns **within-prose semantic segmentation**, not another layout layer. **SPACE-001 / QART-0009 / proposed RFC-0009 exclusively govern paragraph and heading spacing, reading measure, density, and new Chroma/Venation spacing tokens.** TEXT-001 may propose an authored boundary and optional decorative representation, but cannot independently resolve margins, tokens, CSS values, or layout defaults.

## Alternatives: content model and presentation

| Option | Description | Benefits | Risks / required evidence |
| --- | --- | --- | --- |
| **A. Native markup + current `Prose` (initial baseline)** | Authored paragraphs/headings/`<hr>` communicate continuation and thematic breaks; profile-aware CSS handles rhythm. Consumer-owned ornamental styling for prototypes. | Accessible progressive enhancement, zero stable API churn, predictable SSR/Markdown | Lacks standardized intensity and ornament preferences; consumer styling divergence |
| **B. Native markers with SPACE-owned presentation (candidate preferred)** | Reuse native markers and existing `Prose`; refer proposed visual spacing roles or CSS resolutions to QART-0009 / RFC-0009 | Author-owned meaning without duplicate spacing authority | Need evidence distinguishing thematic semantics from merely larger paragraph gaps |
| C. New Lamina component(s) | Proposed `ConceptBreak` or `EditorialFlow` could express meaningful break strength/ornament | Explicit in JSX and review tools | New public API without evidence; Markdown/SSR interop, a11y semantics, and CMS coupling; conflicts with `Prose` no-inference rule |
| D. Generic margins/symbol-only separators | Arbitrary per-paragraph spacing and decorative glyphs, or text-generation-driven HTML | Fast for one-off presentation | Loses semantic distinctions, inaccessible or duplicate announcements, arbitrary styles, fragile export and reading order |

**Historical provisional direction (before ADR-0009):** start with A; evaluate B where repeated independent Utility + Editorial consumers demonstrate a real semantic-marker need. Route evidence for any new *spacing* roles to QART-0009 / RFC-0009, never an independent TEXT-001 spacing decision. Reserve C for a distinct relationship that native markup and `Prose` cannot express. Reject D as a shared contract.

A genuine thematic break maps to native `<hr>` (HTML thematic-break semantics). A related change of thought without a thematic change may need only an authored paragraph grouping or heading, not a fabricated separator. Neither whitespace quantity nor AI prediction by itself proves a thematic break.

## Alternatives: optional ornamentation

- **No ornament:** visually bounded whitespace or native thematic-rule line, strongest Utility baseline.
- **Opt-in theme-resolved ornament:** tiny asterism `⁂`, fleuron `❧` or restrained geometric marker in place of a visually styled rule where compatible with content, user preference, and assistive technology.
- **Mandatory ornament:** rejected by ADR-0009; introduces decoration into technical reference content and user experiences that do not request it.

The symbol is never the semantic source of truth. Compare CSS background/mask artwork and an explicitly `aria-hidden` decorative element with native `<hr>` semantics; CSS `content` text may reach assistive tech and requires testing. Do not add a second live separator or rely on Unicode glyph availability without fallback. Profile, scheme, density and ornament preferences are distinct concepts. No new carrier or custom-property name is accepted here.

## Alternatives: AI decision boundary

| Mode | Source of semantic breaks | Behavior on model failure | Trust/UX implication |
| --- | --- | --- | --- |
| Manual authoring | Author/publisher | Normal HTML | Default, deterministic |
| **Static inference suggestions** | Author-approved suggestions anchored to immutable document revision and block IDs | Drop invalid/stale suggestions; render original document | Candidate for build/editor tools; repeatable review and no reader-time inference |
| Dynamic reader-time *presentation only* | Existing authored/approved semantic breaks; user/host preference adjusts spacing | Stable baseline with no inference | Experimental Amaryllis integration only if separately available and governed |
| Dynamic reader-time semantic resegmentation | Model inserts/removes thematic breaks while person reads | Ambiguous layout/meaning | **Not recommended**: scrolling/hydration drift, privacy, accessibility, non-deterministic semantics |

AI analysis must remain optional and externally owned. Amaryllis is a possible inference/adaptation integration, not an assumed general web runtime or Phyllotaxis dependency.

### Observed Amaryllis integration boundary

The current [Amaryllis runtime-personalization documentation](https://github.com/hackelia-micrantha/amaryllis/blob/main/docs/runtime-personalization.md) describes an active React Native-focused `0.1.x` component system: a registered implementation/contract is authoritative; model output is validated through JSON Schema, unsafe-key and bounded JSON Patch checks before contributing known props, variants, slots or design-token values. This *may* fit a **registered reading-density variant**, if the host defines explicit allowed variants and application policies. It does **not** establish a web-compatible inference API, provide semantic document parsing, or authorize editing the page's text/boundaries.

The same documentation warns that the full `PolicyEngine` is **not automatically invoked** for every programmatic `PersonalizedComponent` call. A Phyllotaxis consumer would still need reviewed application-level accessibility, privacy, allowed-variant, change-timing and authority checks, even for schema-valid output. Any mobile proof of concept should fail closed to the registered base presentation. A web integration requires separate feasibility/design review; do not import the React Native provider merely to style HTML prose. A semantic suggestion record may carry document revision, stable after-block anchor, break kind, optional confidence, inference provenance and approval; [TEXT-001](../requirements/text-rhythm.md) contains a **non-normative illustration**, not a contract schema.

Priority: explicit authorial boundaries > approved immutable build-time suggestions > unapproved suggestions (never rendered as document authority). Host-owned data-handling and governance determine whether private text may be analyzed. No auto-generated CSS/markup execution or unsanctioned remote inference.

## Design risks to resolve

1. **Boundary correctness:** How reliably can reviewers distinguish a paragraph transition from a true thematic break, especially with paragraphs spanning code, lists, quotes and multilingual content?
2. **No duplicate ownership:** Can current `Prose` descendants express the needed rhythm without a new structural layer, component prop or generic CSS passthrough?
3. **Nested styles:** How do adjacent heading/paragraph/break margins interact under two profiles without collapse/doubling and without altering consumer styling unexpectedly?
4. **Accessibility:** How should thematic break be conveyed exactly once to assistive technology when a decorative ornament is used? Validate at least one representative reader/browser combination and fallback if ornament unsupported.
5. **Density and personality:** Can more generous Editorial spacing coexist with dense Utility reference content? Does a proposed density selection from QART-0009 change value resolution only, without altering authored breaks?
6. **Source formats:** Which native Markdown/HTML source patterns have stable, reproducible block identities across rebuilds and incremental editing?
7. **Inference uncertainty:** How are false positives, stale anchors, content changes, provenance/version drift, prompt injection in article contents, and editorial overrides surfaced and rejected?
8. **Runtime (historical alternative, expressly deferred):** Reader-time adaptation is outside current TEXT-001 scope and is **not** a blocker or implementation dependency for this authoring/build-time decision. No runtime analysis or Amaryllis integration is authorized.
9. **Distribution:** Would additional CSS tokens or exported components require changes to versioned Chroma inspection or npm package surface? Describe semver, opt-in migration and rollback before accepting changes.

## Evidence matrix

Compare the same reference text across: (1) unmarked paragraph baseline; (2) author-approved transitions; (3) native thematic breaks with plain rule; (4) thematic breaks with an opt-in ornament; (5) invalid/stale AI suggestions that must safely be ignored.

- **Surfaces:** one Utility technical reference containing code/tables, one Editorial narrative/article with a meaningful scene/argument change, and one intentionally dense operational section as negative control.
- **Presentation:** Utility/Editorial × light/dark; 320/375/768/1280 CSS px; a relaxed consumer preference and the unmodified accepted compact default.
- **Accessibility:** browser zoom, 200% resize, WCAG text-spacing overrides, reflow, high contrast/forced colors, screen-reader boundary announcement, keyboard/DOM order, no CSS/JS, localization.
- **Behavior:** SSR/hydration and long-page scroll stability, browser back/forward/anchor navigation, print/export and unsupported glyph fallbacks.
- **AI evaluation:** gold authored annotations and adversarial samples; agreement/disagreement and false-positive costs, stale document revision and invalid anchors, prompt-injection resistance, no outbound private data by default.
- **Performance:** paired payload/render/layout-shift evidence under PERF-001; do not invent performance thresholds.

A static example/gallery may demonstrate options but is **non-normative**, not a released package or evidence of acceptability by itself. Chromium accessibility-tree probes can test whether native `hr` remains an exposed `separator` and an `aria-hidden` ornament is excluded; **only a separate real screen-reader review** can assess announcement quality (see the [manual protocol](../architecture/text-rhythm-review-plan.md#manual-assistive-technology-review-protocol)).

**Accepted no-API authoring direction:** Retain **A (native HTML + current `Prose`)** as the default, per [ADR-0009](ADR-0009-native-text-rhythm-guidance.md). Treat **B** solely as optional authored presentation guidance using SPACE-owned styling; the synthetic comparison does not justify a new public style role. Do not promote **C (new Lamina component)** without a concrete semantic need that native markup cannot satisfy. The limited ADR-0009 authoring guidance is accepted, but no **new normative API, accessibility conformance or release change** is implied.

## Static comparison available (not normative API or accessibility acceptance evidence)

The [TEXT-001 static comparison](../examples/text-rhythm-comparison.html), [illustrative prepublication suggestion data](../examples/text-rhythm-suggestions.json), and [review plan](../architecture/text-rhythm-review-plan.md) provide an initial reproducible authoring baseline. Its fixture checker verifies structural integrity, not the quality of a concept break, screen-reader announcements or browser layout. Evidence remains pending.

**Current scope decision:** runtime Amaryllis personalization, browser-time inference and dynamic reflow are deferred. Evaluate only authored HTML and optional reviewed **build-time** suggestions. Earlier runtime alternatives remain historical design questions, not this iteration's implementation work.

## Historical proposed disposition and sequencing

1. Confirm A as the no-regression baseline and collect comparisons across existing consumers; coordinate with #79 so text spacing and section spacing do not double-count.
2. Resolve whether A with authoring guidance suffices, or whether B warrants more explicit semantic content markers. Route any proposed spacing role, paragraph/heading margin or reading measure to SPACE-001 / QART-0009 / RFC-0009. Leave C unpromoted without strong repeated evidence.
3. Evaluate static suggestions independently of runtime style adaptation; define a candidate representation in RFC only if integration need is demonstrated.
4. Advance **QART-0010 -> a subsequent TEXT-specific RFC -> ADR** only for authored markers, `Prose` semantics or build-time suggestions. CSS spacing values/roles must be decided by the SPACE-001 path before any related private implementation.
5. Keep AI trust, data locality and author approval externally governed. **Runtime/Amaryllis integration is deferred by operator direction;** current work is static authoring and optional build-time suggestions only.

No new `ConceptBreak`/`EditorialFlow` export, CSS token, ornament carrier, inference service or runtime policy is accepted by this QART.

## Decision disposition — October 9, 2026

The decision owner approved the smallest native authoring direction after the published visual comparison and Chromium AX/keyboard/CSS-off evidence. [RFC-0010](RFC-0010-native-text-rhythm-guidance.md) records the bounded guidance; [ADR-0009](ADR-0009-native-text-rhythm-guidance.md) accepts **author-controlled native boundaries and optional decoration** without changing public package contracts, styling defaults, inspection schemas or browser-time behavior.

- **Selected:** Option A, using existing `Prose` and native paragraphs, headings, sections and `hr`.
- **Permitted as consumer-owned advisory treatment only:** Option B's optional visual decoration and spacing chosen through existing accepted ownership. SPACE-001 alone determines any future shared spacing roles.
- **Not accepted:** Option C (`ConceptBreak` / `EditorialFlow` exports), Option D (visual whitespace or ornament as invented content meaning), model-inserted runtime boundaries and any new AI-suggestion wire schema.
- **Unverified:** actual screen-reader speech, human placement accuracy across representative documents, CSS/print/browser matrix and build-time suggestion integration. The [review protocol](../architecture/text-rhythm-review-plan.md#manual-assistive-technology-review-protocol) and [issue #81](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/81) retain these as follow-up evidence, not a reason to claim WCAG conformance.
- **Compatibility:** no existing consumer changes or migration. No private implementation/release authorization.

The resolved choice is deliberately narrower than a new normative capability; reopen a separate QART/RFC before proposing a component, token, stable suggestion schema or inference integration.
