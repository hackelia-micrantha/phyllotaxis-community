# ADR-0007 — Permit one-time interactive npm package bootstrap

- **Status:** Accepted
- **Date:** 2026-10-07
- **Decision owners:** Phyllotaxis public contract authority
- **Scope:** First npm package creation only
- **Supersedes:** None
- **Superseded by:** None

## Context

ADR-0006 requires stage-only npm trusted publishing from the private canonical GitHub workflow. Current npm behavior creates a bootstrap dependency: trusted publishing is configured on an existing package, while staged publishing is the supported mechanism that can create a new package.

QART-0007 compared interactive exact-artifact staging, a throwaway staged bootstrap version, temporary automation credentials, and direct publication. RFC-0007 selects a one-time interactive staging exception because it preserves artifact identity without adding a CI publishing secret or bypassing staged human approval.

## Decision

Accept RFC-0007.

For creation of `@hackelia-micrantha/phyllotaxis` only, the release owner may interactively stage the exact `0.1.0-alpha.1` tarball produced by the canonical private release pipeline after independently verifying its recorded digest.

The staged alpha must not be approved until:

- stage-only trusted publishing is configured for the accepted GitHub repository/workflow/environment;
- traditional token publishing is disabled at package level;
- the npm-staged tarball has been re-downloaded and reconciled with canonical artifact identity/evidence;
- the normal human 2FA approval gate is satisfied.

After bootstrap, all subsequent staged versions originate from the accepted OIDC workflow.

## Consequences

The first staging authentication path differs from later releases, but producer/artifact authority does not: the exact canonical tarball is reused rather than rebuilt.

npm's `0.0.0-stage` placeholder is an expected registry bootstrap artifact and must not be represented as a Phyllotaxis product release.

No temporary CI publishing secret is required.

## Relationship to ADR-0006

ADR-0006 remains authoritative for the public package distribution architecture. This ADR specializes only the ordering of package creation and trusted-publisher configuration for the first-ever npm package.

Where ADR-0006 says trusted publishing is configured before staging, this ADR supplies the one-time bootstrap exception required by current npm behavior.

## Evidence

- [QART-0007 — First npm package bootstrap under trusted publishing](QART-0007-first-package-bootstrap.md)
- [RFC-0007 — One-time npm package bootstrap for trusted publishing](RFC-0007-first-package-bootstrap.md)
- npm staged publishing and trusted-publisher documentation current on 2026-10-07
