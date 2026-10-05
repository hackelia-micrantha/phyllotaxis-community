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

## Registry and publication trust boundary

The concrete candidate registry is the public npm registry (`https://registry.npmjs.org`) using the scoped public package identity:

```text
@hackelia-micrantha/phyllotaxis
```

This remains a proposal until the RFC is accepted and the corresponding npm scope/package ownership is verified by the release owner. Scoped packages must be explicitly published as public; the release workflow must fail closed rather than rely on an ambient npm client default.

Preferred publication authentication is npm trusted publishing from one dedicated GitHub Actions release workflow in the private canonical repository, using GitHub OIDC and a GitHub-hosted runner. The publication job should have only the permissions needed for checkout plus OIDC (`contents: read`, `id-token: write`) unless a reviewed release step demonstrates another permission is required. Ordinary pull-request CI, self-hosted runners, forks, and reusable validation jobs must not receive package publication authority.

The trusted-publisher binding must name the canonical GitHub organization/repository and exact release workflow filename. If a protected GitHub environment is used, its name is part of that binding and its approval policy remains a separate release-authority control.

No long-lived npm publish token is part of the intended steady-state path. Bootstrap/owner actions required to establish npm scope/package ownership or the first trusted-publisher binding remain explicit human release-owner actions and are not delegated by this RFC.

### Provenance limitation

npm trusted publishing and npm provenance are related but not equivalent controls. npm currently supports OIDC trusted publishing from GitHub Actions, but npm's automatic provenance generation is not available when the publishing repository is private. Because the canonical Phyllotaxis producer is intentionally private, this RFC must not claim that npm trusted publishing alone satisfies the provenance requirement.

The producer must therefore generate a separate reviewed provenance/attestation that binds the canonical source revision, package identity/version, and packed artifact digest. #66 owns that delivery evidence. The public registry publication may additionally expose whatever registry metadata npm provides, but that metadata is not a substitute for the Micrantha provenance record.

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

The authoritative consumer-facing package README is:

`package/README.md`

in this public community repository.

Private release tooling must:

1. resolve the immutable public-contract revision recorded by the producer;
2. read `package/README.md` from that exact public revision;
3. stage it byte-for-byte as package-root `README.md` before packing;
4. verify the packed `README.md` matches the pinned public source;
5. fail closed on missing or mismatched content.

The private implementation README is never an implicit fallback. A package README change therefore follows the normal public design/documentation review path before private release tooling mirrors it.

The README rule is resolved independently from licensing. Before public release:

- verify the packed artifact contains the pinned public README;
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

## Rollback, deprecation, and revocation

Published versions are immutable. A released package version is never overwritten or silently replaced.

### Consumer rollback

Every consumer pins an exact package version and commits its package-manager lock/integrity state. A rollback is a normal reviewed dependency change that restores the last known-good exact version and its corresponding lockfile/integrity resolution, then reruns the consumer's compatibility checks.

For the selected first consumer, `hackelia-micrantha/web`, the package manager authority is Yarn 1.22.22: `package.json` records the exact Phyllotaxis version and `yarn.lock` records the resolved registry artifact and integrity. The initial adoption PR must preserve the pre-Phyllotaxis implementation as the rollback baseline until the public package has passed consumer qualification.

A forward pin and a rollback are both ordinary reviewed consumer changes:

1. change `@hackelia-micrantha/phyllotaxis` only to the intended exact version (no range);
2. regenerate `yarn.lock` from a clean/cache-miss install against the public registry, with private Phyllotaxis repository credentials unavailable;
3. review the lockfile diff so the Phyllotaxis resolved artifact/integrity changes are attributable to that version change;
4. run the consumer's repository-owned typecheck, build, unit/integration checks, and the bounded Phyllotaxis characterization/compatibility checks;
5. for rollback, restore the prior known-good exact version and its reviewed lock/integrity state rather than editing cache contents or substituting a mutable Git/private-repository dependency.

Before the first Phyllotaxis package release there is no prior public package version. In that case rollback means reverting the bounded adoption change and restoring `web`'s pre-Phyllotaxis implementation; after a known-good public version exists, rollback means pinning that exact prior version and its corresponding reviewed lock/integrity state.

The first consumer, `hackelia-micrantha/web`, must prove both the forward pin and restoration of the prior known-good dependency state before its initial Phyllotaxis adoption is considered qualified.

### Bad release

If post-publication smoke or consumer evidence shows a release is broken or unsafe:

1. stop any further promotion/publication activity;
2. deprecate the bad package version in the registry with a concise operator-facing reason when registry controls permit;
3. preserve the bad version, digest, provenance, SBOM, validation evidence, and incident context rather than deleting history;
4. direct consumers to the last known-good immutable version when rollback is safe;
5. publish a new corrected version only from a newly reviewed canonical revision;
6. repeat release-readiness and clean-consumer validation for the corrected artifact.

Unpublishing or erasing a released version is not the normal rollback mechanism.

### Publication-identity compromise

If the publication identity or release workflow is suspected to be compromised, pause publication, revoke/remove the affected trusted-publisher binding or credential, preserve evidence for incident review, and treat artifacts whose integrity cannot be established as unsafe until re-qualified. Restoring publication authority requires a reviewed replacement identity/binding; it must not silently reuse compromised authority.

### No prior release

For the first public release there is no prior public Phyllotaxis package to roll back to. The safe recovery state is therefore to deprecate the bad version, stop first-consumer adoption (or revert the consumer to its pre-Phyllotaxis implementation), and publish a corrected new version only after review. The release record must state this limitation explicitly.

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
- [x] public package README source/derivation is defined: `package/README.md` is authoritative and private release tooling must stage/verify it byte-for-byte from the pinned public revision;
- [ ] packed-artifact allowlist is mechanically enforced, including source-map policy;
- [ ] exact release versioning and npm registry namespace ownership are confirmed by the release owner;
- [ ] npm trusted-publisher identity is demonstrated from the dedicated canonical release workflow; separate provenance is demonstrated because the canonical repository is private;
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
