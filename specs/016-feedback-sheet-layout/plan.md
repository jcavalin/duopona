# Implementation Plan: Wrong-Answer Sheet Layout Fix

**Branch**: `016-feedback-sheet-layout` | **Date**: 2026-11-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/016-feedback-sheet-layout/spec.md`

## Summary

In the wrong-answer sheet, the "Why?"/"Hide" toggle moves from its own column in the heading row
into the text column, under the status text (research R1). The heading row becomes: icon, then
one column that holds the status text and, below it, the toggle. The toggle stays outside the
`role="status"` region and keeps its place in the DOM order (after the status text, before the
explanation card), so what screen readers announce and the tab order do not change (R2).

The change touches `FeedbackBanner.tsx` (one wrapping `<div>`) and `Exercise.module.css` (the
new column class and a top margin on the toggle). Colours, sizes and behaviour stay as they are.
An integration test checks the new structure; layout itself is checked in a real browser at
360 px in all three languages (R3).

## Technical Context

**Language/Version**: TypeScript 6, React 19

**Primary Dependencies**: React, Redux Toolkit (already present); no new dependencies

**Storage**: N/A (no data change)

**Testing**: Vitest + Testing Library (jsdom) for structure and behaviour. jsdom has no layout,
so the 360 px rendering is a written check in quickstart.md, run in headless Chrome by the
implementer, plus a phone check the owner may waive (R3)

**Target Platform**: PWA on iOS Safari and Android Chrome, plus desktop browsers

**Project Type**: Frontend-only single-page web app

**Performance Goals**: N/A (CSS-only layout change)

**Constraints**: 360 px with no sideways scrolling; toggle stays at least 44 × 44 px; same layout
in English, Portuguese and French; toggle stays outside the status announcement

**Scale/Scope**: 1 component, 1 stylesheet, tests in `lessonFlow.test.tsx`, the 010 sheet contract
note, README not affected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. KISS | ✅ | One wrapper element and two CSS rules; no per-language rules, no new component, no dependency |
| II. Frontend-only, local-first | ✅ | No data or storage change |
| III. Standard React stack | ✅ | No state change; the toggle keeps its local `useState` |
| IV. Tests after code, before done | ✅ | Integration test for structure (toggle inside the text column, after and outside the status region) and the existing 010 behaviour tests unchanged. Layout at 360 px: manual check M1 in headless Chrome (recorded in tasks.md); phone check M2 may be waived by the owner |
| V. Mobile-first PWA | ✅ | Fixes a 360 px layout problem; toggle size unchanged (≥ 44 × 44 px); no sideways scrolling |

**Post-design re-check**: unchanged, all ✅.

## Project Structure

### Documentation (this feature)

```text
specs/016-feedback-sheet-layout/
├── plan.md              # This file
├── research.md          # R1–R3
├── data-model.md        # No data change
├── quickstart.md        # Automated run + manual checks M1–M2
├── contracts/
│   └── ui-feedback-sheet.md   # C1/C2 diagrams updated from 010; C3/C4 unchanged
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/components/
├── FeedbackBanner.tsx       # wrap status text + toggle in one column
└── Exercise.module.css      # .sheetBody column; toggle top margin

tests/integration/
└── lessonFlow.test.tsx      # structure test for the toggle position (C5)

docs/design/mockups/
└── 04c-wrong-answer-layout-fix.png   # approved mockup (already added)
```

**Structure Decision**: Existing single-project layout; only the files above change.

## Complexity Tracking

No violations.
