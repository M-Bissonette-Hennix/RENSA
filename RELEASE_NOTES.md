# RENSA v2.0.0 — CORRECTIVE ENGINE FREEZE

**Release:** 2.0.0  
**Freeze date:** 2026-09-30  
**Target:** static GitHub Pages / mobile PWA  
**Upgrade class:** drop-in major replacement from v1.0.0

## Release thesis

v1 established the interface, physical-environment contract and representation taxonomy. v2 makes the internal training record trustworthy enough to support the word **adaptive**.

The release deliberately prioritizes engine correctness over corpus expansion.

## P0 audit defects closed

- **Fixed scheduler fiction:** focus is no longer a fixed four-pair rotation once v2 evidence exists. The rotation remains only as a cold-start coverage fallback.
- **Fixed COMPACT semantics:** compact mode is now an explicit 1,200-second plan rather than stretching the first block found in each phase.
- **Fixed P8 leakage:** noise stimuli are no longer labeled `IGNORE`, given a different tone/haptic, or styled differently from valid cues.
- **Fixed skip-to-complete:** rapidly pressing NEXT cannot create a credited weekly session. Unperformed blocks become partial/skipped and the resulting record is non-crediting.
- **Fixed BACK clock corruption:** completed-block review runs as a bounded review replay and does not inflate planned-work credit.
- **Removed fabricated pressure score:** pressure outcome defaults to `UNRATED`; no automatic 3/5 is written.
- **Removed QA contamination:** the 5-minute preview cannot write training evidence or increment session count.
- **Replaced session-wide-only evidence:** technique exposure and explicit technique outcomes are now distinct from the session summary.

## P1 audit defects closed

- Stateful interruption: PRIME → CHANGE/RESET → optional SUBSTITUTE.
- Self-interruption in striking/Hubud is distinct from the dedicated cross-domain interrupt block.
- Chains are real technique-ID nodes with typed edges and are conducted sequentially.
- Laterality metadata is explicit; P2 only selects movements for which a side cue is meaningful.
- Stance is explicit (`orthodox / southpaw`), while striking vocabulary uses lead/rear terminology.
- Band overlays resolve from technique metadata for either focus position and live dynamic cues.
- Speech uses a coordinator instead of canceling every prior utterance.
- Session time is based on elapsed monotonic time; large callback gaps pause rather than become credited work.
- Active-session checkpoints support safe reload/process recovery.
- Wake-lock state is surfaced and system release is detected.
- TODAY phase preview is generated from the actual selected plan.
- Import/export uses schema v2 validation; v1 migration is explicit and non-destructive.
- Transition pseudo-nodes were replaced with real corpus entries (cover, frame, clinch shadow, disengage, etc.).
- Technique cards were expanded into structured dossiers.
- Curriculum stages now carry explicit dependencies and technique node IDs.
- Wrestling Double-Leg and Judo Morote-gari are separate entries.
- Standing Ezekiel explicitly separates the RENSA no-gi adaptation from canonical sleeve-dependent sode-guruma-jime mechanics.
- Manual NEXT/BACK, pause/resume and pressure NEW CUE operations are retained as protocol events.
- Final freeze hardening requires every weekly block to reach its endpoint for completion credit, guarantees P3 CHANGE selects a different concrete technique, and prevents P4 from starting a chain too late to deliver its terminal recovery node.

## Additional v2 improvements

- 24-entry initial technique/movement corpus.
- 18-term glossary.
- 9-stage dependency curriculum.
- 8 transition chains / 18 typed directed edges.
- per-session block accounting retained in ledger records;
- unexposed focus techniques cannot be rated from an early partial session;
- per-ledger-entry deletion also removes its attached evidence;
- focus-visible keyboard treatment, `aria-current`, live cue regions and increased mobile type/control sizes;
- audio tone/speech/haptic calibration controls;
- network-first service-worker fetch with offline cache fallback to reduce stale-release trapping;
- v1 localStorage is never deleted during migration.

## Deliberately deferred beyond v2

- cloud/account synchronization;
- partner/live-resistance evidence;
- camera or sensor scoring;
- user-authored techniques/chains;
- deep per-technique personal annotations and activation profiles;
- graph visualization/editor;
- ground locomotion incompatible with the current footprint;
- weapons curriculum;
- any mastery percentage or inferred live-fighting competence.

## Frozen session budgets

- FULL: **3,000 s / 50:00**
- COMPACT: **1,200 s / 20:00**
- QA PREVIEW: **300 s / 5:00**

The preview is explicitly non-crediting.
