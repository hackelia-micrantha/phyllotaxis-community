# Dimensional Utility — independent review execution guide

**Status:** Ready-to-execute protocol; **no participant session or independent sign-off recorded**. This guide operationalizes [issue #63](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/63). The decision in [ADR-0008](../decisions/ADR-0008-dimensional-utility-advisory-guidance.md) is already accepted as **advisory-only**; review results may inform reassessment but cannot silently change the accepted flat-first Utility baseline.

## Materials and provenance

- [Standalone participant session](../examples/dimensional-utility-review-session.html) — runs as a local HTML file, shuffles order locally, asks matched-content questions and downloads a JSON response without network upload.
- [Canonical F0–F5 reference](../examples/dimensional-utility-reference.html) and [canonical B1–B3 comparison](../examples/dimensional-utility-boundaries.html) — **not identical** to the participant session's controlled same-content examples. Review both when interpreting results.
- [Detailed B1–B3 independent review worksheet](dimensional-utility-human-review-worksheet.md) — manual/human accessibility and case-specific review.
- [Current browser evidence](dimensional-utility-browser-evidence.md) — scripted fixture observations, unsupported platform states and source provenance, **not** human observations.

Record the **reviewed commit SHA**, browser/version, OS/device, actual viewport/zoom/text settings, and a description of any modifications. A detached review packet is not proof of the repository revision unless the reviewer supplies its source commit. Do not represent any preview GitHub Pages URL as live until the gallery is separately merged and its deployment verified.

## Execution

1. Provide an independent reviewer a pinned copy of the public repository **or** the short-lived **Offline Review Kit** artifact from the GitHub Actions workflow at the reviewed commit. The artifact contains `independent-review-kit.zip` and `SOURCE.txt` with the exact checkout SHA and archive hash. Verify that they correspond to the intended revision, then hand off the ZIP and its source revision; never treat the artifact's existence as a completed participant session. The archive includes an unprimed participant README, the session and only its local supporting examples/worksheet. The page works with `file://`; no server, login, analytics, plugins, or external fonts are required. Workflow artifacts expire after 14 days; their download may require GitHub authentication.
2. Ask for consent to retain **anonymous task observations** and explain that responses remain on the reviewer's device unless they choose to share the JSON. Collect no contact information in the packet. If the reviewer prefers not to export, use the written worksheet without inventing results.
3. **Before showing the design rationale**, ask the reviewer to perform the two exercises: status scanning across three matched-content styles, then distinguishing an action from read-only status across two equal-content elevation styles. Do not reveal which condition is the intended negative control before answers are captured.
4. For each exercise, request the participant's chosen option and **why**, including incorrect expectations about what is clickable or status-bearing. The JavaScript session locally randomizes display order; the JSON records the resulting map (e.g., displayed Option 2 corresponds to a specific experimental condition). Without JavaScript, the displayed order is fixed and the reviewer must record that limitation manually.
5. Observe keyboard interaction and accessibility user settings where the reviewer is comfortable. Record conditions **actually exercised**; do not convert untested zoom, 200% text-only resize, forced-colors, AT, or target-size checks into passes.
6. Export `phyllotaxis-utility-review.json` locally, inspect it for accidental identifying text, and give it to the project owner voluntarily. No request is sent over the network by the page. The project owner must verify the source/protocol version and manually translate anonymized findings into #63; do **not** publish raw responses with identifying details.
7. Interpret each condition independently. The page re-presents F0/B1/B2/B3-like styles with matched copy and basic semantics; it is an **informal, non-random-sample qualitative comparison**, not the canonical B-fixture itself, not a task-timing experiment, not full WCAG/AT certification, and not evidence for stable Chroma/Lamina APIs.

## Evidence record

For each actual reviewer, use a record with these attributes:

| Field | Requirement |
| --- | --- |
| Review provenance | Exact public commit, fixture/protocol identity, date, reviewer independence |
| Platform | Browser/version, OS/device, viewport, color scheme, actual zoom/text/AT settings |
| Presentation order | Map exported local Option numbers to condition IDs; note absent JS |
| Observations | Primary status noticed, option selection, why, action/static expectations, confusion |
| Evidence | Sanitized response summary or reviewer-attested notes; optional link/hashed artifact |
| Limitations | Unsupported settings, uncertainty, prior exposure to design rationale |
| Disposition | Supports current advice, revise, reject, or insufficient evidence — with rationale |

A reviewer's preference for B1 or the differentiated B3 presentation does not demonstrate universal usefulness or a measurable false-affordance reduction. Conversely, rejection of stacked decoration need not prohibit task-justified nested structures.

## Completion boundaries

The **facilitation kit may be merged and marked ready without any participant responses**. Issue #63 must remain open until an actual independent person completes the protocol and findings are recorded with provenance. A single informal observation may inform the issue but is not a representative user study. If the findings materially challenge ADR-0008, use a separate public reassessment; never change private implementation or stable public contracts to fit incomplete evidence.

## Safety / exposure

The participant HTML intentionally has no `fetch`, remote resources, local/session storage, cookies, analytics, or automated GitHub issue creation. Its JSON export is an unverified self-report. Before sharing, review free-text fields for accidental PII, credentials or confidential project details.
