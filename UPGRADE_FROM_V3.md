# Upgrading RENSA v3.0.0 → v4.0.0

## Before replacing files

1. Open the current v3 site.
2. Optional but recommended: **SET → EXPORT DATA**.
3. Do **not** clear browser/site storage.
4. Keep the Git commit containing v3 as your repository rollback point.

## Repository update

Extract the v4 ZIP directly into the existing repository root and replace matching files wholesale.

Do not create a `v4` subfolder. `index.html` remains at repository root.

Replace/add:

- `index.html`
- `css/styles.css`
- `js/app.js`
- `js/data.js`
- `manifest.webmanifest`
- `sw.js`
- `assets/*`
- `README.md`
- `RELEASE_NOTES.md`
- `SPEC.md`
- `QA_REPORT.md`
- `FIELD_TEST_PROTOCOL.md`
- `UPGRADE_FROM_V3.md`
- `COURSE_INTEGRATION_LEDGER.md`
- `VERSION`
- `.nojekyll`
- `CHECKSUMS.sha256`

Commit and push to the same branch/root GitHub Pages already serves.

## First launch migration

v4 writes to new keys and reads the old v3 data only when no valid v4 state exists.

Expected migration behavior:

- v3 session logs survive;
- v3 technique evidence survives;
- session count survives;
- technique holds survive;
- personal technique notes survive;
- stance/settings survive;
- old `CHAINS` route becomes `STATE`;
- original v3 storage remains present as a rollback source.

State Lab starts with an empty decision ledger because v3 did not contain State Engine evidence.

## PWA update behavior

v4 retains the deliberate service-worker waiting handshake. If an **UPDATE** control appears, activate it only when no session is in progress.

If Pages has deployed v4 but the old UI remains visible:

1. close all RENSA tabs/PWA instances;
2. reopen once;
3. use the UPDATE control if shown;
4. avoid deleting site data unless migration has already been independently backed up.

## Acceptance check

The new primary navigation should read:

`TODAY · PRESSURE · LIBRARY · STATE · LEDGER`

STATE should show:

`STATE ENGINE 1`

and:

`STATE BEFORE TECHNIQUE.`
