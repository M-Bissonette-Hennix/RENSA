# RENSA v3.0.0

**Adaptive Combatives Recall — pre-field hardened release**

RENSA is a local-first GitHub Pages PWA for compact solo recall and maintenance of a curated hybrid combatives vocabulary. It is built around a hard default environment profile: approximately **72 × 24 inches**, apartment-quiet, solo, zero-impact, no partner dependency, optional resistance band.

RENSA is not a substitute for live coaching, resistance, sparring, randori, partner sensitivity work, or safe supervised submission/throw practice. Its job is narrower: preserve and retrieve already-known movement patterns, expose them under controlled information pressure, and record honest evidence about recall without pretending solo rehearsal equals live competence.

## v3 field baseline

v3.0.0 hardens v2 for routine weekly use. Major changes include:

- three-way evidence semantics: **exposure credit**, **adaptive credit**, and **session completion** are separate;
- partial sessions can preserve truthful rated evidence without being mislabeled completed;
- balanced LEFT/RIGHT shuffle bags and no-immediate-repeat technique bags;
- coverage-oriented maintenance and chain selection;
- P6 BLIND and P8 noise-gate side-channel suppression;
- terminal-aware chain scheduling so recovery nodes are not truncated;
- safe service-worker update lifecycle: updates wait for explicit foreground activation;
- v3 → v2 → v1 storage fallback and v2 active-checkpoint recovery;
- per-technique **HOLD / RETURN** control and private local notes;
- stricter import sanitation, including rejection of evidence with invalid timestamps.

## Frozen session durations

- **FULL:** 50:00
- **COMPACT:** 20:00
- **QA PREVIEW:** 05:00, no training credit

## Deployment

The contents of the release ZIP belong at the **repository root**. Do not place them inside a version subfolder.

For an existing v2 installation, see `UPGRADE_FROM_V2.md`.

## Data

v3 stores its primary state under a new v3 key and preserves predecessor keys for rollback/migration. Exporting data from SET before an upgrade remains recommended.

## Included release-control documents

- `V2_HOSTILE_AUDIT.md` — pre-field audit that drove v3
- `RELEASE_NOTES.md` — exact v3 changes
- `SPEC.md` — frozen architecture and evidence semantics
- `QA_REPORT.md` — pre-release test record
- `UPGRADE_FROM_V2.md` — live-repository replacement procedure
- `FIELD_TEST_PROTOCOL.md` — first weekly-use observation protocol
- `CHECKSUMS.sha256` — per-file integrity manifest
