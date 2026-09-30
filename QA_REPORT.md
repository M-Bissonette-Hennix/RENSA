# RENSA v3.0.0 — Frozen QA Report

## Result

**PASS — pre-field release candidate accepted for packaging.**

## Static/data integrity

Validated from the final source tree:

- application version: 3.0.0;
- schema version: 3;
- 24 unique technique/movement IDs;
- 8 chain IDs;
- 18 typed chain edges;
- 18 glossary entries;
- 9 curriculum stages;
- all chain node references resolve to corpus IDs;
- all prerequisite/reference relationships checked by static QA;
- FULL session = exactly 3000 seconds;
- COMPACT session = exactly 1200 seconds;
- QA PREVIEW = exactly 300 seconds;
- service-worker core asset list resolves to shipped runtime assets.

## Runtime engine QA

Deterministic runtime tests passed:

- balanced bilateral side bag produced equal LEFT/RIGHT counts across a controlled run;
- constrained draw bag avoided pathological immediate-repeat behavior;
- adaptive focus selection promoted intentionally seeded weak evidence (`miss` / `hesitant`) over clean comparators;
- P8 generated a mixture of valid and noise cues without presentation-channel classification metadata;
- v3 evidence sanitation rejects invalid timestamps rather than assigning current recency;
- state fallback/migration paths preserve predecessor storage rather than overwriting it;
- compatible saved sessions reopen paused with credited time preserved.

## Browser-interaction QA

An exact-source Chromium harness was used to exercise the final HTML/CSS/ES-module application where direct local HTTP navigation was blocked by the managed environment.

Verified:

- TODAY renders;
- PRESSURE renders;
- LIBRARY renders 24 cards;
- CHAINS renders all 8 chains;
- LEDGER renders;
- technique dossier opens;
- HOLD / RETURN interaction works;
- QA PREVIEW starts and completes;
- QA PREVIEW completion reports **NO CREDIT**;
- QA PREVIEW leaves session count, ledger, and evidence untouched;
- P6 visual state does not reveal current cue identity through the main cue/assessment/band UI;
- P8 suppresses per-cue assessment controls and does not label irrelevant cues as noise;
- no browser errors or console warnings were observed in the final interaction pass.

## Timing / chain hardening checks

- P4 chain fit uses complete sequence duration, including terminal node timing;
- ordinary chain conductor uses the same no-truncation rule;
- a chain is not started when the remaining window cannot contain the full sequence;
- P3 substitute selection excludes the initiating concrete technique when alternatives exist.

## Service-worker lifecycle check

Confirmed from final `sw.js`:

- install caches core assets;
- install does **not** call `skipWaiting()`;
- `SKIP_WAITING` occurs only in response to an explicit foreground message;
- activation removes obsolete RENSA caches and claims clients;
- GET requests use network-first with cache fallback and navigation fallback to `index.html`.

## Known QA-environment limitation

The managed Chromium environment blocks direct navigation to local HTTP origins. To avoid treating this as a pass-by-assumption, browser QA used a controlled origin harness that served the exact final multi-file sources into Chromium. Static and deterministic runtime tests were also executed independently.

The definitive final acceptance environment remains the deployed GitHub Pages origin.

## Field-release caveat

This QA establishes software and protocol integrity; it does not establish the real-world value of the training design. v3.0.0 is specifically intended to begin manual weekly field testing. The observation protocol is in `FIELD_TEST_PROTOCOL.md`.
