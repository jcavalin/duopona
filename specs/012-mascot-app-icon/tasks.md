---

description: "Task list for feature 012: Mascot and App Icon"
---

# Tasks: Mascot and App Icon

**Input**: Design documents from `/specs/012-mascot-app-icon/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R7), data-model.md, contracts/ui-mascot.md
(C1–C5), quickstart.md (M1–M7)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Looks and home-screen icons are checked manually (IV exception)
with quickstart M1–M7.

**Organization**: US1 (exercise mascot, P1), US2 (summary mascot, P2) and US3 (app icon, P2).
US1 and US2 share the `Mascot` component (Foundational). US3 is independent.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2, US3)

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`. No new
  packages are needed.
- **Dev server**: ask the user to run `npm run dev` (http://localhost:5173), then drive Chrome
  against it. Save the user's dev `localStorage` before a check and restore it afterwards.
- **Design**: docs/design/mascot.md; drawings in docs/design/mascot/; icons in
  docs/design/app-icon/; mockups 03–09 in docs/design/mockups/.
- **Do not change**: the mascot SVG files' contents (copy them byte for byte), prompt `<h2>`
  text/role, feedback sheet, focus behaviour, grading, store, persistence (FR-006, FR-010).
- tests/unit/theme.test.ts (011) scans only `src/**/*.css`. The mascot's green leaves are inside
  the SVG files, so they don't trip it.

---

## Phase 1: Setup

- [X] T001 Record the baseline: `npm test`, `npm run build`, `npm run test:pwa` pass counts under this task
  - **Baseline (2026-11-04)**: same code as the 011 final gate on main: `npm test` 632 passed; `npm run test:pwa` 26 passed
- [X] T002 Copy docs/design/mascot/mascot-{idle,sad,happy,celebrate}.svg unchanged into src/assets/mascot/ (create the folder); confirm with `cmp`
  - **Result**: 4 files copied, `cmp` identical

---

## Phase 2: Foundational

- [X] T003 Create src/components/Mascot.tsx (research R2): `export type MascotExpression = 'idle' | 'sad' | 'happy' | 'celebrate'`. Import the four SVG URLs from `../assets/mascot/`. Default export `Mascot({ expression, className })` renders `<img src={…} alt="" aria-hidden="true" draggable={false} className={className} data-expression={expression} />`
- [X] T004 In vite.config.ts change the workbox `globPatterns` to `['**/*.{js,css,html,woff2}', 'assets/*.svg']` (research R4). Run `npm run build` and check that dist/sw.js lists the four hashed `assets/mascot-*.svg` and `icon.svg` once each
  - **Result**: first try `**/*.{…,svg}` precached `icon.svg` twice (caught by the existing "lists each file only once" test); narrowed to `assets/*.svg` (research R4 correction). Precache 16 entries, 538.70 KiB

---

## Phase 3: User Story 1 – Mascot on exercise screens (Priority: P1) 🎯 MVP

**Goal**: The idle/sad/happy mascot replaces the prompt icon, and the prompt is a bubble with a
tail (FR-001–FR-003, FR-006, FR-007, FR-010; contract C1, C2, C4).

**Independent Test**: Play a lesson. The mascot is idle, turns sad or happy on Check, and is idle
on the next exercise.

- [X] T005 [US1] In src/components/MultipleChoice.tsx replace the `promptIcon` span and `DropIcon` with `<Mascot expression={result === 'wrong' ? 'sad' : result === 'correct' ? 'happy' : 'idle'} className={styles.promptMascot} />`. Remove the DropIcon import, and remove `DropIcon` from src/components/icons.tsx if nothing else uses it (grep)
  - **Result**: shared `exerciseExpression(result)` helper in Mascot.tsx maps result → expression for both exercises; `DropIcon` removed (no other use)
- [X] T006 [US1] In src/components/WordBank.tsx add an optional prop `result?: 'correct' | 'wrong'` (same doc comment as MultipleChoice) and replace the `promptIcon` span and `BubbleIcon` with the same `Mascot` expression mapping. Remove the BubbleIcon import (keep `BubbleIcon` in icons.tsx: the lesson path uses it)
- [X] T007 [US1] In src/components/ExerciseScreen.tsx pass the same `result` value given to MultipleChoice to `<WordBank … />`
- [X] T008 [US1] In src/components/Exercise.module.css (research R6):
  - `.promptRow` → `align-items: flex-end; gap: 16px`;
  - replace `.promptIcon` with `.promptMascot { flex-shrink: 0; width: 88px; height: 100px; }`;
  - `.prompt` gets `position: relative; min-width: 0; overflow-wrap: anywhere;`;
  - add `.prompt::before`: a 14 × 14 px square, `position: absolute`, left edge at `-9px`, `top: 50%`, `transform: translateY(-50%) rotate(45deg)`, `background: var(--bg)`, `border-left` and `border-bottom` `2px solid var(--line)`.

  Compare against mockup 03.

**Checkpoint**: US1 complete.

---

## Phase 4: User Story 2 – Celebrating mascot on the summary (Priority: P2)

**Goal**: The celebrate mascot replaces the star badge (FR-004; contract C3).

- [X] T009 [US2] In src/components/LessonSummary.tsx replace the `.badge` div (with `.badgeCoin` and `StarIcon`) with `<Mascot expression="celebrate" className={styles.summaryMascot} />`, and drop `StarIcon` from the import
- [X] T010 [US2] In src/components/Exercise.module.css remove the now-unused `.badge` and `.badgeCoin` rules (grep first), and add `.summaryMascot { width: 170px; height: auto; }`. Centring comes from the existing `.summary` column; check that it is centred like mockup 07

**Checkpoint**: US2 complete.

---

## Phase 5: User Story 3 – Mascot app icon (Priority: P2)

**Goal**: The tab and installed-app icons are the mascot (FR-008; contract C5).

- [X] T011 [P] [US3] Copy the five files from docs/design/app-icon/ over the ones in public/ (`icon.svg`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`, `apple-touch-icon-180x180.png`); confirm with `cmp`
  - **Result**: 5 files copied, `cmp` identical
- [X] T012 [P] [US3] In pwa-assets.config.mjs replace the top comment: the icons are hand-made in docs/design/app-icon/ (with different mascot scales per purpose) and are copied into public/, so don't regenerate them with this config. Set `background` to `'#16151f'` so an accidental run is at least on-brand. In README.md, update the `public/` line about regenerating PNGs to match

**Checkpoint**: US3 complete.

---

## Phase 6: Tests (after the code, Constitution IV)

- [X] T013 [P] In tests/integration/lessonFlow.test.tsx add `describe('mascot (feature 012)')`, using a helper `mascot = () => document.querySelector('img[data-expression]')`:
  - on a multiple-choice exercise the mascot is `idle` and has `alt=""`;
  - after a wrong Check it is `sad`, and after Continue the next exercise shows `idle`;
  - after a right Check it is `happy`;
  - on a word-bank exercise (play until one) the same idle/happy/sad rules hold;
  - `screen.queryAllByRole('img')` does not include the mascot;
  - finishing the lesson shows `celebrate` on the summary.

  Reuse the file's existing `answer`, `startLesson`, `completeLesson` and `playUntil`-style helpers
- [X] T014 [P] In tests/integration/practiceFlow.test.tsx add one test: in a practice session the mascot is `idle`, turns `happy` or `sad` with the answer, and the practice summary shows `celebrate`
- [X] T015 [P] Check tests/integration/wordBank.test.tsx (it renders WordBank directly): it must still compile and pass without passing `result`. Add one test: rendering with `result="wrong"` shows the `sad` mascot
  - **Result**: existing tests pass without `result` (optional prop); added the idle → sad rerender test
- [X] T016 [P] In tests/build/pwa.test.ts add:
  - (a) dist/sw.js precaches four `assets/mascot-(idle|sad|happy|celebrate)-*.svg` files, and each exists in dist/;
  - (b) each of the five public icons in dist/ is byte-identical to its docs/design/app-icon/ source;
  - (c) `icon.svg` appears exactly once in the precache list.

  Update existing assertions only where the new svg pattern changes counts
- [X] T017 Run `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa`; all pass. Record the counts under this task
  - **Result (2026-11-04)**: `npm test` 637 passed (+5); lint clean; build ok (precache 16 entries, 538.70 KiB); `npm run test:pwa` 29 passed (+3)
  - **Flaky**: in 1 of 5 full runs the existing test "first lesson flow > browser Back from a lesson discards the session" failed. It passed in 3 isolated runs of the file and in the other 4 full runs. It looks like a timing flake under load, not a 012 regression; left as is and noted
- [ ] T018 Manual check: ask the user to run `npm run dev`, then in Chrome run quickstart M1–M6 against mockups 03–07 and 09. Record the results under this task. On a mismatch, fix the CSS and re-check

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Update README.md where the exercise screens or summary are described: mention the mascot that reacts to answers and the mascot app icon
- [ ] T020 [P] Update docs/design/mascot.md and docs/design/ui-redesign.md line 14: say the mascot is implemented in `specs/012-mascot-app-icon/`, and record the open-point defaults (instant switch, no mascot on path/intro, no name)
- [ ] T021 Ask the user to run quickstart M7 on a phone (Constitution V); record the results under this task. The owner may waive it (Principle IV): then mark `[~]` with the date and "owner decision", and name it in spec.md **Status**
- [ ] T022 Set spec.md **Status** to `Implemented` (or `Implemented (…)` naming any waived check). In ROADMAP.md move 012 from **In progress** to **Done** as a short summary with its specs path; leave **In progress** as `(none)`
- [ ] T023 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass; record the counts vs. T001 under this task

---

## Dependencies & Execution Order

- **Setup**: T001 → T002
- **Foundational**: T003 (needs T002), T004 (needs T002); in parallel
- **US1**: T005, T006 (need T003; different files, parallel) → T007 (needs T006) → T008
- **US2**: T009 (needs T003) → T010 (same CSS file as T008, so after it)
- **US3**: T011, T012 any time after T001
- **Tests**: T013–T016 after their code; T017 after all; T018 after T017
- **Polish**: T019, T020 parallel after T018; T021 → T022 → T023 last

## Parallel Example

```text
After T003:  T005 (MultipleChoice.tsx) ‖ T006 (WordBank.tsx) ‖ T009 (LessonSummary.tsx) ‖ T011 (public/ icons)
After code:  T013 ‖ T014 ‖ T015 ‖ T016 (different test files)
```

## Implementation Strategy

- **MVP**: US1 (T001–T008): the exercise mascot with reactions.
- **Then**: US2 (summary), US3 (icons), tests, manual check, polish.
