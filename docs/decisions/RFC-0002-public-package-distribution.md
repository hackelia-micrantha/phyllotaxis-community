# RFC-0002 — Public npm-compatible Phyllotaxis package distribution

Status: **Proposed**  
Origin: [QART-0002](QART-0002-public-distribution-boundary.md)

## Summary

Publish the first supported consumer artifact as the npm-compatible package:

```text
@hackelia-micrantha/phyllotaxis
```

The package is built and validated by the private canonical implementation repository, while this community repository remains authoritative for public requirements, contracts, interfaces, manuals, and release-policy decisions.

This RFC proposes a distribution boundary. It does **not** authorize publication by itself.

## Why now

The first selected consumer is the public `hackelia-micrantha/web` repository.

That consumer must be able to install an immutable Phyllotaxis library artifact without:

- read access to the private canonical repository;
- long-lived private-repository credentials in public CI;
- a mutable Git branch or unreviewed source snapshot;
- a second public implementation of Chroma, Venation, or Lamina.

Private implementation evidence has also established a bounded npm artifact shape containing compiled runtime/library output, the static Chroma contract, CLI entry point, and section-1 manuals while excluding private source, tests, and the package lockfile.

QART-0002's trigger for a public distribution RFC is therefore satisfied.

## Proposed decision

### Artifact

Use the existing package identity:

```text
@hackelia-micrantha/phyllotaxis
```

The first public release remains pre-1.0. Consumers must pin an exact released version rather than a mutable Git ref.

A release candidate may use a SemVer prerelease such as `0.1.0-alpha.1`; the exact first version is a delivery decision, but `0.0.0` is not a publishable release identity.

### Canonical producer

The private `hackelia-micrantha/phyllotaxis` repository remains the only implementation producer.

A public package is an artifact projection of one reviewed immutable producer revision. Publishing the package does not make the community repository an implementation source.

### Public contents

The public package may contain only reviewed consumer/runtime material:

- compiled ESM/runtime files under `dist/`;
- generated TypeScript declarations required by consumers;
- `chroma.css`, `venation.css`, and `lamina.css`;
- the static `chroma-contract.json` inspection artifact;
- the `phyllo` package entry point;
- section-1 manual sources under `man/`;
- `package.json`;
- a **public package README** whose authority comes from the public documentation surface;
- an explicit LICENSE file and package license metadata.

The package must not contain, unless separately reviewed and justified:

- private `src/`;
- private `tests/`;
- lockfiles;
- CI/build internals;
- credentials or signing material;
- private security corpora or unpublished findings;
- source maps containing private implementation source.

Compiled JavaScript, declarations, CSS, and static contract data are public implementation artifacts once published. This RFC does not describe them as secret or binary-only.

## Acquisition and pinning

Public consumers must be able to install the package without credentials for the private canonical repository.

The supported JavaScript consumption path is an npm-compatible public registry.

Consumers:

1. pin an exact package version;
2. commit their package-manager lockfile/integrity resolution;
3. verify compatibility in their own CI;
4. upgrade through reviewed dependency changes;
5. roll back by restoring a previously known-good immutable package version.

A public consumer must not depend on `main`, a moving tag, or an authenticated private Git URL.

## Alignment with Micrantha release standards

This proposal follows the organization release and source-exposure standards:

- the private canonical repository owns implementation truth and release authorization;
- the public consumer path acquires an immutable reviewed artifact rather than buildable private source;
- packaging is validated **after** artifact creation;
- clean/cache-miss acquisition is tested with private-repository credentials unavailable;
- release-readiness evidence records the canonical identity, artifact inspection, consumer acquisition mode, and applicable CLI/man-page checks;
- public package or Nix metadata must not silently rebuild from private source.

The current private-source Nix package is valuable producer/install evidence, but it is **not** the eventual public Nix distribution contract. A future public Nix surface must fetch and cryptographically pin the exact reviewed public release artifact.

## Repository-registry transition

Acceptance of this RFC requires an explicit organization-registry update before publication.

The intended topology is:

- private canonical `hackelia-micrantha/phyllotaxis`: keep `repositoryRole: canonical` and `sourceExposure: private`, change `distributionMode` from `internal` to `package` when the public package path is accepted;
- public `hackelia-micrantha/phyllotaxis-community`: remain `repositoryRole: projection` with `distributionMode: none`; it remains design/contract authority and must not become a second implementation or package-host authority merely to satisfy topology metadata;
- public acquisition occurs through the approved npm-compatible registry artifact, with the private canonical repository retaining release authority.

The registry change and RFC/ADR must land in dependency order so organization release-readiness tooling does not observe a public package path that contradicts declared repository posture.

## Release identity and provenance

One immutable release identity must connect:

- producer commit;
- package version;
- packed artifact digest;
- registry publication;
- provenance/attestation subject;
- SBOM where required by Micrantha release policy;
- downstream consumer pin.

Preferred publication uses short-lived workload identity / trusted publishing with registry provenance when supported. Long-lived personal publish tokens are not the intended release mechanism.

The release workflow must verify the pinned public contract revision before packing or publishing.

## README and licensing gate

The current private repository README is suitable implementation-facing documentation but must not become the package's accidental public documentation authority merely because npm includes README files automatically.

Before public release:

- define or generate a package README from the public documentation surface;
- verify the packed artifact contains that intended README;
- choose and record the package license;
- add matching LICENSE content and package metadata.

**No explicit license means no public package release.**

## CLI relationship

The npm package may expose the existing `phyllo` bin entry because it is part of the same validated package artifact.

This does not replace system-install conformance:

- npm/package-manager invocation is one supported package-level path;
- Nix/system installation may wrap the same exact released package identity and install manuals conventionally;
- CLI UX, diagnostics, exit behavior, and manuals remain governed by the public CLI contracts here.

A later RFC may split CLI distribution if independent release requirements justify it.

## Rollback and correction

Published versions are immutable.

A bad release is corrected by:

1. marking/deprecating the bad version where the registry supports it;
2. publishing a new corrected version;
3. preserving provenance for both;
4. allowing consumers to restore a prior exact known-good version.

Release recovery must not depend on rewriting an existing package version.

## Release-readiness evidence

Before publication, repository-owned release tooling must produce bounded evidence compatible with the Micrantha release-readiness model, including at minimum:

- canonical release identity and mechanically observed package/executable claims;
- packed artifact file allowlist/prohibited-material result;
- artifact digest;
- clean consumer acquisition with private credentials unavailable;
- public-contract revision verified by the producer;
- package import smoke test for the runtime/CSS surface;
- CLI help/version/man-page smoke evidence when the CLI is claimed as supported;
- rollback target or prior known-good identity when one exists.

Do not embed private source, secret candidates, security corpora, or signing material in the evidence document.

## Consumer qualification

The first consumer qualification is intentionally narrow:

- pin the reviewed public package version in `hackelia-micrantha/web`;
- migrate only the bounded first Venation slice already characterized by that consumer;
- verify unit, responsive, accessibility, and applicable visual evidence;
- confirm the public build needs no private-repository credentials.

Broader component adoption is not a release prerequisite.

## Alternatives

### Keep packages internal

This no longer satisfies the selected public consumer without placing private-repository authority or credentials into its build path.

Internal-only packages may still exist for unreleased work, but they are not the supported first-consumer acquisition path.

### Public release assets outside an npm registry

A tarball attached to another public repository could avoid private access, but it creates a custom JavaScript dependency path and weaker package-manager ergonomics. It is not preferred for the first browser/library consumer.

### Public reimplementation

Rejected. It would create a competing implementation authority.

### Move canonical runtime source public

Not required by current evidence. Public package artifacts are explicitly source-like/inspectable, but repository history, tests, build internals, and unreleased implementation remain private under the existing topology.

## Acceptance before ADR

- [ ] package license and LICENSE text are explicitly selected;
- [ ] public package README source/derivation is defined;
- [ ] packed-artifact allowlist is mechanically enforced, including source-map policy;
- [ ] exact release versioning and registry namespace ownership are confirmed;
- [ ] trusted/publication identity and provenance path are demonstrated;
- [ ] SBOM/checksum requirements from Micrantha release policy are mapped;
- [ ] clean anonymous/public package acquisition succeeds;
- [ ] first consumer can pin the artifact without private-repository credentials;
- [ ] rollback to a prior immutable version is documented and testable;
- [ ] public contract pin verification remains part of producer release validation;
- [ ] organization repository registry reflects the accepted package-distribution topology before publication;
- [ ] normalized release-readiness evidence uses `acquisition.mode: package`, `sourceBuild: false`, `immutable: true`, and `requiresPrivateCredentials: false`, with clean/cache-miss consumer evidence.

## Non-goals

- publishing private source history;
- making npm the design authority;
- broad consumer migration;
- declaring a stable 1.0 API;
- weakening the public-design/private-implementation split;
- creating a second implementation in the community repository.
