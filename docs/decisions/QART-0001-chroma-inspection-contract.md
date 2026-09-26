# QART-0001 — Machine-readable Chroma inspection contract

Status: **Resolved into RFC-0001**

## Question

How should tooling inspect the accepted Chroma semantic role/profile/scheme surface without making `phyllo` or consumer code a second token authority?

The current public contract is CSS-first:

- stable semantic custom properties use `--phyllotaxis-*`;
- Utility and Editorial resolve the same semantic surface;
- light/dark scheme values are orthogonal to profile;
- internal `--pt-*` helpers are implementation detail.

Tooling now needs deterministic role/profile/value inspection for CLI, CI and editors.

## Alternatives

### A — Parse shipped CSS

Tooling could scrape `chroma.css` and infer semantic roles and values.

Advantages:

- no additional package artifact;
- CSS remains the only value source.

Problems:

- requires CSS parsing for semantic inspection;
- internal helper declarations can leak into tooling;
- profile/scheme structure must be inferred from selectors;
- tooling becomes coupled to presentation syntax rather than the public Chroma model.

### B — Static Chroma-owned contract data

Ship a static, versioned package artifact describing:

- stable semantic role IDs;
- `--phyllotaxis-*` mappings;
- Utility/Editorial resolutions;
- explicit light/dark values for scheme-aware roles.

The shipped CSS is generated from, or mechanically verified against, this data.

Advantages:

- inspectable without executing code;
- deterministic serialization;
- explicit profile/scheme model;
- keeps token authority in Chroma;
- supports CLI/CI/editor consumers without CSS scraping.

Risks:

- duplicated data is dangerous unless CSS parity is mechanically enforced;
- role IDs become a compatibility surface and must remain bounded.

### C — Executable JavaScript inspection API

Export a runtime JS object/function for token inspection.

Advantages:

- rich typed API;
- easy for JavaScript tooling to consume.

Problems:

- requires code execution for inspection;
- expands runtime/package behavior unnecessarily;
- less suitable for language-agnostic CI/editor tooling;
- increases trust and dependency surface.

## Recommendation

Proceed with **B — static Chroma-owned contract data**.

Keep the artifact declarative and package-owned. Require mechanical CSS parity so it cannot silently become a second source of truth.

Do not use the same mechanism for Lamina merely for symmetry: Lamina's important invariants are native/runtime semantics and remain better enforced by type, SSR and runtime tests.
