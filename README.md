# RENSA v2.0.0 — Adaptive Combatives Recall

RENSA is a static, local-first Progressive Web App for compact solo maintenance and pressure-retrieval of an **existing** hybrid combatives skill set. It is not a substitute for partner drilling, live resistance, coaching, sparring, or discipline-specific mastery.

## Frozen operating profile

- **Space:** 72 × 24 × 1 inch exercise/yoga mat lane
- **Partner:** none
- **Impact:** zero
- **Noise:** apartment / quiet
- **Equipment:** body only by default; resistance-band overlay optional
- **Primary weekly session:** 50 minutes
- **Compact session:** 20 minutes
- **QA preview:** 5 minutes and **never receives training credit**
- **Deployment:** GitHub Pages; no build step or external runtime dependency
- **Storage:** browser `localStorage`; JSON export/import available

## What changed in v2

v2 replaces the v1 prototype training engine with an evidence-aware implementation:

- per-technique exposure events: `clean / hesitant / miss / skipped / unrated`;
- an explainable focus scheduler using rated focus evidence, recent coverage, recency, side exposure, and cooldown;
- timestamp/delta-based clocks rather than assuming one timer callback equals one second;
- automatic pause on visibility loss or abnormal timer gaps so suspended time is never credited;
- persistent paused-session recovery after reload/process interruption;
- per-block `completed / partial / skipped` accounting;
- explicit protocol-event logging for manual NEXT/BACK, pause/resume and manual pressure cues;
- a separately authored 20-minute COMPACT plan;
- stateful interruption and sequential chain conduction;
- laterality-aware cues rather than indiscriminate LEFT/RIGHT prefixes;
- a P8 noise gate in which valid and irrelevant stimuli use the same presentation channel;
- no fabricated pressure score: pressure results default to `UNRATED`;
- stance setting and stance-relative striking nomenclature;
- distinct Wrestling Double-Leg and Judo Morote-gari entries;
- richer technique dossiers with canonical source, RENSA variant, prerequisites, checkpoints, failure modes and limitations;
- validated schema-v2 import/export and safe one-time migration from the v1 localStorage key;
- audio/haptic calibration controls and visible wake-lock status;
- improved focus states, type sizing and semantic navigation state.

## Representation integrity

Every technical entry carries one of five representation classes:

- `FULL` — the relevant solo motor task is meaningfully performable in the configured environment.
- `SHADOW` — non-contact motor representation; resistance, timing and opponent interaction are absent.
- `PROXY` — useful surrogate missing a defining component.
- `REFERENCE` — knowledge or gross positional recall only.
- `DISABLED` — excluded from generated sessions under the current environment.

RENSA never converts repetition counts into a claim of mastery. Hubud solo work remains a proxy because tactile sensitivity is partner-dependent. Throw entries remain shadow representations. Standing choke entries are hand-position recall only; the application does not prescribe solo neck compression.

## Deploy / upgrade on GitHub Pages

For an existing RENSA v1 repository, follow `UPGRADE_FROM_V1.md`.

For a fresh repository:

1. Extract the ZIP into the repository root so `index.html` is at root.
2. Commit and push all files.
3. GitHub → **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select the branch (normally `main`) and `/ (root)`.
5. Open the published URL while online once so the PWA shell can cache.
6. On iPhone/iPad, Safari → Share → **Add to Home Screen** if desired.

All application asset paths are relative and remain compatible with a project path such as `/RENSA/`.

## v1 data migration

v2 writes to `rensa-state-v2`. On first v2 launch, if that key does not exist and `rensa-state-v1` does, RENSA validates and migrates the v1 settings/history into v2. The original v1 key is intentionally **left untouched** as a rollback source.

Migrated v1 session summaries are marked legacy. They are retained in the ledger but are not fabricated into technique-level evidence and therefore do not masquerade as adaptive training data.

## Active-session recovery

While a weekly or pressure session is active, RENSA stores a paused checkpoint separately in `rensa-active-v2`. Reloaded/restored sessions never credit the time spent closed or backgrounded. A checkpoint older than 12 hours is discarded as stale.

## Audio on iOS

Start a session or use **SET → AUDIO CHECK** from a direct user gesture. Speech uses the browser Speech Synthesis API; tones use Web Audio; haptics use the vibration API where available. Screen Wake Lock support varies by browser/device, so v2 surfaces the current wake-lock state rather than silently assuming it succeeded.

## Files

- `index.html` — application shell and dialogs
- `css/styles.css` — AMOLED/severe responsive UI
- `js/data.js` — technique corpus, transition graph, sessions, terminology and curriculum
- `js/app.js` — state schema, evidence/scheduling logic, conductor, pressure engine, timing, persistence and ledger
- `sw.js` — offline cache/network strategy
- `manifest.webmanifest` — installable PWA metadata
- `assets/` — application icons
- `SPEC.md` — frozen v2 system specification
- `RELEASE_NOTES.md` — v2 release record
- `QA_REPORT.md` — freeze verification record
- `UPGRADE_FROM_V1.md` — drop-in replacement instructions
- `VERSION` — frozen release marker
- `.nojekyll` — explicit static Pages behavior
- `CHECKSUMS.sha256` — per-file integrity hashes

## Scope and safety

RENSA is a personal maintenance/retrieval tool for movement vocabulary the practitioner already knows. Solo rehearsal does not reproduce opponent timing, resistance, collision, tactile sensitivity, live tactical decision-making, or actual stress physiology. Stop on pain, keep movement controlled, stay inside the configured floor space, do not use furniture or household objects as improvised bodies, and do not apply strangulation pressure during solo control-position recall.
