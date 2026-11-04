# UI Contract: Word Bank with Reordering

## W1. Dragging a placed word (US1)

```text
 Your answer                          Your answer (while dragging "mi")
 ┌──────────────────────────────┐     ┌──────────────────────────────┐
 │ [wawa] [mi]                  │     │ [    ] [wawa]                │  gap = where it lands
 │──────────────────────────────│     │──────────────────────────────│
 │                              │     │   ┌────┐                     │
 └──────────────────────────────┘     │   │ mi │ ← ghost under finger│
                                      └───┴────┴─────────────────────┘
```

- **Start**: press on a placed tile and move ≥ 6 px. A shorter press-and-release is a tap
  (removes the word, as today).
- **During**: the tile's own place becomes an empty slot (same size, `tilePlaceholder` look) that
  moves to where the word will land; other tiles shift around it, across wrapped rows. A floating
  copy of the tile (ghost) follows the pointer, slightly raised (shadow), not interactive,
  `aria-hidden`.
- **Release**: over the word bank → back to the bank; anywhere else → lands at the slot.
- **Cancel** (`pointercancel`): order unchanged.

## W2. Dragging a bank word into the sentence (US3)

- **Start**: press on a bank tile and move ≥ 6 px. Shorter → tap (adds at the end, as today).
- **During**: the bank tile shows as the bank's empty place. Over the answer line, an empty slot
  appears where it will land and placed tiles shift; leaving the line removes the slot.
- **Release**: over the line → inserted at the slot; elsewhere → stays in the bank.

## W3. Keyboard and screen readers (US2)

- Placed tiles: **ArrowLeft / ArrowRight** move the focused tile one place; no-op at the ends;
  focus stays on the moved tile. Enter / Space still remove it.
- Placed tiles have `aria-describedby` → one visually hidden text: "Press to remove. Drag or use
  the left and right arrow keys to move." The accessible **name** stays the word.
- Bank tiles: unchanged (Enter / Space add at the end).
- Groups keep their labels: "Your answer", "Word bank".

## W4. Touch and layout

- Tiles have `touch-action: none` (no page scroll or zoom gesture starting on a tile). Elsewhere
  the screen scrolls normally.
- Ghost: `position: fixed`, `pointer-events: none`, above the bottom bar (`z-index` over the
  sticky bar), same font and size as a tile.
- At 360 px: no horizontal scroll; the ghost may cross the screen edge only under the finger.
- After Check (feedback sheet showing): tiles disabled; no tap, drag or arrow-key changes.

## W5. Unchanged

- Check grades the answer line order (W1–W3 only change that order).
- Tile size, colours, ruled answer lines, bank layout, first bank tile focused on a new exercise
  (without scrolling), feedback sheet.
