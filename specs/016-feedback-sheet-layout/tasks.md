---

description: "Task list for feature 016: Wrong-answer sheet layout fix"
---

# Tasks: Wrong-Answer Sheet Layout Fix

**Input**: Design documents from `/specs/016-feedback-sheet-layout/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R3), data-model.md (no change),
contracts/ui-feedback-sheet.md (C1, C2, C5), quickstart.md (M1–M2)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. The 360 px layout is a manual check (quickstart M1, run in headless
Chrome by the implementer; M2 on a phone, which the owner may waive); record results under the
matching task.

**Organization**: One user story (US1, P1): the wrong-answer sheet's text uses the full width and
the "Why?" toggle sits on its own line under the answer. It is the MVP and the whole feature.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1)

## Phase 1: Setup

- [x] T001 Add the approved mockup at docs/design/mockups/04c-wrong-answer-layout-fix.png
  (done during specify).

## Phase 2: Foundational

None: no data, state or string changes.

## Phase 3: User Story 1 - Read the wrong-answer feedback at a glance (Priority: P1) 🎯 MVP

**Goal**: Title, label and answer use the full width beside the icon; the toggle is on its own line
under the answer, aligned with the text, in every language (contract C1, C2, C5).

**Independent Test**: quickstart M1 at 360 px in English, Portuguese and French, compared with
mockup 04c.

### Implementation for User Story 1

- [x] T002 [US1] In src/components/FeedbackBanner.tsx, wrap the `role="status"` element and the
  "Why?"/"Hide" button in one `<div className={styles.sheetBody}>` placed after the icon in
  `.sheetRow`. Order inside it: status element first, then the button (only when
  `hasExplanation`). The button stays outside the status element; the explanation card and
  Continue stay where they are. Update the component's doc comment to cite 016 and mockup 04c.
- [x] T003 [US1] In src/components/Exercise.module.css, add `.sheetBody { flex: 1; min-width: 0; }`
  and move `flex: 1` off `.sheetText` (it keeps `margin: 0; overflow-wrap: anywhere` and the
  colour rules). Give `.explainToggle` `margin-top: 12px` and update its comment ("own line under
  the answer, 016 C5"). Keep every size and colour (C4: at least 44 × 44 px).

### Tests for User Story 1

- [x] T004 [US1] In tests/integration/lessonFlow.test.tsx, next to the 010 tests, add a test for
  C5: after a wrong answer with an explanation, the "Why?" button and the status region share the
  same parent element; the button comes after the status region in document order; the status
  region does not contain the button. After a right answer, no "Why?" button. Existing 010 tests
  must pass unchanged.
- [x] T005 [US1] Run `npm test`, `npm run lint` and `npm run build`; all pass. Record the counts
  here.
  - **2026-11-25**: `npm test` 23 files, 1816 tests passed (the 010 tests unchanged); ESLint no
    issues; build OK (16 precache entries).

### Manual checks for User Story 1

- [x] T006 [US1] Run quickstart M1 on the built app at 360 × 800 in headless Chrome, in English,
  Portuguese and French: wrong one-word answer, toggle opened, wrong word-bank answer, right
  answer. Check title on one line, toggle under the answer aligned with the text, no sideways
  scrolling, and match with mockup 04c. Measure the text area height (SC-002: same in all three
  languages). Record results here.
  - **2026-11-25, passed** (headless Chrome 360 × 800, built app; screenshots in
    [m1-results.png](m1-results.png)). In English, Portuguese and French:
    - Wrong one-word answer: title 1 line; text area 151 px in all three (SC-002); toggle 12 px
      under the answer, left edge equal to the text's; toggle 105/128/141 × 48 px (EN/PT/FR);
      no sideways scrolling.
    - "Why?" opened: label becomes Hide/Ocultar/Masquer in place; card below; Continue visible.
    - Wrong word-bank answer ("ni li meli"): same layout, toggle under the answer.
    - Right answer: unchanged sheet, no toggle.
    - Not seen at runtime: an answer long enough to wrap (the first lesson's sentences fit on one
      line); the wrapping case is covered by mockup 04c, which uses the same rules.
- [~] T007 [US1] Ask the owner to run quickstart M2 (Android Chrome and iOS Safari). If waived or
  deferred, mark `[~]` with the date and "owner decision" and name M2 in the spec's Status line.
  - **Deferred (2026-11-25)** by owner decision, to be run later with the earlier deferred phone
    checks.

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T008 [P] In specs/010-collapsible-explanations/contracts/ui-feedback-sheet.md, add a note
  at the top that the toggle position in C1/C2 is superseded by 016 contract C5 (mockup 04c).
- [x] T009 Update specs/016-feedback-sheet-layout/spec.md Status to "Implemented" (naming any
  waived checks) once T002–T007 are done.

## Dependencies & Execution Order

- T002 → T003 → T004 → T005 → T006 → T007 → T009.
- T008 is independent and can run at any time ([P]).

## Parallel Example

```text
T008 (010 contract note) can be written while T002/T003 are being implemented.
```

## Implementation Strategy

US1 is the whole feature and the MVP: implement T002–T003, test (T004–T005), check the layout in
the browser (T006), then ask for the phone check (T007) and close the docs (T008–T009).
