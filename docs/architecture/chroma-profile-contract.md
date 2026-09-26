# Chroma profile resolution contract

Status: **Accepted contract; CSS implementation validated; machine-readable inspection contract accepted by [ADR-0001](../decisions/ADR-0001-chroma-inspection-contract.md)**  
Depends on: [Lamina editorial semantic contract](lamina-editorial-contract.md)  
Evidence: [Editorial profile evidence](editorial-evidence.md)

## Purpose

Define the smallest Chroma contract required to resolve the same Phyllotaxis semantic tree under the Utility and Editorial visual profiles.

> **Chroma owns values. Venation owns relationships. Lamina owns reusable semantics.**

This contract defines the profile/scheme carriers, stable semantic CSS custom-property surface, and bounded default values consumed by Venation and Lamina. It does not create a general theme/plugin system or add visual-profile props to components.

## Profile carrier

The stable carrier is a semantic DOM attribute on the page root or one coherent publishing-surface boundary:

```html
<html data-phyllotaxis-profile="utility">
<main data-phyllotaxis-profile="editorial">
```

Accepted values are only `utility` and `editorial`.

- Absence means **Utility**.
- Arbitrary per-component/deeply nested switching is outside the first stable contract.
- Venation and Lamina do not accept `profile` props.
- Host, product, author, and aesthetic nickname values are invalid.

The DOM attribute keeps profile selection visible in server-rendered HTML/CSS and avoids requiring React context or runtime state.

## Color-scheme carrier

Light/dark is orthogonal to visual profile.

```html
<html data-phyllotaxis-scheme="light">
<html data-phyllotaxis-scheme="dark">
```

Accepted explicit values are only `light` and `dark`. Absence means automatic system-preference resolution; no `auto` string is required.

### Resolution mechanism

- `:root` advertises `color-scheme: light dark`, allowing browser/user preference to choose the active scheme.
- Each profile defines paired light/dark source values and exposes public semantic color roles with CSS `light-dark()`.
- Explicit `data-phyllotaxis-scheme="light|dark"` sets `color-scheme` on that coherent surface.
- `color-scheme` inheritance carries an explicit root choice into nested coherent profile surfaces unless that surface explicitly overrides the scheme.

This avoids the scheme-inheritance defect of attribute-sensitive dark-media remapping: a nested Editorial surface must not lose an explicit ancestor light/dark choice merely because it has a different profile attribute.

Chroma does not own persistence, storage, toggle controls, hydration, or application settings.

## Stable semantic variable surface

Stable public custom properties use `--phyllotaxis-*`. Internal implementation helpers use `--pt-*` and are not contract.

### Structural values required by Venation

The structural set is defined authoritatively by `VENATION_REQUIRED_CHROMA_PROPERTIES`:

```css
--phyllotaxis-space-none
--phyllotaxis-space-xs
--phyllotaxis-space-sm
--phyllotaxis-space-md
--phyllotaxis-space-lg
--phyllotaxis-space-xl
--phyllotaxis-gutter-page
--phyllotaxis-content-width-narrow
--phyllotaxis-content-width-readable
--phyllotaxis-content-width-wide
--phyllotaxis-content-width-full
```

Current `venation.css` references these variables directly and intentionally contains no value fallbacks. `chroma.css` therefore supplies the first package-owned default resolution. A consumer that imports Venation without Chroma must intentionally provide all required properties itself.

Profiles may resolve the values differently while preserving the same Venation relationship API.

### Typography roles

```css
--phyllotaxis-font-body
--phyllotaxis-font-display
--phyllotaxis-font-mono
--phyllotaxis-type-body-size
--phyllotaxis-type-body-line-height
--phyllotaxis-type-title-size
--phyllotaxis-type-title-line-height
--phyllotaxis-type-title-weight
--phyllotaxis-type-heading-size
--phyllotaxis-type-heading-line-height
--phyllotaxis-type-heading-weight
--phyllotaxis-type-meta-size
--phyllotaxis-type-meta-line-height
--phyllotaxis-type-caption-size
--phyllotaxis-type-caption-line-height
```

These are semantic roles, not a generic numeric scale. `font.display` may equal `font.body` in Utility and differ in Editorial. Chroma does not fetch/package webfonts; defaults use portable stacks.

### Color/state roles

```css
--phyllotaxis-color-canvas
--phyllotaxis-color-surface
--phyllotaxis-color-text
--phyllotaxis-color-text-muted
--phyllotaxis-color-border
--phyllotaxis-color-link
--phyllotaxis-color-link-visited
--phyllotaxis-color-focus
--phyllotaxis-color-selection
--phyllotaxis-color-selection-text
```

Do not add generic palette steps, branded color names, status scales, radius/shadow/elevation scales, gradients, or image-treatment tokens without accepted consumer evidence.

## Default structural values

These are the initial explicit Chroma resolutions for the already-declared Venation dependencies.

| Role | Utility | Editorial |
| --- | --- | --- |
| `space-none` | `0` | `0` |
| `space-xs` | `0.25rem` | `0.375rem` |
| `space-sm` | `0.5rem` | `0.75rem` |
| `space-md` | `1rem` | `1rem` |
| `space-lg` | `1.5rem` | `1.5rem` |
| `space-xl` | `2rem` | `2.25rem` |
| `gutter-page` | `1rem` | `1.25rem` |
| `content-width-narrow` | `46rem` | `34rem` |
| `content-width-readable` | `70rem` | `44rem` |
| `content-width-wide` | `82rem` | `68rem` |
| `content-width-full` | `100%` | `100%` |

Editorial's narrower `readable` value provides a reading-measure distinction without introducing a new Venation width API.

## Default typography values

| Role | Utility | Editorial |
| --- | --- | --- |
| body family | system UI sans | system UI sans |
| display family | body family | portable `ui-serif` stack |
| mono family | portable `ui-monospace` stack | portable `ui-monospace` stack |
| body size / line | `1rem / 1.45` | `1.0625rem / 1.7` |
| title size / line / weight | `1.75rem / 1.15 / 700` | `2.5rem / 1.1 / 700` |
| heading size / line / weight | `1.25rem / 1.25 / 700` | `1.625rem / 1.25 / 700` |
| meta size / line | `0.875rem / 1.35` | `0.875rem / 1.4` |
| caption size / line | `0.875rem / 1.4` | `0.9375rem / 1.45` |

The reference site's exact font products remain evidence, not dependencies or token names.

## Default color values

### Utility

| Role | Light | Dark |
| --- | --- | --- |
| canvas | `#ffffff` | `#111111` |
| surface | `#f5f5f5` | `#1b1b1b` |
| text | `#111111` | `#eeeeee` |
| text-muted | `#555555` | `#bbbbbb` |
| border | `#a0a0a0` | `#666666` |
| link | `#0000ee` | `#8ab4f8` |
| link-visited | `#551a8b` | `#c58af9` |
| focus | `#111111` | `#ffffff` |
| selection | `#cfe3ff` | `#294a70` |
| selection-text | `#111111` | `#ffffff` |

### Editorial

| Role | Light | Dark |
| --- | --- | --- |
| canvas | `#fdfcf8` | `#0f1618` |
| surface | `#f4f0e8` | `#172126` |
| text | `#1f2528` | `#e8e3d8` |
| text-muted | `#5f6a6f` | `#b1aaa0` |
| border | `#d7d0c4` | `#3c494e` |
| link | `#075a80` | `#7cc4e4` |
| link-visited | `#6d4b7e` | `#c2a5d6` |
| focus | `#8a3500` | `#f4c15d` |
| selection | `#d9e8ef` | `#264956` |
| selection-text | `#1f2528` | `#ffffff` |

Executable tests enforce at least 4.5:1 contrast for body, muted, link, visited-link and focus values against each profile's canvas, plus selection text against selection background.

## Resolution precedence

1. `:root` supplies Utility structural/typography/color-role defaults.
2. Explicit `data-phyllotaxis-profile="utility"` resolves the same Utility set on a coherent surface.
3. `data-phyllotaxis-profile="editorial"` overrides the same stable roles with Editorial values.
4. `:root { color-scheme: light dark; }` follows browser/user preference by default.
5. Public color roles use `light-dark(light-value, dark-value)` and follow inherited `color-scheme`.
6. `data-phyllotaxis-scheme="light|dark"` explicitly narrows `color-scheme` and is inherited unless a descendant coherent surface overrides it.

Profile changes semantic visual character; scheme changes light/dark values. Neither changes content or layout APIs.

## Accessibility/capability invariants

- Body and muted text meet WCAG AA normal-text contrast against intended contexts.
- Link/visited recognition must not rely on color alone where link affordance is needed; normal underline/decoration remains the safe default.
- `--phyllotaxis-color-focus` must support an obvious focus indicator.
- Typography uses rem units so browser text scaling remains effective.
- Neither profile requires motion for comprehension.
- Chroma does not broadly disable forced-colors/high-contrast behavior.
- `color-scheme` informs browser-native controls and paired values; it is not component state.

## Package boundary

Implementation exposes:

```text
@hackelia-micrantha/phyllotaxis/chroma.css
```

No `ThemeProvider`, `ProfileProvider`, hook, context, runtime registry, or JS token object is added. `chroma.css` is a declared side effect and copied by the existing build.

`venation.css` remains independently importable, but it is not independently valued: a consumer omitting `chroma.css` must supply every `VENATION_REQUIRED_CHROMA_PROPERTIES` value through its own Chroma-compatible theme boundary.

The accepted machine-readable inspection surface is defined by [RFC-0001](../decisions/RFC-0001-chroma-inspection-contract.md) and [ADR-0001](../decisions/ADR-0001-chroma-inspection-contract.md): package metadata declares `phyllotaxis.contracts.chroma: 1` and the package exports static `./chroma-contract.json`. The artifact uses the RFC-0001 v1 schema, preserves Utility/Editorial role parity, represents scheme-aware light/dark values explicitly, and must remain mechanically synchronized with shipped `chroma.css`. No public executable Chroma inspection API is required by this contract.

## Lamina relationship

Accepted #5 semantics consume these values without visual/profile props:

- `ArticleHeader` -> title/display/text;
- `ArticleMeta` -> meta/muted/link;
- `Prose` -> body/display/mono/text/link/visited/surface/border;
- `Figure` / `Caption` -> border/caption/muted as needed;
- `TaxonomyLink` -> link/visited/focus;
- `PostSummary` -> title/heading/body/meta/link.

Lamina may own selector-specific presentation rules; values remain Chroma-owned.

## Explicit non-goals

- per-component profile/scheme props;
- React theme providers/runtime registries;
- host/site/author profile names;
- generic palette/radius/shadow/elevation scales;
- gradients, glass, glow, ornamental motion, image filters, hero tokens;
- bundled external webfonts;
- CMS/content-model values;
- persistence/storage for scheme choice.

## Acceptance mapping for #22

- Same shared role surface for Utility/Editorial: **implemented**.
- Every Venation-required Chroma property resolved in both profiles: **tested**.
- No profile-only token namespace: **implemented**.
- No site/author/framework names: **implemented**.
- No arbitrary radius/shadow scale: **implemented**.
- Contrast/focus/visited/text-scaling/reduced-motion boundary: **implemented and tested**.
- #21 can consume roles without visual/profile props: **implemented**.
- Profile/scheme inheritance and explicit override contract: **tested**.
- Package CSS delivery: **tested**. Chroma inspection metadata/artifact: **accepted for implementation by ADR-0001**.
- Exact-head CSS implementation CI: **complete**.

## Main invariant

> Profiles may resolve semantic values differently; they may not redefine what Venation relationships or Lamina content semantics mean.
