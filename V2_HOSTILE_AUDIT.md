# RENSA v2.0.0 — Pre-Field Hostile Audit

**Audit target:** RENSA v2.0.0  
**Disposition:** Superseded by RENSA v3.0.0  
**Purpose:** Identify defects that could distort training evidence, cue integrity, or field usability before routine weekly use.

## Executive finding

v2.0.0 corrected the major truthfulness failures of v1: it stopped fabricating scores, separated exposure from assessment, introduced adaptive scheduling, repaired COMPACT mode, hardened session accounting, and replaced naïve countdown timing. The pre-field audit nevertheless found a second-order defect class: mechanisms that were individually reasonable but could bias evidence, leak cue information, or behave awkwardly under long-form use.

v3.0.0 is therefore a field-hardening release rather than a feature-expansion release.

## Frozen defect ledger

| ID | Severity | v2.0.0 defect | v3.0.0 disposition |
|---|---|---|---|
| V2-A01 | P0 | **Partial-session evidence was too aggressively discarded.** A nearly complete session that ended partial could contain truthful technique evidence but lose adaptive value merely because the whole session did not reach completed status. | Evidence credit is now assessed per event. Valid rated evidence can survive a partial weekly/pressure session without converting that session into a completed one. |
| V2-A02 | P0 | **Exposure, rating, and session completion were still too coupled.** | v3 explicitly separates exposure credit, adaptive credit, and whole-session completion. |
| V2-A03 | P0 | **P6 BLIND leaked cue identity through secondary UI.** The main cue could be hidden while the assessment strip or band overlay still exposed the technique. | P6 suppresses visual side channels that reveal the current cue. |
| V2-A04 | P0 | **P8 could leak valid-vs-noise status through assessment affordances.** | P8 suppresses per-cue assessment controls and uses the same presentation channel for valid and irrelevant cues. |
| V2-A05 | P0 | **P4 chain-fit timing underestimated actual conductor runtime.** Terminal scheduling overhead could allow a chain to start even though its final recovery node could not complete before the pressure window ended. | Chain duration accounting is terminal-node aware; no chain starts unless the complete node sequence fits. |
| V2-A06 | P0 | **Ordinary CHAIN blocks could also begin too late and truncate recovery.** | Chain scheduling uses the same full-fit logic outside P4. |
| V2-A07 | P0 | **Service-worker install used `skipWaiting()`, undermining the foreground update handshake.** An update could activate while an active training session existed. | New workers wait. The foreground app explicitly requests activation only through the UPDATE control. |
| V2-A08 | P1 | **Raw random side selection could cluster LEFT/RIGHT despite bilateral-training intent.** | Bilateral cues use shuffle-bag balancing rather than independent random draws. |
| V2-A09 | P1 | **Pressure techniques could repeat immediately or cluster excessively.** | Technique cue pools use constrained shuffle bags with immediate-repeat avoidance. |
| V2-A10 | P1 | **Maintenance could randomly overexpose some entries before others.** | Maintenance now cycles through the eligible entry pool before repeats. |
| V2-A11 | P1 | **Chain selection could repeat the same chain too often.** | Chain selection is coverage-oriented through a constrained bag. |
| V2-A12 | P1 | **Pressure/maintenance evidence did not influence scheduling as cleanly as focus assessments.** | Adaptive scoring now consumes rated, creditable evidence across relevant contexts while preserving conservative credit rules. |
| V2-A13 | P1 | **Malformed imported evidence timestamps could be repaired to the current time, fabricating recency.** | Evidence with invalid dates is rejected rather than made artificially fresh. |
| V2-A14 | P1 | **A corrupt current-state record could collapse to defaults instead of attempting preserved predecessor state.** | Startup reads v3 first, then safely falls back to preserved v2, then v1. |
| V2-A15 | P1 | **A saved v2 active-session checkpoint had no v3 recovery path.** | v3 sanitizes and imports compatible v2 active checkpoints into the new active-session key. |
| V2-A16 | P1 | **No operator-level way existed to temporarily remove a technique from generated training without altering source data.** | HOLD/RETURN creates a practitioner overlay. Held techniques are excluded or substituted safely while canonical technique data remains unchanged. |
| V2-A17 | P1 | **No per-technique practitioner notes existed.** | v3 adds local technique notes, separately stored from canonical corpus fields. |
| V2-A18 | P1 | **The adaptive selector could treat sparse evidence too eagerly.** | v3 keeps a conservative cold-start threshold and falls back to coverage rotation until sufficient rated evidence exists. |
| V2-A19 | P1 | **Repeated focus assignment could occur without enough cooldown pressure.** | Adaptive score incorporates recent focus-session cooldown and underexposure/recency separately. |
| V2-A20 | P2 | **Audio initialization contained fragile/redundant handling during hardening.** | Dead/redundant audio initialization code removed; existing cue coordinator retained. |
| V2-A21 | P2 | **Update availability and active-session safety were conceptually separate but not fully enforced at SW lifecycle level.** | v3 aligns SW lifecycle and foreground update UI into one safe mechanism. |
| V2-A22 | P2 | **Import sanitation accepted some malformed booleans/ordering more loosely than desirable.** | v3 normalizes booleans, sorts logs/evidence, validates technique references, clamps held sets, and drops malformed evidence. |

## What the audit deliberately did *not* change

The following remain intentional constraints rather than defects:

- RENSA does not claim solo shadow work reproduces partner timing, tactile sensitivity, live resistance, or competition/randori competence.
- Full throw completion and impact falling remain excluded under the default apartment profile.
- Submission entries remain position/hand-sequencing recall only; no neck compression is part of generated solo training.
- The default session remains 50:00. COMPACT remains 20:00. QA PREVIEW remains 05:00 and non-crediting.
- The initial corpus remains deliberately curated rather than attempting encyclopedic martial-arts coverage.

## Release decision

v2.0.0 is judged **methodologically sound but not the preferred field baseline**. The defects above are sufficiently concentrated around evidence integrity, pressure validity, and long-session operation that routine weekly use should begin on v3.0.0 instead.
