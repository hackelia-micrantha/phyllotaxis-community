# QART-0007 — First npm package bootstrap under trusted publishing

Status: **Resolved into RFC-0007**

## Question

How should the first-ever `@hackelia-micrantha/phyllotaxis` npm package be created when ADR-0006 requires trusted publishing, but npm trusted-publisher configuration requires the package to already exist?

## Current platform constraint

As of 2026-10-07:

- npm staged publishing can create a new package;
- creating a new package through staging creates a public `0.0.0-stage` placeholder while the staged version contents remain unavailable until approval;
- npm trusted-publisher configuration is package-scoped and therefore follows package creation;
- `npm stage publish` accepts the initial creation path without requiring 2FA, while approval requires an interactive maintainer with 2FA;
- prerelease versions require an explicit dist-tag.

References:

- https://docs.npmjs.com/staged-publishing/
- https://docs.npmjs.com/cli/v11/commands/npm-stage/
- https://docs.npmjs.com/trusted-publishers/
- https://github.blog/changelog/2026-10-02-npm-staged-publishing-now-supports-creating-new-packages/

## Alternatives

### A — Interactively stage the exact reviewed alpha tarball once

The release owner downloads the canonical producer tarball, verifies its recorded digest, and stages that exact tarball from an authenticated local npm session with explicit public access and prerelease tag. Package creation makes settings available. Before approving the staged alpha, configure the stage-only trusted publisher and disallow token publishing.

**Pros:** no CI write token; no rebuild; first public installable alpha is still human-approved only after package settings are hardened.

**Cons:** the first staging action is interactive rather than OIDC-authenticated; npm exposes its required `0.0.0-stage` placeholder during staging.

### B — Stage and reject a throwaway bootstrap version, then use OIDC for alpha

Create the package with a disposable staged version, configure OIDC, reject the bootstrap stage, then have CI stage `0.1.0-alpha.1`.

**Pros:** actual alpha staging uses OIDC.

**Cons:** artificial version/evidence lifecycle, extra rejection step, additional opportunity for operator error, and no security improvement for the public alpha contents relative to verifying the exact canonical tarball before the one-time stage.

### C — Temporarily use a stage-only granular token in CI

Create the package from automation with a narrowly scoped stage-only token, revoke it, then configure OIDC.

**Pros:** first stage remains automated.

**Cons:** introduces a write secret solely to solve bootstrap; expands CI secret handling for a one-time operation.

### D — Directly publish a bootstrap version

**Rejected.** It bypasses the staged human-approval control and unnecessarily makes a bootstrap payload installable.

## Resolution

Proceed with **A**.

The bootstrap action is a one-time package-creation exception, not an alternative ongoing release path. It stages only the exact reviewed canonical tarball after digest verification. It does not rebuild the package and does not approve it.

Before approving `0.1.0-alpha.1`:

1. configure the stage-only trusted publisher for the accepted GitHub workflow/environment;
2. restrict traditional token publishing at the package level;
3. verify the staged tarball identity/evidence;
4. require interactive 2FA approval.

All subsequent staged versions originate through the accepted OIDC workflow.
