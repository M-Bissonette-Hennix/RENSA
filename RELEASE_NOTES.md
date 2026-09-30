# RENSA v4.0.0 — Release Notes

## Release purpose

v4.0.0 is the first state-driven RENSA release. It does **not** attempt to expand the operational technique catalog. Its purpose is to place a problem/decision layer above the existing motor-recall engine while preserving the field-hardened v3 conductor.

## State Engine 1

New state axes:

1. Distance
2. Entanglement
3. Orientation
4. Mobility
5. Hand availability
6. Information state
7. Objective

New objective hierarchy:

**Avoid → Stabilize → Resolve**

The hierarchy is encoded as course-derived synthesis rather than attributed as verbatim external doctrine.

## Problem Cards

v4 ships with 10 Problem Cards, including:

- unknown-contact standoff;
- one-hand-occupied contact;
- boundary respected;
- boundary still closing;
- contact/entangled;
- surface-constrained contact;
- mobility restored / exit available;
- exit opens before entanglement;
- continuation check / anti-termination-bias;
- grounded entanglement as reference only.

Only environment-compatible, non-reference cards can be selected as random starters. Continuation-only cards may be entered only through explicit state transitions. Reference and instructor-only cards cannot leak into generated starter problems.

## Response-family model

State Lab uses 10 broad families:

- Observe / Hold
- Verbal Boundary
- Move / Manage Space
- Cover / Organize
- Frame
- Clinch / Connect
- Off-Balance / Entry
- Recover Posture
- Recover Mobility
- Disengage / Exit

After a decision, RENSA reveals the current modeled family set and, where applicable, links those families back to existing retained technique nodes. The app explicitly describes this as model compatibility rather than universal tactical or legal correctness.

## Provenance

v4 introduces explicit provenance classes:

- RENSA ABSTRACTION
- COURSE-DERIVED SYNTHESIS
- PERSONAL MEMORY
- INSTRUCTOR-ONLY REFERENCE

This is intended to prevent a later RENSA abstraction from being mistaken for something an instructor said or taught verbatim.

## Instructor-only boundary

v4 adds the `INSTRUCTOR` representation class. Instructor-derived tool-context domains may be indexed for provenance, but the autonomous compiler is prohibited from generating operational weapon-use procedures.

## Evidence integrity

State evidence is isolated from technique evidence and the adaptive motor scheduler. Historical State decisions snapshot the v4 model version, problem title, selected-family label, and admissible family IDs.

Results are deliberately limited to:

- `compatible`
- `outside-model`
- `unsure`

“Outside model” is not presented as a universal tactical or legal judgment.

## Migration

- new state key: `rensa-state-v4`
- new active-session key: `rensa-active-v4`
- compatible migration sources: v3, v2, v1
- old storage keys are preserved
- legacy `CHAINS` route migrates to the new `STATE` workspace

## Existing engines deliberately unchanged

The following v3 field components remain materially unchanged in v4:

- 50/20/5-minute weekly plans;
- technique evidence engine;
- adaptive focus scheduler;
- constrained laterality/cue bags;
- Pressure Engine 3;
- technique hold/return overlay;
- active-session checkpointing;
- service-worker update handshake.

This separation is intentional: State Engine behavior can now be field-tested without confounding it with a simultaneous rewrite of the motor conductor.
