# Data Model: Reorder Answer Tiles

Nothing is stored or sent. All state below is local to `WordBank` (component state) and lives only
while the exercise is on screen.

## Existing (unchanged in kind)

- **tiles**: `string[]`, the shuffled words (answer + distractors), fixed for the exercise. A tile
  is identified by its **index** in this array, so repeated words stay distinct.
- **placed**: `number[]`, tile indexes in answer-line order. This is what Check grades
  (`placed.map(i => tiles[i])`, FR-007). Changed by tap (add at end / remove), by a committed
  drop, and by arrow keys.

## New: Drag (local, `null` when no drag)

| Field | Type | Meaning |
|-------|------|---------|
| `tile` | number | Index of the tile being dragged |
| `from` | `'line' \| 'bank'` | Where the drag started |
| `index` | number \| null | Preview position in the answer line, counted among the *other* placed tiles; `null` = not in the line (bank drags only) |
| `x`, `y` | number | Ghost's top-left corner on screen (pointer minus grab offset) |
| `width` | number | Ghost width, the pressed tile's width |

A separate ref holds the press before it becomes a drag (`pointerId`, start point, grab offset),
and a one-shot flag that ignores the `click` following a drag (research R2).

### Lifecycle

```text
idle ──pointerdown on enabled tile──▶ pressed
pressed ──move < 6 px──▶ pressed
pressed ──move ≥ 6 px──▶ dragging   (capture pointer; drag = {tile, from, index: initial, ...})
pressed ──pointerup──▶ idle         (click runs: tap behaviour)
dragging ──move──▶ dragging          (ghost follows; index updated while over the line)
dragging ──pointerup──▶ idle         (commit per rules below; ignore next click)
dragging ──pointercancel──▶ idle     (no change)
```

Initial `index`: for a line drag, the tile's current position in `placed`; for a bank drag,
`null`.

### Preview order (what the answer line shows while dragging)

`others = placed` without `drag.tile`; if `drag.index !== null`, the dragged tile is inserted
into `others` at `drag.index` and rendered as an empty slot (line drag: the same button; bank
drag: an `aria-hidden` span).

### Commit rules on pointerup (research R6)

| from | Released over | Result |
|------|---------------|--------|
| line | word bank | `placed` without the tile (back to bank) |
| line | elsewhere | `placed` = preview order (unchanged if `index` never moved) |
| bank | answer line (`index !== null`) | `placed` = preview order (tile inserted) |
| bank | elsewhere | unchanged |

## Pure helpers (`src/lib/reorder.ts`)

- `moveItem<T>(list: T[], from: number, to: number): T[]`: new array with the item moved.
- `dropIndex(rects: Rect[], x: number, y: number): number`: count of `rects` before the point
  (`y > bottom`, or `y ≥ top` and `x > left + width / 2`). `Rect` is
  `{ left, top, width, bottom }` (a `DOMRect` fits).

## Validation rules

- No drag, tap or arrow key changes anything once the exercise is checked (`disabled`, FR-008).
- A drag only starts from the primary button (mouse) or any touch/pen contact.
- Only one drag at a time; moves from another `pointerId` are ignored.
