# Utility consumer evidence — Digitalis community

Status: **Non-normative evidence**

## Source

The Digitalis community site was redesigned under the accepted Phyllotaxis Utility directive and then verified in production.

This document records reusable observations from that consumer. It does **not** promote Digitalis colors, class names, markup, or deployment details into Phyllotaxis contracts.

## What worked

### Flat surface rhythm

A small number of low-chroma, flat section backgrounds improved scanning and identity without reintroducing card-heavy composition.

The useful property was not any exact green, blue, sand, or rose value. It was the ability to distinguish adjacent information regions while retaining:

- square/simple borders;
- zero or small grid gaps;
- shared separators;
- compact spacing;
- normal document flow;
- no shadow/elevation;
- no gradient, blur, glow, or glass treatment.

This is evidence that Utility does not need to mean monochrome or visually unfinished.

### Compact bounded introduction

A modest bordered introductory region worked as a page orientation surface without becoming a marketing hero.

Reusable characteristics:

- bounded width;
- modest padding;
- system typography;
- direct title and explanatory copy;
- obvious text/actions;
- no decorative illustration;
- no oversized whitespace or viewport-filling treatment.

This is a composition pattern, not evidence for a generic `Hero` component.

### Border-sharing information grids

Summary, status, architecture, and principle information worked well as flat grids whose cells share borders rather than as independent rounded cards.

Useful characteristics:

- semantic headings and native document order;
- contiguous borders/separators;
- compact cells;
- responsive collapse to fewer columns;
- optional low-chroma surface differentiation;
- no per-cell shadow/elevation.

This is stronger evidence for a Utility composition recipe than for a new Venation primitive: existing Grid/Stack relationships already express the structure.

### State labels

Small outlined state labels were effective for defined/active/evaluating/planned states.

Reusable characteristics:

- state text remains explicit;
- color is redundant rather than the sole carrier;
- compact border/background treatment;
- no pill silhouette required.

One consumer is not enough to require a generic Lamina badge/status API, but the pattern is worth retaining as candidate evidence.

### Link-first action hierarchy

Most navigation/actions remained obvious links. A bounded primary action was useful only where stronger action hierarchy was genuinely needed.

The reusable lesson is to keep anchors recognizably link-like by default and avoid converting every link into button chrome.

### System fonts improved both design and security

Removing third-party webfont imports strengthened the intended Utility character while also preserving a strict same-origin Content Security Policy and reducing external dependencies.

System-font-first should therefore be treated as a Utility design and delivery default, not merely a fallback.

### Technical long-form remained Utility

The Digitalis whitepaper remained coherent under Utility. Its length alone did not justify Editorial.

Specifications, RFCs, whitepapers, operational references, and technical documentation remain Utility when the primary task is inspection/reference rather than narrative reading or media consumption.

## What should not be promoted

Do not promote:

- Digitalis product identity or copy;
- exact consumer color values;
- Digitalis class names;
- a fixed four-color palette;
- site-specific section ordering;
- a generic marketing `Hero`;
- a generic `Card` abstraction;
- state names that belong to one product lifecycle.

## Candidate durable lessons

1. Document flat low-chroma section rhythm as valid Utility composition.
2. Publish a synthetic Utility reference fixture showing compact intro, contiguous information grid, explicit state labels, and link-first actions.
3. Clarify that technical long-form content remains Utility by default.
4. Treat external fonts, gradients, blur/glass, broad elevation, general rounded-card composition, and ornamental motion as useful Cambium advisory signals when a consumer declares Utility.
5. Require additional consumer evidence before expanding the stable Chroma role set or Lamina component API.

## Relationship to RFC-0003

RFC-0003 named “Utility with bounded pastel surfaces” as the first reference experiment and required successful consumer evidence before promotion into Phyllotaxis.

The Digitalis result supplies that evidence. It supports promotion of the **composition guidance**, but does not by itself justify a generic palette scale or new runtime theming API.
