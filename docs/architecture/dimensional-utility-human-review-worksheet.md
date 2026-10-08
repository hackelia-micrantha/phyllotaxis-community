# Utility material review — independent evaluation worksheet

Status: **Review protocol / unexecuted**. No independent human judgement or user-study result is recorded by this worksheet.

This worksheet is the remaining human-evidence task in [issue #63](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/63), distinct from accepted **advisory-only** [ADR-0008](../decisions/ADR-0008-dimensional-utility-advisory-guidance.md). It covers the [B1–B3 boundary examples](../examples/dimensional-utility-boundaries.html) against the [flat F0 reference](../examples/dimensional-utility-reference.html). It is **not** an accessibility certification or approval to add styling APIs.

## Session metadata

| Field | Reviewer fills in |
| --- | --- |
| Independent reviewer / affiliation | *Unrecorded* |
| Date, OS, browser/version, device, viewport | *Unrecorded* |
| Display/color mode, zoom/text scaling/assistive settings | *Unrecorded* |
| Exact reviewed Phyllotaxis Community commit and fixture blob | *Unrecorded* |
| Evidence link (screenshots, notes or recording with consent) | *Unrecorded* |
| Limitations, conflicts of interest, accessibility accommodations | *Unrecorded* |

Use a reproducible checked-in fixture. Do not rely on a time-limited GitHub Actions artifact without recording the source commit and test conditions. Remove or protect user-identifying details from any shared notes.

## Protocol

1. Review the **F0** flat baseline first and describe the content's task, primary information, and controls in plain language.
2. Observe **B1** (one tinted, shallow elevated region) separately. Without reading its case label, ask: *What is the most important information here, and why?* Then compare to F0 and record whether differentiation actually improves orientation or instead draws unnecessary attention.
3. Observe **B2** in isolation before revealing that it is an intentionally negative treatment. Ask the reviewer to identify primary information, subordinate containers, and any implied interactivity. Record whether nested framing is useful or distracting; do not prime the reviewer by calling it bad in advance.
4. For **B3**, compare the differentiated raised-action/inset-static pair and the equally raised pair (counterbalance left/right order if showing screenshots separately). Ask *Which areas would you click and why?* Require the reviewer to distinguish the native **Inspect** button from the read-only status. Record incorrect expectations rather than inferring confusion from CSS.
5. Repeat relevant checks in **light and dark**, narrow desktop/mobile widths, keyboard-only navigation, 200% browser zoom, 200% text-only resize where the browser supports it, and text-spacing overrides; mark unavailable equipment or settings as **not tested**.
6. Verify that focus, status meaning, action/link semantics, reading order, forced-colors/high-contrast and reduced-motion needs remain understandable. The accepted [accessibility capability floor](../requirements/accessibility.md) controls required behavior.
7. Record case-specific observations, a qualitative disposition and confidence. Do not turn a positive recommendation into a mandatory visual style or conformance assertion.

## Reviewer findings

| Review dimension | B1 bounded combination | B2 nested over-stack | B3 relative hierarchy |
| --- | --- | --- | --- |
| Primary content understandable | Not reviewed | Not reviewed | Not reviewed |
| Distinguishable action versus static content | Not reviewed | Not reviewed | Not reviewed |
| Decoration supports rather than obscures hierarchy | Not reviewed | Not reviewed | Not reviewed |
| Low-chroma light/dark suitability | Not reviewed | Not reviewed | Not reviewed |
| Keyboard/focus/reflow/text-stress observations | Not reviewed | Not reviewed | Not reviewed |
| Reviewer preference and rationale | Not reviewed | Not reviewed | Not reviewed |
| Rejected variation or documented exception | Not reviewed | Not reviewed | Not reviewed |
| Evidence link and confidence | Not reviewed | Not reviewed | Not reviewed |

## Disposition

Record one of **supports current advice**, **revise advice**, **reject advice**, or **insufficient evidence** for each case, with concrete observations. A B1 preference does not justify a stable Chroma token; a negative B2 observation is not a universal nesting ban; and a visually clearer B3 screenshot does not prove real-world false-affordance rates.

The session owner posts a bounded summary with evidence and limitations to [issue #63](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/63). If findings materially challenge accepted ADR-0008, open a separate public reassessment rather than silently rewriting the existing decision. Changes to package interfaces or private implementation require their own approved contract.
