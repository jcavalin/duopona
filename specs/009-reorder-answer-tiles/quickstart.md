# Quickstart: Reorder Answer Tiles

## Prerequisites

`npm ci` (see the sandbox note in project memory if npm needs a cache dir), then:

```sh
npm test          # Vitest: unit + integration
npm run lint
npm run build     # type check + PWA build
npm run dev       # for the manual checks below
```

## Automated coverage

| Area | Test | Spec |
|------|------|------|
| `moveItem`, `dropIndex` (same row, wrapped rows, start, end, empty) | `tests/unit/reorder.test.ts` | FR-002, US1-4 |
| Drag a placed word to a new spot; Check grades the shown order | `tests/integration/lessonFlow.test.tsx` | FR-001, FR-002, FR-007, US1-1, US1-3 |
| Tap (no or < 6 px movement) still removes / adds | same | FR-003, FR-004a, SC-002, SC-002a |
| Placed word dropped on bank → back in bank; dropped elsewhere → stays at shown spot; same spot → unchanged; cancel → unchanged | same | FR-004, edge cases |
| Bank word dragged between two placed words; dragged and dropped elsewhere → stays in bank | same | FR-004a, US3-1, US3-3 |
| Repeated words stay distinct while moving | same | edge case |
| Arrow keys move the focused placed word, focus kept, no-op at ends; hint via `aria-describedby` | same | FR-005, FR-006, US2 |
| No changes after Check | same | FR-008 |

Layout is stubbed in the integration tests (jsdom has none): see research R10.

## Manual checks (`npm run dev`, Chrome DevTools device toolbar at 360 px)

| # | Steps | Expected |
|---|-------|----------|
| S1 | Lesson with a sentence exercise: place 3 words, drag the last to the front | Gap follows the pointer; word lands at the front; Check grades the new order |
| S2 | Place enough words to wrap to a second row; drag one from row 2 to the start of row 1 | Lands at the start; no horizontal scroll |
| S3 | Drag a placed word onto the bank | Returns to its bank place |
| S4 | Drag a bank word between two placed words; then drag another bank word and drop it on the prompt | First lands in the middle; second stays in the bank |
| S5 | Tap placed and bank words (no drag) | Remove / add at end, as before |
| S6 | Keyboard only: Tab to a placed word, arrows left/right | Word moves, focus stays on it |
| S-D1 | Phone (iOS Safari or Android Chrome, browser or installed): S1, S2, S4, S5 by touch; then try to scroll by dragging on the prompt text | Drags move words, not the page; taps still work; scrolling from outside tiles still works |

Record results (or an owner waiver) in tasks.md.
