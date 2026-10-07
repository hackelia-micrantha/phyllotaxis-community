# Phyllotaxis

Phyllotaxis is Micrantha's shared design-system and UI substrate. The public package is a consumer artifact produced from the private canonical implementation and constrained by the public contracts in this repository.

## Maturity

Phyllotaxis is pre-1.0. Consumers should pin an exact released package version and upgrade through reviewed dependency changes. Do not depend on a mutable Git branch.

## Public package surface

The supported package surface includes:

- compiled ESM/library output from the package root;
- `chroma.css`, `venation.css`, and `lamina.css`;
- the static `chroma-contract.json` inspection artifact;
- the `phyllo` CLI entry point;
- section-1 manual pages shipped with the release artifact.

Private implementation source, tests, build internals, lockfiles, and unpublished security material are not part of the public package contract.

## Layer model

- **Chroma** owns semantic visual values and profile resolution.
- **Venation** owns structural layout relationships and primitives.
- **Lamina** owns reusable semantic UI components and compositions.
- **Cambium** owns migration/codemod semantics when such behavior is accepted.
- **`phyllo`** inspects and validates integration without becoming a second design authority.

## Consumption

Use only documented package exports and CLI surfaces. Exact package exports and command behavior are defined by the canonical public contracts.

For browser/library use, consumers should pin an exact package version in their package-manager lockfile. Public CI must not require credentials for the private canonical repository.

### Build integration boundary

After RFC-0002 is accepted and a public package release exists, Phyllotaxis is consumed by the application's existing framework and build pipeline. Until then, this section describes the intended post-release integration boundary rather than an available installation path. Phyllotaxis does not replace the consumer's package manager, bundler, dev server, framework configuration, or deployment system.

Consumers import the compiled runtime from `@hackelia-micrantha/phyllotaxis` and import the exported stylesheets they need through their normal build tooling:

- `@hackelia-micrantha/phyllotaxis/chroma.css`
- `@hackelia-micrantha/phyllotaxis/venation.css`
- `@hackelia-micrantha/phyllotaxis/lamina.css`

Consumers must not copy or vendor those stylesheets as a competing implementation. `phyllo` may inspect, validate, diagnose, and initialize bounded configuration; it is not a site builder or deployment tool. Migration orchestration is not part of the currently implemented command surface.

For CLI use, `phyllo --help` and the installed section-1 manuals describe the supported command surface. Machine consumers should use explicit `--format json` where defined.

Canonical CLI documentation:

- command contract: https://github.com/hackelia-micrantha/phyllotaxis-community/blob/main/docs/cli/phyllo.md
- section-1 manual sources: https://github.com/hackelia-micrantha/phyllotaxis-community/tree/main/man

## Compatibility

A package release is compatible only with the public contract revision recorded by its producer release evidence. Consumers should validate upgrades in their own CI and roll back by restoring a previously known-good immutable package version.

Pre-1.0 releases may change through reviewed contract revisions. Published package versions are immutable.

## Public authority

Public requirements, architecture, contracts, interfaces, CLI behavior, manuals, and release-policy decisions are authoritative in:

https://github.com/hackelia-micrantha/phyllotaxis-community

The private `hackelia-micrantha/phyllotaxis` repository remains authoritative for implementation, tests, build mechanics, and release evidence.

A package artifact is therefore a reviewed projection of one immutable private producer revision; it does not create a second implementation authority.
