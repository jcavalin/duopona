# Implementation Plan: Reorder Answer Tiles

**Branch**: `009-reorder-answer-tiles` | **Date**: 2026-11-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-reorder-answer-tiles/spec.md`

## Summary

In word-bank exercises, learners can drag a placed word to a new spot in the answer line, drag a
bank word straight into a chosen spot, and move a focused placed word with the left and right
arrow keys. Taps keep working as today. Built with **Pointer Events and no library** (R1): a
6 px threshold separates taps from drags (R2); during a drag the answer line shows a **preview
order** with a gap where the word will land and a floating ghost follows the pointer; the order
is committed on drop (R3, R6). The landing spot comes from a pure `dropIndex()` over the other
tiles' boxes, which works across wrapped rows (R5). All state stays local to `WordBank`; no
Redux, storage or grading change (R9).

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: React 19, Redux Toolkit 2, react-redux 9, React Router 8, Vite 8,
vite-plugin-pwa 2; **no new dependencies** (R1)

**Storage**: none; `duopona:*` keys unchanged (FR-009)

**Testing**: Vitest + React Testing Library on jsdom 30 (`PointerEvent` available, no layout, no
pointer capture: R10). New unit tests for `src/lib/reorder.ts`; `lessonFlow.test.tsx` extended
with pointer-driven drags over stubbed tile boxes, keyboard moves and the hint. Touch on real
phones as manual check S-D1

**Target Platform**: iOS Safari and Android Chrome (browser and installed); desktop browsers

**Project Type**: Frontend-only single-page web app (PWA)

**Performance Goals**: Gap and ghost follow the pointer without visible lag; per move: measure
≤ ~12 tile boxes and one state update

**Constraints**: 360 px width, no horizontal scroll; dragging a tile never scrolls the page
(`touch-action: none` on tiles, R7); 44 px targets kept (tile size unchanged); offline unchanged

**Scale/Scope**: 1 component reworked (`WordBank.tsx`), 1 new pure module
(`src/lib/reorder.ts`, 2 functions), CSS for gap, ghost and touch-action; 0 new routes, 0 store
or storage changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. KISS | No dependency: Pointer Events in one component (R1). Two small pure helpers, each used by the component and its tests; `moveItem` serves both drop and arrow keys. No generic drag framework or context | ✅ Pass |
| II. Frontend-only, local-first | Nothing stored or sent | ✅ Pass |
| III. Standard React stack | Drag and order are purely local UI state, kept in component state as `placed` already is (R9) | ✅ Pass |
| IV. Tests after code, before done | Pure helpers unit-tested; drags, taps, drops, cancel, keyboard and hint tested with simulated pointer events (R10); only the real touch gesture is a written manual check (S-D1), the allowed browser/device exception | ✅ Pass |
| V. Mobile-first PWA | Touch-first pointer handling; `touch-action: none` only on tiles (R7); works at 360 px; tile size ≥ 44 px unchanged | ✅ Pass |
| Governance: Transitional compliance | No open gaps | ✅ Pass |

**Post-design re-check (after Phase 1)**: unchanged. The design adds one local state object and
two pure helpers; the one trade-off (scrolling can't start on a tile) is recorded in R7 and
checked in S-D1.

## Project Structure

### Documentation (this feature)

```text
specs/009-reorder-answer-tiles/
├── plan.md
├── research.md                 # R1–R10
├── data-model.md               # Drag state, preview order, commit rules
├── quickstart.md               # automated coverage, S1–S6, S-D1
├── contracts/
│   └── ui-word-bank.md         # W1–W5
├── checklists/requirements.md
└── tasks.md                    # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── reorder.ts              # new: moveItem(), dropIndex() (R5)
└── components/
    ├── WordBank.tsx            # pointer drag (line and bank), preview order, ghost, arrow keys, hint (R2–R8)
    └── Exercise.module.css     # slot (gap) style, ghost, touch-action on tiles (W1, W4)
tests/
├── unit/
│   └── reorder.test.ts         # new
└── integration/
    └── lessonFlow.test.tsx     # + drag, tap, drop, cancel, bank-to-spot, keyboard, hint, after-Check
```

**Structure Decision**: Existing single-project layout. The helpers go in `src/lib/` next to
`shuffle.ts`, the other small pure list helper. A draft of the pointer handling for line drags
(written before this spec, kept outside the repo in the session scratchpad) may seed
`WordBank.tsx`; it must be reworked to the preview-and-commit model (R3) and extended to bank
drags.

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected Because |
|------|------------|-------------------------------------|
| Hand-written pointer drag (~100 lines) instead of a library | FR-001, FR-002, FR-004a on touch and mouse | A library (`@dnd-kit`) is a new dependency far larger than one wrapping row needs; HTML5 drag and drop does not work on touch in iOS Safari (R1) |
