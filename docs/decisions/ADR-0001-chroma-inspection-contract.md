# ADR-0001 — Accept static Chroma inspection contract

Status: **Accepted**

Date: 2026-09-26

Decision lineage:

- [QART-0001 — Machine-readable Chroma inspection contract](QART-0001-chroma-inspection-contract.md)
- [RFC-0001 — Static Chroma inspection contract](RFC-0001-chroma-inspection-contract.md)

## Context

Tooling needs deterministic inspection of the accepted Chroma semantic role/profile/scheme surface.

The existing CSS contract is sufficient for presentation but is a poor inspection API:

- CSS parsing couples tools to presentation syntax;
- internal helper declarations can leak into tooling;
- profile/scheme structure must otherwise be inferred from selectors;
- an executable JS API would increase trust and runtime surface unnecessarily.

QART-0001 compared CSS parsing, static data, and executable JavaScript. RFC-0001 proposed static Chroma-owned contract data with mechanical CSS parity.

## Decision

Accept RFC-0001.

The public machine-readable Chroma inspection surface is:

1. package metadata declares `phyllotaxis.contracts.chroma: 1`;
2. package export `./chroma-contract.json` exposes the static contract artifact;
3. `schemaVersion: 1` uses the exact shape and invariants defined by RFC-0001;
4. Utility and Editorial expose the same stable semantic role set;
5. light/dark values are explicit only for scheme-aware roles;
6. public role mappings use stable `--phyllotaxis-*` properties;
7. internal `--pt-*` helpers remain implementation detail;
8. shipped `chroma.css` is mechanically derived from, or mechanically verified against, the canonical contract data;
9. deterministic validation is required for contract completeness and profile/scheme parity.

The public interface does **not** require an executable Chroma runtime inspection API. Implementations may use private helpers internally, but adding public runtime/type exports requires a separate public-interface change.

## Public interface projection

The machine-readable public interface adds:

```json
{
  "contracts": {
    "venation": 1,
    "chroma": 1
  },
  "packageExports": [
    ".",
    "./chroma.css",
    "./chroma-contract.json",
    "./venation.css",
    "./lamina.css"
  ]
}
```

Existing runtime and type exports do not change as part of this ADR.

## Consequences

### Positive

- CLI, CI, editors, and other tooling can inspect Chroma without CSS scraping.
- Chroma remains the token authority.
- Inspection is language-agnostic and does not execute consumer code.
- CSS/data drift becomes detectable.
- Compatibility changes have explicit `schemaVersion` and `contractVersion` boundaries.

### Costs

- Stable role IDs become a compatibility surface.
- Package tests/build tooling must preserve JSON/CSS parity.
- Any future public executable helper API requires a separate design/interface decision.

## Lamina boundary

This ADR does not introduce Lamina contract metadata.

Lamina guarantees remain enforced through its accepted semantic API plus type, SSR/runtime, CSS, and package tests.

## Supersession rule

Changes that remove/rename stable Chroma role IDs, change their semantic meaning, alter required Utility/Editorial parity, or incompatibly change the v1 artifact representation require a new public decision record.
