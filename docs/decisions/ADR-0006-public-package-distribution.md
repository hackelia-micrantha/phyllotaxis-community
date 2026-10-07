# ADR-0006 — Accept public npm-compatible Phyllotaxis package distribution

- **Status:** Accepted
- **Date:** 2026-10-07
- **Decision owners:** Phyllotaxis public contract authority
- **Scope:** Public package distribution and first-release authority boundary
- **Supersedes:** None
- **Superseded by:** None

## Context

Phyllotaxis intentionally separates public design authority from private implementation authority. The public `phyllotaxis-community` repository owns requirements, contracts, interfaces, CLI/manual contracts, and durable design decisions. The private `phyllotaxis` repository owns implementation, validation, build mechanics, and release evidence.

The selected first consumer, `hackelia-micrantha/web`, is public and therefore cannot safely depend on private Git credentials or a mutable private branch. QART-0002 resolved the alternatives into RFC-0002, which proposes one immutable npm-compatible package built by the private canonical producer.

Before this decision, RFC-0002 resolved the package license, consumer documentation boundary, artifact allowlist/source-map posture, trusted publication model, prerelease identity, evidence ownership, rollback/revocation model, registry-topology transition, and normalized release-readiness contract.

## Decision

Accept RFC-0002.

The durable distribution architecture is:

1. **Package identity:** the supported public browser/library/CLI artifact is `@hackelia-micrantha/phyllotaxis` on the public npm registry.
2. **Canonical producer:** `hackelia-micrantha/phyllotaxis` remains the private implementation and release authority.
3. **Public contract authority:** `hackelia-micrantha/phyllotaxis-community` remains authoritative for published requirements, interfaces, manuals, package README/license policy, and decisions; it is not a second implementation repository.
4. **Package license:** the public package artifact is Apache-2.0 using authoritative `package/LICENSE`; this does not make unpublished private source/history a public source distribution.
5. **Immutable release identity:** the first public candidate is `0.1.0-alpha.1` mapped to `v0.1.0-alpha.1`; consumers pin exact versions plus lock/integrity state.
6. **Trusted publication:** publication originates only from the private canonical repository through the dedicated `.github/workflows/release.yml` GitHub-hosted OIDC workflow and protected `npm-public-release` environment.
7. **Separated authority:** initial automation has staged-publication authority only. Human release-owner approval remains a distinct authorization step.
8. **No ambient long-lived publish token:** steady-state publication uses trusted publishing rather than a broadly reusable npm token.
9. **Private-repository provenance limitation:** npm registry provenance is not treated as sufficient; the producer must generate a separate attestation binding canonical revision, package version, and packed-artifact digest.
10. **Consumer acquisition:** public consumers install anonymously without private-repository credentials and must not consume mutable Git refs.
11. **Rollback/revocation:** published versions are immutable; bad versions are deprecated rather than overwritten, compromised publication authority is revoked, and evidence is preserved.
12. **Stable promotion:** `0.1.0` is not promoted until the bounded first-consumer qualification succeeds after the alpha release.

## Authority boundary

This ADR authorizes the **architecture**, not a publication.

It does not by itself authorize:

- changing the private package from `0.0.0` / `private: true`;
- creating `v0.1.0-alpha.1` or any release tag;
- changing organization repository posture before the corresponding producer/release changes are reviewed;
- configuring or exercising npm publication authority;
- staging or approving a package;
- claiming anonymous acquisition, provenance, SBOM, or consumer qualification evidence that has not actually been produced.

Those remain fail-closed first-release delivery gates in RFC-0002.

## Consequences

### Positive

- the public first consumer gets a conventional package-manager path without private Git credentials;
- implementation and public design authorities remain distinct;
- the release workflow has a concrete least-privilege identity and human approval boundary;
- package contents, licensing, provenance, SBOM, digest, rollback, and clean-consumer evidence have explicit owners;
- the alpha can be qualified in a real consumer before stable `0.1.0`.

### Negative and accepted costs

- the split topology requires public-contract pinning plus package staging verification;
- the private producer requires separate provenance/attestation rather than relying only on npm provenance;
- first release requires npm owner/bootstrap configuration and a protected release environment;
- post-publication anonymous-install and rollback evidence cannot exist before the first staged package is approved.

## Release sequencing

The first release proceeds in three authority-separated phases:

1. **Producer preparation:** pin the accepted public revision; stage/verify README and LICENSE; set reviewed package metadata; generate digest/SBOM/separate attestation/smoke evidence; land the dedicated release workflow; transition organization posture.
2. **Staged publication:** automation stages the exact reviewed candidate; a human release owner independently approves public availability.
3. **Post-publication qualification:** verify anonymous clean/cache-miss acquisition, pin `0.1.0-alpha.1` in `hackelia-micrantha/web`, run bounded compatibility/accessibility/responsive/visual evidence, and prove recovery. Only then may stable `0.1.0` be considered.

## Reassessment triggers

Revisit this decision if:

- npm trusted/staged publishing no longer supports the required private-canonical authority model;
- a second independently versioned artifact justifies splitting `phyllo` from the runtime package;
- public-source implementation becomes an explicit product/community requirement;
- consumer evidence shows npm distribution is materially unsuitable;
- provenance or signing requirements require a different artifact authority model.

## Evidence

- [QART-0002 — Public runtime and `phyllo` distribution boundary](QART-0002-public-distribution-boundary.md)
- [RFC-0002 — Public npm-compatible Phyllotaxis package distribution](RFC-0002-public-package-distribution.md)
- Community issue #25
- Community PRs #44, #45, and #46
- Private release issues `phyllotaxis#45`, `#65`, `#66`, `#67`, and first-consumer `#57`
