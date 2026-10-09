# Phyllotaxis GitHub Pages gallery

Status: **pre-release public reference gallery**. The site is not the canonical design authority and is not a substitute for a published Phyllotaxis package.

The site includes **only** the reviewed landing page and the two existing synthetic reference fixtures. The first is a Utility contract illustration. The second is an RFC-0008 comparison under [ADR-0008's accepted, non-binding advisory review guidance](https://github.com/hackelia-micrantha/phyllotaxis-community/blob/main/docs/decisions/ADR-0008-dimensional-utility-advisory-guidance.md), **not** an accepted visual profile, a validated example, or an implementation guarantee. None of the styling here is a Chroma token contract or a private implementation copy.

## Build and verify

From this public repository. The Nix-flake-backed Chromium/ChromeDriver smoke test is **Linux-only**; on macOS the flake supplies Node but not browser binaries or drivers:

```sh
nix build .#demo-site
nix flake check

# Chromium smoke on the exact built site
nix develop .#browser-evidence --command node tools/gallery-browser-smoke.mjs --site ./result
```

The flake constructs an allowlisted static directory with `index.html`, `site.css` and `examples/`. Links, local assets and remote-resource rejection (including negative cases) are checked in the flake check. The gallery browser smoke verifies core navigation, light/dark contrast, visible keyboard focus, reduced motion, forced colors, and responsive reflow, including a narrow CSS viewport stress. It is **not** a browser-zoom or assistive-technology certification. No third-party front-end packages, external resources, or private-repository credentials are needed.

## Deployment

After the required merge-gate disposition and an explicitly authorized merge, an isolated GitHub Actions workflow publishes only the flake-built output from `main`. A repo administrator must set **Settings → Pages → Build and deployment → Source: GitHub Actions** if not already configured. The workflow cannot enable Pages or change repository settings.

Expected project URL, **not confirmed live until successfully deployed and checked**:

`https://hackelia-micrantha.github.io/phyllotaxis-community/`

The workflow does not deploy from pull requests; `pages: write` and `id-token: write` are restricted to the deployment job.

## Release-backed next step

Once a verified, public, immutable Phyllotaxis release exists, upgrade the gallery to a package-backed consumer demo using documented imports and exact lockfiles. The accepted public package identity is `@micrantha/phyllotaxis` (#59, resolved). Do not pull from the private canonical repository or vendor compiled CSS as a source-of-truth fork. Consume only a verified, immutable published package version; the earlier `0.1.0-alpha.1` candidate was abandoned and not published. The release-backed demo should show both semantic profiles, host-owned light/dark/system behavior, proper interaction motion, keyboard/accessibility cases and actual Chroma/Venation/Lamina output.

Track this work in [issue #61](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/61).
