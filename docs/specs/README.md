# Specification index

Phyllotaxis specifications are organized by responsibility rather than duplicated into a parallel specification tree. This index is the entry point for normative and evidence-bearing design documents.

## Normative design specifications

- [Venation layout contract](../architecture/venation-layout-contract.md) — structural layout primitives, semantic inputs, and dependency boundaries.
- [Chroma profile resolution contract](../architecture/chroma-profile-contract.md) — semantic values, stable custom properties, Utility/Editorial profile resolution, and scheme behavior.
- [Lamina editorial semantic contract](../architecture/lamina-editorial-contract.md) — reusable semantic editorial components and composition rules.
- [Visual profiles](../architecture/visual-profiles.md) — profile semantics and host/brand independence.
- [Visual directive](../architecture/visual-directive.md) — default Utility visual character and modern capability requirements.
- [`phyllo` CLI architecture](../architecture/phyllo-cli.md) — CLI responsibility, dependency direction, security boundary, and delivery constraints.
- [`phyllo` project discovery/configuration](../architecture/phyllo-project-config.md) — inert configuration and deterministic project discovery.
- [`phyllo` command contract](../cli/phyllo.md) — human/machine UX, diagnostics, exit semantics, commands, and automation behavior.

## Evidence

- [Editorial profile evidence](../architecture/editorial-evidence.md) — source observations used to derive reusable Editorial contracts. Evidence is not itself normative.
- [Utility consumer evidence](../architecture/utility-evidence.md) — observations from a production Utility consumer used to refine composition guidance without promoting product-specific styling.

## Decision lifecycle

Material unresolved design questions should enter [QART/RFC/ADR](../decisions/README.md) rather than being hidden inside implementation changes. Accepted decisions update the normative documents above.
