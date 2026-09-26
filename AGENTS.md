# Agent instructions

This repository is the public Phyllotaxis design/contract authority.

## Hard boundaries

- Put public requirements, specifications, contracts, interfaces, architecture, QART/RFC/ADR records, CLI contracts, and man-page design here.
- Do not introduce private implementation source, private tests, unpublished security findings, credentials, operational secrets, or internal-only evidence.
- Treat `hackelia-micrantha/phyllotaxis` as implementation authority, not public design-contract authority.
- Never change a published contract merely to match implementation drift.
- Never write proposed or planned behavior as implemented behavior.

## Micrantha standards

Apply organization standards in `hackelia-micrantha/.github`, especially documentation, source exposure, repository topology, CLI design/UX, CLI interoperability, security, testing, and release readiness.

For substantial decisions, use QART -> RFC -> ADR.

## CLI review gate

Verify `--format text|json`, stdout/stderr separation, deterministic versioned machine contracts, stable exit semantics, TTY/no-color behavior, help/version discoverability, safe non-interactive/dry-run behavior, broken-pipe/signal handling, section-1 man-page coverage, and no duplication of Chroma/Venation/Lamina/Cambium semantics.

## Documentation review gate

Verify authority/audience, status accuracy, link integrity, compatibility effects, absence of duplicate authorities, and that private material has not crossed the repository boundary.
