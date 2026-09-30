# RENSA v1.0.0 — Adaptive Combatives Recall

RENSA is a static, local-first Progressive Web App for compact solo maintenance and pressure-retrieval of an existing hybrid combatives skill set.

## Release profile

- **Space:** 72 × 24 inch mat lane
- **Partner:** none
- **Impact:** zero
- **Noise:** apartment / quiet
- **Equipment:** body only by default; resistance-band overlay optional
- **Primary weekly session:** 50 minutes
- **Deployment:** GitHub Pages; no build step and no external dependencies
- **Storage:** browser `localStorage`; optional JSON export/import

## Deploy to GitHub Pages

1. Extract the ZIP into the **root of the prepared repository** so `index.html` is at repository root.
2. Commit and push all files.
3. In GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select the desired branch (normally `main`) and `/ (root)`.
5. Open the published URL once while online so the service worker can cache the release.
6. On iPhone/iPad, use Safari → Share → **Add to Home Screen** for standalone PWA behavior.

All asset URLs are relative, so the app works both at `username.github.io/` and `username.github.io/repository-name/`.

## Training model

RENSA deliberately distinguishes:

- `FULL` — meaningful solo motor task in the configured environment.
- `SHADOW` — non-contact motor representation; resistance/timing/opponent interaction absent.
- `PROXY` — useful surrogate missing a defining component.
- `REFERENCE` — knowledge or gross hand-position recall only.
- `DISABLED` — incompatible with the current environment.

The app does **not** treat repetitions as proof of live competence. Hubud solo work is marked as a proxy because tactile sensitivity requires a partner. Throwing entries are shadow representations only. Standing choke entries are hand-position recall only and never instruct the user to create neck compression in solo mode.

## Audio on iOS

Tap **BEGIN SESSION** or **START PRESSURE** directly from the app. That user gesture initializes Web Audio before cues begin. Spoken prompts use the browser's built-in Speech Synthesis API. Keep the app visible for the most reliable timing; iOS may suspend web apps that are backgrounded or the device is locked.

## Files

- `index.html` — application shell
- `css/styles.css` — AMOLED/severe responsive UI
- `js/data.js` — technique corpus, chains, session definition
- `js/app.js` — routing, session engine, audio, pressure engine, ledger and persistence
- `sw.js` — offline cache
- `manifest.webmanifest` — installable PWA metadata
- `assets/` — icons
- `SPEC.md` — frozen v1.0 system specification
- `RELEASE_NOTES.md` — release freeze record
- `QA_REPORT.md` — deterministic freeze checks and browser-harness limitation

## Data reset / migration

Use **SET → EXPORT DATA** before clearing Safari/site data or changing devices. Restore with **SET → IMPORT DATA**.

## Safety / scope

RENSA is a personal practice and recall tool. Solo shadow/proxy work cannot reproduce partner timing, resistance, tactile sensitivity, collision, live decision-making, or stress physiology. Train only movements you already know, stop on pain, and do not apply strangulation pressure during solo control-position recall.
