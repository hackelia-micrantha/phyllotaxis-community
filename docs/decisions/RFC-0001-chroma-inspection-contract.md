# RFC-0001 — Static Chroma inspection contract

Status: **Accepted by [ADR-0001](ADR-0001-chroma-inspection-contract.md)**

Supersedes the recommendation phase of [QART-0001](QART-0001-chroma-inspection-contract.md).

## Summary

Add a versioned, static, machine-readable Chroma contract artifact so tooling can inspect semantic role/profile/scheme resolutions without scraping CSS or executing package/consumer code.

## Contract

A conforming implementation exposes:

1. a package-level Chroma contract version;
2. a static `chroma-contract.json` artifact;
3. stable semantic role IDs mapped to public `--phyllotaxis-*` properties;
4. the same stable role set for Utility and Editorial;
5. explicit light/dark values for scheme-aware roles;
6. deterministic serialization and deterministic validation diagnostics;
7. mechanical generation or parity validation between canonical contract data and shipped `chroma.css`.

## Normative v1 artifact schema

RFC-0001 proposes the following exact top-level shape for `schemaVersion: 1`. Producers and consumers must reject missing required fields and unsupported profile/scheme names rather than inferring them.

```ts
type ChromaInspectionContractV1 = {
  schemaVersion: 1;
  contractVersion: 1;
  defaultProfile: "utility";
  roles: Record<RoleId, {
    cssProperty: `--phyllotaxis-${string}`;
    category: "structure" | "typography" | "color";
    kind: "dimension" | "font-family" | "number" | "color";
    schemeAware: boolean;
  }>;
  profiles: {
    utility: ProfileResolutionV1;
    editorial: ProfileResolutionV1;
  };
};

type ProfileResolutionV1 = {
  values: Record<RoleId, string>;
  schemes: {
    light: Record<RoleId, string>;
    dark: Record<RoleId, string>;
  };
};
```

The following invariants are normative for v1:

- every role ID appears exactly once in `roles`;
- every `cssProperty` starts with `--phyllotaxis-` and maps one-to-one to a stable public Chroma property;
- `category: "color"` roles have `kind: "color"` and `schemeAware: true`;
- non-color roles have `schemeAware: false`;
- every non-scheme-aware role appears once in each profile's `values` and in neither scheme map;
- every scheme-aware role appears once in each profile's `light` and `dark` maps and not in profile `values`;
- Utility and Editorial expose exactly the same role ID set;
- unknown profiles, schemes, role IDs, or extra values are validation errors;
- serialized JSON uses UTF-8, two-space indentation, stable insertion order defined by the canonical producer, and a final newline;
- `schemaVersion` changes only when the artifact representation becomes incompatible;
- `contractVersion` changes when the stable semantic role contract becomes incompatible.

Role IDs use the accepted Chroma vocabulary. Initial role families are:

- `space.*`, `gutter.page`, and `content.width.*` for accepted structural values;
- `font.*` and `type.*` for accepted typography roles;
- `color.*` for accepted semantic color/state roles.

The precise v1 role ID list must map one-to-one to the stable custom properties already enumerated by the normative Chroma contract; an implementation may not omit a stable role or invent an additional stable role solely for tooling convenience.

The canonical v1 role IDs, CSS-property mappings, and accepted Utility/Editorial values are published in [`contracts/chroma-inspection-v1.json`](../../contracts/chroma-inspection-v1.json). Its representation is constrained by [`contracts/chroma-inspection.schema.json`](../../contracts/chroma-inspection.schema.json). Implementations claiming Chroma contract v1 must conform to that canonical artifact; the prose type shape above does not permit an alternative role-ID vocabulary.

## Role model

Role IDs are semantic and Chroma-owned. They must correspond to already accepted Chroma concepts such as structural spacing/width, typography and semantic color/state roles.

Public mappings use `--phyllotaxis-*`.

The following are not stable role IDs:

- internal `--pt-*` helpers;
- host or author names;
- framework names;
- palette-brand names;
- font product names;
- arbitrary radius/shadow/elevation scales;
- consumer aliases.

## Source-of-truth rule

The package must not ship independently hand-maintained JSON and CSS values without drift detection.

One of these is required:

- generate CSS from the canonical data; or
- verify the shipped CSS mechanically against the canonical data in the package quality gate.

A mismatch is a validation failure.

## Inspection and trust boundary

Reading the static artifact must not require:

- executing consumer repository code;
- executing arbitrary package hooks;
- evaluating CSS through a browser;
- importing `phyllo`.

The contract may be consumed by CLI, CI, editors or other tooling, but those tools do not own or redefine Chroma semantics.

## Compatibility

`contractVersion` is the compatibility version of the inspection surface.

`schemaVersion` versions the JSON representation.

Changes that remove/rename stable role IDs, change their meaning, or change required profile/scheme structure require an explicit compatibility decision.

## Lamina boundary

This RFC does not introduce Lamina contract metadata.

Lamina invariants such as:

- standalone `h1` ownership;
- `PostSummary` heading depth;
- native `figure`/`figcaption`;
- authored prose preservation;
- forbidden layout/profile/style escape hatches

remain type/SSR/runtime/package-test concerns.

## Non-goals

- arbitrary token generation;
- general theme/plugin systems;
- site-specific presets;
- consumer CSS scraping;
- package installation/update behavior;
- runtime theme providers;
- exposing internal Chroma helper variables.

## Acceptance criteria

Before ADR acceptance:

- role vocabulary maps cleanly to the accepted Chroma contract;
- Utility/Editorial role parity is demonstrated;
- light/dark values are explicit for scheme-aware roles;
- deterministic validation is specified;
- CSS parity enforcement is demonstrated in implementation evidence;
- no private implementation detail is required to understand this public proposal.
