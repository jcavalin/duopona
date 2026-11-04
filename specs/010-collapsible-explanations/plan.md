# Implementation Plan: Collapsible Mistake Explanations

**Branch**: `010-collapsible-explanations` | **Date**: 2026-11-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/010-collapsible-explanations/spec.md`

## Summary

After a wrong answer, the 008 explanation starts hidden behind a "Why?" toggle at the top right of
the feedback sheet. The toggle shows "Hide" while the explanation is open. When open, the
explanation appears in a darker card that scrolls on its own above an always-visible Continue
(mockups 04a/04b).

This is a presentation-only change to `FeedbackBanner`:
- local `useState`;
- a `hidden` card linked by `aria-controls`;
- the card moved out of the `role="status"` region;
- new red-family CSS tokens;
- one chevron icon.

Course content, `explainMistake` and the store stay unchanged.

## Technical Context

**Language/Version**: TypeScript 6, React 19

**Primary Dependencies**: React, Redux Toolkit (unchanged); no new dependencies

**Storage**: N/A (nothing new stored; `localStorage` untouched)

**Testing**: Vitest + Testing Library (jsdom); manual layout check in quickstart.md

**Target Platform**: PWA on iOS Safari and Android Chrome, plus desktop browsers

**Project Type**: Frontend-only single-page web app

**Performance Goals**: Toggle responds immediately (synchronous state change, no data work)

**Constraints**: 360 px width with no horizontal scroll; 44 px targets; offline (no new assets);
contrast ≥ 4.5:1

**Scale/Scope**: One component (`FeedbackBanner`), its CSS module, `index.css` tokens,
`icons.tsx`, and two integration test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. KISS | ✅ | One boolean of local state, one icon, native button. No abstraction, no dependency |
| II. Frontend-only, local-first | ✅ | No data stored or sent |
| III. Standard React stack | ✅ | Purely local UI state stays in component state, as the principle allows |
| IV. Tests after code, before done | ✅ | Integration tests for behaviour and a11y. Layout is checked manually per the browser-only exception (quickstart M1–M5) |
| V. Mobile-first PWA | ✅ | Toggle ≥ 44 px; 360 px with the 60% cap and card scroll; safe areas via the existing `.bottom-bar` padding; works offline |

Post-design re-check: still passes; no Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/010-collapsible-explanations/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-feedback-sheet.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── index.css                         # + --explain-* tokens (research R6)
└── components/
    ├── FeedbackBanner.tsx            # toggle, hidden card outside the status region (R1–R3, R7)
    ├── Exercise.module.css           # sheet cap, heading row, toggle, card styles (R4, R8)
    └── icons.tsx                     # + ChevronDownIcon (R5)
tests/
└── integration/
    ├── lessonFlow.test.tsx           # 008 tests open "Why?" first; new 010 tests (R9)
    └── practiceFlow.test.tsx         # 008 practice test opens "Why?" first
```

**Structure Decision**: Single frontend project, existing layout. No new files outside `specs/`.

## Complexity Tracking

None.
