# RENSA v3.0.0 — Frozen System Specification

## 1. Mission

RENSA is a compact, solo, local-first recall and maintenance system for a curated hybrid combatives vocabulary. It prioritizes retrieval, sequencing, laterality, interruption, and transition recall under controlled information pressure.

It does not claim to generate live-fighting competence from solo work and does not substitute for partner drilling, sparring, randori, live resistance, tactile sensitivity training, or qualified coaching.

## 2. Default environment profile

- usable lane: approximately 72 × 24 inches;
- apartment-quiet;
- no throw completion;
- no impact breakfalls;
- no jumping requirement;
- no partner requirement;
- no bag/pad requirement;
- bodyweight default;
- resistance band optional;
- difficulty is increased primarily through information/retrieval pressure, not reckless movement speed.

## 3. Representation classes

- **FULL** — relevant solo motor task can be practiced meaningfully in the configured environment.
- **SHADOW** — non-contact motor pattern can be rehearsed but resistance/timing/opponent interaction are absent.
- **PROXY** — surrogate preserves part of a skill while a defining component is unavailable.
- **REFERENCE** — knowledge/sequencing recall only in the configured environment.
- **DISABLED** — excluded from generated sessions.

Representation is descriptive, not a mastery score.

## 4. Evidence semantics

Every evidence event has independent credit dimensions.

### 4.1 Exposure credit

Indicates that the relevant technique/movement was meaningfully presented/rehearsed under a creditable session condition.

### 4.2 Adaptive credit

Indicates that the event contains an explicit rated performance result suitable for scheduler weighting.

Only these results are adaptive evidence:

- `clean`
- `hesitant`
- `miss`

`unrated` remains a valid honest state and is never converted into positive evidence.

### 4.3 Session completion

Whole-session status is independent from evidence-event credit. A session may be `partial` while still containing valid rated technique evidence. Conversely, reaching a log screen does not make a session completed.

FULL/COMPACT weekly completion requires all planned blocks to reach their endpoints. QA PREVIEW never earns training credit.

## 5. Adaptive scheduling

The adaptive focus pool is the retained seven-entry active takedown set unless practitioner holds temporarily remove entries.

Until sufficient rated evidence exists, RENSA uses a deterministic coverage rotation.

Once activated, the scheduler considers:

- technique recency;
- underexposure;
- recent `miss` / `hesitant` evidence;
- bilateral exposure imbalance where applicable;
- recent focus-session coverage;
- cooldown against repeatedly assigning the same focus item.

The scheduler is corrective, not a mastery estimator.

## 6. Constrained randomization

Random cueing must not defeat coverage intent.

- bilateral side cues use balanced shuffle bags;
- pressure technique pools avoid immediate repeat where alternatives exist;
- maintenance cycles eligible entries before reuse;
- chain selection cycles eligible chains before reuse.

## 7. Pressure ladder

- **P1 PATTERN / RECALL:** concrete technique cues.
- **P2 SIDE:** technique plus meaningful laterality where supported.
- **P3 INTERRUPT:** stateful technique → CHANGE/RESET → substitute/recovery.
- **P4 CHAIN:** sequential chain nodes conducted over time.
- **P5 COMPRESSION:** reduced decision interval within safe movement constraints.
- **P6 BLIND:** audio-led retrieval with visual cue identity suppressed.
- **P7 CATEGORY:** category/functional cue requiring self-selection.
- **P8 NOISE:** relevant and irrelevant vocabulary share the same delivery channel; semantic discrimination is required.

No pressure level is permitted to use hidden UI metadata to reveal the answer.

## 8. Chain scheduling

A chain is a sequence of real corpus node IDs. Chain playback is temporal, not a single spoken memorization string.

A chain may only start when the complete remaining node sequence, including terminal recovery/disengagement, fits inside the remaining block/window.

## 9. Session clocks

Frozen durations:

- FULL: 3000 s
- COMPACT: 1200 s
- QA PREVIEW: 300 s

Clock credit is elapsed-time based rather than callback-count based. Background/visibility gaps do not become automatic training credit.

## 10. Practitioner overlay

Canonical technique data is immutable during ordinary use. Personal state lives separately:

- held technique IDs;
- technique-specific private notes;
- session/evidence history.

HOLD never deletes the technique from the reference library. Generated sessions either exclude it or substitute an explicit safe fallback when a fixed block requires structural continuity.

## 11. Persistence

Primary state schema: **3**.

Primary keys:

- `rensa-state-v3`
- `rensa-active-v3`

Preserved predecessor inputs:

- `rensa-state-v2`
- `rensa-state-v1`
- compatible `rensa-active-v2`

Startup preference: valid v3 → valid v2 migration → valid v1 migration → defaults.

Malformed evidence with invalid timestamps is dropped, not assigned artificial recency.

## 12. Update safety

A newly installed service worker waits. The application presents an update action and explicitly sends `SKIP_WAITING` only when the user chooses to update. An active session should not be displaced silently by service-worker activation.

## 13. Frozen corpus counts

- 24 technique/movement nodes
- 8 chains
- 18 typed edges
- 18 glossary entries
- 9 curriculum stages

These counts are release invariants, not claims of comprehensive combatives coverage.
