---

description: "Task list for feature 004: Dark Duolingo-Style UI Redesign"
---

# Tasks: Dark Duolingo-Style UI Redesign

**Input**: Design documents from `/specs/004-ui-redesign/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R12), data-model.md,
contracts/ui-screens.md (S1–S5), contracts/app-identity-changes.md, quickstart.md (V1–V13, D1–D3)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Visual match, contrast, safe areas and device look cannot be
simulated in jsdom and are validated manually with quickstart.md (IV exception), results
recorded under the matching task.

**Organization**: Tasks are grouped by user story: US1 (P1, lesson play), US2 (P2, lesson
path), US3 (P3, lesson complete).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2, US3)

## Path Conventions

Single frontend project: `src/`, `public/`, `tests/`, `index.html`, `vite.config.ts` at the
repository root. Run commands from the repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only); allow network access to `registry.npmjs.org` for that command.
- **Dev/preview server**: a server started from the sandbox is not reachable from Chrome. Ask
  the user to run `npm run dev` (http://localhost:5173) or `npm run build && npm run preview`
  (http://localhost:4173) themselves, then drive Chrome against it.
- **Source of truth for looks**: the PNGs in `docs/design/mockups/` (390×844 at 2×) and the
  tokens, type and shape rules in `docs/design/ui-redesign.md`. Open the matching mockup with
  the Read tool before styling a screen.
- **Texts and accessible names** are fixed by `contracts/ui-screens.md`; tests query by them.

---

## Phase 1: Setup

**Purpose**: Baseline and static assets

- [X] T001 Run `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa`; all must pass before any change. Record under this task the test count and the total size of the precached files (sum of the `dist/` files listed in `dist/sw.js` precache) for comparison in T029
  - **Result (2026-11-03)**: all pass; 428 unit/integration tests, 19 build tests; precache 10 entries, 389.56 KiB
- [X] T002 Fetch the font: in `$TMPDIR`, run `npm_config_cache="$TMPDIR/npm-cache" npm pack @fontsource-variable/nunito@5.3.0` and extract it; copy `package/files/nunito-latin-wght-normal.woff2` and `package/files/nunito-latin-wght-italic.woff2` to `public/fonts/`, and `package/LICENSE` to `public/fonts/OFL.txt` (research R1). Do **not** add the package to package.json
  - **Result**: copied from @fontsource-variable/nunito 5.3.0: normal 38.2 KB, italic 40.8 KB, OFL.txt

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Dark tokens, font, shared layout, icons and app identity that every screen uses

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Rewrite the theme in src/index.css (research R1, R3, R4; design reference "Tokens" and "Type and shape"):
  - Replace all `--color-*` variables and **delete** the `@media (prefers-color-scheme: dark)` block. Define on `:root` one variable per token of `docs/design/ui-redesign.md`, named `--bg #131F24`, `--text #EEF2F4`, `--text-muted #9AA8B0`, `--line #2E3D45`, `--line-deep #1E2A30`, `--primary #0B7F63`, `--primary-deep #075E49`, `--primary-text #3DDBA6`, `--primary-text-strong #7FF0C8`, `--primary-tint #17392F`, `--grammar-tint #18302A`, `--success-tint #163A2E`, `--error #D62F3A`, `--error-deep #A3141F`, `--error-text #FF8A92`, `--error-tint #3A1B1F`, `--gold #F2B705`, `--gold-deep #C79600`, `--gold-ink #5A4300`, `--gold-ink-label #4A3700`, `--gold-tint #3D3214`, `--gold-tag-text #FFD666`, `--icon-muted #8C9AA2`
  - Add `color-scheme: dark`; two `@font-face` rules (`font-family: 'Nunito'`, `src: url('/fonts/nunito-latin-wght-normal.woff2') format('woff2')` / the italic file with `font-style: italic`, `font-weight: 200 1000`, `font-display: swap`); `:root` font `'Nunito', system-ui, sans-serif`, weight 600, body 15px
  - Keep `touch-action`, `text-size-adjust`, `box-sizing`; `body` background `var(--bg)`, color `var(--text)`
  - `#root`: keep `max-width: 600px; margin: 0 auto` but **remove its padding** (it moves into screens)
  - Add layout classes: `.screen` (flex column, `min-height: 100dvh`); `.screen-body` (`flex: 1`, padding `max(16px, env(safe-area-inset-top))` top, `max(20px, env(safe-area-inset-left/right))` sides, 24px bottom); `.bottom-bar` (`position: sticky; bottom: 0`, background `var(--bg)`, top border `2px solid var(--line)`, padding `16px max(20px, safe-area sides) calc(28px + env(safe-area-inset-bottom))`)
  - `.primary-button`: full width, `min-height: 52px`, radius 14px, background `var(--primary)`, `border-bottom: 5px solid var(--primary-deep)`, white uppercase 17px/900 text with letter-spacing; `:active` moves down 2px and shrinks the edge; `.primary-button.danger` uses `--error`/`--error-deep`; disabled: background `var(--line)`, edge `var(--line-deep)`, text `var(--text-muted)`, no opacity change
  - `.text-button` (for "Replay lesson"): no background/border, `var(--primary-text)`, uppercase 15px/900, `min-height: 44px`, full width
  - `.label`: 13px/900 uppercase, letter-spacing 0.08em
  - Focus: `:focus-visible { outline: 3px solid var(--primary-text); outline-offset: 2px }`
  - `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important } }` (FR-022)
  - To keep the home screen padded until US2, add `className="screen-body"` to the root `<div>` of src/components/LessonList.tsx
  Run `npm test` and `npm run lint`
- [X] T004 [P] Create src/components/icons.tsx (research R6): export `CloseIcon`, `CheckIcon`, `StarIcon`, `LockIcon`, `DropIcon`, `BubbleIcon`, `WrongIcon`, each `(props: { size?: number }) => <svg>` with `viewBox="0 0 24 24"`, `width`/`height` = `size ?? 24`, `aria-hidden="true"`, `focusable="false"`, drawn with original simple paths using `currentColor` (stroke icons: `fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"`; `StarIcon` filled). Shapes: X; check mark; five-point star; padlock (rounded body + shackle); water drop with a small inner highlight curve; square speech bubble with a tail at bottom-left (mockup 05); `WrongIcon` = bold X for use inside the red circle
- [X] T005 [P] Dark app identity (research R3, contracts/app-identity-changes.md): in index.html replace the two `theme-color` metas with `<meta name="theme-color" content="#131F24" />` and add `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`; in vite.config.ts set manifest `background_color` and `theme_color` to `'#131F24'` and Workbox `globPatterns` to `['**/*.{js,css,html,woff2}']`
- [X] T006 Update tests/build/pwa.test.ts for T005 (after T002, T005): expect manifest `background_color` and `theme_color` `'#131F24'`; expect exactly one `theme-color` meta with content `#131F24` and no `media` attribute; expect the `apple-mobile-web-app-status-bar-style` meta with `black-translucent`; add a test that `fonts/nunito-latin-wght-normal.woff2` and `fonts/nunito-latin-wght-italic.woff2` exist in `dist/` and are in the precache list. Update the header comment to reference this feature's contract as well. Run `npm run build && npm run test:pwa`
  - **Result**: 20 build tests pass; precache 12 entries, 470.17 KiB
- [X] T007 [P] Update specs/003-pwa-offline-mobile/contracts/app-identity.md: change the `background_color`, `theme_color`, `theme-color` meta and status-bar-style rows to the "After (004)" values of specs/004-ui-redesign/contracts/app-identity-changes.md, each with "(changed by 004)"

**Checkpoint**: App is dark with Nunito everywhere (old layouts, new colors); all suites pass

---

## Phase 3: User Story 1 - Play a lesson in the new look (Priority: P1) 🎯 MVP

**Goal**: Intro, exercises and feedback match mockups 02–06; lesson behavior unchanged

**Independent Test**: Open any unlocked lesson, play it to the end with at least one wrong answer, and compare each screen with mockups 02–06 (quickstart V3–V6, V8)

### Implementation for User Story 1

- [X] T008 [US1] Restyle the intro in src/components/LessonIntro.tsx and src/components/LessonIntro.module.css (mockup 02, contract S2, FR-009): root `<div className="screen">`; inside `.screen-body`: close `button` with `aria-label="Back to lessons"` showing `<CloseIcon />` in `var(--icon-muted)` (44×44 target), overline `<p className="label">` with `{sourceLabel(lesson)} · {lesson.exercises.length} exercises` in `var(--primary-text)`, `h1` title 30px/900, `h2` "New words" 20px/900, the `dl` as a 2-column grid (gap 12px) of word cards (border `2px solid var(--line)`, `border-bottom-width: 4px`, radius 16px, padding 14px 16px; `dt` 22px/900 `var(--primary-text)`, `dd` margin 0, `var(--text-muted)` 15px/700), grammar `section` as a card (background `var(--grammar-tint)`, radius 16px, padding 18px 20px; `h2` `var(--primary-text-strong)` 20px/900; paragraphs 17px line-height 1.55); then `<div className="bottom-bar">` with the Start `primary-button`. Keep the existing ids/`aria-labelledby` and the no-autoFocus comment. Long words/meanings wrap (`overflow-wrap: anywhere`)
- [X] T009 [US1] Restructure the exercise screen in src/components/ExerciseScreen.tsx and src/components/Exercise.module.css (mockups 03/05, contract S3, FR-010): root `<div className="screen">`; a top bar inside `.screen-body` (flex row, gap 16px, align center): quit `button` `aria-label="Quit lesson"` with `<CloseIcon size={28} />` in `var(--icon-muted)` (44×44), the `<progress>` (keep `aria-label="Lesson progress"`, `value={done}`, `max={total}`) styled as a 16px-high rounded bar (track `var(--line)`, fill `var(--primary)`; style both `::-webkit-progress-bar`/`::-webkit-progress-value` and `::-moz-progress-bar`, `appearance: none`), and the position text `{Math.min(done + 1, total)}/{total}` in `var(--text-muted)` 17px/900. Layout (research R4; `.bottom-bar` must be a direct child of `.screen` for `position: sticky`): build the top bar as a `const topBar = <div className={styles.topBar}>…</div>` and pass it as a new `header: ReactNode` prop to MultipleChoice/WordBank. Each exercise component returns a fragment `<><div className="screen-body">{header}…its content…</div>{!disabled && <div className="bottom-bar">…Check…</div>}</>` (T010, T011). ExerciseScreen renders `<div className="screen">{exercise component}{showingFeedback && session.feedback && <FeedbackBanner …/>}</div>`, so the sheet (T012, itself a `.bottom-bar`) takes the Check bar's place. Pass `result={showingFeedback && session.feedback ? (session.feedback.correct ? 'correct' : 'wrong') : undefined}` to MultipleChoice (research R9)
- [X] T010 [US1] Restyle src/components/MultipleChoice.tsx (mockups 03/04, contract S3, FR-011, FR-012, research R5, R9) with styles in src/components/Exercise.module.css:
  - Instruction as `h1` (26px/900): `direction === 'en-tp'` → "Choose the Toki Pona", `'tp-en'` → "Choose the meaning" (data-model "Instruction text")
  - Prompt row: an icon tile (`aria-hidden`, 64×64, radius 16px, background `var(--primary-tint)`, color `var(--primary-text)`, `<DropIcon size={32} />`) and the prompt as `h2` in a bubble (border `2px solid var(--line)`, radius 16px, padding 12px 18px, 22px/800)
  - Options: keep `group` "Options" and `aria-pressed`; each card full width, `min-height: 56px`, radius 14px, border `2px solid var(--line)` with `border-bottom-width: 5px`, background `var(--bg)`, text 18px/800 left-aligned; a number badge `<span aria-hidden="true">` (32×32, radius 8px, border `2px solid var(--line)`, `var(--text-muted)` 15px/900) before the text. Selected: border `var(--primary-text)`, background `var(--primary-tint)`, text and badge `var(--primary-text)`. New optional prop `result?: 'correct' | 'wrong'`: when set, the selected option uses `data-result={result}`; `wrong` → border `var(--error)`, background `var(--error-tint)`, text/badge `var(--error-text)`; `correct` keeps the green selected look. Disabled options keep full opacity (override the global disabled opacity) except non-selected ones at 0.6
  - Number keys: `useEffect` adding a `keydown` listener on `window` (removed on cleanup, re-registered when `disabled`/`options` change): if `!disabled`, no `ctrlKey`/`metaKey`/`altKey`, and `event.key` is `'1'`–`'9'` with value ≤ `options.length`, call `setSelected(options[n - 1])`; never submit
  - Check: inside `<div className="bottom-bar">`, `primary-button`, only when `!disabled` (unchanged logic)
- [X] T011 [US1] Restyle src/components/WordBank.tsx (mockup 05, contract S3, FR-011, FR-013) with styles in src/components/Exercise.module.css:
  - Instruction `h1`: `direction === 'en-tp'` → "Write this in Toki Pona", `'tp-en'` → "Write this in English"; when `exercise.practisesGrammar`, a `<span className="label">Grammar</span>` tag beside it (background `var(--gold-tint)`, color `var(--gold-tag-text)`, radius 10px, padding 6px 12px; title row is flex with `justify-content: space-between`, `align-items: flex-start`)
  - Prompt row as in T010 but with `<BubbleIcon size={32} />`
  - Answer `group` "Your answer": `min-height` of two tile rows (2 × 56px + gap), background `repeating-linear-gradient` or two `border-bottom` lines in `var(--line)` so the tiles sit on two ruled lines; grows when tiles wrap
  - Tiles: `min-height: 48px`, padding 8px 16px, radius 12px, border `2px solid var(--line)` with `border-bottom-width: 4px`, 18px/800; placeholder: same size, background `var(--line)`, border transparent, text transparent (keep `aria-hidden`); bank centered with gap 10px
  - Check in a `.bottom-bar` as in T010
- [X] T012 [US1] Turn src/components/FeedbackBanner.tsx into the bottom sheet (mockups 04/06, contract S4, FR-015, FR-016, research R9) with styles in src/components/Exercise.module.css: root `<div className="bottom-bar">` plus a modifier class (`styles.sheetCorrect`: background `var(--success-tint)`, no top border; `styles.sheetWrong`: background `var(--error-tint)`); slide-in `@keyframes` from `translateY(100%)` over 200 ms (removed by the global reduced-motion rule). Content row: a 56px circle icon (`aria-hidden`; correct: background `var(--primary)` with white `<CheckIcon />`; wrong: background `var(--error)` with white `<WrongIcon />`) and the `role="status"` text. Correct text: `<strong>pona!</strong> Correct.` in `var(--primary-text-strong)` 24px/900. Wrong text: "Not quite" (26px/900) then "Correct answer:" (17px/800) and the answer (20px/800 on its own line), all `var(--error-text)`; the status element's text content must read "Not quite. Correct answer: <answer>" (use a visually hidden "." or put the period in a span; contract S4). Continue: `primary-button` with `autoFocus`, plus `danger` class when wrong
- [X] T013 [US1] Run `npm run lint` and `npm run build`; fix type/lint errors from T008–T012

### Tests for User Story 1

- [X] T014 [US1] Update tests/integration/lessonFlow.test.tsx for the changed texts of contract S2–S4 only (no behavior change): "n of total" → "n/total"; `status` "Correct!" → "pona! Correct."; "Wrong — correct answer: X" → "Not quite. Correct answer: X"; buttons "Quit" → "Quit lesson", intro "Back" → "Back to lessons". The `currentExercise()` helper still finds the prompt by `heading` level 2. Run `npm test`: every pre-existing test must pass
- [X] T015 [US1] Add tests to tests/integration/lessonFlow.test.tsx (new `describe('lesson screens (004 US1)')`):
  - intro shows the overline `${sourceLabel(lesson)} · ${n} exercises`, every new word and meaning, and "Back to lessons" returns to the list
  - multiple choice: instruction heading is "Choose the Toki Pona" or "Choose the meaning" according to `direction`
  - pressing `{1}`, `{2}` with `user.keyboard` sets `aria-pressed="true"` on the 1st/2nd displayed option of the group and enables Check; a key above the option count changes nothing; after Check (feedback shown) a number key changes nothing
  - after a wrong multiple-choice answer, the chosen option has `data-result="wrong"`; after a right one, `data-result="correct"`
  - a word-bank exercise with `practisesGrammar` shows the "Grammar" text and one without does not (find a lesson exercise of each kind via the content, play to it, or render the lesson whose first exercise matches)
  - focus moves to Continue when feedback appears (correct and wrong)
  Run `npm test` and `npm run lint`

### Validation for User Story 1

- [X] T016 [US1] With the user running the dev server, check quickstart V3–V6, V8 and V11 in Chrome device mode at 390×844 and 360×740 against mockups 02–06 (open each PNG with Read for side-by-side comparison; take screenshots with the browser tools). Fix differences in the files of T008–T012. Record each row's result under this task
  - **Result (2026-11-03)**: Chrome against `npm run preview`, window 500×667 (Chrome's minimum window width; DevTools device mode not available to the extension). V3 intro matches mockup 02, grammar card scrolls fully above the Start bar; V4 number keys 1/2 select, Check enables; V5 red sheet with chosen option red (mockup 04) and green sheet (mockup 06); V6 Grammar tag, tiles on ruled lines, grey placeholders (mockup 05). On the 667 px-tall window the feedback sheet makes the page scroll so Continue stays visible (fits at the mockup's 844 px). Not run here: V8 at 360 px and V11 reduced motion; moved to T027. Only known difference: mockup 02 bolds Toki Pona words inside the grammar text; the content is plain text, so no bold

**Checkpoint**: Lesson play fully restyled and tested; home and summary still old layout on dark tokens

---

## Phase 4: User Story 2 - Follow the course on a lesson path (Priority: P2)

**Goal**: Home screen matches mockup 01: top bar with counter, banner, zigzag node path, credit

**Independent Test**: With a few lessons completed, open the app, compare with mockup 01 and tap each kind of node (quickstart V1, V2)

### Implementation for User Story 2

- [X] T017 [US2] Rebuild src/components/LessonList.tsx and src/components/LessonList.module.css (mockup 01, contract S1, FR-005–FR-008, research R7, R8, R11, data-model "Derived values" and "Node states"):
  - Root `<div>` (remove the temporary `screen-body` class of T003) containing a top bar (sticky top, background `var(--bg)`, bottom border `2px solid var(--line)`, padding `max(16px, safe-area-top)` / `max(20px, safe-area sides)` / 14px): `h1` "duopona" (30px/900, `var(--primary-text)`, letter-spacing -0.02em) and a counter `<p aria-label={`${doneCount} of ${lessons.length} lessons done`}>` with `<BubbleIcon />` (`var(--primary-text)`) and `{doneCount} / {lessons.length}` (20px/900)
  - `doneCount` = `lessons.filter((l) => Object.hasOwn(completed, l.id)).length` (research R11)
  - Banner card (margin 16px 20px, background `var(--primary)`, `border-bottom: 5px solid var(--primary-deep)`, radius 18px, padding 18px 20px, white text): `<p className="label">Course · {doneCount} of {lessons.length} done</p>`, `<p>` "Learn Toki Pona" 30px/900, `<p>` "Following <cite>Toki Pona: The Language of Good</cite>" 17px/700 (cite italic)
  - Path: keep `<ul>`/`<li>` in course order; each item centered, shifted by `style={{ '--offset': OFFSETS[index % 8] } as React.CSSProperties}` with `const OFFSETS = [0, 1, 2, 1, 0, -1, -2, -1]` and CSS `transform: translateX(calc(var(--offset) * 44px))`; vertical gap 28px
  - State per lesson: `completed` if `completed[lesson.id]`; else `current` if `selectIsUnlocked(lesson.id)({ progress })`; else `locked`. Node: 76×70 circle (`border-radius: 50%`, `border-bottom: 7px solid`): completed background `var(--gold)`/edge `var(--gold-deep)` with `<CheckIcon size={34} />` in `var(--gold-ink)`; current background `var(--primary)`/edge `var(--primary-deep)` with white `<StarIcon size={34} />`, ring `box-shadow: 0 0 0 10px var(--bg), 0 0 0 16px var(--primary-tint)` (or an outline) and above it a "Start" pill (`label`, `var(--primary-text)`, border `2px solid var(--line)`, radius 12px, padding 8px 14px, 44px tall); locked background `var(--line)`/edge `var(--line-deep)` with `<LockIcon size={30} />` in `var(--icon-muted)`. Title under the node, max-width 180px, centered, 17px/800: `var(--text)` for current, `var(--text-muted)` otherwise
  - Completed and current: `<Link to={`/lesson/${lesson.id}`} aria-label=…>` wrapping pill (current only), node and title; locked: `<div role="link" aria-disabled="true" aria-label=…>`. Labels: completed `${title}, completed, ${firstTryCorrect} of ${total}`; current `${title}, start`; locked `${title}, locked`
  - Scroll: `const currentRef = useRef<HTMLAnchorElement>(null)` on the current link; `useEffect(() => { currentRef.current?.scrollIntoView?.({ block: 'center' }) }, [])`
  - Keep the credit `footer` unchanged in text and link, with side padding and `max(24px, safe-area-bottom)` bottom padding; footer link color `var(--primary-text)`
  - Remove now-unused classes (`card`, `number`, `meta`, `badge`, `lockedNote`, `done`) from the CSS module
- [X] T018 [US2] Run `npm run lint` and `npm run build`; fix errors

### Tests for User Story 2

- [X] T019 [US2] Update tests/integration/lessonFlow.test.tsx for the path (contract S1): replace the `card(title)` helper with one returning the node element by accessible name prefix, e.g. `screen.getByRole('link', { name: new RegExp(`^${escape(title)}, `) })`; heading "Duopona" → "duopona"; tests that read "Completed · X/Y" or "Locked" text now assert the node's accessible name (`, completed, X of Y` / `, locked` / `, start`). In `tests/setup.ts` stub `Element.prototype.scrollIntoView = vi.fn()` if not defined (jsdom lacks it). Run `npm test`: all pre-existing behavior tests pass
- [X] T020 [US2] Add tests to tests/integration/lessonFlow.test.tsx (`describe('lesson path (004 US2)')`): new learner → counter named "0 of 17 lessons done", text "Course · 0 of 17 done", lesson 1 is ", start", lessons 2–17 ", locked"; after completing lesson 1 → "1 of 17 lessons done", lesson 1 ", completed, X of Y", lesson 2 ", start"; with all 17 completed in saved progress (write `localStorage` under `STORAGE_KEY` before render, as existing tests do) → no ", start" node and counter "17 of 17 lessons done"; saved progress containing an unknown lesson id does not raise the count; `scrollIntoView` is called on the current node on open. Run `npm test` and `npm run lint`

### Validation for User Story 2

- [X] T021 [US2] With the user running the dev server, check quickstart V1 and V2 in Chrome at 390×844 and 360×740 against mockup 01 (Read the PNG; screenshot the page), including the long titles at 360 px (no horizontal scroll, labels wrap). Fix differences in T017's files. Record results under this task
  - **Result (2026-11-03)**: V1 matches mockup 01 (wordmark, "1 / 17", banner, gold/current/locked nodes); V2 with 2 lessons done the page opens scrolled to the current node "You and I"; no horizontal scroll at 500 px; keyboard focus ring visible on nodes

**Checkpoint**: Home path complete and tested

---

## Phase 5: User Story 3 - Celebrate the end of a lesson (Priority: P3)

**Goal**: Summary matches mockup 07 with Continue and Replay

**Independent Test**: Finish a lesson that has a next lesson, compare with mockup 07, use both buttons (quickstart V7)

### Implementation for User Story 3

- [X] T022 [US3] Rebuild src/components/LessonSummary.tsx (mockup 07, contract S5, FR-017, FR-018, research R10) with styles in src/components/Exercise.module.css: props `{ lessonTitle: string; nextLessonTitle?: string; firstTryCorrect: number; total: number; onContinue: () => void; onReplay: () => void }`. Root `.screen`; body centered: badge (`aria-hidden`; 148px circle `var(--gold-tint)` containing a 104px gold circle with `border-bottom: 8px solid var(--gold-deep)` and white `<StarIcon size={44} />`), `h1` "Lesson complete!" 32px/900 `var(--primary-text)`, `<p>` lesson title 20px/800 `var(--text-muted)`, a 2-column card row (gap 16px; a single card spans both columns when there is no next lesson): "Correct" card (border `3px solid var(--gold)`, radius 16px; header strip background `var(--gold)` with `label` "Correct" in `var(--gold-ink-label)`; body `{firstTryCorrect} / {total}` 34px/900) and, only when `nextLessonTitle`, "Unlocked" card (border `var(--primary-text)`, header `var(--primary)` with white `label` "Unlocked"; body the title 22px/900). Bottom bar: `primary-button` "Continue" with `autoFocus` → `onContinue`; `text-button` "Replay lesson" → `onReplay`
- [X] T023 [US3] Update src/routes/LessonRoute.tsx: compute `const index = lessons.findIndex((l) => l.id === lesson.id)` and `const next = lessons[index + 1]` (import `lessons` from '../content/lessons'); render `<LessonSummary lessonTitle={lesson.title} nextLessonTitle={next?.title} … onContinue={goHome} onReplay={() => setStartedId(null)} />`. Run `npm run lint` and `npm run build`

### Tests for User Story 3

- [X] T024 [US3] Update and extend tests/integration/lessonFlow.test.tsx (`describe('lesson complete (004 US3)')`): replace "You got X of Y right on the first try." and "Back to lessons" expectations in existing tests with "Correct" + "X / Y" and "Continue"; new tests: finishing lesson 1 shows "Lesson complete!", lesson 1's title, "Unlocked" and lesson 2's title, and Continue is focused; Continue shows the path with lesson 1 completed; "Replay lesson" shows lesson 1's introduction (Start button, "New words") and playing it again works and updates the score; finishing the last lesson (saved progress with lessons 1–16 completed, then play lesson 17) shows no "Unlocked" text. Run `npm test` and `npm run lint`

### Validation for User Story 3

- [X] T025 [US3] With the user running the dev server, check quickstart V7 against mockup 07 at 390×844 and 360×740. Fix differences in T022's files. Record results under this task
  - **Result (2026-11-03)**: V7 matches mockup 07 (badge, "Correct 11 / 13", "Unlocked You and I"); Replay lesson opens the intro; closing returns to the path showing 2 / 17

**Checkpoint**: All three stories done and tested

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T026 Quickstart V9 (contrast): for every text/icon color pair in use (body, muted text on `--bg`, white on `--primary`, labels on gold/green strips, `--error-text` on `--error-tint`, `--primary-text-strong` on `--success-tint` and `--grammar-tint`, `--gold-tag-text` on `--gold-tint`, `--icon-muted` on `--bg`, `--gold-ink` on `--gold`) compute the WCAG contrast ratio (a short node script with the relative-luminance formula is fine, run once, not committed). Body text must be ≥ 4.5:1, text ≥ 24px or ≥ 19px bold and icons ≥ 3:1 (FR-004). Adjust a failing token in src/index.css and note the change in docs/design/ui-redesign.md "Tokens". Record the lowest ratio under this task
  - **Result (2026-11-03)**: 20 pairs checked with a one-off script; no token changed. Lowest required pairs: `--icon-muted` lock on `--line` 3.88:1 (icon, min 3), `--text-muted` on `--line` (disabled button) 4.60:1, white on `--error` 4.85:1, white on `--primary` 4.96:1. One pair is below 3:1: the white star on the gold summary badge (1.82:1); the badge is decorative (`aria-hidden`, the "Lesson complete!" heading carries the meaning), so it is kept white as in mockup 07. Owner may switch it to `--gold-ink` (5.16:1)
- [~] T027 Quickstart V10, V12, V13 with the user running `npm run build && npm run preview`: keyboard-only pass through all screens; light color scheme emulated still dark; offline reload keeps Nunito and the network panel shows no third-party request. Fix failures; record results under this task
  - **Won't do (2026-11-03)**: owner decision; will raise an issue if a problem shows up
  - **Partial (2026-11-03)**: in Chrome: Nunito normal + italic loaded, every request goes to `localhost:4173` only, both font files present in the Workbox precache, focus ring visible on dark background. Still to do by the owner in DevTools: V8 (360×740 device mode), V11 (emulate reduced motion), V12 (emulate light scheme; no light styles exist in the CSS), V13 offline reload
- [X] T028 [P] Update README.md: mention the dark design and `docs/design/ui-redesign.md`; under "Project layout" mention `public/fonts/` (Nunito, SIL OFL, `OFL.txt`) and `src/components/icons.tsx`
- [X] T029 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass; compare the precached size with T001 (expected growth ≈ 81 KB plus CSS) and record it under this task
  - **Result (2026-11-03)**: `npm test` 444 passed (was 428), lint clean, build OK, `npm run test:pwa` 20 passed (was 19). Precache 12 entries, 481.67 KiB (was 10 entries, 389.56 KiB: +92 KiB = fonts 79 KB + CSS/JS)
- [~] T030 Ask the user to run quickstart D1–D3 on an iPhone (Safari) and an Android phone (Chrome), in the browser and installed, ideally in the same session as 003's open T016–T021 (see specs/003-pwa-offline-mobile/tasks.md and quickstart). Record device, OS/browser versions and each row's result under this task
  - **Won't do (2026-11-03)**: owner decision; will raise an issue if a problem shows up
  - **Partial (2026-11-03, via 005 T012)**: on the public address, the owner reports on both an iPhone and an Android phone: lesson path loads over HTTPS, a lesson plays, the app installs and works, a lesson plays in airplane mode, reload and a bookmarked lesson address work. Device model, OS/browser versions and the remaining rows (D1–D3 as written) not yet recorded
- [~] T031 Fix every failure from T030 in the file responsible (layout/safe areas: src/index.css or the component's CSS module; identity: index.html or vite.config.ts); re-run T029 after any change
  - **Won't do (2026-11-03)**: owner decision; will raise an issue if a problem shows up
- [X] T032 Set spec.md **Status** to `Implemented` (or `Implemented (pending: …)` naming any open manual check); update ROADMAP.md: move the UI redesign to **Done** as `**004 – UI redesign**: dark Duolingo-style screens (\`specs/004-ui-redesign/\`).` only when T016, T021, T025–T027 and T030 are recorded, otherwise update its status line with what remains

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 first; T002 any time before T003/T006
- **Foundational (Phase 2)**: needs T002; blocks all stories. T004, T005, T007 parallel; T006 after T005 (and T002)
- **US1 (Phase 3)**: after Phase 2
- **US2 (Phase 4)**: after Phase 2; independent of US1 (different files) except both edit tests/integration/lessonFlow.test.tsx, so run their test tasks one after the other
- **US3 (Phase 5)**: after Phase 2; T022 shares src/components/Exercise.module.css with US1, so do it after T012 if working in parallel
- **Polish (Phase 6)**: after all stories; T030–T031 need the user and real phones

### Within Each Story

- Implementation → lint/build → tests (Constitution IV: tests after code) → manual validation
- Tasks on the same file run in order (T009 → T010 → T011 → T012 share Exercise.module.css)

### Parallel Opportunities

- Phase 2: T004 (icons.tsx), T005 (index.html, vite.config.ts), T007 (003 contract) together
- US2's T017 (LessonList files) can run alongside US1's T008–T012
- T028 (README) alongside T026–T027

---

## Parallel Example: Foundational

```text
Task: "T004 Create src/components/icons.tsx"
Task: "T005 Dark app identity in index.html and vite.config.ts"
Task: "T007 Update specs/003-pwa-offline-mobile/contracts/app-identity.md"
```

## Parallel Example: US1 alongside US2

```text
Task: "T008 Restyle src/components/LessonIntro.tsx and LessonIntro.module.css"
Task: "T017 Rebuild src/components/LessonList.tsx and LessonList.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2: dark tokens, font, icons, identity
2. Phase 3 (US1): lesson play in the new look
3. **STOP and VALIDATE**: T016 against mockups 02–06; the app is usable and consistent enough to ship

### Incremental Delivery

1. Setup + Foundational → dark app, old layouts
2. US1 → lesson play restyled (MVP)
3. US2 → home path
4. US3 → summary with Replay
5. Polish → contrast, keyboard/offline checks, phones (with 003's open checks)

---

## Notes

- No store, content or `localStorage` changes in any task (FR-019); if a task seems to need one, stop and revisit the plan
- Keep every interactive target ≥ 44×44 px and every screen free of horizontal scroll at 360 px
- Commit after each phase or logical group
