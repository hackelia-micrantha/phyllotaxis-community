# Phyllotaxis visual directive

Status: **Accepted**

## Goal

Phyllotaxis should default to a **minimal, utilitarian, late-1990s web aesthetic**, with Craigslist as a useful reference point for visual restraint and information density.

This default is the **Utility** visual profile. Phyllotaxis may also define bounded purpose-specific profiles, beginning with **Editorial** for genuine long-form/media surfaces. See [`visual-profiles.md`](visual-profiles.md).

The governing Utility rule is:

> **1990s in visual character, not in capability.**

Utility surfaces should look intentionally plain, direct, lightweight, and content-first while retaining modern semantics, accessibility, responsiveness, security, and interaction quality.

The existence of Editorial does not turn visual profile choice into arbitrary theming. Utility remains the default; a richer profile requires a concrete content/task reason.

## Default visual character

For Utility, prefer:

- system and browser-native typography;
- obvious text links and familiar browser affordances;
- restrained colour use with strong link and state distinction;
- flat low-chroma surface variation when it materially improves scanning between adjacent regions;
- compact, readable information density;
- simple borders and separators where structure needs reinforcement;
- natural document flow and intrinsic layout;
- small amounts of reusable spacing rather than large decorative whitespace;
- controls whose purpose is visible without ornamental styling;
- pages that remain understandable when CSS is reduced or partially unavailable.

Avoid by default:

- decorative gradients;
- glass, blur, glow, and elevation effects;
- rounded-card layouts as a general page-composition pattern;
- oversized hero sections;
- ornamental animation or motion;
- bespoke typography when system fonts are sufficient;
- hidden navigation, icon-only controls, or styling that obscures native affordances;
- visual complexity introduced only to make the interface appear contemporary.

These are defaults, not absolute prohibitions. A deviation should correspond to a concrete semantic, usability, accessibility, editorial, or product requirement. Repeated coherent deviations should be considered for a named semantic profile rather than accumulated as local exceptions.

Utility may use restrained flat section rhythm rather than monochrome presentation. Low-chroma adjacent surfaces can distinguish information regions while preserving square/simple borders, compact spacing, normal flow, and no elevation. Exact palettes remain consumer evidence unless separately promoted into Chroma.

## Visual profiles

Phyllotaxis is one design system with semantic visual profiles rather than site-specific themes.

Initial profiles:

- **Utility** — the organization/default profile described by this directive;
- **Editorial** — a richer media/blog profile for long-form reading, narrative, imagery, and publishing surfaces.

Profile selection follows the primary task/content model, not the host name and not a desire for more decoration. Content length alone does not select Editorial: technical whitepapers, RFCs, specifications, runbooks, API/reference documentation, and other inspection-oriented long-form material remain Utility by default.

`ryanjennin.gs` is the primary evidence source/reference consumer for Editorial, but stable design-system APIs must use semantic names such as `editorial`, not personal or site branding.

`micrantha.com` remains Utility by default but may use Editorial for a genuine journal, article, case-study, or other media-oriented surface.

## Layer implications

### Chroma

Chroma should make the Utility default inexpensive to express:

- small semantic spacing and density scales;
- restrained surface and text palettes;
- explicit link, visited-link, focus, disabled, selected, warning, and error states;
- system-font-first Utility typography;
- minimal border/radius/elevation tokens, with visually neutral defaults.

Chroma also owns profile-specific value resolution for Editorial where justified, including typography roles, reading rhythm, surfaces, imagery treatment, light/dark values, and related semantic presentation values.

Chroma owns the values, but both profiles should reinforce semantic constraints rather than add arbitrary styling capability.

### Venation

Venation is **profile-neutral** and should reinforce simple document structure:

- intrinsic layout before breakpoint choreography;
- predictable spacing relationships;
- normal flow before absolute positioning or layered composition;
- primitives that still produce understandable reading order and structure without decorative styling.

Utility and Editorial must share the same structural API. A profile is not a reason to add profile-specific branches to layout primitives.

The visual directive does not change the ownership rule: **Chroma owns values; Venation owns relationships.**

### Lamina

Lamina components should remain visually obvious and semantically direct:

- links should look like links;
- buttons should look actionable;
- inputs should look editable;
- headings and separators should communicate hierarchy without decorative containers;
- cards, badges, pills, shadows, and radii should not become default wrappers for ordinary Utility content.

Editorial may justify reusable article/media semantics and richer presentation, but those components must be promoted from real semantic/reuse evidence rather than introduced merely to encapsulate styling.

### Cambium

Migration tooling should prefer removing accidental visual complexity over mechanically reproducing it. Existing decoration is not automatically part of the target design contract.

Cambium may classify an existing pattern as Utility, Editorial, or product-owned styling, but migration must not silently convert site-specific CSS into stable Phyllotaxis API. Profile-aware advisory checks may flag mechanically detectable Utility anti-patterns such as external webfonts, decorative gradients, blur/glass treatment, broad elevation, repeated large-radius content containers, and ornamental reveal motion; heuristic findings must not rewrite code automatically.

See [Utility consumer evidence](utility-evidence.md) and [RFC-0004](../decisions/RFC-0004-utility-composition-patterns.md) for the evidence and proposed durable guidance behind these refinements.

## Non-goals

This directive does **not** mean reproducing historical browser limitations or inaccessible 1990s markup.

Phyllotaxis should still require or support across all profiles:

- semantic HTML;
- keyboard navigation and visible focus states;
- WCAG-appropriate contrast and interaction targets;
- responsive and container-aware layout;
- reduced-motion preferences;
- internationalization and text scaling;
- modern form semantics and validation;
- progressive enhancement where appropriate.

Nor does the Editorial profile create a general arbitrary-theme/plugin system. The initial contract intentionally favors a small number of semantically justified profiles.

## Community publication

Community-facing repositories must make the default visual direction and any supported profile distinction understandable without access to the private Phyllotaxis repository.

The public contribution/design guidance should therefore restate the governing Utility rule and its modern-capability requirement rather than merely linking to this document. Organization-level community guidance may provide the shared public source, while repositories that maintain their own contribution guidance should repeat or explicitly reference that public source.

The community default remains **Utility: 1990s in visual character, not in capability.** Editorial may be used for genuine long-form/media surfaces; it must not be interpreted as a generic “make this more modern” escape hatch.

## Review test

For Utility, when choosing between two designs that satisfy the same product and accessibility requirements, prefer the one with:

1. fewer visual concepts;
2. fewer custom values;
3. fewer wrappers;
4. fewer effects;
5. more obvious browser-native semantics;
6. higher information density without harming readability.

For Editorial, first require a real editorial/media task. Then prefer the smallest additional typography, imagery, hierarchy, and spacing vocabulary that materially improves reading or narrative comprehension.

A default Phyllotaxis surface should feel closer to a well-maintained, highly usable document or classified listing than to a contemporary marketing site. An Editorial surface may be more expressive, but should still feel intentional, semantic, and restrained rather than decorative by default.
