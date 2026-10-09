# TEXT-001 — Static semantic text rhythm comparison and review plan

- **Status:** Proposed evidence procedure; **not** a stable contract, implementation or accessibility certification
- **Scope decision:** Authoring/build-time only; runtime personalization and Amaryllis integration are explicitly deferred.
- **Requirement:** [TEXT-001](../requirements/text-rhythm.md)
- **QART:** [QART-0010](../decisions/QART-0010-semantic-text-rhythm.md)
- **Issue:** [#81](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/81)
- **Fixtures:** [HTML comparison](../examples/text-rhythm-comparison.html), [synthetic suggestions](../examples/text-rhythm-suggestions.json)
- **Companion:** [SPACE-001 layout spacing comparison](spatial-rhythm-review-plan.md)

## Evidence model and scope

The HTML fixture is self-contained, contains **no scripts** or external dependencies, and compares four authoring/presentation cases over the same content. The four cases are continuity (existing paragraphs), related transition (author mark, no invented semantics), genuine thematic rule (`hr`), and thematic rule plus an explicitly decorative asterism. All conditions share the same prose and reading order; difference is entirely the authored boundary and its local presentation.

All numerical paragraph, transition and thematic-rule gaps in this fixture are **illustrative study inputs**, not proposed normative roles. [SPACE-001 / QART-0009 / proposed RFC-0009](../decisions/RFC-0009-spatial-rhythm.md) exclusively govern spacing-value and typography decisions; TEXT-001 governs authored break semantics, reviewed static suggestions and optional ornamentation.

The specimen covers two content classes, Utility technical/reference and Editorial narrative, and shows each in light and dark. Example attributes (`data-fixture-profile`, `data-fixture-scheme`, `data-variant`) and `--fixture-*` values are **test-only** and must never be promoted to a Chroma/HTML public carrier by implication.

The synthetic suggestion JSON illustrates prepublication review: an author-approved suggestion with exact revision and stable block ID, a pending suggestion, a stale revision and a non-existent block anchor. There is no model invocation, inferred semantics, reader-time mutation or released schema. In production, approval and revision/anchor validation would need a separate host-owned tool and policy. The fixture checker only proves this example's static predicates.

## Automated checks

`nix flake check` includes a `text-rhythm-fixture` build-time check that checks:
- 16 total combinations: 2 profiles × 2 schemes × 4 variants.
- No JavaScript, event handlers, external resources or duplicate HTML IDs.
- Identical authored text/blocks across variants for each profile.
- Exactly one native `hr` for thematic/ornament variants, none for mere transitions; ornament only in its designated variant and with `aria-hidden="true"`.
- Expected positive and negative synthetic suggestion states (approved revision+anchor, pending, stale, missing).
- A set of negative mutations must be rejected by the checker itself.

These checks are structural only, not visual, accessibility, or model-accuracy conclusions. The HTML/JSON are **not part of the published Phyllotaxis package**. The HTML alone is allowlisted for the static GitHub Pages review gallery; the JSON suggestion cases are **not** published as a Pages data resource. This adds a visual review link, not an accepted component or runtime feature.

## Automated Chromium geometry evidence (experimental)

The [TEXT-001 browser evidence harness](../../tools/text-rhythm-browser-evidence.mjs) and [read-only CI workflow](../../.github/workflows/text-rhythm-browser-evidence.yml) exercise this **static HTML fixture**, not the Phyllotaxis package or a live consumer:

- eight CDP-emulated 320/375/768/1280 CSS-px viewport × light/dark measurements covering all sixteen authored specimens per case;
- bounded checks for document/specimen overflow, native `hr` presence, optional `aria-hidden` ornaments, and explicit surface color-scheme behavior;
- eight screenshots targeting both the applicable light/dark surfaces **and actual ornament locations** (Utility at 320px, Editorial at 1280px), plus two explicitly **CSS-simulated** text stress checks, exact source/fixture identity and persisted failure evidence;
- a fixed 1-column narrow layout / 2-column wide layout keeps continuity adjacent to transition and thematic rule adjacent to ornament; five native fragment navigation links and per-surface return links make the long comparison reviewable without JavaScript;
- experimental Chromium DevTools accessibility-tree inspection (native `hr` present as exactly one exposed `separator` per thematic/ornament variant, `aria-hidden` glyph ignored), keyboard Tab focus, forced-colors affordance and CSS-off DOM/anchor preservation; results are recorded only after exact-head CI;
- no inference, application JavaScript, runtime personalization, publication or deployment.

**Visual review correction (from original merged-main screenshots):** the first 1280px screenshot showed three side-by-side treatments and a fourth wrapping to a later row; light/dark captures both began at the first Utility-light specimen. The revised structure and targeted captures address those reviewability problems. They are not proof that readers prefer the result.

**CI is evidence, not semantic approval.** Screenshots require human visual inspection. A Chromium accessibility-tree `separator` role and hidden decorative glyph are **not** evidence of how NVDA, VoiceOver or TalkBack announces the document. Automated forced-colors and stylesheet-removal probes, when passing, establish limited browser and DOM behavior only—not a manual visual audit, actual browser zoom/OS text-only resize, Firefox/Safari/iOS parity, semantic correctness or real consumer accessibility. Record exact run SHA and conclusion before marking any scenario passed.

### Manual assistive-technology review protocol

On the [live static TEXT-001 review page](https://hackelia-micrantha.github.io/phyllotaxis-community/examples/text-rhythm-comparison.html), record the browser/version and screen-reader/version, input method, date and observed speech or braille. Use at least one **real** screen-reader/browser pairing such as VoiceOver+Safari or NVDA+Firefox/Chromium; do not substitute the CDP accessibility tree.

1. Follow the jump links with keyboard only; verify meaningful focus and headings in the intended order. Test both a Utility and an Editorial surface, one in light and one in dark.
2. Read through the boundary between the second and third paragraph of each variant. **Continuity** and **thought transition** must not announce a separator. **Thematic rule** and **ornament** should each announce exactly one meaningful separator according to that reader's native behavior.
3. Confirm `⁂` is not spoken separately in the ornament case, and that no thematic boundary is lost when the visual rule is clipped for ornament presentation. Record literal observed speech rather than assuming native `hr` announcement terminology.
4. Disable CSS and repeat the semantics/navigation check; then test forced colors, actual browser 200% zoom, print and a missing-glyph fallback separately. Record skipped/unsupported cases explicitly.
5. If any screen-reader pairing drops the clipped `hr`, doubles the separator, or announces the ornament, retain TEXT-001 as **unresolved**, fix author-owned markup/CSS and repeat the same paired test. Do not add an API or declare WCAG conformity from the synthetic fixture.

This protocol is an **instruction for human testing**, not a claim it has been performed.

## Manual evidence matrix

| Condition | Required observation | Status |
| --- | --- | --- |
| 320, 375, 768, 1280 CSS px | overflow, readable measure, no clipped code, clear conceptual separation | Not run |
| Light and dark, Utility and Editorial | separation without over-decoration or color-only meaning | Not run |
| 200% text resize and zoom | reflow, non-overlap and predictable margins | Not run |
| WCAG text-spacing overrides | author break survives changed line/letter/word/paragraph spacing | Not run |
| Forced colors/high contrast and no CSS | thematic `hr` meaning survives styling removal; ornament not sole cue | Not run |
| Keyboard and screen reader | DOM order unchanged; exactly one meaningful thematic separator announced; glyph not separately announced | Not run |
| Print and localization expansion | break remains understandable, without stranded rule or clipped long content | Not run |
| Long-page anchors and scroll position | no unexpected jumps in static content across reload/navigation | Not run |

Capture browser/version, viewport, settings, screenshot evidence and genuine assistive-technology observations. Do not substitute visual inspection or automated audits for screen-reader evidence.

## Human editorial judgment

Use at least two independently reviewed representative passages (one documentation-heavy, one narrative), and an adversarial passage with lists, code, a block quotation, and a figure caption. Compare authored gold markers against *candidate* static suggestions. Classify false thematic-break insertions more severely than missed subtle transitions. A model's confidence is not authority or semantic truth; rejected suggestions should be preserved as review evidence without publishing their markup. The synthetic JSON is not an AI benchmark.

## Promotion gates

1. Gather browser, print, CSS-disabled and assistive-technology evidence; record limitations.
2. Decide whether accepted native HTML + existing `Prose` is sufficient or a tightly bounded role is justified by repeated consumers.
3. Resolve QART-0010, then RFC and ADR for **any** stable API/token/inspection change.
4. If static AI integration proves useful, specify a separately versioned authoring contract with privacy, revision binding, prompt-injection defenses, human approval and rollback. Do not create a runtime dependency.

No Phyllotaxis package release, runtime capability, accepted contract, or private implementation change is implied by static fixture validation. Publication of this HTML under a separate, explicitly reviewed static Pages preview remains distinct from release or design acceptance.
