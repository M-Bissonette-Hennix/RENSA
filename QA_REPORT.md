# RENSA v1.0.0 — Freeze QA Report

**Release status:** FIRST FROZEN BASELINE  
**Target:** static GitHub Pages deployment / mobile PWA

## Passed checks

- JavaScript syntax check: `js/app.js`, `js/data.js`, `sw.js`.
- Technique corpus: 19 entries; all IDs unique; all representation classes valid.
- Terminology: 16 glossary entries.
- Curriculum: 9 ordered stages.
- Session budgets:
  - FULL: exactly 3,000 seconds / 50:00.
  - COMPACT: exactly 1,200 seconds / 20:00.
  - QA PREVIEW: exactly 300 seconds / 5:00.
- View-generation logic: TODAY, PRESSURE, LIBRARY, CHAINS and LEDGER all generate successfully under deterministic runtime QA.
- Pressure engine: P1 through P8 all return callable cue structures.
- Takedown focus rotation resolves to valid technique IDs.
- Manifest parses as valid JSON and uses relative GitHub-Pages-safe scope/start paths.
- Service worker pre-cache list resolves to shipped assets.
- HTTP smoke test: application shell, CSS, JS modules, manifest, service worker and icons all return HTTP 200 from a local static server.

## Browser-harness limitation

The available managed Chromium instance in the build environment is administratively blocked from opening both local HTTP addresses and `file://` pages. A direct visual/click-through browser smoke test therefore cannot be completed inside this container. This is an environment policy restriction, not an application error.

To compensate, the release underwent JavaScript syntax validation, deterministic execution of the real view/session/pressure logic in a stubbed DOM, static-asset validation and an actual local HTTP asset smoke test.

A one-minute post-deployment check on the target GitHub Pages URL is still recommended before treating the installed iPhone PWA as operational: load TODAY, open LIBRARY, start the 5-minute QA PREVIEW, verify a spoken cue, exit, then start PRESSURE and verify randomized cues.

## Frozen invariants

- No build step or CDN required.
- Relative asset URLs only.
- No completed throws or impact falls generated under default profile.
- No partner-dependent drill represented as full solo training.
- No solo strangulation pressure instruction.
- Optional band work never changes the nominal session duration.
- Difficulty escalation is cognitive/retrieval oriented rather than an instruction to move recklessly faster.
