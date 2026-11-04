# Research: Reorder Answer Tiles

No open questions remained after the spec's clarification (bank words can be dragged into a
chosen spot). These are the design decisions.

## R1. Pointer Events, no drag-and-drop library

- **Decision**: Implement dragging with the browser's Pointer Events (`pointerdown`,
  `pointermove`, `pointerup`, `pointercancel`) on the tile buttons in `WordBank.tsx`, plus
  `setPointerCapture` so the pressed tile keeps receiving moves while the pointer leaves it.
  No new dependency.
- **Rationale**: One list, one source (bank) and one target (answer line). Pointer Events cover
  touch and mouse on iOS Safari and Android Chrome with one code path, and it fits in roughly
  a hundred lines (Principle I: no dependency unless a few lines can't do it).
- **Alternatives**: `@dnd-kit` (mainstream and accessible, but a new dependency with sensors,
  contexts and sortable strategies, far more than one wrapping row needs); HTML5 drag and drop
  (`draggable`) does not fire on touch in iOS Safari and gives no control over the drag image.

## R2. Telling a tap from a drag

- **Decision**: A press becomes a drag only after the pointer moves 6 px or more from where it
  went down. Below that, nothing happens on move and the normal `click` runs (tap removes a
  placed word, tap adds a bank word: FR-003, FR-004a). After a real drag, the `click` that the
  browser fires on release is ignored once (a cancel sets nothing: no click follows it), and
  keyboard clicks (`detail === 0`) are never ignored. The ignore flag is cleared on every `pointerdown`,
  because some drops unmount the pressed button (a placed word dropped on the bank, a bank word
  dropped into the line), so no click arrives to clear it, and a stuck flag would swallow the
  learner's next tap.
- **Rationale**: Keeps today's tap behaviour exactly (SC-002, SC-002a) and makes drags start
  immediately, with no long press (spec Assumptions). 6 px absorbs a shaky finger (spec edge
  case) without feeling sticky.
- **Alternatives**: Long press to start dragging (slower, and iOS shows its own long-press UI);
  replacing `onClick` with pointer-up handling (loses keyboard Enter/Space activation, which
  comes free with `click`).

## R3. Preview while dragging, commit on drop

- **Decision**: While a drag runs, the committed `placed` order is not changed. A local `drag`
  state holds the dragged tile, where it came from (`line` or `bank`), the pointer position and
  the **preview position** in the answer line (or none). The answer line renders a *preview
  order* derived from `placed` and `drag`. On drop, the preview is committed or discarded
  (rules in [data-model.md](data-model.md)). A floating copy of the tile (the "ghost",
  `position: fixed`, `aria-hidden`) follows the pointer.
- **Rationale**: One rule for both sources; cancelling a drag (`pointercancel`, edge case) just
  drops the preview and nothing is lost. The ghost keeps the word visible next to the finger
  while the gap in the line shows where it will land (spec edge case).
- **Alternatives**: Reordering `placed` live on every move (simple for line drags, but a bank
  drag would have to add and remove the word repeatedly, and cancelling needs an undo);
  translating the real tile with CSS transforms (its layout slot moves under it as the order
  changes, so offsets must be recomputed after every reorder).

## R4. Following the pointer: window listeners, and the pressed element stays mounted

- **Revised during implementation (2026-11-04)**: pointer capture proved unreliable. React moves
  the dragged button in the DOM when the preview order changes, and moving a node releases its
  capture, so in Chrome the release landed on another element and the press stayed stuck. Moves,
  releases and cancels are therefore followed with `window` listeners for as long as a press
  lasts (registered once per mounted word bank); `setPointerCapture` is not used. The rest of
  this section still holds, so the pressed button keeps its identity and styling.
- **Decision**: The pressed button is never unmounted during its drag. A dragged **line** tile
  stays the same keyed button in the line, styled as an empty slot (the gap). A dragged **bank**
  tile stays the same button in the bank, styled as the bank's existing empty place
  (`tilePlaceholder` look); its gap in the line is a separate `aria-hidden` span. Tiles keep
  their index keys, so repeated words stay distinct (edge case).
- **Rationale**: Keeping the same keyed button lets the slot style follow it and keeps repeated
  words distinct.
- **Alternatives**: Pointer capture on the pressed button (the first implementation; lost when
  React moves the node, see above).

## R5. Where the word will land

- **Decision**: A pure function `dropIndex(rects, x, y)` in `src/lib/reorder.ts` takes the
  on-screen boxes of the *other* placed tiles, in order, and returns how many of them come
  before the pointer: a tile is before the pointer when the pointer is below the tile's row
  (`y > bottom`), or on its row (`y ≥ top`) and right of its centre. This works across wrapped
  rows (FR-002, US1-4). The preview position is updated only while the pointer is over the
  answer line (its box, extended 16 px down so the bottom row is easy to hit). The line
  and bank drop areas must not overlap: the line's `margin-bottom` is 28 px, and the two
  extensions (16 px down, 8 px up) leave a 4 px neutral strip between them. A sibling
  `moveItem(list, from, to)` does the array move for drops and arrow keys.
- **Rationale**: Measuring the other tiles each move (≤ ~12 tiles) is cheap and needs no layout
  model. Pure functions can be unit-tested without layout, which jsdom does not have.
- **Alternatives**: Hit-testing with `elementFromPoint` (the ghost is under the finger and
  gaps have no element); fixed grid maths (tiles have different widths).

## R6. Where a drop goes

- **Decision**: On release:
  - Line tile, pointer over the word bank (bank's box, extended 8 px up) → removed to the bank
    (FR-004).
  - Line tile, anywhere else → committed at the last preview position (unchanged if never moved
    over the line: edge cases "same spot" and "outside both").
  - Bank tile, pointer over the answer line → inserted at the preview position (FR-004a).
  - Bank tile, anywhere else → stays in the bank (FR-004a, edge case).
  - `pointercancel` → nothing changes (edge case).
- **Rationale**: Matches each acceptance scenario and edge case one to one.

## R7. Touch scrolling

- **Decision**: Tiles (line and bank) get `touch-action: none` while the exercise is not
  checked, so a press-and-drag on a tile moves the word, not the page (FR-010). The rest of the
  screen keeps normal scrolling. After Check the tiles are disabled and the rule no longer
  matters.
- **Rationale**: Without it, mobile browsers start a scroll and send `pointercancel` after a few
  pixels, killing the drag.
- **Alternatives**: `touch-action: none` on the whole exercise (blocks scrolling a long screen
  at 360 px); preventing default on `touchmove` (needs non-passive listeners; `touch-action` is
  the supported way).
- **Trade-off**: A scroll that starts on a tile no longer scrolls. Tiles are a small part of the
  screen and the exercise fits one phone screen in the common case; recorded as manual check
  S-D1.

## R8. Keyboard and screen readers

- **Decision**: On a focused **placed** tile, ArrowLeft/ArrowRight move it one place
  (`moveItem`), no-op at the ends; focus is put back on the moved tile after render (moving a
  DOM node blurs it). Placed tiles get `aria-describedby` pointing to one visually hidden hint:
  "Press to remove. Drag or use the left and right arrow keys to move." Bank tiles are
  unchanged for keyboard users: Enter/Space adds at the end, then the arrows reach any position
  (US3-4, SC-003).
- **Rationale**: Covers FR-005, FR-006 with native buttons and no custom roles. The hint is
  described, not part of the name, so tile names stay the word itself (existing tests and
  screen-reader output unchanged).
- **Alternatives**: Arrow keys moving focus between tiles (a roving-tabindex listbox: more
  ARIA, and it conflicts with using the arrows to move); a live-region announcement per move
  (the focused button is re-read in its new place; can be added later if the phone check finds
  it silent).

## R9. State stays local

- **Decision**: `placed` and `drag` live in `WordBank` component state, as `placed` does today.
  No Redux or storage change; `onSubmit` still receives `placed` mapped to words, so Check
  grades the order shown (FR-007, FR-009).
- **Rationale**: Purely local UI state (Principle III allows it); nothing else reads it.

## R10. Testing pointer drags in jsdom

- **Decision**: jsdom (v30) supports `PointerEvent` with `clientX`, `clientY` and `pointerId`
  (checked 2026-11-04) but has no layout and no `setPointerCapture`. So:
  - `dropIndex` and `moveItem` get unit tests with plain rectangles (rows, wrapping, ends).
  - A component-level integration test (`tests/integration/wordBank.test.tsx`) renders
    `WordBank` with a fixture exercise, stubs `getBoundingClientRect` on the line, bank and
    tiles (a simple row layout), then drives `fireEvent.pointerDown/Move/Up` and asserts the
    answer line order, what `onSubmit` receives, tap-vs-drag, drop on bank, drop outside,
    cancel, bank to chosen spot, arrow keys with focus, and the hint's `aria-describedby`.
    One `lessonFlow.test.tsx` test checks the full app grades a reordered answer.
  - Real touch on phones is manual check S-D1 (Principle IV exception), which the owner may waive.
- **Rationale**: Everything except the real touch gesture is simulated automatically
  (Principle IV).
