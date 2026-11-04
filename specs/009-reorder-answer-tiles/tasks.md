---

description: "Task list for feature 009: Reorder Answer Tiles"
---

# Tasks: Reorder Answer Tiles

**Input**: Design documents from `/specs/009-reorder-answer-tiles/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R10), data-model.md,
contracts/ui-word-bank.md (W1–W5), quickstart.md (S1–S6, S-D1)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Real touch on phones is validated manually (IV exception) with
quickstart S-D1, results recorded under the matching task.

**Organization**: Tasks are grouped by user story: US1 (P1, drag a placed word), US2 (P2, arrow
keys and screen-reader hint), US3 (P3, drag a bank word into a chosen spot). All three change
src/components/WordBank.tsx, so stories run in order, not in parallel.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2, US3)

## Path Conventions

Single frontend project: `src/`, `tests/` at the repository root. Run commands from the
repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only). No new packages are needed (R1: no drag-and-drop library).
- **Dev server**: a server started from the sandbox is not reachable from Chrome. Ask the user to
  run `npm run dev` (http://localhost:5173), then drive Chrome against it.
- **Draft**: a pre-spec draft of line dragging is at
  `/tmp/claude-1000/-home-lin-projects-duopona/66373d5f-2644-4d4f-88c8-32ef9e96bb51/scratchpad/WordBank.drag-draft.tsx`
  (may be gone in a later session). It reorders `placed` live on every move; this feature uses
  **preview-and-commit** instead (R3). Reuse its pointer plumbing only.
- **Tiles are identified by index** into `tiles` (keys and `placed` hold indexes), so repeated
  words stay distinct. Keep that.
- **Do not change** grading, the session store, persistence, or the `onSubmit` contract
  (`placed.map((i) => tiles[i])`, FR-007, FR-009).
- **Keep** the first bank tile's `ref={index === 0 ? focusOnMount : undefined}` (focus without
  scrolling; the page-jump fix on `main`), and keep tile accessible names equal to the word
  (existing tests query `getByRole('button', { name: word })`).
- **jsdom** (v30) has `PointerEvent` with `clientX`, `clientY`, `pointerId`, but no layout
  (`getBoundingClientRect` returns zeros) and no `setPointerCapture`: call it as
  `el.setPointerCapture?.(id)` (R10).

---

## Phase 1: Setup

- [ ] T001 On branch `009-reorder-answer-tiles`, run `npm test` and `npm run lint` and record the passing test count under this task as the baseline. In ROADMAP.md replace `(none)` under **In progress** with `**009 – Reorder answer tiles**: drag or arrow-key placed words into a new order, and drag bank words into a chosen spot (\`specs/009-reorder-answer-tiles/\`).`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The pure list helpers every story uses (research R5).

- [ ] T002 Create src/lib/reorder.ts with a doc comment per export: `export interface Rect { left: number; top: number; width: number; bottom: number }` (a `DOMRect` fits); `export function moveItem<T>(list: readonly T[], from: number, to: number): T[]` returning a new array with `list[from]` moved to index `to` (input unchanged); `export function dropIndex(rects: readonly Rect[], x: number, y: number): number` returning the count of rects before the point, where a rect is before it when "`y > bottom`, or `y ≥ top` and `x > left + width / 2`" (data-model, works across wrapped rows)
- [ ] T003 [P] Create tests/unit/reorder.test.ts: `moveItem` forward, backward, same index, does not mutate input; `dropIndex` with one row of three 80×48 rects (left 0/90/180, top 0): point left of the first centre → 0, between second and third centres → 2, right of all → 3; two rows (row 2 at top 58): point on row 2 left of its first centre → count of row 1; point above row 1 (`y < top`) → 0; empty rects → 0

**Checkpoint**: helpers tested; no visible change

---

## Phase 3: User Story 1 - Drag a placed word to a new spot (Priority: P1) 🎯 MVP

**Goal**: Press and drag a placed word to a new spot in the answer line, with a gap showing where
it lands and a ghost under the pointer; taps still remove; dropping on the bank removes
(FR-001–FR-004, FR-007, FR-008, FR-010).

**Independent Test**: Place three words, drag the first to the end; the line shows the new order
and Check grades it.

### Implementation for User Story 1

- [ ] T004 [US1] In src/components/WordBank.tsx add pointer dragging of **placed** tiles per research R2–R7, data-model and contract W1:
  - Local state `drag: { tile: number; from: 'line' | 'bank'; index: number | null; x: number; y: number; width: number } | null` (only `from: 'line'` in this story) and a ref for the press `{ tile, pointerId, startX, startY, offsetX, offsetY, dragging }`; a ref flag `suppressClick`; refs to the answer line div, the bank div, and a `Map<number, HTMLButtonElement>` of placed tile buttons (callback refs that set/delete by tile index).
  - `onPointerDown`: first clear `suppressClick` (research R2: a drop that unmounts the pressed button gets no click, so the flag must not outlive its press). Then ignore the press when `disabled`, for a mouse with `button !== 0`, or when a press is already active ("Only one drag at a time", data-model); otherwise record the press and grab offset from `getBoundingClientRect()`.
  - `onPointerMove`: ignore other `pointerId`s; start the drag only once the pointer is "≥ 6 px" from the start (`Math.hypot`), then call `event.currentTarget.setPointerCapture?.(event.pointerId)` and set `drag` with `index` = the tile's position in `placed`. On every move update `x`/`y` (pointer minus grab offset) and, **only while the pointer is over the answer line's box extended 16 px down** (it must not overlap the bank's area extended 8 px up: the line's `margin-bottom` is 28 px, research R5), `index = dropIndex(<rects of the other placed tiles, in placed order>, clientX, clientY)`.
  - `onPointerUp`: if no drag started, do nothing (the native `click` handles the tap). Otherwise set `suppressClick`, clear `drag`, and commit: pointer over the bank's box extended 8 px up → remove the tile from `placed`; else `placed` = preview order (data-model: "`others = placed` without `drag.tile`; ... inserted into `others` at `drag.index`").
  - `onPointerCancel`: clear `drag` and the press; `placed` unchanged.
  - `onClick` on a placed tile: if `suppressClick` is set, clear it and return; else remove (today's tap).
  - Render the answer line from the **preview order** while `drag` is set (from `placed` otherwise). The dragged tile stays the **same keyed button** (never unmounted: R4) with an extra slot class; render the ghost `<span aria-hidden="true">` with the tile classes plus a ghost class at `style={{ left: x, top: y, width }}` outside `.screen-body` (next to the bottom bar).
  - No change to bank buttons yet except keeping `focusOnMount` on the first one.
- [ ] T005 [US1] In src/components/Exercise.module.css (contract W1, W4): `.tile` (shared by placed and bank tiles, so no new class is needed) `touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none`; `.tileSlot` = the `tilePlaceholder` look (transparent text and border, `--line` background) so the gap keeps the tile's size; `.tileGhost` `position: fixed; z-index: 2` (above the sticky `.bottom-bar` at z-index 1), `pointer-events: none`, a soft shadow, `margin: 0`. Nothing may scroll horizontally at 360 px
- [ ] T006 [US1] Run `npm run lint`, `npm run build`, `npm test`; all existing tests must pass unchanged (taps still go through `click`)

### Tests for User Story 1

- [ ] T007 [US1] Create tests/integration/wordBank.test.tsx rendering `<WordBank header={null} exercise={fixture} disabled={false} onSubmit={onSubmit} />` (src/components/WordBank.tsx) with a fixture word bank: answer `['kulupu', 'sina', 'li', 'wawa']`, distractors `['li']` (a repeated word), `direction: 'en-tp'`. Stub layout with `vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')` returning, by element: the "Your answer" group → `{ left: 0, top: 0, width: 400, height: 116, bottom: 116 }`; the "Word bank" group → `{ top: 200, bottom: 300, left: 0, width: 400 }`; a tile button inside the answer line → its position among the line's children laid out 4 per row, 80 wide with 10 px gaps, 48 high, rows at top 0 and 58; anything else → zeros (restore in `afterEach`). Helper `drag(el, from, to)` = `fireEvent.pointerDown(el, { pointerId: 1, clientX, clientY, button: 0, pointerType: 'mouse' })`, a few `pointerMove`s, `pointerUp`, then `fireEvent.click(el)` (as browsers do). Assert by reading the answer line's button names in order:
  - dragging the first placed word to after the last → new order; pressing Check → `onSubmit` receives that order (FR-007);
  - mid-drag, the answer line shows an element at the landing position (slot) and a ghost exists; after drop, no ghost;
  - a press with < 6 px movement then click → word removed (tap, SC-002);
  - dropping on the bank (y 250) → word back in the bank;
  - dropping at the same spot → order unchanged and word still placed;
  - dropping outside both (y −100) after moving over a new position → word at that last position;
  - `pointerCancel` mid-drag → order unchanged;
  - drop a placed word on the bank **without** firing a click afterwards (the button unmounts), then a plain tap (pointerDown/Up + click, no movement) on another placed word → that word is removed (the ignore flag did not swallow it, research R2);
  - a second `pointerDown` (`pointerId: 2`) on another tile mid-drag → ignored; the first drag completes normally;
  - moving one of the two `li` tiles never moves the other;
  - row 2 to the start of row 1 (US1-4, place 5 tiles first);
  - re-render with `disabled={true}` → pointer drags and taps change nothing (FR-008).
- [ ] T008 [P] [US1] Extend tests/integration/lessonFlow.test.tsx: on a word-bank exercise, place the answer words in the wrong order (e.g. the last word first), fix the order by a pointer drag in the answer line (stub `getBoundingClientRect` as in T007 for this test), press Check → "pona! Correct." (FR-007)
- [ ] T009 [US1] Run `npm run lint`, `npm run build`, `npm test`; record the count under this task

### Validation for User Story 1

- [ ] T010 [US1] Manual check in Chrome with the user running `npm run dev`: quickstart S1, S2, S3, S5 at 360 px (DevTools device toolbar with touch emulation); record results under this task, including the owner's opinion of the gap and ghost look (no mockup exists)

**Checkpoint**: placed words can be dragged; MVP shippable

---

## Phase 4: User Story 2 - Reorder without dragging (Priority: P2)

**Goal**: ArrowLeft/ArrowRight move a focused placed word, focus stays on it; screen readers hear
how to remove, drag or move it (FR-005, FR-006, SC-003).

**Independent Test**: Keyboard only: place three words, focus the first, press ArrowRight twice;
it is last and still focused.

### Implementation for User Story 2

- [ ] T011 [US2] In src/components/WordBank.tsx (research R8, contract W3): `onKeyDown` on placed tiles — ArrowLeft / ArrowRight (no modifier) call `preventDefault()` and move the tile one place with `moveItem`; "no-op at the ends"; ignored when `disabled` or during a drag. Store the moved tile index in a ref and, in an effect on `placed`, re-focus that button with `focus({ preventScroll: true })` then clear the ref. Add one `<p id={hintId} className="visually-hidden">Press to remove. Drag or use the left and right arrow keys to move.</p>` (`hintId` from `useId()`) and `aria-describedby={hintId}` on every placed tile button; the button's name stays the word
- [ ] T012 [US2] Run `npm run lint`, `npm run build`, `npm test`

### Tests for User Story 2

- [ ] T013 [US2] Extend tests/integration/wordBank.test.tsx (user-event keyboard): place three words; focus the first; `{ArrowRight}` twice → it is last and `toHaveFocus()`; `{ArrowLeft}` on the first → no change; `{ArrowRight}` on the last → no change; Enter on a focused placed tile still removes it; a placed tile has an accessible description equal to the hint (`toHaveAccessibleDescription`) and its name is the word; after `disabled` arrows change nothing

### Validation for User Story 2

- [ ] T014 [US2] Manual check in Chrome: quickstart S6; record results under this task

**Checkpoint**: every reorder is possible without a pointer

---

## Phase 5: User Story 3 - Drop a bank word into a chosen spot (Priority: P3)

**Goal**: Drag a bank word into a chosen spot of the answer line; dropped elsewhere it stays in
the bank; a tap still adds at the end (FR-004a, SC-002a).

**Independent Test**: Place two words, drag a third from the bank between them; the line shows it
in the middle and the bank shows its empty place.

### Implementation for User Story 3

- [ ] T015 [US3] In src/components/WordBank.tsx (research R3–R6, contract W2): give **bank** tile buttons the same pointer handlers with `from: 'bank'` and initial `index: null`; while over the answer line (box extended 16 px down) `index = dropIndex(<rects of all placed tiles>, x, y)`, otherwise `index = null`. While dragging, the bank button stays mounted (R4) and is styled as the bank's empty place (`tilePlaceholder` look); the line shows an `aria-hidden` slot `<span>` at `index` when not null. On drop: "bank | answer line (`index !== null`) | `placed` = preview order (tile inserted)"; "bank | elsewhere | unchanged". A bank tap (no drag) still appends; the click after a drag is suppressed. Tap and the first-tile `focusOnMount` unchanged
- [ ] T016 [US3] Run `npm run lint`, `npm run build`, `npm test`

### Tests for User Story 3

- [ ] T017 [US3] Extend tests/integration/wordBank.test.tsx (extend the layout stub so bank buttons sit inside the bank box): place `kulupu` and `wawa`; drag `sina` from the bank to between them → line reads `kulupu sina wawa` and the bank shows `sina`'s place empty (no `sina` button in the bank); mid-drag over the line a slot is present; drag a bank word and drop it at y −100 → stays in the bank, line unchanged; drag over the line then away and drop → stays in the bank; a bank press with < 6 px movement → appended at the end (SC-002a); `pointerCancel` → nothing changes; drop a bank word into the line **without** firing a click afterwards, then tap another bank word → it is appended (research R2)

### Validation for User Story 3

- [ ] T018 [US3] Manual check in Chrome: quickstart S4 (and S5 again); record results under this task

**Checkpoint**: all three stories done

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Update README.md: in the features section mention that sentence answers can be reordered by dragging words (or with the arrow keys) and that bank words can be dragged into place
- [ ] T020 Ask the user to run quickstart S-D1 on iPhone (Safari) and Android (Chrome), in the browser or installed; record results under this task (the owner may waive it under the constitution's recorded-waiver rule, Principle IV; then mark `[~]` with the date and "owner decision" and name the waived check in spec.md **Status**)
- [ ] T021 Set spec.md **Status** to `Implemented` (or `Implemented (…)` naming skipped manual checks) and mark the requirements checklist unchanged; in ROADMAP.md move the T001 entry from **In progress** to **Done** with the same text, leaving **In progress** as `(none)`
- [ ] T022 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass; record the test count vs. T001's baseline under this task

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: first
- **Foundational (Phase 2)**: after T001; T002 → T003
- **US1 (Phase 3)**: after T002; T004 → T005 → T006 → T007 → T009 → T010 (T008 in parallel with T007)
- **US2 (Phase 4)**: after US1 (same component, uses the placed-tile refs from T004); T011 → T012 → T013 → T014
- **US3 (Phase 5)**: after US1 (reuses the drag state, preview order and commit); independent of US2 but edits the same file, so run after it; T015 → T016 → T017 → T018
- **Polish (Phase 6)**: after all stories; T020 needs the user and real phones

### Within Each Story

- Implementation → lint/build/test → tests (Constitution IV: tests after code) → manual validation
- Same-file order: src/components/WordBank.tsx (T004 → T011 → T015), tests/integration/wordBank.test.tsx (T007 → T013 → T017)

### Parallel Opportunities

- T003 (unit tests) alongside starting T004 once T002 is done
- T008 (lessonFlow) alongside T007 (wordBank test)
- T019 (README) any time after T015

---

## Parallel Example: User Story 1 tests

```text
Task: "T007 wordBank.test.tsx line drags"
Task: "T008 lessonFlow.test.tsx reordered answer graded correct"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2: baseline, helpers
2. Phase 3 (US1): drag placed words
3. **STOP and VALIDATE**: T010; fixes the reported problem on its own

### Incremental Delivery

1. Setup + Foundational → no visible change
2. US1 → drag to reorder (MVP)
3. US2 → arrow keys and screen-reader hint
4. US3 → bank words dragged into place
5. Polish → README, phones, final gate
