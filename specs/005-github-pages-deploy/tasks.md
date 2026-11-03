---

description: "Task list for feature 005: Automatic Deployment to GitHub Pages"
---

# Tasks: Automatic Deployment to GitHub Pages

**Input**: Design documents from `/specs/005-github-pages-deploy/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R10), data-model.md,
contracts/pipeline.md (P1–P5, C1–C8, D1–D5, Q1–Q3, M1–M5), contracts/sub-path.md (S1–S8),
quickstart.md (L1–L5, G1–G6, W1–W6)

**Tests**: Included where the test environment can run them: build-output checks in
`tests/build/pwa.test.ts` (Constitution IV, written after the code they cover). Pipeline and
public-address behavior only exists on GitHub and on real devices; it is validated manually with
quickstart.md (IV exception), results recorded under the matching task.

**Organization**: US1 (P1, `main` goes live), US2 (P2, broken builds never published),
US3 (P3, manual start). All three stories edit the same workflow file, so they run in order.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2, US3)

## Path Conventions

Single frontend project at the repository root: `vite.config.ts`, `tests/build/`, `README.md`,
new `.github/workflows/deploy.yml`. Run commands from the repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only); allow network access to `registry.npmjs.org` for that command.
- **Preview server**: a server started from the sandbox is not reachable from Chrome. Ask the
  user to run the preview commands themselves, then drive Chrome against them.
- **GitHub**: Claude cannot push, log in or change repository settings. Tasks marked
  **(owner)** are done by the user; Claude prepares the exact steps and records the results the
  user reports.
- **Public address**: `https://jcavalin.github.io/duopona/`; repository `jcavalin/duopona`.

---

## Phase 1: Setup

**Purpose**: Baseline before any change

- [X] T001 Run `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa`; all must pass. Record under this task the unit/integration test count and build-test count, and save a copy of the current `dist/index.html` to `$TMPDIR/index.before.html` for comparison in T004
  - **Result (2026-11-03)**: all pass; 444 unit/integration tests, 20 build tests; `dist/index.html` saved to `$TMPDIR/index.before.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A build that works under `/duopona/` and at a site root, guarded by build-output
checks (contracts/sub-path.md). Every story publishes or checks this build.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 In `vite.config.ts`, add `base: './'` as the first property of the object passed to `defineConfig`, with the comment `// Relative paths: same build works at / and under /duopona/ (specs/005-github-pages-deploy/research.md R1)`. Change nothing else (keep `start_url: '.'`, `scope: '.'`, `navigateFallback: 'index.html'`)
  - **Result**: done
- [X] T003 Run `npm run build` and confirm the output matches research R1's table: `dist/index.html` uses `./icon.svg`, `./apple-touch-icon-180x180.png`, `./assets/index-*.js`, `./assets/index-*.css`, `./manifest.webmanifest`, `./registerSW.js`; `dist/registerSW.js` contains `register('./sw.js', { scope: './' })`; the CSS in `dist/assets/` contains `url(../fonts/nunito-latin-wght-normal.woff2)` and `url(../fonts/nunito-latin-wght-italic.woff2)`. Record any difference under this task
  - **Result**: output matches R1 exactly (`./` paths in index.html, `register('./sw.js', { scope: './' })`, `url(../fonts/…)` in CSS); no differences
- [X] T004 Update the root-path expectations in `tests/build/pwa.test.ts` to the relative form (contracts/sub-path.md, "Changes to existing build-output expectations"): in O1 and O2 the regexes `src="\/registerSW\.js"` become `src="\.\/registerSW\.js"`; the `manifestLink` regex becomes `/<link rel="manifest" href="\.\/([^"]+)"/` (still expecting `manifest.webmanifest`); the iOS icon expectation becomes `'<link rel="apple-touch-icon" href="./apple-touch-icon-180x180.png" />'`; the favicon expectation becomes `'<link rel="icon" href="./icon.svg" type="image/svg+xml" />'`. Also update the header comment to mention `specs/005-github-pages-deploy/contracts/sub-path.md`. Diff `dist/index.html` against `$TMPDIR/index.before.html` (T001): only path prefixes and asset hashes may differ
  - **Result**: 4 expectations updated (O1/O2 regex, manifest link, apple-touch-icon, favicon); `manifest` parse moved to top level for T005. Diff vs `index.before.html`: only `/`→`./` prefixes and asset hashes
- [X] T005 Add a `describe('sub-path (specs/005-github-pages-deploy/contracts/sub-path.md)', …)` block at the end of `tests/build/pwa.test.ts`, reusing `indexHtml`, `distFiles`, `precachedUrls`, `read` and the parsed manifest (move the `manifest` parse to top level if needed), with one `it` per rule:
  - S1: `indexHtml` has no match for `/\s(src|href)="\/(?!\/)/` (root-absolute, not protocol-relative)
  - S2: `indexHtml` contains `src="./registerSW.js"`, `href="./manifest.webmanifest"`, `href="./icon.svg"`, `href="./apple-touch-icon-180x180.png"`, and matches `/<script type="module" crossorigin src="\.\/assets\/index-[^"]+\.js">/` and `/<link rel="stylesheet" crossorigin href="\.\/assets\/index-[^"]+\.css">/`
  - S3: for every `distFiles` entry ending in `.css`, `read(file)` has no match for `/url\(\s*['"]?\/(?!\/)/`
  - S4: `read('registerSW.js')` contains `register('./sw.js', { scope: './' })`
  - S5: no `precachedUrls` entry starts with `/`
  - S6: manifest `start_url` and `scope` are `'.'` and no `icons[].src` starts with `/`
  - **Result**: `describe('sub-path …')` with S1–S6 added
- [X] T006 Run `npm run build && npm run test:pwa`; all build tests pass (count = T001 build-test count + 6). Then prove the new checks bite: temporarily remove `base: './'` from `vite.config.ts`, rebuild, run `npm run test:pwa` and confirm S1–S4 fail; restore `base: './'`, rebuild, all pass again. Record both results under this task
  - **Result**: 26 build tests pass (20 + 6). Without `base: './'`: 8 fail (S1–S4 plus O1, O2, manifest link, icons), 18 pass; restored: 26 pass
- [ ] T007 Local manual checks L1–L4 of `quickstart.md` **(owner runs the servers; Claude drives Chrome)**: ask the user to run `npm run dev` (L1), then `npm run preview` (L2), then `npx vite preview --base /duopona/` (L3–L4); record each row's result under this task

**Checkpoint**: `dist/` works at `/` and under `/duopona/`; `npm run test:pwa` fails on any root-absolute path

---

## Phase 3: User Story 1 - Every change on main goes live by itself (Priority: P1) 🎯 MVP

**Goal**: A push to `main` with passing checks is published at the public address with no
manual step.

**Independent Test**: Push a commit with a small visible change to `main`; within 10 minutes
`https://jcavalin.github.io/duopona/` shows it (quickstart G3, W1–W6).

### Implementation for User Story 1

- [X] T008 [US1] Create `.github/workflows/deploy.yml` (contracts/pipeline.md; research R3–R6) with:
  - `name: Check and deploy`; a top comment linking `specs/005-github-pages-deploy/contracts/pipeline.md`
  - `on: push: branches: ['**']` (pull request and manual triggers come in T013/T016)
  - top-level `permissions: contents: read`
  - top-level `concurrency: { group: deploy-${{ github.ref }}, cancel-in-progress: ${{ github.ref != 'refs/heads/main' }} }` (Q1–Q3)
  - job `check` (`runs-on: ubuntu-latest`, `timeout-minutes: 10`), steps each with a `name:` matching contract C1–C8: `actions/checkout@v7`; `actions/setup-node@v7` with `node-version: 26`, `cache: npm`; `npm ci`; `npm test`; `npm run lint`; `npm run build`; `npm run test:pwa`; `actions/upload-pages-artifact@v5` with `path: dist` and `if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'`
  - job `deploy`: `needs: check`, same `if:` as the upload step, `runs-on: ubuntu-latest`, `timeout-minutes: 10`, `permissions: { pages: write, id-token: write }`, `environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }`, one step `actions/deploy-pages@v5` with `id: deployment`
  - No secrets, no `actions/configure-pages`, no build step in `deploy` (D2)
  - **Result**: created with all three triggers (push, pull_request, workflow_dispatch); T013 and T016 were done in the same edit (see plan note)
- [X] T009 [P] [US1] Lint the workflow: run `actionlint .github/workflows/deploy.yml` if `actionlint` is installed (it is not a project dependency; do not add it). If it is not installed, re-read the file against contracts/pipeline.md row by row (C1–C8, D1–D4, Q1–Q3) instead. Record the result under this task
  - **Result**: `actionlint` not installed; YAML parses (triggers push/pull_request/workflow_dispatch; jobs check, deploy; 8 named steps). Reviewed against contracts/pipeline.md: C1–C8, D1–D4, Q1–Q3 all match
- [X] T010 [P] [US1] In `README.md`: (a) after the intro paragraph, add "**Try it:** https://jcavalin.github.io/duopona/"; (b) add a `## Deployment` section before `## Project layout` saying: `.github/workflows/deploy.yml` runs `npm ci`, tests, lint, build and `test:pwa` on every push, pull request and manual start; on `main` only, when all pass, it publishes the checked `dist/` to GitHub Pages; runs on `main` queue so the newest commit wins; one-time setup: repository public, Settings → Pages → Build and deployment → Source: **GitHub Actions**; to republish without a commit: Actions → "Check and deploy" → "Run workflow" on `main`; (c) in `## Hosting`, say the build uses relative paths so `dist/` works at any path (site root or sub-folder), and that GitHub Pages (the reference host) serves every file with a 10-minute cache that cannot be changed, which is fine because browsers check `sw.js` for updates past the HTTP cache (research R8); keep the HTTPS and `Cache-Control` advice for other hosts; (d) in `## Project layout`, add `.github/workflows/deploy.yml` — checks and GitHub Pages deployment (`specs/005-github-pages-deploy/`); (e) in `## Getting started`, change "Requires Node.js 20+." to "Requires Node.js 20.19+ or 22.12+ (CI uses 26)." (Vite 8's `engines` range)
  - **Result**: done (a)–(e); Deployment section placed after Hosting, before Project layout
- [ ] T010a [US2] **(owner)** Quickstart G1, before T011: push the feature branch; "check" passes; no "deploy" job; no artifact (P2). Record under this task (US2 check, run first because the branch is pushed before it is merged)
- [ ] T011 [US1] **(owner)** One-time setup and first publish (quickstart "One-time GitHub setup" + G3): merge to `main` and push with Pages still disabled; the first run is **expected** to fail at `deploy` with the "enable Pages" error (D5); then set Source to "GitHub Actions" and re-run that run with "Re-run all jobs"; note push time and the time the site shows the new version (≤ 10 min, SC-001). Record under this task
- [ ] T012 [US1] **(owner)** Public address checks W1–W5 of `quickstart.md` (W1 desktop Chrome, Claude may drive; W2–W5 on a real iPhone and Android phone). Leave the app installed on both phones for T017a. Record each row's result under this task; also record W2–W5 results under 003 T016–T021 and 004 T030–T031 where they match

**Checkpoint**: Duopona is live at the public address and updates on every passing push to `main`

---

## Phase 4: User Story 2 - A broken build never reaches learners (Priority: P2)

**Goal**: Failing checks publish nothing; pull requests and other branches are checked but never
published.

**Independent Test**: Open a pull request with a deliberately failing test; the run fails at
"npm test", no deploy runs, and the public address still serves the previous version (G2).

### Implementation for User Story 2

- [X] T013 [US2] In `.github/workflows/deploy.yml`, add `pull_request:` (no filters) to `on:`. Confirm the upload step and the `deploy` job both keep `if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'` and `deploy` keeps `needs: check` (P2, P3, D1)
  - **Result**: `pull_request:` present; upload step and `deploy` keep the `main`-only `if:`; `deploy` keeps `needs: check`
- [ ] T014 [US2] **(owner)** Quickstart G2: on a scratch branch make one assertion in `tests/unit/shuffle.test.ts` fail, push and open a pull request (G2: fails at "npm test" with the failing test shown; no deploy; site unchanged); close the PR and delete the branch. Record under this task
- [ ] T015 [US2] **(owner)** Quickstart G6: push a commit to `main` that fails `npm run lint` (e.g. an unused variable in a test file), confirm `deploy` is skipped and the site still serves the previous version, then push the revert and confirm it publishes. Record under this task

**Checkpoint**: Only passing `main` runs publish (SC-002)

---

## Phase 5: User Story 3 - Publish again on demand (Priority: P3)

**Goal**: The owner can rerun checks and publishing for `main` without a commit.

**Independent Test**: Actions → "Check and deploy" → "Run workflow" on `main`; checks run and
the site is republished (G4).

### Implementation for User Story 3

- [X] T016 [US3] In `.github/workflows/deploy.yml`, add `workflow_dispatch:` (no inputs) to `on:` (P4, P5). The existing `if:` already limits publishing to `main`
  - **Result**: `workflow_dispatch:` present
- [ ] T017 [US3] **(owner)** Quickstart G4: start the workflow by hand on `main`; checks run and `deploy` succeeds. Record under this task
- [ ] T017a [US1] **(owner)** Quickstart W6 on both phones, using the version published by T017 (or T015's revert): close the installed app, open it, close it, open it again; the new version shows by the second launch and progress is intact (SC-004, FR-008). Record under this task

**Checkpoint**: All three stories work

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T018 **(owner)** Quickstart G5: push two small commits to `main` within a minute; the second run waits (or replaces the first while queued) and the site ends on the second commit (FR-006, M5). Record under this task
- [X] T019 Final local run: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa`, all pass; record counts and compare with T001 (unit/integration unchanged, build tests +6)
  - **Result (2026-11-03)**: after `npm ci`: 444 unit/integration tests (unchanged), lint clean, build OK, 26 build tests (+6)
- [X] T020 [P] Update `ROADMAP.md`: when T010a–T018 (incl. T017a) are recorded, move "Deploy to GitHub Pages" to **Done** as "**005 – GitHub Pages deployment**: checks on every push, `main` published to https://jcavalin.github.io/duopona/ (`specs/005-github-pages-deploy/`)"; until then set its Status to what is built and which owner tasks remain
  - **Result**: Status updated to "built; remaining T007 and owner checks"; move to Done after the owner tasks are recorded
- [X] T021 [P] Cross-check the finished files against `contracts/pipeline.md` and `contracts/sub-path.md`; fix any mismatch in the code, or in the contract if the code is right, and note it under this task
  - **Result**: code matches both contracts; no changes needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none
- **Foundational (Phase 2)**: after T001; blocks all stories (the pipeline runs `test:pwa`, which must already expect relative paths)
- **US1 (Phase 3)**: after Phase 2
- **US2 (Phase 4)**, **US3 (Phase 5)**: after T008 (they edit the workflow it creates). Their owner checks (T014, T015, T017) need T011 (Pages enabled); T010a needs only T008, T013, T016. T017a needs T012 (app installed) and a later publish (T015 or T017)
- **Polish (Phase 6)**: after the stories; T018 needs T011

### Within Phases

- T002 → T003 → T004 → T005 → T006 → T007
- T008 → T009; T010 independent of T008/T009
- T013 and T016 both edit `deploy.yml`: run in order, not in parallel
- Code tasks T013 and T016 can be done before the owner pushes, so one push carries the whole workflow; owner order: T010a (push the feature branch; checks pass, no deploy) → T011 (merge and push `main`; the first run is **expected** to fail at `deploy` with the "enable Pages" error (D5); enable Pages; "Re-run all jobs"; it publishes) → T012 → T014 (G2) → T015 → T017 → T017a → T018

### Parallel Opportunities

- T009 and T010 (different files)
- T020 and T021 (different files)
- Owner checks on the phone (T012) can run while Claude does T019–T021

## Parallel Example: User Story 1

```text
After T008:
  Task: "T009 Lint .github/workflows/deploy.yml against contracts/pipeline.md"
  Task: "T010 README: public address, Deployment section, Hosting update"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2: relative build, sub-path checks
2. Phase 3: workflow + README; owner enables Pages and pushes `main`
3. **STOP and VALIDATE**: public address live (G3), phone checks (W1–W6)

### Incremental Delivery

1. MVP above → Duopona has a public HTTPS address
2. US2 → pull requests checked, failures proven not to publish
3. US3 → manual rerun
4. Polish → concurrency check, ROADMAP

In practice T008, T013 and T016 are a few lines in one file and are best committed together
before the first push; the per-story owner checks then verify each story separately.
