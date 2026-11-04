---

description: "Task list for feature 011: Purple Brand Colours"
---

# Tasks: Purple Brand Colours

**Input**: Design documents from `/specs/011-purple-brand-colours/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R6), data-model.md, contracts/ui-colours.md,
quickstart.md (M1–M5)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. How the screens look (match with the mockups, phone bar colour) is
checked manually (IV exception) with quickstart M1–M5, and the results are recorded under the
matching task.

**Organization**: US1 (purple brand) and US2 (correct stays green) are both P1 and ship
together: US2 must land with US1, or the correct sheet turns purple. US3 (manifest and meta
colours) is independent.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2, US3)

## Path Conventions

Single frontend project: `src/`, `tests/` at the repository root. Run commands from the
repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only). No new packages are needed.
- **Dev server**: a server started from the sandbox is not reachable from Chrome. Ask the user to
  run `npm run dev` (http://localhost:5173), then drive Chrome against it. If a file was rewritten
  by a script, touch it and check the served code before testing in Chrome (Vite may serve an
  empty cached file).
- **Colour values**: `docs/design/purple-theme.md` (token table and success table). Mockups in
  `docs/design/mockups/` 01–07 show the purple theme. Ignore the mascot and the app icon (feature
  012).
- **Do not change**: `--error*`, `--explain-*`, `--gold*`, `--streak*`, layout, sizes, type,
  course content, store or persistence (FR-006, FR-009). Do not touch `public/` icons.

---

## Phase 1: Setup

- [X] T001 Record the baseline: run `npm test` and `npm run test:pwa` (after `npm run build`) and note the pass counts under this task
  - **Baseline (2026-11-04)**: `npm test` 601 passed (16 files); `npm run test:pwa` 26 passed

---

## Phase 2: Foundational

None. The token block in src/index.css is shared by US1 and US2, but each story edits its own
lines.

---

## Phase 3: User Story 1 – Purple brand across the app (Priority: P1) 🎯 MVP (with US2)

**Goal**: Brand and neutral colours are purple/violet-grey everywhere (FR-001, FR-002, FR-005,
FR-008).

**Independent Test**: Every screen matches mockups 01–07 in colour, apart from the correct sheet
(US2).

- [X] T002 [US1] In src/index.css `:root`, set the new values (purple-theme.md token table): `--bg: #16151f`, `--text: #efeef5`, `--text-muted: #a3a1b3`, `--line: #2e2c3d`, `--line-deep: #201e2c`, `--icon-muted: #9592a8`, `--primary: #6d3fd9`, `--primary-deep: #4f27a8`, `--primary-text: #b69cff`, `--primary-text-strong: #d9cbff`, `--primary-tint: #2b2150`, `--grammar-tint: #221c3d`. Leave every other token unchanged
- [X] T003 [US1] Search `src/` (all `.css`, `.tsx`, `.ts`) for hard-coded copies of the old values (`#131f24`, `#eef2f4`, `#9aa8b0`, `#2e3d45`, `#1e2a30`, `#8c9aa2`, `#0b7f63`, `#075e49`, `#3ddba6`, `#7ff0c8`, `#17392f`, `#18302a`, `#097257`, `#cff1e5`, `#e6f7f1`, case-insensitive) and green `rgb()`/`rgba()` values, and replace any found outside `:root` with the matching token (research R1 found none; confirm)
  - **Result (2026-11-04)**: none found; the only `rgb()` is the neutral black sheet shadow in Exercise.module.css

**Checkpoint**: Brand is purple. The correct sheet is temporarily purple too, until US2.

---

## Phase 4: User Story 2 – "Correct" stays green (Priority: P1)

**Goal**: Only the correct-answer sheet uses green, through `--success*` (FR-003, FR-004).

**Independent Test**: A right answer shows the green sheet with a green Continue (mockup 06), and
no other element uses `--success*`.

- [X] T004 [US2] In src/index.css `:root`, add `--success: #0b7f63;`, `--success-deep: #075e49;` and `--success-text: #7ff0c8;` next to the existing `--success-tint: #163a2e;`. After `.primary-button.danger`, add `.primary-button.success { background: var(--success); border-bottom-color: var(--success-deep); }` (same shape as `.danger`)
- [X] T005 [P] [US2] In src/components/Exercise.module.css: `.sheetCorrect .sheetIcon` background → `var(--success)`; `.sheetCorrect .sheetText` colour → `var(--success-text)` (research R2)
- [X] T006 [P] [US2] In src/components/FeedbackBanner.tsx, give the Continue button `className={`primary-button ${correct ? 'success' : 'danger'}`}`. Keep `ref={focusOnMount}`, `onClick` and the name "Continue"
- [X] T007 [US2] Check that `--success`, `--success-deep` and `--success-text` are used only by `.primary-button.success`, `.sheetCorrect .sheetIcon` and `.sheetCorrect .sheetText` (grep `src/`)
  - **Result (2026-11-04)**: `--success`/`--success-deep` only in `.primary-button.success`; `--success` and `--success-text` only in `.sheetCorrect .sheetIcon` / `.sheetText`; `--success-tint` unchanged on `.sheetCorrect`

**Checkpoint**: US1 + US2 complete. The app is purple and "correct" is green.

---

## Phase 5: User Story 3 – Installed app and browser bar match (Priority: P2)

**Goal**: The manifest and theme-color meta use the new background (FR-007).

**Independent Test**: The built manifest and index.html carry `#16151F`.

- [X] T008 [P] [US3] In vite.config.ts set the manifest `background_color: '#16151F'` and `theme_color: '#16151F'`; in index.html set `<meta name="theme-color" content="#16151F" />`
- [X] T009 [US3] In tests/build/pwa.test.ts change the expected `background_color`, `theme_color` and theme-color meta from `#131F24` to `#16151F` (research R5)

**Checkpoint**: US3 complete.

---

## Phase 6: Tests (after the code, Constitution IV)

- [X] T010 [P] Create tests/unit/theme.test.ts (research R6), reading files with `node:fs` (`readFileSync`, plus a small recursive walk of `src/` for `*.css`):
  - parse `:root` custom properties in src/index.css with a regex (`/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g`) and assert every T002 and T004 value (lowercase compare);
  - assert that no `src/**/*.css` contains any old neutral/brand value from T003 (case-insensitive), except `#0b7f63`, `#075e49` and `#7ff0c8`, which may appear only as the values of `--success`, `--success-deep` and `--success-text`;
  - compute WCAG contrast from the parsed tokens (relative luminance, `(L1+0.05)/(L2+0.05)`) and assert ≥ 4.5 for: `--text`/`--bg`, `--text-muted`/`--bg`, `--primary-text`/`--bg`, `--primary-text`/`--primary-tint`, `--primary-text`/`--grammar-tint`, `--primary-text-strong`/`--grammar-tint`, `#ffffff`/`--primary`, `#ffffff`/`--success`, `--success-text`/`--success-tint`; and ≥ 3 for `--icon-muted`/`--bg` and `--primary-text` (focus ring) on `--bg`, `--success-tint` and `--error-tint`
- [X] T011 [P] In tests/integration/lessonFlow.test.tsx add `describe('011 correct colours')`: after a right answer, the "Continue" button has class `success` and not `danger`; after a wrong answer it has `danger` and not `success`. Reuse the file's existing helpers for answering an exercise
- [X] T012 Run `npm test`, `npm run lint`, `npm run build` and `npm run test:pwa`; all pass. Record the counts under this task
  - **Result (2026-11-04)**: `npm test` 632 passed (17 files; +30 theme, +1 integration); lint clean; build ok (precache 12 entries, 503.00 KiB); `npm run test:pwa` 26 passed
- [X] T013 Manual check: ask the user to run `npm run dev`, then in Chrome with device emulation (390 × 844) run quickstart M1–M4 against mockups 01–07. Record the results under this task. Save the user's dev `localStorage` before the check and restore it afterwards. On a mismatch, fix the token or rule and re-check
  - **Result (2026-11-04)**, Chrome against the user's `npm run dev` (500 px wide; the window would not go narrower):
    - **M1**: violet-grey `#16151f` background, purple banner, Practice button and current node with tinted ring, lilac wordmark; no green. Matches 01.
    - **M2**: intro: lilac label and words, grammar card `#221c3d` (02). Exercise: purple progress fill, selected option purple-tinted with lilac text, purple Check (03).
    - **M3**: wrong sheet unchanged (red, "Why?" toggle); no element uses an old or success green.
    - **M4**: correct sheet green (background, circle, "pona! Correct.", Continue), matches 06. The summary screen (07) was not played through; its colours come from `--primary*` and `--gold*` tokens covered by tests/unit/theme.test.ts.
    - The user's dev `localStorage` was saved before and restored after.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T014 [P] Update README.md: where it describes the look or the colour tokens (around lines 44 and 108), mention the purple brand and green used only for "correct"
- [X] T015 [P] Update docs/design/purple-theme.md: add one line at the top saying it was implemented in `specs/011-purple-brand-colours/`, and that the progress-shadow and banner-text rows had no hard-coded values to change
- [~] T016 Ask the user to run quickstart M5 on a phone (Constitution V); record the results under this task. The owner may waive it under the recorded-waiver rule (Principle IV): then mark `[~]` with the date and "owner decision", and name the waived check in spec.md **Status**
  - **Deferred (2026-11-04)**: owner decision (constitution IV waiver): the owner will run M5 on a phone later.
- [X] T017 Set spec.md **Status** to `Implemented`, or to `Implemented (…)` naming any waived manual check. In ROADMAP.md, move the 011 entry from **In progress** to **Done** as a short summary in the style of the other Done items, keeping the specs path; leave **In progress** as `(none)`
  - **Result (2026-11-04)**: Status `Implemented (phone check M5 deferred by owner decision, task T016)`; ROADMAP updated
- [X] T018 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass; record the test count vs. T001's baseline under this task
  - **Result (2026-11-04)**: `npm test` 632 passed (baseline 601, +31); lint clean; build ok (precache 12 entries, 503.00 KiB); `npm run test:pwa` 26 passed

---

## Dependencies & Execution Order

- **Setup (T001)**: first
- **US1**: T002 → T003
- **US2**: T004 (after T002, same file) → T005 / T006 in parallel → T007. Ship together with US1
- **US3**: T008 → T009; independent of US1/US2
- **Tests**: T010 after T002 and T004; T011 after T006; T012 after everything above; T013 after
  T012
- **Polish**: T014 / T015 in parallel any time after T013; T016 → T017 → T018 last

## Parallel Example

```text
After T004:  T005 (Exercise.module.css)  ‖  T006 (FeedbackBanner.tsx)  ‖  T008 (vite.config.ts, index.html)
After code:  T010 (theme.test.ts)  ‖  T011 (lessonFlow.test.tsx)
```

## Implementation Strategy

- **MVP**: US1 + US2 together (T002–T007): the purple app with a green correct sheet. Shipping
  US1 alone would turn the correct sheet purple, so don't stop between them.
- **Then**: US3 (manifest/meta), tests, manual check, polish.
