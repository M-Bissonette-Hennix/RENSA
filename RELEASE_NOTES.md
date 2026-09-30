# RENSA v3.0.0 — Release Notes

**Release class:** Pre-field hardening / major state-schema release

v3.0.0 is the release intended to begin routine weekly field use. It does not attempt a broad curriculum expansion; it corrects second-order defects found by hostile auditing of v2.0.0.

## Evidence Engine 3

- Separates **exposure credit**, **adaptive credit**, and **session completion**.
- Valid rated events from partial sessions may influence the scheduler when the event itself satisfies credit rules.
- Unrated exposure remains exposure only; it never silently becomes positive performance evidence.
- Invalid-dated evidence is rejected rather than repaired to the current time.
- State import sorts/sanitizes logs and evidence and validates all technique references.

## Adaptive Scheduler 2

- Uses rated creditable evidence rather than whole-session labels alone.
- Retains conservative cold-start behavior until enough rated evidence exists.
- Considers recency, underexposure, recent misses/hesitation, side exposure imbalance, recent focus coverage, and cooldown.
- Held techniques are removed from generated focus pools without mutating canonical data.

## Constrained Randomization

Independent random draws were replaced where they could produce misleading clustering.

- bilateral sides use balanced shuffle bags;
- pressure technique pools avoid immediate repeats;
- maintenance covers eligible entries before repeating;
- chains use coverage-oriented selection before reuse.

Randomness remains unpredictable but is bounded by training intent.

## Pressure Engine 3

- **P6 BLIND:** cue identity is not leaked by assessment controls or band overlays.
- **P8 NOISE:** valid/noise status is not leaked through tone, haptics, flash style, label, typography, or per-cue assessment affordances.
- P4 chain timing is terminal-node aware; a chain is not started unless the entire node sequence can finish inside the available window.
- P3 substitution continues to exclude the initiating technique.

## Chain Conductor 3

- Ordinary chain blocks now use the same full-fit calculation as P4.
- No new chain begins if its final recovery/disengagement node cannot be delivered before the block ends.
- Constrained selection reduces accidental repetitive chain exposure.

## Practitioner Overlay

Technique dossiers now support local practitioner state without editing the canonical corpus:

- **HOLD:** temporarily excludes a session-eligible movement from generation where possible.
- **RETURN:** restores it.
- If a held technique occurs in a fixed plan block, RENSA substitutes a quiet safe fallback rather than silently deleting the planned block.
- Holds are constrained so the adaptive focus pool cannot be reduced below two available focus techniques.
- Private local notes may be stored per technique.

## Persistence and Recovery

- New primary key: `rensa-state-v3`.
- v2 and v1 state keys remain preserved as predecessor/rollback sources.
- If current v3 state is corrupt/unreadable, startup can fall back to valid v2, then v1 state.
- Compatible v2 active-session checkpoints may be sanitized into the v3 active-session format.
- Recovered sessions always resume paused and do not credit closed/background time.

## Service Worker / Update Safety

v2's worker could activate too aggressively. v3 intentionally does **not** call `skipWaiting()` during install.

When a new worker is waiting, the foreground app owns activation through the UPDATE action. This prevents an in-progress training session from being involuntarily displaced by an update.

## Corpus / session invariants

Frozen v3 corpus and timing:

- 24 movement/technique nodes
- 8 transition chains
- 18 typed chain edges
- 18 glossary entries
- 9 curriculum stages
- FULL = 3000 seconds
- COMPACT = 1200 seconds
- QA PREVIEW = 300 seconds

## Compatibility

v3 is intended as a drop-in replacement for v2 repository files. Do not manually merge runtime JavaScript. Follow `UPGRADE_FROM_V2.md`.
