# UI Contract: Wrong-Answer Sheet with Collapsible Explanation

Supersedes 008 contract F1 for the wrong-answer sheet. The right-answer sheet ("pona! Correct.")
is unchanged. Design: mockups 04a and 04b.

## C1. Collapsed (default, mockup 4a)

```text
┌──────────────────────────────────────────┐
│ (✕)  Not quite               [ Why?  ⌄ ] │  ← status region: title + answer only
│      Correct answer:                      │
│      telo pona                            │
│ [            CONTINUE            ]        │  focused on open
└──────────────────────────────────────────┘
```

- Toggle: `<button type="button" aria-expanded="false" aria-controls="<card id>">`. Its accessible
  name is "Why?"; the chevron is decorative (`aria-hidden`).
- The card is in the DOM with `hidden` and is not visible or announced.
- No toggle when the explanation would be empty, or after a right answer.

## C2. Expanded (mockup 4b)

```text
┌──────────────────────────────────────────┐
│ (✕)  Not quite               [ Hide  ⌃ ] │  pressed background
│      Correct answer:                      │
│      telo pona                            │
│ ┌──────────────────────────────────────┐ │
│ │ telo: water, liquid                   │ │  word list (<ul>)
│ │ pona: good, useful, simple            │ │
│ │ <pick> means <meaning>                │ │  only for a single-word wrong pick
│ │ ──────────────────────────────────    │ │  divider before grammar (if anything above)
│ │ Describing words come after the noun  │ │  grammar title (bold)
│ │ FROM LESSON 2 · NOUNS AND ADJECTIVES  │ │  "From <chapter> · <title>", uppercase by CSS
│ │ pona describes telo, so it goes …     │ │  note
│ └──────────────────────────────────────┘ │  ← only this card scrolls
│ [            CONTINUE            ]        │  always visible
└──────────────────────────────────────────┘
```

- Toggle: `aria-expanded="true"`, accessible name "Hide", chevron rotated up.
- Card: no `hidden`; follows the heading row in DOM order, outside the `role="status"` region.
- Activating "Hide" returns to C1. Focus stays on the toggle while toggling.

## C3. Behaviour

| Event | Result |
|-------|--------|
| Wrong answer | C1, focus on Continue |
| Tap / Enter / Space on "Why?" | C2 |
| Tap / Enter / Space on "Hide" | C1 |
| Continue (either state) | Next step exactly as before; the next wrong sheet opens in C1 |
| Right answer | Unchanged right-answer sheet, no toggle |

## C4. Layout and style

- Sheet `max-height: max(60dvh, 360px)`; heading row and Continue do not shrink; the card scrolls
  (`overflow-y: auto`). No horizontal scrolling at 360 px; long glosses wrap.
- Toggle: at least 44 × 44 px, 2 px border `--explain-toggle-border`, text `--explain-toggle-text`,
  background transparent (C1) or `--explain-toggle-pressed` (C2).
- Card: background `--explain-bg`, 2 px border `--explain-border`, text `--explain-text`; source
  label `--explain-source`; divider `--explain-border`.
- The chevron rotation is not animated under `prefers-reduced-motion: reduce`.
- Same in lesson, practice and review sessions.
