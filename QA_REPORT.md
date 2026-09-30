# RENSA v4.0.0 — Frozen QA Report

## Frozen invariants

- application version: 4.0.0
- schema version: 4
- technical/movement nodes: 24
- transition chains: 8
- glossary entries: 24
- curriculum stages: 10
- Problem Cards: 10
- response families: 10
- State axes: 7
- FULL: 3000 s / 50:00
- COMPACT: 1200 s / 20:00
- QA PREVIEW: 300 s / 05:00

## Static integrity checks

PASS:

- `js/app.js` syntax
- `js/data.js` syntax
- every technique ID unique and referenced IDs resolve
- every chain node resolves to a technique
- every curriculum technique reference resolves
- every Problem Card contains all seven axes
- every axis value is in the declared vocabulary
- every allowed response-family ID resolves
- every continuation ID resolves
- every response-family technique mapping resolves
- generated Problem Cards require no partner, impact, functional weapon, or live fire
- generated Problem Card title/prompt/family corpus contains no operational draw/fire/manipulation procedure
- `INSTRUCTOR` records remain separate from generated cards
- service-worker cache version is v4.0.0
- service-worker install does not force `skipWaiting()`

## Exact-source runtime harness

The final `data.js` and `app.js` sources were combined only for the QA runtime harness; their application logic was not rewritten.

PASS:

- State route renders `STATE ENGINE 1`
- seven State cells render
- ten response-family controls render
- a modeled-compatible selection records `compatible`
- an incompatible selection records `outside-model`
- reveal-without-claim records `unsure`
- State decision creates no weekly session count or technique-evidence change
- decision history renders
- historical decision snapshots store model version and admissible-family set
- continuation enters only a declared continuation and increments depth
- 250 generated starter samples all satisfy the environment compiler
- 250 generated starter samples contain no `REFERENCE` / `INSTRUCTOR` leakage
- Library still renders 24 technical cards
- Curriculum renders Stage 10 / State reasoning

## Migration harness

A seeded v3 state was migrated through the final v4 migration code.

PASS:

- v3 route `chains` maps to `state`
- stance preserved
- credited weekly count preserved
- held technique preserved
- practitioner note preserved
- a new v4 key is written
- original v3 key remains present
- State decisions begin separately from technique evidence

## Browser limitation

The managed Chromium environment available during this build blocks file, data, localhost, and synthetic test origins before page content can execute. I therefore do not claim a direct real-origin browser pass for the undeployed v4 build.

Compensation:

- source-level validation of the exact multi-file tree;
- exact-source runtime harness using browser-compatible DOM stubs;
- local HTTP asset delivery check;
- final ZIP re-extraction and checksum verification.

The user's deployed GitHub Pages origin is the final real-browser acceptance environment.
