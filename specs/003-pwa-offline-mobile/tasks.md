---

description: "Task list for feature 003: Installable, Offline-Capable PWA"
---

# Tasks: Installable, Offline-Capable PWA

**Input**: Design documents from `/specs/003-pwa-offline-mobile/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/app-identity.md,
contracts/offline-and-updates.md, quickstart.md

**Tests**: Included. Constitution IV ("Tests after code, before done") and plan.md require the
build-output suite `tests/build/pwa.test.ts` (auto rows of both contracts). Each test task comes
**after** the code it covers. Offline/install/device behavior has no jsdom equivalent and is
validated manually with quickstart.md.

**Organization**: Tasks are grouped by user story. Story order follows priority: US1 (P1),
US2 (P2), US4 (P2, needs US1 + US2 on devices), US3 (P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2, US3, US4)

## Path Conventions

Single frontend project: `src/`, `public/`, `tests/`, `index.html`, `vite.config.ts` at the
repository root. Run commands from the repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix installs/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only); network access to `registry.npmjs.org` must be allowed for that
  command.
- **Dev/preview server**: a server started from the sandbox is not reachable from Chrome. Ask
  the user to run `npm run preview` (after `npm run build`) themselves, then drive Chrome
  against `http://localhost:4173`.
- **Service worker only in production builds**: `npm run dev` never registers it (research R4).
  All offline/install checks use `npm run build && npm run preview`.

---

## Phase 1: Setup

**Purpose**: Baseline and dependencies

- [X] T001 Record the baseline: run `npm test`, `npm run lint`, `npm run build`; note in this file under T001 the pass/fail of each, the list of files in `dist/` and the total size of `dist/` (`du -sb dist`)
  - Baseline 2026-11-03: `npm test` pass (6 files, 428 tests); `npm run lint` pass; `npm run build` pass. `dist/`: `index.html`, `assets/index-DKIMOWdf.js` (392.91 kB, 122.52 kB gzip), `assets/index-BePqG2J3.css` (4.76 kB); total 398 085 bytes.
- [X] T002 Install dev dependencies in package.json: `npm install -D vite-plugin-pwa@^2.0.0 @types/node@^<major of node --version>` (e.g. `@types/node@^22` on Node 22); confirm `npm run build` still passes and package-lock.json is updated
  - Installed `vite-plugin-pwa@^2.0.0`, `@types/node@^26.6.6` (Node v26.13.0). `npm audit`: moderate advisories in `glob`, `minimatch`, `deepmerge` (Workbox build-time deps only, not shipped to the browser).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build-output test harness shared by US1 and US2

**⚠️ CRITICAL**: Complete before the test tasks of any story

- [X] T003 Create tests/build/vitest.config.ts: `import { defineConfig } from 'vitest/config'`; `export default defineConfig({ test: { environment: 'node', include: ['tests/build/**/*.test.ts'], globals: true, passWithNoTests: true } })` (no React plugin, no setup file); vitest resolves `include` relative to the repo root when run with `--config tests/build/vitest.config.ts --root .`
- [X] T004 In vite.config.ts add `exclude: [...configDefaults.exclude, 'tests/build/**']` to `test` (import `configDefaults` from `vitest/config`) so `npm test` never runs build-output tests; in package.json add script `"test:pwa": "vitest run --root . --config tests/build/vitest.config.ts"`; confirm `npm test` still passes with the same test count as T001

**Checkpoint**: `npm test` unchanged; `npm run test:pwa` passes with no test files until T007

---

## Phase 3: User Story 1 - Learn without a connection (Priority: P1) 🎯 MVP

**Goal**: After one online visit, the whole app, including all 17 lessons, works offline; any
in-app address opens the app offline.

**Independent Test**: `npm run build && npm run preview`, open once, DevTools → Network →
Offline, reload, play a never-opened lesson to the end (quickstart rows 2–5).

### Implementation for User Story 1

- [X] T005 [US1] In vite.config.ts register the plugin: `import { VitePWA } from 'vite-plugin-pwa'` and add to `plugins` after `react()`: `VitePWA({ registerType: 'prompt', injectRegister: 'script-defer', manifest: false, workbox: { globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'], navigateFallback: 'index.html', cleanupOutdatedCaches: true } })`. Do **not** set `skipWaiting`, `clientsClaim` or `devOptions` (research R2, R4; contract O9). `manifest: false` is temporary until T011. Run `npm run build` and confirm `dist/sw.js`, `dist/registerSW.js` and a `workbox-*.js` file exist and `dist/index.html` contains a `<script ... src="/registerSW.js" defer>` (or equivalent deferred) tag
  - Changed during T011: `globPatterns` is `['**/*.{js,css,html}']`. With svg/png/webmanifest in the pattern, icons and the manifest were precached twice (the plugin already adds manifest icons + `includeAssets`). A "lists each file only once" test guards this.
- [X] T006 [US1] Inspect the generated `dist/sw.js` (it is minified): find how the precache list appears (expected `precacheAndRoute([{url:"index.html",revision:"…"},…])`, keys unquoted), how navigation fallback appears (expected `NavigationRoute` + `createHandlerBoundToURL("index.html")`), `cleanupOutdatedCaches()`, and the `SKIP_WAITING` message listener; write the exact patterns you will match as a comment at the top of tests/build/pwa.test.ts (created in T007), so the test matches real output, not guesses
  - Confirmed patterns (recorded at the top of tests/build/pwa.test.ts): `precacheAndRoute([{url:"…",revision:"…"|null}…])`, `NavigationRoute(createHandlerBoundToURL("index.html"))`, `cleanupOutdatedCaches()`, `"SKIP_WAITING"===e.data.type&&self.skipWaiting()`; no `clientsClaim`. `registerSW.js` is in the precache list. Registration tag: `<script … src="/registerSW.js" defer>`.

### Tests for User Story 1

- [X] T007 [US1] Create tests/build/pwa.test.ts (first line `/// <reference types="node" />`; if `npm run lint` rejects it (`@typescript-eslint/triple-slash-reference`), remove it and instead create tests/build/tsconfig.json extending ../../tsconfig.json with `compilerOptions.types: ["vitest/globals", "node"]` and `include: ["."]`, and exclude `tests/build` from the root tsconfig.json `include` while adding it as a reference so `tsc -b` still checks it; use `node:fs` and `node:path`; read from `dist/` at the repo root; if `dist/sw.js` is missing, fail with the message "Run `npm run build` before `npm run test:pwa`"). Add `describe('offline copy (contracts/offline-and-updates.md)')` with one test per auto rule:
  - **O1**: `dist/index.html` references `registerSW.js`
  - **O2**: that script tag has `defer` (or `type="module"`/`async`)
  - **O3**: precache URLs include `index.html`
  - **O4**: every `.js` and `.css` file found recursively under `dist/` is in the precache URLs, except `sw.js` and `workbox-*.js` themselves (so `registerSW.js` must be included; confirm in T006)
  - **O5**: precache URLs include `icon.svg`, every `*.png` in `dist/`, and `manifest.webmanifest` — write this test now but wrap the icon/manifest assertions in `it.skipIf(!existsSync('dist/manifest.webmanifest'))` **only until T011**, then remove the skip in T013
  - **O6**: every precache entry has a non-empty `revision` or a hashed filename (`-[A-Za-z0-9_-]{8,}\.`)
  - **O7**: sum of the byte sizes of all precached files in `dist/` < 1 048 576
  - **O8**: `sw.js` contains the navigation fallback to `index.html` (pattern from T006)
  - **O9**: `sw.js` contains no `clientsClaim`, and every `skipWaiting()` occurrence is inside the `SKIP_WAITING` message listener (pattern from T006)
  - **O12**: `sw.js` contains `cleanupOutdatedCaches`
  Run `npm run build && npm run test:pwa`; all pass
  - `npm run test:pwa`: 10 passed, 1 skipped (O5 until T011). Lint accepts the `/// <reference types="node" />` line; tsconfig fallback not needed.
- [X] T008 [US1] Manual validation in Chrome against `npm run preview` (user starts it): quickstart desktop rows 2, 3, 4 (play a never-opened lesson offline to the end and confirm the next one unlocks), 5; record results under this task; fix any failure in vite.config.ts
  - 2026-11-03, Chrome desktop, `npm run preview`. Row 2: worker `activated`, precache holds all 10 files; page controlled after one reload (expected: no `clientsClaim`). Offline simulated by **stopping the preview server** (fetch to the origin fails): row 3 lesson list loads; row 4 lesson 1 (never opened) played to the end: intro, MC + word-bank exercises, wrong-answer feedback, retries, summary; progress saved and lesson 2 unlocked; row 5 reload on `#/lesson/nouns-and-adjectives` shows that lesson's intro, `/nonexistent/page` shows the lesson list. No fixes needed.

**Checkpoint**: US1 complete; app fully usable offline in the browser (MVP)

---

## Phase 4: User Story 2 - Install Duopona on the phone (Priority: P2)

**Goal**: Installable with the Duopona name, an original icon, standalone display and
matching colors (contracts/app-identity.md).

**Independent Test**: In Chrome on `npm run preview`, DevTools → Application → Manifest shows
no installability issues; install and open it (quickstart rows 1 and 6).

### Implementation for User Story 2

- [X] T009 [P] [US2] Create public/icon.svg: original artwork, `viewBox="0 0 512 512"`, a full-bleed square background in `#2da44e` (no rounded corners, so the maskable variant fills Android shapes), and a simple white mark (e.g. a speech bubble with a small heart or smile, suggesting "talk" and "good"; no text, nothing copied from the book or from other apps' logos) kept entirely inside the central circle of radius 205 (80 % safe zone, contract "Icons"). Keep it a few `<path>`/`<circle>` elements, no embedded fonts or images
- [X] T010 [US2] Generate the PNGs from public/icon.svg: `npm_config_cache="$TMPDIR/npm-cache" npx @vite-pwa/assets-generator@2 --preset minimal-2023 public/icon.svg` (research R6). Keep `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/maskable-icon-512x512.png`, `public/apple-touch-icon-180x180.png`; delete any other generated files (e.g. `pwa-64x64.png`, `favicon.ico`). Open the four PNGs (Read tool) and check the mark is centered and not clipped
  - The `minimal-2023` preset pads icons with white (a white ring on Android maskable). Regenerated with a no-padding config committed as `pwa-assets.config.mjs` (background `#2da44e`); regenerate with `npx @vite-pwa/assets-generator@2` (no `--preset`). Checked the four PNGs visually: full-bleed green, mark centered, not clipped.
- [X] T011 [US2] In vite.config.ts replace `manifest: false` with the manifest from contracts/app-identity.md, exactly: `name: 'Duopona'`, `short_name: 'Duopona'`, `description: 'Learn Toki Pona in short lessons'`, `start_url: '.'`, `scope: '.'`, `display: 'standalone'`, `background_color: '#ffffff'`, `theme_color: '#ffffff'`, `lang: 'en'`, **no** `orientation`, `icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }, { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }, { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }]`; also add `includeAssets: ['icon.svg', 'apple-touch-icon-180x180.png']` to the plugin options. Build and confirm `dist/manifest.webmanifest` exists and `dist/index.html` has `<link rel="manifest" …>`
- [X] T012 [P] [US2] Edit index.html `<head>` (keep the existing viewport meta unchanged: `width=device-width, initial-scale=1, viewport-fit=cover`, no `user-scalable=no`): add `<meta name="description" content="Learn Toki Pona in short lessons" />`, `<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />`, `<meta name="theme-color" content="#0d1117" media="(prefers-color-scheme: dark)" />`, `<link rel="icon" href="/icon.svg" type="image/svg+xml" />`, `<link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />`, `<meta name="apple-mobile-web-app-title" content="Duopona" />`. Do **not** add `apple-mobile-web-app-status-bar-style` (research R7; decided on device in T019)

### Tests for User Story 2

- [X] T013 [US2] In tests/build/pwa.test.ts remove the temporary skip from O5 and add `describe('app identity (contracts/app-identity.md)')` with one test per **auto** row: parse `dist/manifest.webmanifest` as JSON and check `name`, `short_name`, non-empty `description`, `start_url`, `scope`, `display`, `background_color`, `theme_color`, `lang`, `orientation` absent, and the three icons (sizes, type, maskable purpose) each pointing to a file that exists in `dist/`; in `dist/index.html` check the manifest link, the viewport content (exact string above, no `user-scalable`), both theme-color metas with their `media`, the apple-touch-icon link to an existing 180×180 file, the SVG icon link, and `apple-mobile-web-app-title` = `Duopona`. Run `npm run build && npm run test:pwa`; all pass
  - `npm run test:pwa`: 19 passed (offline copy 11, app identity 8).
- [~] T014 [US2] Manual validation in Chrome against `npm run preview`: quickstart desktop rows 1 (Manifest panel: no errors, installable) and 6 (install, opens in its own window on the lesson list; reach the list from intro, exercise and summary using only in-app buttons, US2 AC4); record results under this task
  - **Won't do (2026-11-03)**: owner decision; will raise an issue if a problem shows up

**Checkpoint**: US1 + US2 complete; installable and offline on desktop

---

## Phase 5: User Story 4 - Comfortable to use on real phones (Priority: P2)

**Goal**: No double-tap zoom or text inflation; safe areas, 360 px and 44 px rules hold on real
iPhone and Android, in the browser and installed.

**Independent Test**: quickstart "Real devices" rows D1–D8 on a real iPhone and Android phone.

### Implementation for User Story 4

- [X] T015 [US4] In src/index.css add to the existing `:root` rule `-webkit-text-size-adjust: 100%; text-size-adjust: 100%;` and add a rule `html { touch-action: manipulation; }` (research R8; FR-015). Run `npm test` and `npm run lint`
  - `npm test` 428 passed, lint clean, build + `test:pwa` pass.

### Validation for User Story 4 (needs US1 + US2)

- [X] T016 [US4] Ask the user to make a production build reachable over HTTPS from their phones (quickstart "Real devices": Android USB port forwarding to `localhost:4173`, or an HTTPS tunnel/static deploy for iPhone); this is a user action: give them the exact commands from quickstart and wait for the URL
  - **Result (2026-11-03)**: done by feature 005: the production build is served over HTTPS at https://jcavalin.github.io/duopona/
- [~] T017 [US4] With the user, run quickstart rows D1–D8 on the **Android phone (Chrome)**: browser play-through, install, every screen installed in light and dark mode, in-app navigation back to the list, airplane-mode lesson, landscape, launch time, 002 scenarios in the installed app (FR-016); record device model, Android and Chrome versions and each row's result under this task
  - **Partial (2026-11-03, via 005 T012)**: on the public address, the owner reports on Android (Chrome): lesson path loads over HTTPS, a lesson plays, the app installs and works, a lesson plays in airplane mode, reload and a bookmarked lesson address work. Device model, OS/browser versions and the remaining rows (light/dark per screen, in-app navigation, landscape, launch time, 002 scenarios) not recorded
  - **Won't do (2026-11-03)**: remaining rows skipped by owner decision; will raise an issue if a problem shows up
- [~] T018 [US4] Same as T017 on the **iPhone (Safari)**: record device model, iOS version and each row's result under this task
  - **Partial (2026-11-03, via 005 T012)**: on the public address, the owner reports on iPhone (Safari): lesson path loads over HTTPS, a lesson plays, the app installs and works, a lesson plays in airplane mode, reload and a bookmarked lesson address work. Device model, OS/browser versions and the remaining rows (light/dark per screen, in-app navigation, landscape, launch time, 002 scenarios) not recorded
  - **Won't do (2026-11-03)**: remaining rows skipped by owner decision; will raise an issue if a problem shows up
- [~] T019 [US4] Fix every failure from T017–T018 in the file responsible (layout/safe areas: src/index.css or the matching src/components/*.module.css; identity: index.html or vite.config.ts). If the iOS status bar does not match the app in light or dark mode (D3), add `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />` to index.html (research R7), rebuild, re-check D3 on the iPhone, and update contracts/app-identity.md's status-bar row to the chosen value. Re-run `npm test`, `npm run build && npm run test:pwa` after any change
  - **Won't do (2026-11-03)**: owner decision; will raise an issue if a problem shows up

**Checkpoint**: Constitution V checks pass on real devices; 002's T051 device checks covered

---

## Phase 6: User Story 3 - Get new lessons and fixes automatically (Priority: P3)

**Goal**: New versions arrive silently, take effect on the next launch, never interrupt a
lesson or lose progress. Behavior comes from T005's config (no `skipWaiting`/`clientsClaim`);
O9 and O12 are already tested in T007.

**Independent Test**: quickstart desktop rows 7–8.

- [X] T020 [US3] Manual validation in Chrome against `npm run preview` (user runs it): quickstart rows 7 (start a lesson, rebuild with a visible text change, keep playing: not interrupted; DevTools shows the new worker "waiting") and 8 (close all Duopona tabs and the installed window, reopen: change visible, progress intact). Use a harmless temporary change (e.g. a character in the list heading in src/components/LessonList.tsx) and **revert it** afterwards, then rebuild. Record results under this task
  - 2026-11-03, Chrome desktop, `npm run preview`. Started lesson 2; changed the list heading to `Duopona!` and rebuilt while the server ran; `registration.update()` → new worker `installed` (waiting), old one still active. Kept answering: same page instance (marker kept), no reload (row 7, FR-011). Closed every Duopona tab, opened a new one: heading `Duopona!`, no waiting worker, progress unchanged (row 8, FR-010, SC-004). Change reverted and rebuilt.
- [~] T021 [US3] Repeat the update check on the installed app on one phone (Android is easiest with port forwarding): publish a changed build, open the installed app online, fully close it (remove from recent apps), reopen up to twice; the change must appear within two launches (SC-004) with progress intact. If it does not, implement research R2's alternative in src/main.tsx (register with `virtual:pwa-register`'s `registerSW({ onNeedRefresh })`, and when an update is waiting and `document.visibilityState === 'hidden'` while the hash route is `#/` or empty, call `updateSW(true)`; switch `injectRegister` to `false` in vite.config.ts), add a test for that logic, and record the decision in research.md R2; otherwise record "not needed" under this task
  - **Won't do (2026-11-03)**: owner decision; will raise an issue if a problem shows up

**Checkpoint**: All user stories complete

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T022 [P] Update README.md: replace the "runs entirely in the browser" intro to mention it installs to the home screen and works offline after the first visit; under "Getting started" add `npm run preview` (production build with offline support; the service worker is not active in `npm run dev`) and `npm run test:pwa` (run after `npm run build`); add a short "Hosting" section with the HTTPS and `Cache-Control` notes from quickstart.md "Hosting notes"; mention `public/` (icons; regenerate command) in "Project layout"
- [X] T023 [P] Update ROADMAP.md: move "PWA & mobile compliance" from **In progress** to **Done** as `**003 – PWA & mobile**: installable, offline, checked on iPhone and Android (\`specs/003-pwa-offline-mobile/\`).`; leave **In progress** as `(none)`; do not touch other items
  - 2026-11-03: moved to **Done** without "checked on iPhone and Android"; device checks skipped by owner decision.
- [~] T024 [P] In specs/002-book-course/tasks.md under T051 add a line: the real-device part is done by feature 003 (T017–T018), with the date; tick T051 only if its remaining timing check (SC-001 of 002) has also been done by the user, otherwise leave it open and say so
  - **Won't do (2026-11-03)**: device checks T017–T018 skipped by owner decision, so there is nothing to record; 002 T051 stays open.
- [X] T025 Run quickstart desktop row 9 (SC-006: first-visit time with "Slow 4G", worker active vs. unregistered; difference ≤ 3 s) and record it under this task
  - 2026-11-03, measured on `npm run preview` (localhost, no throttling) after unregistering the worker and deleting its caches: first contentful paint 88 ms, `load` 71 ms. `registerSW.js` registers the worker only on the `load` event, so the precache download (~390 KiB, the same files the page just loaded) starts after the lesson list is usable; it cannot delay it at any connection speed, so SC-006 holds by construction. Not measured with DevTools "Slow 4G" (needs DevTools, unavailable to the browser automation); optional for the user.
- [X] T026 Set spec.md **Status** to `Implemented` (or `Implemented (pending: …)` naming any open manual check) and tick checklists/requirements.md if anything changed
  - 2026-11-03: Status set to `Implemented (pending: T014, T016–T021 manual checks)`; set it to `Implemented` once those pass. Requirements checklist unchanged (16/16).
- [X] T027 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass; compare `dist/` size with T001 and record it
  - 2026-11-03: `npm test` 428 passed; lint clean; build ok (precache 10 entries, 389.56 KiB); `npm run test:pwa` 19 passed. `dist/` 422 238 bytes vs. 398 085 at T001 (+24 153: worker, Workbox runtime, manifest, icons). Re-run after any T019/T021 fix.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none
- **Foundational (Phase 2)**: after T002
- **US1 (Phase 3)**: after Phase 2 — MVP
- **US2 (Phase 4)**: T009, T010, T012 can start after Phase 1; T011 needs T005 (same file, extends the plugin call); T013 needs T007 and T011
- **US4 (Phase 5)**: T015 any time after Phase 1; T016–T019 need US1 and US2 complete (installed + offline on devices)
- **US3 (Phase 6)**: needs US1 (T005); T021 also needs US2 (installed app) and T016's device access
- **Polish (Phase 7)**: after all stories

### Within Each Story

- Implementation → build → test task → manual validation
- vite.config.ts is touched by T004, T005, T011 (and maybe T021): do these in order, never in parallel

### Parallel Opportunities

- T009 (icon.svg), T012 (index.html) and T015 (index.css) touch different files and can run alongside US1 work
- T022, T023, T024 in Polish

---

## Parallel Example: alongside User Story 1

```bash
# While T005–T008 (vite.config.ts, tests/build) are in progress:
Task: "T009 Create public/icon.svg"
Task: "T012 Add head tags to index.html"
Task: "T015 Add touch-action and text-size-adjust to src/index.css"
```

## Parallel Example: Polish

```bash
Task: "T022 Update README.md"
Task: "T023 Update ROADMAP.md"
Task: "T024 Note in specs/002-book-course/tasks.md T051"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2
2. Phase 3 (US1): worker + build-output tests + offline check in Chrome
3. **STOP and VALIDATE**: `npm run build && npm run test:pwa`, quickstart rows 2–5
4. The app is now usable offline in any browser (not yet installable)

### Incremental Delivery

1. + US2 → installable with name, icon and colors (desktop-verified)
2. + US4 → real-phone verification and fixes (closes Constitution V and 002's T051 device checks)
3. + US3 → update behavior verified on desktop and an installed phone app
4. + Polish → docs, roadmap, final gate

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- Storage format `duopona:progress` v1 is unchanged; the worker never touches `localStorage`
- No in-app install button, no update banner (spec FR-009, Assumptions)
- Manual tasks (T008, T014, T016–T021, T025) need the user to run the preview server and/or
  hold the phones; ask up front, record results in this file
- Commit after each phase
