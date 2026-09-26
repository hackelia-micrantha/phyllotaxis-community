# Phyllotaxis visual profiles

Status: **Accepted boundary; implementation details remain provisional**  

## Decision

Phyllotaxis is one design system with multiple **semantic visual profiles**, not a collection of site-specific themes.

The initial profiles are:

- **Utility** — the default profile: minimal, utilitarian, information-dense, and intentionally reminiscent of late-1990s web interfaces and Craigslist.
- **Editorial** — a richer media/blog profile for long-form reading, narrative, imagery, and publishing surfaces.

The governing default remains:

> **1990s in visual character, not in capability.**

Editorial is not an exception that weakens that rule. It is a bounded, purpose-specific profile selected because a surface is genuinely editorial or media-oriented.

Public APIs should use semantic profile names such as `utility` and `editorial`. Site or personal brand names such as `micrantha`, `craigslist`, or `ryanjennings` do not belong in stable Phyllotaxis contracts.

## Selection rule

Profile selection follows the **primary user task and content model**, not the host name and not a desire for more decoration.

Use **Utility** when the primary task is to:

- navigate software, projects, tools, or community resources;
- read reference or operational documentation;
- inspect status, metadata, downloads, support, or structured information;
- complete direct application or administrative tasks.

Use **Editorial** when the primary task is to:

- read a long-form article or essay;
- consume narrative technical writing or retrospectives;
- browse an editorial archive, journal, or publication stream;
- engage with imagery, figures, captions, pull quotes, or other media as first-class content.

A surface MUST NOT select Editorial merely to make ordinary application UI look more contemporary or decorative.

Initial profile selection should occur at a page or coherent publishing-surface boundary. Arbitrary nested or per-component profile switching is outside the first stable contract because it weakens predictability and encourages local visual exceptions.

## Layer ownership

### Venation

Venation is **profile-neutral**.

`Stack`, `Inline`, `Cluster`, `Grid`, `Switcher`, `Container`, and future structural primitives express layout relationships. Their public API must not branch on Utility versus Editorial.

Both profiles should be able to render the same structural composition with different Chroma values and Lamina presentation.

The ownership rule remains:

> **Chroma owns values. Venation owns relationships.**

A visual profile is not evidence for adding a profile prop to Venation.

### Chroma

Chroma owns profile-specific visual values and semantic roles, including as justified by evidence:

- typography families, scales, weights, and reading rhythm;
- spacing and density resolution;
- content-width values;
- text, link, surface, border, and state colors;
- light/dark value sets;
- borders, radii, and elevation where semantically justified;
- image presentation values;
- focus, selection, warning, error, disabled, and visited-link states.

Utility should make restraint inexpensive and natural.

Editorial may introduce a more expressive hierarchy, but values should remain semantic and bounded rather than exposing arbitrary styling as a public token API.

### Lamina

Lamina owns reusable visual/semantic components and compositions.

For Editorial, candidate semantics include concepts such as:

- article and article header;
- article metadata and byline;
- prose/readable body treatment;
- figure and caption;
- post summary/list entry;
- featured story;
- editorial tag/category treatment.

These are candidates, not commitments. A semantic component should be promoted only when real use demonstrates reuse or when HTML/accessibility semantics justify a stable abstraction.

Lamina should not encode Ryan-specific author identity, Micrantha product identity, site navigation, or CMS/content-model concerns into generic editorial components.

### Cambium

Cambium may help classify and migrate existing styles into Utility, Editorial, or product-owned styling.

Migration must not mechanically preserve every current decorative rule. Existing site CSS is evidence, not automatically a design-system contract.

## Profile characteristics

### Utility

Utility is the organization and Phyllotaxis default.

Prefer:

- system/browser-native typography;
- obvious links and controls;
- compact readable information density;
- restrained color;
- simple borders and separators;
- limited radii and elevation;
- normal document flow;
- intrinsic responsive layout;
- little or no ornamental motion.

Utility is the default for Micrantha software/project/docs/community surfaces unless a concrete surface has an editorial content model.

### Editorial

Editorial permits more expressive presentation when it improves reading, narrative, or media comprehension.

Expected characteristics may include:

- distinct display/body/monospace typography roles;
- more deliberate long-form reading rhythm;
- stronger article hierarchy;
- first-class featured and inline imagery;
- richer article metadata and taxonomy presentation;
- selective surfaces, borders, and radii;
- light/dark presentation appropriate to sustained reading;
- more whitespace where it improves editorial pacing.

Editorial does **not** imply:

- gradients, glass effects, animation, or decoration for their own sake;
- inaccessible contrast or custom controls;
- giant marketing-style hero sections by default;
- arbitrary component-level theming;
- framework-specific class structures as public contracts.

## Reference implementation: ryanjennin.gs

The current `ryanjennin.gs` site is the primary evidence source and expected reference consumer for Editorial.

Useful evidence already present includes:

- a display serif, readable sans-serif body, and monospace accent hierarchy;
- light/dark themes;
- featured imagery;
- article metadata, tags, categories, and archive/list patterns;
- richer editorial hierarchy than the Utility profile.

These characteristics should be **classified and extracted semantically**, not copied wholesale. Current generated CSS, framework classes, exact font choices, current card structures, and personal branding remain implementation/product evidence until separately promoted by contract.

The stable profile is `editorial`, not `ryanjennin.gs` or a personal-name theme.

## Site and content boundary

Visual profile and canonical host are related but independent decisions.

### micrantha.com

`micrantha.com` is primarily the canonical home for:

- software and project information;
- tools and downloads;
- product/reference documentation;
- support/community information;
- organizational project publishing.

Its default profile should remain Utility.

A genuine Micrantha journal, release essay, case study, or media page may use Editorial when the content task is editorial. This does not change the rest of the site's default.

### ryanjennin.gs

`ryanjennin.gs` is primarily the canonical home for:

- personal essays and opinion;
- narrative engineering writing and retrospectives;
- music and art;
- personal experiments and adjacent long-form work.

Its default profile may be Editorial.

### Canonical-content rule

Do not infer content ownership from profile selection.

- Editorial on `micrantha.com` remains Micrantha content.
- Utility on a personal technical utility page could still remain personal content.

Where the same subject appears on both sites, prefer distinct content roles and cross-linking over full duplication. Detailed cross-posting and canonical-URL mechanics remain a publishing concern tracked separately in #7 rather than a Phyllotaxis component API.

## Shared requirements

Both profiles retain the same modern capability floor:

- semantic HTML;
- keyboard navigation and visible focus states;
- WCAG-appropriate contrast and interaction targets;
- responsive and container-aware layout;
- reduced-motion support;
- internationalization and text scaling;
- modern form semantics and validation;
- progressive enhancement where appropriate;
- security and privacy requirements appropriate to the consuming product.

A richer profile never lowers these requirements.

## Review heuristic

When reviewing a visual-profile proposal:

1. identify the primary user task and content model;
2. choose Utility unless Editorial is semantically justified;
3. keep structure in Venation and values in Chroma;
4. promote Lamina semantics only from repeated or accessibility-significant patterns;
5. keep host/brand-specific identity outside reusable APIs;
6. treat existing site CSS/framework structure as evidence, not contract;
7. prefer the smallest profile-specific surface that satisfies the editorial need.

## Current implementation sequence

Completed:

- visual-profile boundary accepted in #2;
- public community profile guidance published in #6.

Next:

1. implement and validate profile-neutral Venation primitives (#4);
2. extract and classify ryanjennin.gs editorial evidence, including the minimal Chroma semantic roles (#3);
3. define only the Lamina editorial semantics justified by that evidence (#5);
4. implement bounded Utility/Editorial Chroma/Lamina behavior from the accepted contracts and evidence;
5. define cross-posting/canonical-URL policy only when needed for shared publishing (#7).
