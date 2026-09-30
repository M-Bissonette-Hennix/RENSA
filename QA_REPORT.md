# RENSA v2.0.0 — Freeze QA Report

**Release status:** FROZEN CORRECTIVE ENGINE  
**Freeze date:** 2026-09-30  
**Target:** static GitHub Pages / mobile PWA

## Static/source validation — PASS

- `js/app.js`, `js/data.js`, `sw.js`: JavaScript syntax PASS.
- `manifest.webmanifest`: JSON parse PASS.
- Application version: `2.0.0`.
- State schema: `2`.
- Technique/movement corpus: **24 entries**, all IDs unique.
- All representation values resolve to defined representation classes.
- All laterality values are one of `none / bilateral / stance`.
- Every prerequisite resolves to a real technique ID.
- Transition graph: **8 chains / 18 typed directed edges**.
- Every graph node/edge resolves and aligns to a real technique ID.
- Active focus pool: **7** retained takedown/shot entries.
- Wrestling Double-Leg and Judo Morote-gari are distinct IDs; Morote-gari is excluded from the active focus pool.
- Glossary: **18 entries**.
- Dependency curriculum: **9 stages**; all technique references resolve.
- Session budgets:
  - FULL: **3,000 seconds / 50:00**
  - COMPACT: **1,200 seconds / 20:00**
  - QA PREVIEW: **300 seconds / 5:00**
- Every session `techniqueId` resolves to the corpus.
- Every dynamic block type resolves to a known conductor implementation.
- Service-worker cache version is `rensa-v2.0.0`.
- Every service-worker core asset exists in the release tree.

## Static HTTP asset smoke test — PASS

A local static server returned HTTP 200 for:

- `/`
- `index.html`
- `css/styles.css`
- `js/app.js`
- `js/data.js`
- `manifest.webmanifest`
- `sw.js`
- `assets/icon.svg`
- `assets/icon-192.png`
- `assets/icon-512.png`

The served `js/data.js` was verified to report `APP_VERSION = '2.0.0'`.

## Chromium runtime QA — PASS

The managed Chromium policy in this environment blocks direct navigation to localhost with `ERR_BLOCKED_BY_ADMINISTRATOR`. To obtain a real browser runtime test rather than falling back to source inspection alone, the exact release HTML, CSS, `data.js` and `app.js` were assembled into a **temporary, non-shipped single-file QA harness**. Module exports/imports were inlined without changing application logic, and a test-only in-memory `localStorage` shim was injected. The harness was executed in headless Chromium at a 390 × 844 mobile viewport.

No page errors or console errors/warnings were produced in the main runtime suite.

### Navigation / corpus

- TODAY initial render: PASS.
- `aria-current="page"` follows navigation: PASS.
- LIBRARY renders **24** technique cards: PASS.
- CHAINS renders **8** chains and **26** linked node buttons: PASS.
- Morote-gari detail explicitly presents it as distinct from the Wrestling Double-Leg: PASS.

### COMPACT plan integrity

TODAY rendered COMPACT as exactly **20:00** with the actual selected plan:

- WAKE 02:00
- BASE 01:00
- WRESTLE 01:30
- STRIKE 04:00
- FLOW 02:00
- TAKEDOWN 04:00
- CONTROL 01:30
- CHAIN 02:00
- PRESSURE 01:30
- DOWN 00:30

This confirms v1's `find(first phase block) and stretch it` failure is absent.

### QA preview contamination test

The browser started the 5-minute QA PREVIEW and manually advanced through all eight blocks.

Result:

- completion screen explicitly displayed **NO CREDIT**;
- v2 logs remained `0`;
- `sessionCount` remained `0`.

PASS.

### Adversarial skip-to-complete test

The browser started FULL and immediately pressed NEXT through all **25** blocks.

Result:

- completion state was **PARTIAL**, not completed;
- all 25 unperformed blocks were retained as `skipped`;
- both focus-rating fields were disabled because no meaningful focus exposure occurred;
- saved ledger status was `partial`;
- `sessionCount` remained `0`;
- number of training-credit evidence events remained `0`.

PASS. This directly closes the v1 defect where reaching the end of the array could manufacture a completed session.

### Pressure P8 validity-leak test

P8 was launched and allowed to emit cues.

The active pressure UI contained neither `VALID CUE` nor `NOISE — IGNORE`. v2 uses one common tone/haptic/display path for both valid and irrelevant P8 stimuli.

PASS.

### Pressure-score integrity test

A pressure session was ended and saved partial without selecting a performance outcome.

Result:

- default outcome: `unrated`;
- stored `pressureOutcome`: `unrated`;
- stored legacy `recall`: `null`;
- no synthetic 3/5 value was written.

PASS.

### v1 → v2 migration test

A test browser context was seeded with a representative `rensa-state-v1` record and no v2 state.

Result:

- `rensa-state-v2` was created;
- v1 ledger record was preserved as `legacy`;
- historical session count was preserved;
- settings migrated;
- the original `rensa-state-v1` key remained present and unchanged.

PASS.

### Adaptive scheduler test

The browser was seeded with credited focus evidence in which Tai-otoshi carried a recent `miss` and De-ashi-harai a recent `hesitant` assessment, while comparison techniques carried clean evidence.

Result:

- Focus A: **Tai-otoshi**;
- Focus B: **De-ashi-harai**;
- displayed reasons included `recent miss` and `recent hesitation`.

PASS. This verifies that v2 focus selection is evidence-driven rather than the v1 fixed rotation once sufficient v2 evidence exists.

### Active-session recovery test

A valid paused QA session checkpoint was injected with 15 seconds already credited in its current 30-second block.

Result:

- TODAY displayed a RESUME card;
- RESUME reopened the session dialog;
- state restored **paused**;
- button read `RESUME`;
- timer displayed **00:15** rather than crediting closed time.

PASS.

### Temporal conductor tests

**Self-interruption:** the FULL striking block `Jab — Cross — Lead Hook — Cross` was entered and allowed to conduct. The first dynamic cue was the combination itself; the subsequent interrupt resolved to the intended recovery path (`Compact fighting base`) rather than an unrelated random technique. PASS.

**P4 chain sequencing:** P4 produced `Compact cover / shell` as cue 1 and later `Compact clinch acquisition shadow` as cue 2. The chain was not presented as one joined `A then B` string. PASS.

## Visual mobile inspection — PASS WITH SMALL CORRECTION APPLIED

Chromium screenshots at 390 × 844 were inspected for TODAY and the active session conductor.

The first visual pass revealed that the `TAKEDOWN` phase label could collide with its description in the narrow phase grid. The mobile phase-name column was enlarged before freeze. Evidence buttons were also increased to a larger touch target.

The active-session layout preserves clear hierarchy at mobile size:

- phase/progress at top;
- high-visibility movement label;
- instruction;
- live cue;
- optional evidence marks;
- large timer;
- persistent BACK / PAUSE / NEXT controls.

## Known platform limitations

- Browser Speech Synthesis voices/pronunciation differ by OS/browser. v2 mitigates this with per-technique `spokenCue` aliases but does not ship recorded audio.
- Screen Wake Lock can be unsupported or revoked by the platform. v2 detects and surfaces this instead of treating acquisition as guaranteed.
- Mobile operating systems can suspend PWAs. v2 therefore auto-pauses on visibility loss/timer gaps and restores active sessions paused rather than pretending suspended time was training.
- Direct localhost navigation in the managed build Chromium was blocked by administrator policy; browser logic was therefore exercised through the temporary inline harness described above, while the real multi-file release was independently served and asset-checked over local HTTP.

## Freeze conclusion

**PASS — RENSA v2.0.0 is approved for frozen GitHub Pages release.**

The v2 freeze specifically validates the corrective properties absent from v1: honest time accounting, honest evidence, adaptive focus behavior, non-contaminating QA, resumability, sequential transition cueing and a non-leaking P8 noise gate.


## Final hardening regression checks — PASS

After the main runtime suite, four edge cases were tightened and revalidated at source/invariant level before hashing the frozen package:

- weekly completion requires every block to reach its actual endpoint; a skipped or partial block forces a `partial` ledger result and prevents adaptive credit;
- P3 `CHANGE` rejects an identical replacement technique when a concrete technique cue is available;
- P4 refuses to begin a chain unless its maximum defined edge-delay window can complete before the current weekly/standalone pressure window ends, preventing the final recovery node from being cut off;
- adaptive cooldown resolves against the most recent completed weekly record, not an unrelated completed pressure record.

JavaScript syntax, session budgets, graph references, technique references and all service-worker core-asset HTTP checks were rerun after these edits and passed.
