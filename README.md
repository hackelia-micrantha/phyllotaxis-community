# Phyllotaxis

**Micrantha's public design-system specification and contract surface.**

Phyllotaxis defines the shared UI substrate used across Micrantha projects. This repository is intentionally **design-first**: published requirements, architecture, contracts, interfaces, CLI behavior, visual direction, and decision records live here so they can be reviewed without access to the private implementation.

> **Chroma owns values. Venation owns relationships. Lamina owns reusable semantics.**

| Surface | Responsibility | Status |
| --- | --- | --- |
| **Chroma** | Themeable values, semantic tokens, visual-profile resolution | Contract accepted |
| **Venation** | Structural layout relationships and primitives | Contract accepted |
| **Lamina** | Reusable semantic UI components and compositions | Contract accepted |
| **Cambium** | Contract migration and codemod semantics | Design surface; implementation evolves privately |
| **`phyllo`** | Inspection, validation, diagnostics, initialization, migration orchestration | Proposed CLI contract |

## Repository role

`hackelia-micrantha/phyllotaxis-community` is authoritative for **published Phyllotaxis design work**:

- requirements and design constraints;
- architecture and layer boundaries;
- public component/layout/token contracts;
- CLI UX, machine-output, exit-status, and configuration contracts;
- visual directives and semantic visual profiles;
- QART, RFC, and ADR records intended for public review;
- section-1 CLI manual pages and other public interface documentation.

The private `hackelia-micrantha/phyllotaxis` repository remains authoritative for implementation, private tests, build/release mechanics, and implementation-specific evidence.

Published contracts do not silently change to match private implementation. If implementation evidence exposes a design defect, the public contract is revised explicitly and the implementation follows the reviewed contract.

See [UPSTREAM.md](UPSTREAM.md) for the repository-boundary and authority rules.

## Visual direction

Phyllotaxis is one design system with bounded semantic profiles:

- **Utility** — the default: minimal, direct, information-dense, and intentionally reminiscent of late-1990s web interfaces.
- **Editorial** — a richer media/blog profile for long-form reading, narrative, and imagery.

The rule is **1990s in visual character, not in capability**: semantic HTML, accessibility, responsiveness, security, modern browser behavior, and predictable interaction remain required.

Read:
- [Visual directive](docs/architecture/visual-directive.md)
- [Visual profiles](docs/architecture/visual-profiles.md)
- [Editorial evidence](docs/architecture/editorial-evidence.md)

## Contract map

### Design-system contracts

- [Venation layout contract](docs/architecture/venation-layout-contract.md)
- [Chroma profile resolution contract](docs/architecture/chroma-profile-contract.md)
- [Lamina editorial semantic contract](docs/architecture/lamina-editorial-contract.md)
- [Specification index](docs/specs/README.md)
- [Public contract index](docs/contracts/README.md)
- [Public interface index](docs/interfaces/README.md)
- [Requirements index](docs/requirements/README.md)

### CLI

- [`phyllo` CLI architecture](docs/architecture/phyllo-cli.md)
- [Project discovery and configuration](docs/architecture/phyllo-project-config.md)
- [`phyllo` command contract](docs/cli/phyllo.md)
- [`phyllo(1)`](man/phyllo.1)
- [`phyllo-check(1)`](man/phyllo-check.1)
- [`phyllo-status(1)`](man/phyllo-status.1)
- [`phyllo-doctor(1)`](man/phyllo-doctor.1)
- [`phyllo-init(1)`](man/phyllo-init.1)
- [`phyllo-tokens(1)`](man/phyllo-tokens.1)

The CLI contract follows the Micrantha CLI standards: deterministic exit semantics, strict stdout/stderr separation, explicit machine-readable formats, safe non-interactive behavior, discoverable help, no implicit authority escalation, and section-1 manual-page coverage before a supported release.

## Documentation

Start at [docs/README.md](docs/README.md).

Design decisions use Micrantha's standard progression:

```text
QART -> RFC -> ADR -> delivery issues
```

QART captures unresolved questions and alternatives. RFCs develop substantial proposals. ADRs record accepted durable decisions. Implementation work remains tracked separately from the public contract when exposing implementation details would violate the repository boundary.

## Maturity

Phyllotaxis is currently **experimental / contract-first**. Accepted contracts are intended to constrain implementation, but a polished document does not imply that every surface is released or stable.

Each document states its own status. Proposed behavior must not be treated as implemented behavior.

## Contributing

Public review is most useful around contract clarity, accessibility, interoperability, CLI behavior, semantic boundaries, migration safety, and consistency across Micrantha consumers.

See [CONTRIBUTING.md](CONTRIBUTING.md) and the Micrantha organization standards for contribution and review expectations.
