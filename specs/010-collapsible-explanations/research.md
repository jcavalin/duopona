# Research: Collapsible Mistake Explanations

No NEEDS CLARIFICATION items: the stack is fixed by the constitution and the look is fixed by
mockups 04a/04b and the notes in `docs/design/ui-redesign.md`. The decisions below settle the
remaining how-to questions.

## R1. Where the shown/hidden state lives

- **Decision**: Local `useState(false)` in `FeedbackBanner`.
- **Rationale**: Purely local UI state, never saved and needed nowhere else (Principle III allows
  component state; FR-004, FR-008). `ExerciseScreen` renders the sheet only while
  `session.status === 'feedback'`, and every new exercise passes through `answering`, so the sheet
  unmounts between answers and each new wrong-answer sheet starts hidden without extra code.
  Tests cover this for the next exercise and for the retry of the same exercise.
- **Alternatives**: Redux session field (rejected: shared state for a one-component toggle, and
  it would need resetting by hand); `<details>/<summary>` (rejected: the summary cannot sit in
  the heading row on the right while the content renders below the row, and its label and
  chevron swap is awkward to style the same way across iOS Safari and Chrome).

## R2. Hiding the explanation

- **Decision**: The explanation card stays in the DOM with the `hidden` attribute while collapsed;
  the toggle is a `<button type="button">` with `aria-expanded` and `aria-controls` pointing at the
  card's id (`useId`).
- **Rationale**: `hidden` removes it from view and from the accessibility tree, and keeps the
  `aria-controls` target present, as the design note asks. No new code paths in the explanation
  rendering.
- **Alternatives**: Conditional rendering (would leave `aria-controls` pointing at nothing while
  collapsed).

## R3. Screen-reader announcement

- **Decision**: Move the explanation card out of the `role="status"` region. The region keeps only
  "Not quite. Correct answer: …". The card follows the toggle in DOM order, so after opening it, the
  next item a screen reader reads is the explanation.
- **Rationale**: Design note: "the explanation text stays out of the `role="status"` announcement
  until opened". Live-announcing the card on open would repeat the whole thing every toggle; the
  `aria-expanded` change is announced by the button itself.
- **Alternatives**: Keep the card in the status region (it would be announced while hidden on some
  readers, or re-announced on each toggle).

## R4. Layout: toggle position, 60% cap, only the card scrolls

- **Decision**:
  - The heading row becomes icon, status text, toggle (`align-self: flex-start`, `flex-shrink: 0`).
  - Below the row: the card, then Continue.
  - `.sheet` `max-height` goes from `75dvh` to `max(60dvh, 360px)`. The 360 px floor keeps the
    heading, a few lines of card and Continue usable on very short (landscape) screens.
  - The row stops scrolling (`flex: none`). The card gets `flex: 0 1 auto; min-height: 0; overflow-y: auto`.
    Continue keeps `flex-shrink: 0`.
- **Rationale**: Matches 4b: the sheet grows with the card, then only the card scrolls, and
  Continue is always visible (FR-003a, SC-004).
- **Alternatives**: Keep 75dvh and the whole row scrolling (008 behaviour; contradicts 4b).

## R5. Chevron icon

- **Decision**: One `ChevronDownIcon` in `icons.tsx` (same `Stroke` helper), rotated 180° by CSS
  when `aria-expanded="true"`. No animation of the rotation under `prefers-reduced-motion`.
- **Rationale**: One icon, no new dependency (Principle I).

## R6. Colours

- **Decision**: New tokens in `src/index.css` with the values from ui-redesign.md:
  `--explain-toggle-border #6b2b32`, `--explain-toggle-pressed #4a2328` (toggle background while
  shown), `--explain-toggle-text #ffc2c6`, `--explain-bg #2a1316`, `--explain-border #5a262c`,
  `--explain-text #ffd9db`, `--explain-source #e7a3a8`.
- **Contrast** (WCAG, computed): explanation text on card 13.5:1; source label on card 8.5:1;
  toggle text on pressed background 8.8:1 (and higher on `--error-tint`). All pass 4.5:1 (FR-003b).
- **Rationale**: Red-family tones tied to the wrong-answer sheet, so they do not change with the
  later purple brand swap.

## R7. Card content and text

- **Decision**: Keep `explainMistake()` and its output unchanged (008 tests stand). In the card:
  - Word list.
  - Wrong-pick line.
  - A divider (top border), shown only when words or the pick line come before the grammar block.
  - Grammar title.
  - Source line rendered as `From {lesson}`, e.g. "From Lesson 2 · Nouns and adjectives". CSS
    `text-transform: uppercase` with letter spacing, as in 4b; the DOM text stays mixed case for
    tests and screen readers.
  - Note.
- **Rationale**: Only presentation changes (spec Assumptions: 008 content and rules stay).

## R8. Toggle sizing and keyboard

- **Decision**: `min-height: 44px; min-width: 44px` (renders ~50 px tall as in the mockup),
  2 px border with a 4 px darker bottom edge like other chunky controls, 12 px radius, visible
  focus ring from the existing `:focus-visible` rule. Continue keeps `focusOnMount`, so Enter still
  continues; Tab reaches the toggle. Native button gives Enter and Space.
- **Rationale**: FR-006, FR-007, Principle V.

## R9. Testing

- **Decision**: Update the 008 integration tests (`lessonFlow`, `practiceFlow`) to open "Why?"
  before checking the explanation, and assert the status region no longer contains it. Add
  integration tests for:
  - hidden by default;
  - `aria-expanded` and the label swap;
  - Hide;
  - reset on the next mistake and on the retry;
  - no toggle after a right answer;
  - focus stays on Continue, and the keyboard toggle;
  - scores and saved data are unchanged whether the explanation is opened or not.
  Layout (60% cap, only the card scrolls, 360 px, mockup match) cannot be measured in jsdom, so
  it gets a written manual check in quickstart.md (Principle IV exception).
