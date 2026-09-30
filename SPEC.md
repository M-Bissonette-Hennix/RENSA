# RENSA v1.0.0 — Frozen System Specification

## 1. Mission

RENSA is a compact, solo, apartment-compatible combatives **maintenance and retrieval** platform. It aggregates selected movements from the user's prior striking, judo, wrestling, Brazilian jiu-jitsu, Filipino martial arts and combatives experience without presenting itself as a complete course in any constituent discipline.

The training objective is rapid access to already-known motor vocabulary under increasing cue-selection, inhibition, laterality and task-switching demands.

## 2. Hard environmental constraints

- 72 × 24 × 1 inch yoga/exercise mat.
- Very little usable floor space outside that footprint.
- Apartment-compatible noise profile.
- No training partner.
- No throw completion or impact falling.
- No bag or pads assumed.
- Resistance band optional, never required.
- Standing/compact movement favored.

## 3. Functional ontology

RENSA organizes skills by functional use first, provenance second:

`BASE → STRIKE → FLOW → SHOT → SPRAWL → THROW → CONTROL → RECOVER`

The first release excludes ground-fighting locomotion that cannot be performed comfortably inside the footprint.

## 4. Representation integrity

Every entry carries one representation class: `FULL`, `SHADOW`, `PROXY`, `REFERENCE`, `DISABLED`.

This classification is intentionally conservative. The UI never converts completion counts into a claim of mastery.

## 5. Weekly session

Frozen full-session budget: **50 minutes**.

1. WAKE — 4 min
2. BASE — 3 min
3. WRESTLE — 3 min
4. STRIKE — 6 min
5. FLOW — 4 min
6. TAKEDOWN — 11 min
7. CONTROL — 4 min
8. CHAIN — 8 min
9. PRESSURE — 5 min
10. DOWN / LOG — 2 min

Compact and QA-preview profiles exist for constrained days and release testing; FULL remains the normative weekly session.

## 6. Takedown maintenance

Every weekly session touches all seven retained takedown families through a low-volume maintenance pulse. Two entries receive deeper rotating focus:

- A: o-soto-gari + double-leg
- B: uchi-mata + o-uchi-gari
- C: tai-otoshi + de-ashi-harai
- D: ippon-seoi-nage + o-soto-gari

The rotation advances only when a weekly session is committed to the ledger.

## 7. Hubud

The library distinguishes **Hubud-Lubud (partner-origin)** from the RENSA **solo motor proxy**. v1.0 trains bilateral sequencing, compact hand organization, rhythm changes, reversal and clean recovery from sequence interruption. It explicitly does not claim to train tactile pressure-reading or live sensitivity.

## 8. Pressure engine

Pressure is informational rather than ballistic.

- P1 RECALL — random named movement.
- P2 SIDE — movement plus left/right cue.
- P3 INTERRUPT — CHANGE/RESET inhibition prompts.
- P4 CHAIN — two-step cross-domain combinations.
- P5 COMPRESSION — shorter selection intervals.
- P6 BLIND — audio-first; screen hides movement name.
- P7 CATEGORY — functional category only; practitioner self-selects an appropriate known movement.
- P8 NOISE GATE — irrelevant spoken words are inserted and must be ignored.

## 9. Band overlay

Band mode is global and optional. Compatible throw entries receive a light-resistance upper-body connection note. No session depends on owning or using the band.

## 10. Persistence

No server is used. Session history and settings live in localStorage. Export/import provides a portable JSON backup.

## 11. Release invariants

The following must remain true for any v1.x patch:

- GitHub Pages compatibility without a build step.
- Relative URLs only.
- Full offline shell after first successful online load.
- No required external CDN/API.
- No partner-dependent drill silently presented as full solo training.
- No actual strangulation pressure prescribed in solo sessions.
- No impact fall or completed throw generated under the default environment.
