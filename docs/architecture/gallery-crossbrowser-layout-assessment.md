# Gallery layout and theme review — Chromium / Firefox

- **Status:** Preliminary assistant-assisted screenshot interpretation; **not independent human sign-off**
- **Date:** 2026-10-08 / 2026-10-09 UTC
- **Reviewed source:** `2b57036a11ba9b286c4d53736a1631c243540400`
- **Scope:** Public gallery and the example-owned material playground only
- **Authority:** [Utility visual directive](visual-directive.md) and [ADR-0008 advisory material guidance](../decisions/ADR-0008-dimensional-utility-advisory-guidance.md) remain unchanged

## Reproducible evidence

- [PR #85](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/85)
- [Gallery Cross-Browser Evidence workflow #37890064542](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37890064542)
- Artifact: `gallery-crossbrowser-2b57036a11ba9b286c4d53736a1631c243540400`, ID `11598081276`, wrapper digest `sha256:35bb464b5924905cebf36cac48a4495d4bb612db9335937a2082078d97d2a86d`
- The run used an **exact-SHA check** for both Git checkout and the manifest; observed screenshot manifest `sourceCommit` matches the reviewed head.
- **22 passes, 4 unsupported, 0 failures, 0 harness errors**, with **40 screenshots** (viewport top and scrolled content, multiple widths/schemes). Screenshots and `manifest.json` are captured as short-lived CI artifacts (14 days).
- Chromium: gallery at 320, 375, 768 and 1280px, light and dark; material page at 375, 768 and 1280px, explicitly selected light and dark.
- Firefox: gallery at 768 and 1280px in actual headless **system** appearance; material page at 768 and 1280px with explicitly selected light and dark, plus native radio keyboard controls. Firefox headless requested 320/375px returned **500px** instead; all four clamped observations are **unsupported**, not validated mobile widths.
- Both engines: real WebDriver Tab and arrow-key selection reaches the native System/Light/Dark radio group with checked state, visible focus, and expected computed theme on the material page.

## Visual assessment of captured frames

1. **Narrow Chromium gallery (320/375px):** The header links wrap, the intro and notice remain legible, the three examples stack in document order with consistent separation and no horizontal clipping. The new third example is not disproportionately emphasized at narrow widths.
2. **Desktop gallery (768/1280px), Chromium and Firefox:** Utility and Dimensional Utility occupy the first row. The third Gloss and Bevel Lab example deliberately spans the second row; its shorter copy produces substantial empty space on its right. The distinct row is visually coherent and avoids a half-empty orphan column. That space is acceptable for this reference gallery but should be revisited if the gallery grows beyond three examples.
3. **Material playground (375/768/1280px), light/dark:** The matte, bevel, shallow shadow and low-gloss examples are distinguishable without repeated nested framing. Cards stack on narrow screens and occupy two columns at desktop widths. Increased gaps reduce visual crowding; the dark scheme remains neutral slate rather than saturated green.
4. **Firefox light/dark:** Explicit local theme radios update the computed page theme and screenshots as expected on supported 768/1280px widths. System-theme appearance is not independently overridden in Firefox in this run.
5. **Static vs interactive affordance:** All cards in the material comparison remain static while actual links retain the hover/focus/active behavior. The screenshot alone cannot establish how many users would mistake a raised panel for a clickable control.

**Disposition:** Retain the current featured-card layout and spacing; no immediate palette or layout change recommended. Favor user-observed hierarchy evidence before introducing any stronger dimensional default.

## Evidence gaps and next review

- **Safari/iOS:** No Safari/WebKit runtime is available in the pinned Linux Nix browser environment. Test actual iOS Safari/System-Light-Dark selection, touch target sizing, focus/navigation through supported input controls, viewport/reflow at mobile widths and reduced-motion settings on an eligible device. Do not infer this from Chromium or Firefox.
- **Firefox narrow mobile:** 320/375px were *not* reproduced because headless window width clamped to 500px. A genuine mobile/small-window Firefox setup or appropriately qualified emulation remains needed before claiming those widths.
- **Human preference / accessibility:** Screenshot inspection by the implementation assistant is **not** an independent reviewer, participant preference study, WCAG certification, native 200% browser zoom, text-only resize, or assistive-technology audit. Keep [issue #76](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/76) open for the remaining platform tasks and [issue #63](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/63) for independent B1–B3 task/affordance review.

The source and artifact are public. No private implementation, stable token/component API or production consumer was changed.
