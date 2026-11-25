# UI Contract: Wrong-Answer Sheet Layout (016)

Updates the layout in 010's contract (`specs/010-collapsible-explanations/contracts/ui-feedback-sheet.md`).
C3 (behaviour) and C4 (sizes, colours, scrolling) stay as they are. Design: mockup 04c.

## C1. Collapsed

```text
┌──────────────────────────────────────────┐
│ (✕)  Não é bem isso                       │  ← status region: title + answer only
│      Resposta correta:                    │
│      ken                                  │
│      [ Por quê?  ⌄ ]                      │  toggle: own line, aligned with the text
│ [            CONTINUAR           ]        │  focused on open
└──────────────────────────────────────────┘
```

## C2. Expanded

```text
┌──────────────────────────────────────────┐
│ (✕)  Não é bem isso                       │
│      Resposta correta:                    │
│      ken                                  │
│      [ Ocultar  ⌃ ]                       │  pressed background
│ ┌──────────────────────────────────────┐ │
│ │ explanation card (unchanged, 010 C2) │ │  ← only this card scrolls
│ └──────────────────────────────────────┘ │
│ [            CONTINUAR           ]        │  always visible
└──────────────────────────────────────────┘
```

## C5. Structure and layout rules

- Heading row: icon, then one text column that takes the rest of the width.
- The text column holds, in order: the `role="status"` element (title, label, answer), then the
  toggle. The toggle is never inside the status element.
- The toggle starts at the left edge of the text column, 12 px below the answer, at its natural
  width (not stretched).
- With no explanation there is no toggle and no gap below the answer.
- The same rules apply in English, Portuguese and French; no language-specific styles.
- The right-answer sheet is unchanged (it has no toggle; its text uses the same column).
