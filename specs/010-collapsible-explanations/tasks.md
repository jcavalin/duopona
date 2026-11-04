---

description: "Task list for feature 010: Collapsible Mistake Explanations"
---

# Tasks: Collapsible Mistake Explanations

**Input**: Design documents from `/specs/010-collapsible-explanations/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R9), data-model.md,
contracts/ui-feedback-sheet.md (C1–C4), quickstart.md (M1–M5)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Layout (60% cap, card scroll, 360 px, mockup match) is validated
manually (IV exception) with quickstart M1–M5 (with M2b), results recorded under the matching task.

**Organization**: One user story (US1, P1). Every implementation task edits the feedback sheet,
so tasks run mostly in order.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1)

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
- **Design**: mockups `docs/design/mockups/04a-wrong-explanation-hidden.png` and
  `04b-wrong-explanation-shown.png`; colour values in `docs/design/ui-redesign.md` (open points,
  "Mistake explanation toggle"). Ignore the purple theme and the mascot in the mockups (later
  roadmap items).
- **Do not change** `src/content/explanations.ts` (`explainMistake`), course content, the session
  store, grading or persistence (FR-008).
- **Keep** `ref={focusOnMount}` on Continue (focus without scrolling) and its accessible name
  "Continue".
- `ExerciseScreen` mounts `FeedbackBanner` only while the session is in `feedback`, so local state
  resets for every answer (R1). Don't add a Redux field for it.

---

## Phase 1: Setup

- [X] T001 On branch `010-collapsible-explanations`, run `npm test` and `npm run lint` and record the passing test count under this task as the baseline (ROADMAP.md already lists 010 under **In progress**)
  - **Result (2026-11-04)**: baseline `npm test` 595 passed; lint clean

---

## Phase 2: Foundational

- [X] T002 [P] In src/index.css, in the `:root` token block next to the `--error*` tokens, add (R6):
  - `--explain-toggle-border: #6b2b32;`
  - `--explain-toggle-pressed: #4a2328;`
  - `--explain-toggle-text: #ffc2c6;`
  - `--explain-bg: #2a1316;`
  - `--explain-border: #5a262c;`
  - `--explain-text: #ffd9db;`
  - `--explain-source: #e7a3a8;`

  Add a short comment: "Mistake explanation toggle and card (010, mockups 04a/04b)".
- [X] T003 [P] In src/components/icons.tsx add `export function ChevronDownIcon(props: IconProps)` using the existing `Stroke` helper with path `<path d="M6 9l6 6 6-6" />` (R5)

---

## Phase 3: User Story 1 - Explanation hidden until asked for (Priority: P1) 🎯 MVP

**Goal**: After a wrong answer the sheet shows "Not quite", the correct answer, a "Why?" toggle
and Continue. The toggle reveals the unchanged 008 explanation in a card (mockups 4a/4b).

**Independent Test**: Answer "good water" (second lesson on the path, `nouns-and-adjectives`, book chapter "Lesson 3") wrong. Only the answer and "Why?" show. Tap
it: "Hide" and the card with telo/pona meanings and the grammar point appear.

### Implementation

- [X] T004 [US1] Rework src/components/FeedbackBanner.tsx (contract C1–C3, R1–R3, R7):
  - **State**: `const [open, setOpen] = useState(false)`; `const cardId = useId()`.
  - **Empty explanation**: compute `hasExplanation` = explanation non-null and
    (`words.length > 0 || wrongPick || grammar`). Move this emptiness check out of
    `ExplanationBlock`.
  - **Heading row** (`styles.sheetRow`): the icon, the `role="status"` div (now holding only the
    title, "Correct answer:" and the answer), then, when `!correct && hasExplanation`, a
    `<button type="button">` with:
    - `className={styles.explainToggle}`, `aria-expanded={open}`, `aria-controls={cardId}`;
    - `onClick={() => setOpen((o) => !o)}`;
    - content: `<span>{open ? 'Hide' : 'Why?'}</span><ChevronDownIcon size={20} />`.
  - **Card**: after the row and before Continue, when `!correct && hasExplanation`, render
    `<div id={cardId} className={styles.explain} hidden={!open}>`. Inside it goes
    `ExplanationBlock`'s content, outside the status region.
  - **Source line**: render it as `From {grammar.lesson}` (e.g. "From Lesson 4 · You and I").
  - **Divider**: give the grammar block an extra class `styles.explainGrammarDivided` when
    `words.length > 0 || wrongPick`.
  - **Unchanged**: the content and its order (words list, wrong pick, grammar title, source, note).
  - **Doc comment**: update the component comment to cite 010 contract C1–C3.
- [X] T005 [US1] Update src/components/Exercise.module.css (contract C4, R4, R8):
  - **`.sheet`**: `max-height: max(60dvh, 360px)`.
  - **`.sheetRow`**: change `flex: 1 1 auto; min-height: 0; overflow-y: auto` to `flex: none`.
    Keep `margin-bottom: 16px`.
  - **New `.explainToggle`**:
    - `flex-shrink: 0`, inline-flex, centred, `gap: 6px`;
    - `min-height: 48px; min-width: 44px; padding: 8px 14px`;
    - `border: 2px solid var(--explain-toggle-border); border-bottom-width: 4px; border-radius: 12px`;
    - `background: transparent; color: var(--explain-toggle-text)`;
    - `font: inherit; font-size: 17px; font-weight: 800; cursor: pointer`.
  - **Expanded toggle** `.explainToggle[aria-expanded='true']`:
    `background: var(--explain-toggle-pressed)`, and its `svg` gets `transform: rotate(180deg)`.
    The svg has `transition: transform 0.15s`, disabled inside
    `@media (prefers-reduced-motion: reduce)`.
  - **`.explain`**: replace the 008 rules with:
    - `flex: 0 1 auto; min-height: 0; overflow-y: auto; margin-bottom: 16px`;
    - `padding: 14px 16px`;
    - `border: 2px solid var(--explain-border); border-radius: 16px`;
    - `background: var(--explain-bg); color: var(--explain-text)`;
    - keep the font size and line height;
    - `.explain[hidden] { display: none; }`, so `display` does not override `hidden`.
  - **Bold words**: `.explain strong { color: #ffffff; }` (mockup 4b shows the bold words in white;
    contrast on `--explain-bg` is well above 4.5:1).
  - **New `.explainGrammarDivided`**:
    `margin-top: 12px; padding-top: 12px; border-top: 2px solid var(--explain-border)`.
  - **`.explainLesson`**: `color: var(--explain-source)`, `text-transform: uppercase`,
    `letter-spacing: 0.06em`, `font-size: 14px`, `font-weight: 800`. Remove the old `opacity`.
  - **No overflow**: nothing scrolls horizontally at 360 px. `overflow-wrap: anywhere` is already
    on `.sheetText`; add it to `.explain`.
- [X] T006 [US1] Run `npm run lint`, `npm run build`, `npm test`. Expect only the 008 explanation tests in tests/integration/lessonFlow.test.tsx and tests/integration/practiceFlow.test.tsx to fail, because the text left the status region and is hidden. Record which fail under this task.
  - **Result (2026-11-04)**: lint clean, build ok (precache 12 entries, 502.85 KiB); exactly the 4 expected 008 tests failed: lessonFlow "a wrong pick shows…", "a missed grammar exercise…", "a wrong sentence lists…", practiceFlow "a missed grammar exercise names its own lesson…"

### Tests (after the code, Constitution IV)

- [X] T007 [US1] Update the 008 tests in tests/integration/lessonFlow.test.tsx (`describe` with "a wrong pick shows the answer word…", "a missed grammar exercise…", "a wrong sentence lists…"):
  - **Open first**: after each wrong answer, click `getByRole('button', { name: 'Why?' })`, then
    query the card instead of the status.
  - **Getting the card**: use `document.getElementById(toggle.getAttribute('aria-controls')!)`,
    or `getByRole('button', { name: 'Hide' })` followed by the element it controls.
  - **Status region**: assert it still contains `Not quite. Correct answer: …` and no longer
    contains the meanings.
  - **Lesson label**: the grammar test expects `From Lesson 4 · You and I`.
  - **Retry**: the retry part expects the explanation hidden again (no "Hide" button, "Why?"
    present) before reopening it.
- [X] T008 [P] [US1] Update tests/integration/practiceFlow.test.tsx "a missed grammar exercise names its own lesson in a practice session": click "Why?" first. Then assert on the card: the grammar title, `From ${pi.chapter} · ${pi.title}` and the note.
- [X] T009 [US1] Add `describe('010 collapsible explanation')` to tests/integration/lessonFlow.test.tsx, reusing the 008 helpers (`unlock`, `renderApp`, `startLesson`, `playUntil`, `answer`). The second lesson (`nouns-and-adjectives`, chapter "Lesson 3", exercise `telo-pona`) mirrors the mockups. Cover:
  - (a) A wrong answer shows a "Why?" button with `aria-expanded="false"`. Its controlled card is
    `hidden` (`not.toBeVisible()`), and `queryByText(/telo: /)` is not visible. Continue has
    focus.
  - (b) Clicking "Why?": the button's name becomes "Hide" with `aria-expanded="true"`. The card is
    visible with `telo: …` and `pona: …` (no grammar section: `telo-pona` is a
    multiple-choice exercise, and only word-bank exercises carry grammar notes; the grammar part
    is covered by T007). Continue is still in the document.
  - (c) Clicking "Hide" hides the card again.
  - (d) Opening it, then Continue, then a later wrong answer: the new sheet starts collapsed.
  - (e) A right answer shows no "Why?" button.
  - (f) Keyboard: after a wrong answer (focus on Continue), `user.tab({ shift: true })` lands on "Why?". `user.keyboard('{Enter}')`
    opens it and `user.keyboard(' ')` closes it. Then `user.click(Continue)` advances as before.
  - (g) The session result and stored progress are the same whether "Why?" was opened or not
    (FR-008). Do two separate renders with `vi.spyOn(Math, 'random').mockReturnValue(0)`. In each,
    answer the same exercise wrong and press Continue, opening "Why?" (and "Hide") only in the
    second. Compare `store.getState().progress`, `.words` and `.session` across the two with
    `toEqual`, and compare `localStorage` contents too.
- [X] T010 [US1] Run `npm test` and `npm run lint`; all pass
  - **Result (2026-11-04)**: `npm test` 601 passed (+6 new 010 tests); lint clean
- [X] T011 [US1] Manual check: ask the user to run `npm run dev`, then in Chrome with device emulation run quickstart M1–M5 (with M2b). Record results under this task. On a mismatch with mockup 4a/4b (spacing, colours, toggle size), fix src/components/Exercise.module.css and re-check.
  - **Result (2026-11-04)**, Chrome against the user's `npm run dev`:
    - **M1**: matches 4a apart from theme and mascot.
    - **M2**: matches 4b; the toggle is 95×48 px and keeps focus after the tap.
    - **M2b** (`tomo-suli-li-ijo-pona`): divider, bold title, "FROM LESSON 3 · NOUNS AND ADJECTIVES", note; matches 4b.
    - **M3**: in a 619×667 viewport the sheet is 400 px (60%) and only the card scrolls (276/175 px), Continue visible. Chrome won't make the window narrower than 500 px. At 500×463 the 360 px floor applies (78%), still with Continue visible. With the app column forced to 360 px: no horizontal overflow, and the toggle stays inside the sheet.
    - **M4**: Continue focused → Shift+Tab "Why?" → Enter opens ("Hide", expanded) → Tab goes to the scrollable card (Chrome makes scrollable areas focusable, so the card can be scrolled with the arrow keys) → Tab Continue → Enter continues.
    - **M5**: Chrome can't emulate reduced motion through the extension. Covered by the global `prefers-reduced-motion` rule in src/index.css, which sets `transition: none !important`.
    - The user's dev `localStorage` was saved before and restored after.

**Checkpoint**: US1 complete and independently testable.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T012 [P] Update README.md: where the features mention mistake explanations, say they open with a "Why?" button after a wrong answer
- [X] T013 [P] Update specs/008-mistake-explanations/contracts/ui-feedback-sheet.md: add one line at the top saying the wrong-answer layout is superseded by `specs/010-collapsible-explanations/contracts/ui-feedback-sheet.md`
- [~] T014 Ask the user to run quickstart M6 on iPhone (Safari) and Android (Chrome), in the browser or installed (Constitution V); record results under this task. The owner may waive it under the recorded-waiver rule (Principle IV): then mark `[~]` with the date and "owner decision", and name the waived check in spec.md **Status**
  - **Deferred (2026-11-04)**: owner decision (constitution IV waiver): the owner will run M6 on phones later.
- [X] T015 Set spec.md **Status** to `Implemented`, or to `Implemented (…)` naming any waived manual check. In ROADMAP.md, move the 010 entry from **In progress** to **Done**, rewording it as a short summary in the style of the other Done items and keeping the specs path. Leave **In progress** as `(none)`.
  - **Result (2026-11-04)**: Status `Implemented (phone check M6 deferred by owner decision, task T014)`; requirements checklist left as is (16/16); ROADMAP updated
- [X] T016 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass; record the test count vs. T001's baseline under this task
  - **Result (2026-11-04)**: `npm test` 601 passed (baseline 595, +6); lint clean; build ok (precache 12 entries, 502.85 KiB); `npm run test:pwa` 26 passed

---

## Dependencies & Execution Order

- **Setup (T001)**: first
- **Foundational (T002, T003)**: after T001, in parallel (different files)
- **US1**: T004 (needs T003) → T005 (needs T002) → T006 → T007 / T008 (parallel, different files)
  → T009 (same file as T007, after it) → T010 → T011
- **Polish**: T012, T013 any time after T004; T014 (phones, needs the user) after T011; T015 after
  T014; T016 last

## Parallel Example

```text
Task: "T002 tokens in src/index.css"
Task: "T003 ChevronDownIcon in src/components/icons.tsx"
```

```text
Task: "T007 lessonFlow.test.tsx 008 updates"
Task: "T008 practiceFlow.test.tsx 008 update"
```

## Implementation Strategy

Single story = MVP:
1. Setup + Foundational (no visible change).
2. US1 code.
3. Fix the 008 tests and add the 010 tests.
4. Manual layout check against 4a/4b.
5. Phone check (or recorded waiver), polish and final gate.
