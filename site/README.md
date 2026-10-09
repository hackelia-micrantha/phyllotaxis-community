# Phyllotaxis GitHub Pages gallery

Status: **pre-release public reference gallery**. The site is not the canonical design authority and is not a substitute for a published Phyllotaxis package.

The site includes the landing page, three synthetic reference fixtures (including the **non-normative TEXT-001 semantic text-rhythm comparison**) and an **experimental, non-normative material lab** for gloss, beveled controls, soft shadow, CSS-only System/Light/Dark selection and bounded hover states. The gallery uses neutral surfaces and more spacing so these treatments are easier to compare. The first is a Utility contract illustration. The second is an RFC-0008 comparison under [ADR-0008's accepted, non-binding advisory review guidance](https://github.com/hackelia-micrantha/phyllotaxis-community/blob/main/docs/decisions/ADR-0008-dimensional-utility-advisory-guidance.md), **not** an accepted visual profile, a validated example, or an implementation guarantee. None of the styling here is a Chroma token contract or a private implementation copy.

## Build and verify

From this public repository. The Nix-flake-backed Chromium/ChromeDriver smoke test is **Linux-only**; on macOS the flake supplies Node but not browser binaries or drivers:

```sh
nix build .#demo-site
nix flake check

# Chromium smoke on the exact built site
nix develop .#browser-evidence --command node tools/gallery-browser-smoke.mjs --site ./result
```

The flake constructs an allowlisted static directory with eight explicit static files: `index.html`, `site.css`, `material-playground.html`, `material-playground.css` and four `examples/` resources (including `examples/text-rhythm-comparison.html`). The material page has **no JavaScript**; the three native radio controls use CSS state selectors to switch between System, Light and Dark on that page. Static cards remain stationary; only real links can move by at most 1px. Links, local assets and remote-resource rejection (including negative cases) are checked in the flake check. The gallery browser smoke verifies core navigation, light/dark contrast, visible keyboard focus, reduced motion, forced colors, and responsive reflow, including a narrow CSS viewport stress. It additionally drives the **actual keyboard event path** through the System/Light/Dark native radio group, checks the associated focus indicator in forced-colors/reduced-motion modes, verifies viewport-wide color at 1920 CSS pixels, and checks the intentional third featured example on wide screens. It is **not** a browser-zoom or assistive-technology certification. Theme switching and real keyboard radio selection are checked by the existing Chromium gallery smoke. A separate [Chromium/Firefox cross-browser workflow](../.github/workflows/gallery-crossbrowser-review.yml) now validates Firefox's observed 320/375px CSS viewport via WebDriver BiDi, explicit Light/Dark theme selection and native radio keyboard focus, with [qualified evidence](../docs/architecture/gallery-crossbrowser-layout-assessment.md). As of merged PR #88, its exact-head run recorded 30 passes, zero unsupported/failures, and 56 screenshots. **This is not Safari/iOS testing**; actual iOS Safari, native zoom/text-only resize, assistive technology and independent participant preference remain outside the automated coverage. CSS-only selection relies on the browser's `:has()` support; system preference remains the fallback in browsers without it. No third-party front-end packages, external resources, or private-repository credentials are needed.

The TEXT-001 page is a reviewed, **static** authoring/visual comparison. It has no JavaScript, runtime adaptation or AI inference. Its numerical spacing values and ornaments are experimental, not accepted Chroma or Lamina exports. The browser checker does not certify editorial meaning, actual text-only zoom or assistive-technology behavior. The [design evidence plan](../docs/architecture/text-rhythm-review-plan.md) records remaining review requirements.

## Deployment

The public gallery is deployed from reviewed `main` through the dedicated [Pages demo gallery workflow](../.github/workflows/pages.yml), which publishes **only** the flake-built, currently eight-file allowlist. The repository's Pages build source is configured for **GitHub Actions**. The workflow cannot change repository Pages settings.

Both the [public reference gallery](https://hackelia-micrantha.github.io/phyllotaxis-community/) and [Gloss and Bevel material lab](https://hackelia-micrantha.github.io/phyllotaxis-community/material-playground.html) were verified live on October 8, 2026 after [PR #75](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/75) and [deployment #37881415053](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37881415053). The subsequent TEXT-001 static comparison is included in the current eight-file allowlist; [Pages workflow #37891602348](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37891602348) passed on merged TEXT-001 commit `51b3369c`. This records source/build evidence, not an independent live-URL probe for the new fixture.

The material lab and TEXT-001 fixture remain **experimental and non-normative**; neither consumes the released Phyllotaxis package. Pull requests only validate the gallery: they do not deploy, and `pages: write` plus `id-token: write` remain restricted to the deployment job. A new Pages deployment still requires a separately authorized, reviewed merge to `main`.

## Actual iPhone Safari handoff

The remaining device-specific review is tracked in [issue #76](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/76), with an [unexecuted iPhone Safari checklist](../docs/architecture/gallery-ios-safari-review-protocol.md). In Safari (not ChatGPT's in-app webview), open the [gallery](https://hackelia-micrantha.github.io/phyllotaxis-community/) and [material playground](https://hackelia-micrantha.github.io/phyllotaxis-community/material-playground.html), then examine portrait/landscape layout, explicit Light/Dark/System selection, touch links and Reduce Motion. Report only actually observed results and iOS/browser context. The CSS-only pages have no telemetry or reporting endpoint.

**Do not close #76** based on the existence of the checklist, WebKit on Linux, Firefox BiDi widths or an assistant screenshot review. A real iOS Safari observation is required; independent B1–B3 hierarchy/affordance judgement remains separately tracked in [#63](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/63).

## Release-backed next step

Once a verified, public, immutable Phyllotaxis release exists, upgrade the gallery to a package-backed consumer demo using documented imports and exact lockfiles. The accepted public package identity is `@micrantha/phyllotaxis` (#59, resolved). Do not pull from the private canonical repository or vendor compiled CSS as a source-of-truth fork. Consume only a verified, immutable published package version; the earlier `0.1.0-alpha.1` candidate was abandoned and not published. The release-backed demo should show both semantic profiles, host-owned light/dark/system behavior, proper interaction motion, keyboard/accessibility cases and actual Chroma/Venation/Lamina output.

Track this work in [issue #61](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/61).
