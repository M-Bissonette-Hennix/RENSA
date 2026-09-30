# RENSA v4.0.0

**Adaptive Combatives Recall // State Engine 1**

RENSA v4 is a local-first GitHub Pages PWA for maintaining an existing hybrid empty-hand skill set and rehearsing decision selection under constrained, apartment-safe conditions. v4 preserves the v3 weekly conductor and Pressure Engine 3 while adding a separate **State Engine** above the technique graph.

## What changed in v4

v4 introduces a formal problem-state model:

`DISTANCE × ENTANGLEMENT × ORIENTATION × MOBILITY × HAND AVAILABILITY × INFORMATION × OBJECTIVE`

The State Lab compiles a safe Problem Card from those axes and asks for a **response family**, not one predetermined technique. Multiple response families can be modeled as compatible with the same state.

The objective hierarchy is:

**AVOID → STABILIZE → RESOLVE**

This hierarchy and several contact-management concepts are preserved as **course-derived synthesis** from the user's redacted post-course notes. RENSA marks that provenance explicitly; it does not imply verbatim instructor doctrine.

## Hard boundary

Generated v4 State Lab problems are cognitive / empty-hand only. The compiler requires:

- no partner;
- no impact;
- no functional weapon;
- no live fire.

Previously trained IFWA/tool-context material can be indexed only as **INSTRUCTOR** reference. v4 does not encode or generate access, draw, firing, retention, manipulation, malfunction, or other operational weapon procedure.

## Environment

Default field profile remains:

- solo;
- quiet apartment;
- 72 × 24 inch mat lane;
- zero impact;
- no partner;
- optional resistance band;
- no live resistance.

## Weekly conductor

The v3 motor conductor is intentionally preserved rather than silently rewritten while the new State Engine is unfielded:

- FULL — 50:00
- COMPACT — 20:00
- QA PREVIEW — 05:00, no training credit

## State evidence

State decisions are stored separately from technique evidence. A State Lab selection cannot affect the weekly focus scheduler.

Each decision stores:

- problem ID;
- problem-title snapshot;
- full state vector;
- selected response family;
- result: `compatible`, `outside-model`, or `unsure`;
- objective;
- continuation depth;
- provenance class;
- RENSA model version;
- admissible-family snapshot.

This prevents later model changes from silently reinterpreting old decisions.

## Data migration

v4 writes to `rensa-state-v4` / `rensa-active-v4` and can migrate v3, v2, or v1 state. Prior storage keys remain untouched as rollback sources.

See `UPGRADE_FROM_V3.md`, `SPEC.md`, `QA_REPORT.md`, and `FIELD_TEST_PROTOCOL.md` before first use.
