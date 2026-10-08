# RFC-0007 — One-time npm package bootstrap for trusted publishing

Status: **Accepted by [ADR-0007](ADR-0007-first-package-bootstrap.md)**  
Origin: [QART-0007](QART-0007-first-package-bootstrap.md)

## Summary

Specialize ADR-0006 for the first creation of `@micrantha/phyllotaxis`.

Because npm trusted-publisher configuration is available only after the package exists, the first staging action may be performed interactively by the release owner from the **exact canonical tarball** already produced and reviewed by the private release pipeline.

This exception ends before the staged alpha is approved. It does not authorize a locally rebuilt package, a direct publish, a CI write token, or a second producer.

## Bootstrap procedure

1. The canonical private producer prepares `0.1.0-alpha.2`, generates the reviewed tarball and release evidence, and records its SHA-256 digest.
2. The release owner downloads that exact tarball to a trusted workstation and independently verifies the digest against canonical evidence.
3. From an authenticated npm session, stage that tarball as a public scoped package using the prerelease dist-tag `next`:
   `npm stage publish <verified-tarball> --access public --tag alpha`.
4. Record the npm stage ID and the npm-created `0.0.0-stage` placeholder as bootstrap evidence. Do not approve the alpha yet.
5. Configure the trusted publisher for `hackelia-micrantha/phyllotaxis`:
   - GitHub Actions;
   - repository `hackelia-micrantha/phyllotaxis`;
   - workflow filename `release.yml`;
   - environment `npm-public-release`;
   - stage-only permission.
6. Change package publishing access to require 2FA and disallow traditional token publishing.
7. Verify the staged tarball downloaded from npm matches the canonical candidate identity/digest and passes the applicable artifact inspection.
8. The release owner may then approve the staged alpha with interactive 2FA.
9. All later versions must be staged by the accepted OIDC workflow; this bootstrap exception must not recur merely for convenience.

## Security properties

- no long-lived npm token is introduced into GitHub Actions;
- bootstrap cannot substitute local source or locally rebuilt bytes;
- staging and public approval remain separate actions;
- the public alpha is not installable before interactive approval;
- package settings are hardened before the alpha is approved;
- separate producer provenance remains required because the canonical GitHub repository is private;
- the required npm placeholder is recorded rather than mistaken for a Phyllotaxis release.

## Failure behavior

If digest verification fails, the release owner must not stage the tarball.

If npm package creation/staging produces an unexpected identity or scope, reject the stage and stop the release train.

If trusted publishing cannot be configured and validated, do not approve the staged alpha. Reject it if necessary and preserve the stage/evidence record.

If the staged tarball downloaded from npm does not match the canonical candidate evidence, reject it and treat the discrepancy as a release incident.

## Compatibility

This does not change Phyllotaxis runtime, CLI, CSS, or consumer contracts. It changes only the first-package release-authority sequence.

## References

- [ADR-0006 — Accept public npm-compatible Phyllotaxis package distribution](ADR-0006-public-package-distribution.md)
- https://docs.npmjs.com/staged-publishing/
- https://docs.npmjs.com/cli/v11/commands/npm-stage/
- https://docs.npmjs.com/trusted-publishers/
- https://github.blog/changelog/2026-10-02-npm-staged-publishing-now-supports-creating-new-packages/
