# Upgrade RENSA v2.0.0 → v3.0.0

v3 is a repository-root drop-in replacement. Do not manually merge `app.js` or `data.js`.

## Before replacing files

1. Open the current v2 deployment.
2. In **SET**, export a data backup if you have any history you want independently archived.
3. Do **not** clear browser/site storage before deploying v3; automatic migration depends on the existing v2 state key.
4. Keep Git history so the v2 commit remains an easy code rollback point.

## Repository update

Extract the v3 ZIP locally and copy its contents into the existing RENSA repository root.

Replace these runtime assets wholesale:

- `index.html`
- `css/styles.css`
- `js/app.js`
- `js/data.js`
- `manifest.webmanifest`
- `sw.js`
- `assets/icon.svg`
- `assets/icon-192.png`
- `assets/icon-512.png`

Replace/update release documents as supplied and add any new v3 documents.

Do not create a `RENSA_v3.0.0/` directory inside the repository. `index.html` must remain at the Pages root.

Commit and push to the same branch/root already configured for GitHub Pages.

## First-load migration behavior

v3 writes to a new state key. On first load:

1. valid `rensa-state-v3` is preferred if present;
2. otherwise valid `rensa-state-v2` is sanitized/migrated into v3;
3. otherwise valid v1 data may be migrated;
4. predecessor keys remain untouched as rollback sources.

Technique notes and holds are new v3 fields and begin empty unless restored from a v3 backup.

A compatible `rensa-active-v2` checkpoint can be imported into the v3 active-session structure. It reopens paused and does not receive credit for time spent closed.

## Service-worker transition

Because v3 deliberately uses a waiting-worker update handshake, an already-open v2 tab may initially continue using the old worker.

After GitHub Pages finishes deploying:

1. open/reload the live site;
2. if RENSA displays an update control/banner, use **UPDATE**;
3. allow the page to reload;
4. confirm the interface reports release **3.0.0**;
5. if the old version persists, close all RENSA tabs and reopen the site once.

Do not clear site storage merely to force an update unless migration/rollback data is no longer needed.

## Acceptance check

Before the first real workout:

- verify version 3.0.0;
- verify your prior ledger is present if v2 had history;
- run QA PREVIEW and confirm it finishes with **NO CREDIT**;
- inspect LEDGER and confirm preview did not increment training history;
- test one HOLD and RETURN action from a technique dossier;
- add/remove a harmless test note;
- run P6 briefly and confirm the screen does not reveal the audio cue identity;
- run P8 briefly and confirm noise cues do not visually identify themselves as noise;
- restore weekly mode to FULL or your desired field mode.

Then begin field use using `FIELD_TEST_PROTOCOL.md`.
