# RENSA v1.0.0 → v2.0.0 — Drop-in Upgrade

This package is designed to replace the current files at the root of the live RENSA GitHub Pages repository.

## Before replacing files

Optional but recommended: open the current v1 site and use **SET → EXPORT DATA**. This gives you an independent JSON backup in addition to v2's automatic migration behavior.

Do **not** clear Safari/site data before the first successful v2 launch if you want v1 local history migrated automatically.

## Repository changes

Extract the v2 ZIP at repository root and **replace the existing files with the files of the same path**:

- `index.html`
- `css/styles.css`
- `js/app.js`
- `js/data.js`
- `manifest.webmanifest`
- `sw.js`
- `assets/icon.svg`
- `assets/icon-192.png`
- `assets/icon-512.png`
- `README.md`
- `RELEASE_NOTES.md`
- `SPEC.md`
- `QA_REPORT.md`

Add these new release/integrity files:

- `UPGRADE_FROM_V1.md`
- `VERSION`
- `.nojekyll`
- `CHECKSUMS.sha256`

No v1 repository file needs to be deleted beyond replacement of the paths above.

## Commit / deploy

1. Copy the extracted files into the existing RENSA repository root.
2. Confirm `index.html` is still at repository root, not inside an extra `RENSA_v2.0.0/` directory.
3. Commit all replacements/additions.
4. Push to the branch GitHub Pages already deploys (currently expected to be `main` / root).
5. Wait for the Pages deployment to complete.
6. Open the published site while online.
7. Confirm TODAY shows **RELEASE 2.0.0 // EVIDENCE ENGINE 2**.

## Service-worker transition from v1

v1 used a cache-first service worker, so a device that already installed/cached v1 may briefly show the old shell immediately after deployment.

v2 uses a new cache name (`rensa-v2.0.0`), immediately activates the new worker, removes obsolete RENSA caches, and then uses network-first same-origin fetching with offline fallback.

If the first visit after deployment still visibly shows v1:

1. keep the device online;
2. reload once;
3. if using the Home Screen PWA, fully close it and reopen it;
4. verify the release label reads `2.0.0` before training.

You should **not** need to delete/re-add the Home Screen app.

## Automatic data migration

On first v2 execution:

1. RENSA checks for `rensa-state-v2`.
2. If absent, it checks `rensa-state-v1`.
3. v1 settings and ledger summaries are validated and copied into the v2 schema.
4. v1 session summaries are marked `legacy`.
5. No fictitious per-technique evidence is generated from old 1–5 recall scores.
6. The original `rensa-state-v1` key is left unchanged.

This means rollback remains possible at the browser-storage level until site data is manually cleared.

## Post-deployment acceptance check

Before the next 50-minute session:

1. Open **SET** and confirm your desired stance, cue channels and pressure level.
2. Run **AUDIO CHECK**: TONE, SPEECH and HAPTIC where supported.
3. Set session mode to **QA PREVIEW — 5 min**.
4. Start the preview and verify PAUSE / BACK / NEXT respond.
5. Finish or skip through the preview and verify it explicitly says **NO CREDIT**.
6. Open **PRESSURE**, select **P8**, and confirm cues are presented without `VALID` / `IGNORE` labels.
7. Return to SET and restore **FULL — 50 min** for normal weekly use.
8. Open **LEDGER** and confirm any migrated v1 records are still visible.

Once those checks pass, v2 is operational.
