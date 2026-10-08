# RFC-0008 — preliminary composition assessment (B1–B3)

Status: **Review candidate, non-normative — not an accepted decision or a human sign-off**.

This assessment considers the published [RFC-0008](../decisions/RFC-0008-dimensional-utility-materials.md), [fixture plan](dimensional-utility-fixtures.md), and the isolated public [B1–B3 HTML](../examples/dimensional-utility-boundaries.html). Its purpose is to support the design decision in [issue #55](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/55), not to declare conformance or an approved visual standard.

## Evidence provenance and coverage

- Source [PR #64](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/64) merged at `1675ea63176c94e09535388655d8bb9a743994ea`.
- Reproducible source run: [Browser Evidence #37745594999](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37745594999) on `c14f118c3a4eb062a582b84e2ac1c8eb243a5bf3`.
- Immutable artifact digest: `sha256:d77aee141ef0a321178e0c715a627b4c900e56de5f0ec9be056b94f5489dc677`.
- Fixture blob: `86c0b5de8a96b724b67964edddb7bf232f09dc0b`. The harness is version `0.2.0`.
- Portable results: **two browsers completed, zero harness failures, zero required failures, sixteen unsupported environment observations**. Checks cover *structure, calculated styles, navigation and reflow*; they do **not** establish aesthetic value, task performance or full WCAG conformance.
- Inspected screenshot set: Chromium/Firefox, light/dark, B1–B3 from the versioned CI artifact. The captured screenshots are viewport images after a section scroll; some include portions of adjoining sections. They are not full-page screenshots, and all observations below are qualitative.

## Composition findings

| Case | Observed presentation | Assessment | Decision effect |
| --- | --- | --- | --- |
| B1 — low-chroma tint plus shallow elevation | A single lightly tinted, bordered region distinguishes a status panel from surrounding document flow, without additional nested card shells. Dark-mode shading remains subdued. | **Reasonable opt-in candidate**, not evidence that every Utility panel benefits from elevation. The border/shadow/radius treatment is still a deviation from the flat baseline. | Proposed guidance may allow a *single semantically justified* differentiated region while keeping F0 as the default. |
| B2 — nested over-stacking | Multiple closely nested rounded borders and shadows create several competing enclosures around one status message. The nested framing becomes more prominent than the status content; repeated edges remain conspicuous in both schemes. | **Reject as a shared example**. This is a useful negative fixture, not a normative ban on all nesting. | Document stacking restraint: avoid repeated radius + shadow + gloss on ordinary static content unless hierarchy and task justify every layer. |
| B3 — relative elevation | The left example distinguishes a raised action region from an inset read-only status. The right example gives both action and read-only areas the same rounded, raised treatment. Native buttons identify actual actions in both versions. | **Prefer differentiated treatment provisionally**; equal elevation makes status appear unduly action-like. Neither screenshot alone proves that users actually mistake the status area for a control. | Prefer elevation that communicates meaningful hierarchy, and verify false affordance through interaction/human testing rather than inferring it from the CSS. |

### Limits of the visual judgement

- These are **assistant-assisted qualitative observations**, not independent human user research or repository-author acceptance. A reviewer with authority over the public contract should explicitly confirm or reject the recommendation.
- B1 and B2 have similar words but different container nesting; B3 shows a different structure/task. This is *not* a randomized A/B study, task-completion result or controlled, same-markup comparison of every treatment.
- Screenshot inspection cannot establish touch target usability, browser/OS accessibility, motion experience, reading order under user customizations, or actual assistive technology behavior.
- Light/dark desktop captures are visible evidence. Some portable headless checks report **unsupported**: real browser-level 200% zoom; Firefox 320/375px window sizes; Firefox forced-colors/reduced-motion overrides. The accepted [accessibility capability floor](../requirements/accessibility.md) also requires **200% text-only resize, text-spacing resilience and target-size/spacing evidence** where applicable.
- Three repeated  desktop observations cannot establish consumer performance impact. Do not translate source-size/paint figures from the tiny fixture into production budgets or release guarantees.

## Proposed RFC disposition

**Recommend revising RFC-0008 as *advisory composition guidance*, then requesting an explicit acceptance decision; do not create an accepted ADR yet.**

1. Preserve the accepted [flat-first Utility directive](visual-directive.md) and [ADR-0003](../decisions/ADR-0003-utility-composition-patterns.md). Existing product-owned deviations are already possible. This RFC should articulate how to *review* a recurrent deviation class, not claim newly created permission or a new default.
2. Permit a **single opt-in, purpose-specific** use of restrained tint, border, and shallow elevation when it strengthens a genuine hierarchy. These are descriptive design considerations rather than fixed pixel/color/shadow thresholds or Chroma exports.
3. Reject routine nested gloss/elevation/radius stacking and equal-elevation treatment of unrelated static/action areas as shared patterns, subject to documented context-specific exceptions.
4. Reference the accepted accessibility/interaction contracts directly instead of restating or weakening their criteria. Require explicit verification of interactions, focus, status non-color dependence, and responsive behavior for actual consuming surfaces.
5. Record open evidence honestly: human visual/semantic sign-off, accessible platform/zoom/text-size conditions, and representative consumer comparison remain outstanding. **Do not gate publishing these preliminary visual observations on claiming those checks have passed**, but do gate any stable API or conformance declaration on appropriate evidence.
6. Do **not** promote material tokens, generic Lamina Card/Pill/Badge APIs, automatic Cambium restyling, visual profile proliferation, or production migration from these fixtures.

## Acceptance checklist and next owner

- [x] Publish versioned, reproducible browser evidence and negative fixtures (merged PR #64).
- [x] Publish a preliminary qualitative interpretation with screenshot provenance and limitations (this document).
- [ ] Obtain explicit human design/semantic review: is B1 useful, is B2 rejected, and does B3's differentiated elevation better communicate its controls?
- [ ] Select RFC disposition: (a) accept **advisory** review bounds only, (b) revise/defer, or (c) reject. Explain why existing ADR-0003's product-owned deviation route is or is not sufficient.
- [ ] If affirmative, create a uniquely numbered **accepted ADR** as a separately reviewed change; only change the accepted visual directive when the decision explicitly requires it.
- [ ] Defer stable Chroma/Lamina/public API promotion and any private implementation work until separately accepted/versioned contracts exist.

Issue [#63](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/63) tracks disposition of the boundary review; [#55](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/55) owns the RFC decision. Neither can be silently closed by a passing browser run.
