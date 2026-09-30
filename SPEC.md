# RENSA v4.0.0 — Frozen System Specification

## 1. Mission

RENSA is a personal recall-and-maintenance platform for an existing hybrid combatives skill set. It is not a certification system, belt curriculum, competence oracle, or replacement for live coaching/resistance.

v4 adds a state/decision layer whose purpose is to rehearse identification of a problem state, current objective, and potentially compatible response family.

## 2. Environment invariant

Default environment:

- footprint: 72 × 24 inches;
- partner: none;
- impact: none;
- live resistance: none;
- noise: quiet;
- functional weapons: disabled;
- live fire: disabled.

The State compiler may emit only cards whose declared requirements are compatible with this environment.

## 3. Representation classes

- `FULL`
- `SHADOW`
- `PROXY`
- `REFERENCE`
- `DISABLED`
- `INSTRUCTOR`

`INSTRUCTOR` means previously trained/instructor-derived material can be indexed for provenance or context but RENSA does not autonomously teach or generate its operational procedure.

## 4. State vector

Every Problem Card has exactly one value for each axis:

### Distance
- standoff
- close
- contact

### Entanglement
- none
- clinch
- surface-constrained
- grounded

### Orientation
- frontal
- lateral
- turned
- seated

### Mobility
- free
- restricted
- pinned
- transitional

### Hand availability
- both free
- one occupied
- one unavailable
- both engaged

### Information
- unknown
- concerning
- boundary violated
- confirmed contact
- resolved

### Objective
- avoid
- stabilize
- resolve

## 5. Objective hierarchy

**AVOID → STABILIZE → RESOLVE**

RENSA treats this as a course-derived synthesis from the user's notes. It is not encoded as a universal legal rule or attributed as verbatim instructor language.

## 6. Problem compiler

A random starter must:

1. be `entryEligible`;
2. not be `REFERENCE` or `INSTRUCTOR`;
3. require no partner;
4. require no impact;
5. require no functional weapon;
6. require no live fire;
7. satisfy the current environment profile.

Continuation-only cards may be reached from an explicit `continuations` edge. `REFERENCE` and `INSTRUCTOR` cards remain non-generative even when addressed directly by the normal compiler.

## 7. Response families

A Problem Card admits zero or more broad response families. More than one family may be compatible. The engine records the user's selection against the card's modeled set; it does not claim a single universal answer.

The v4 family set is:

`OBSERVE, VERBALIZE, MOVE, COVER, FRAME, CLINCH, OFF_BALANCE, RECOVER_POSTURE, RECOVER_MOBILITY, DISENGAGE`

Some families map to existing motor nodes; purely cognitive channels do not.

## 8. State evidence

State evidence is independent of motor/technique evidence.

Required fields:

- timestamp;
- problem ID;
- problem title snapshot;
- state vector;
- selected response-family ID / label snapshot;
- result;
- objective;
- continuation depth;
- provenance class;
- model version;
- admissible-family snapshot.

Valid results:

- `compatible`
- `outside-model`
- `unsure`

An invalid/missing family cannot be sanitized into a positive or negative model judgment; it becomes `unsure`.

## 9. Provenance

Every course-derived Problem Card carries provenance metadata. RENSA distinguishes its own abstraction from course-derived synthesis and instructor-only reference.

## 10. Weekly motor conductor

Frozen durations remain:

- FULL: 3000 seconds
- COMPACT: 1200 seconds
- QA PREVIEW: 300 seconds

State Lab is intentionally standalone in v4 and does not alter these budgets or the adaptive focus scheduler.

## 11. Pressure Engine

Pressure Engine 3 remains the v3 field-hardened implementation. v4 does not silently fuse the unfielded State Engine into pressure generation.

## 12. Tool-context boundary

The v4 generated problem corpus contains no access, draw, firing, retention, manipulation, malfunction, live-fire, or other operational weapon-use procedure.

IFWA and dry-practice domains may exist only as `INSTRUCTOR`/boundary records in v4.

## 13. Persistence and migration

Primary keys:

- `rensa-state-v4`
- `rensa-active-v4`

Fallback sources:

- v3
- v2
- v1

Prior keys are not deleted during migration.
