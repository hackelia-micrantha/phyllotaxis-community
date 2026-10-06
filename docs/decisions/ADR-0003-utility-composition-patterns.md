# ADR-0003 — Accept Utility composition guidance from consumer evidence

- **Status:** Accepted
- **Date:** 2026-10-05
- **Decision owners:** Phyllotaxis public contract authority
- **Scope:** Utility visual composition guidance and conformance direction
- **Supersedes:** None
- **Superseded by:** None

## Context

Phyllotaxis already defines Utility as the default semantic visual profile: plain, direct, information-dense, browser-native in character, and modern in accessibility/capability.

RFC-0003 established that successful consumer presentation experiments are evidence rather than implicit contract changes. A production Utility consumer subsequently demonstrated a repeatable visual result using flat low-chroma section rhythm, compact bordered introductions, contiguous information grids, explicit state labels, link-first actions, and system typography without reintroducing decorative contemporary marketing patterns.

QART-0004 compared four dispositions:

1. keep the result entirely consumer-owned;
2. promote composition guidance while leaving stable APIs unchanged;
3. immediately add stable Chroma surface/state roles;
4. immediately add generic Lamina Hero/Card/Badge components.

QART-0004 recommended option 2. RFC-0004 developed that proposal and preserved accepted visual contracts unchanged until an ADR decision.

## Decision

Accept RFC-0004's **composition-guidance-only** approach.

The durable Phyllotaxis rules are:

1. **Utility may use flat low-chroma surface rhythm.** Restrained background variation may separate adjacent information regions when it improves scanning, provided the composition remains flat, semantic, contrast-valid, and document-like.
2. **Shared separators are preferred over floating card chrome.** Contiguous bordered grids and section boundaries are valid Utility compositions when grouping structured information.
3. **Compact bounded introductions are valid Utility composition.** A page may use a modest bordered orientation region without introducing a generic marketing-style hero abstraction.
4. **Links remain link-first.** Navigation and ordinary actions should retain obvious link affordances; bounded action treatment is reserved for genuine hierarchy rather than applied to every link.
5. **State presentation remains explicit.** State text must remain visible; color may reinforce but not replace state meaning.
6. **System-font-first remains the Utility default.** External/bespoke fonts require a real product/editorial need rather than decorative preference.
7. **Content length alone does not select Editorial.** Whitepapers, RFCs, specifications, API/reference documentation, runbooks, support material, and operational documentation remain Utility when the primary task is inspection, lookup, or direct technical work.
8. **Existing stable APIs remain unchanged.** This decision does not add Chroma palette/state roles, new Venation primitives, generic Lamina Card/Hero/Badge components, or new visual profiles.
9. **Further API promotion requires additional evidence.** A second independent consumer or accessibility-significant repeated semantic need should demonstrate that current public seams are insufficient before stable Chroma/Lamina/Venation expansion.
10. **Utility conformance tooling may provide advisory diagnostics.** Mechanically detectable anti-patterns may be reported, but heuristic findings must not auto-rewrite code or silently become normative token/component semantics.

## Alternatives considered

### Keep the result consumer-owned

Benefit: no design-contract change.

Not selected because the observed composition principles are reusable and RFC-0003 explicitly provides a promotion path for durable learning from consumer experiments.

### Add stable Chroma surface/state roles now

Benefit: standardized shared values.

Not selected because one consumer does not yet justify a stable role vocabulary or generic palette/state scale. Exact values and product lifecycle states remain consumer-owned.

### Add generic Lamina Hero/Card/Badge components now

Benefit: straightforward reuse.

Not selected because the observed structures are primarily compositions of native semantics and existing layout relationships, not new reusable content semantics. Generic wrappers would also work against the accepted Utility direction.

## Consequences

### Positive

- Utility can carry more visual identity without drifting into glass/card/marketing aesthetics.
- Consumers get a concrete pattern for adding rhythm while retaining flat, information-dense composition.
- Technical long-form profile selection is less ambiguous.
- The result compounds successful consumer evidence without freezing product-specific colors or markup into the design system.
- Chroma, Venation, and Lamina public APIs remain stable.

### Negative and accepted costs

- Surface accent values remain consumer-owned for now.
- Some guidance is qualitative rather than mechanically enforceable.
- Advisory tooling must distinguish exact signals from heuristics to avoid false positives.
- Consumers may still duplicate local surface choices until evidence justifies new Chroma roles.

### Accessibility and security

- Surface variation must preserve required text/link/focus contrast.
- State meaning must not depend on color alone.
- System-font-first reduces unnecessary third-party dependency/CSP pressure but is not itself a security boundary.
- Conformance tooling must remain non-mutating for heuristic findings and must not execute consumer code merely to inspect CSS/markup.

### Compatibility and migration

No package/runtime migration is required. This ADR changes published visual guidance, not stable package exports.

Existing Utility consumers remain conforming if they follow the prior accepted directive. The new composition patterns are permitted guidance, not a mandatory restyling requirement.

### Validation

Representative reference evidence should verify:

- semantic/no-JavaScript usability;
- understandable document structure with CSS disabled;
- contrast-valid example values;
- responsive contiguous-grid behavior;
- explicit state text;
- no product-specific names becoming public API.

Future advisory diagnostics should use deterministic checks where possible and retain warning/info severity for heuristic interpretation.

## Accepted contract updates

The accepted [visual directive](../architecture/visual-directive.md) and [visual profiles](../architecture/visual-profiles.md) are updated by the same delivery slice to reflect this decision.

The Chroma profile contract, Venation layout contract, Lamina semantic contracts, profile carrier values, and machine-readable public interface remain unchanged.

## Implementation follow-up

Private `hackelia-micrantha/phyllotaxis#70` may now proceed with bounded Utility visual-conformance advisory checks.

That implementation must consume this public decision rather than re-defining the rules privately. It must not block `phyllo migrate` evidence gates or imply automatic migration semantics.

## Reassessment triggers

Revisit this decision if:

- multiple consumers need the same additional surface/state roles;
- repeated state-label semantics justify a stable Lamina component;
- advisory conformance checks produce material false positives that cannot be bounded;
- Utility composition guidance conflicts with accessibility, platform, or consumer requirements in real deployments.

## Evidence

- [QART-0004 — Utility composition promotion from consumer evidence](QART-0004-utility-composition-patterns.md)
- [RFC-0004 — Utility composition patterns from consumer evidence](RFC-0004-utility-composition-patterns.md)
- [Utility consumer evidence](../architecture/utility-evidence.md)
- Issue #34
- PR #35
