# UI Contract: Feedback Sheet with Explanation

## F1. Wrong-answer sheet

Replaces the bottom bar after a **wrong** answer (right-answer sheet unchanged: "pona! Correct.").

```text
┌──────────────────────────────────────────┐
│ (✕)  Not quite                            │  ← role="status" region starts
│      Correct answer:                      │
│      mi wawa                              │
│      ─────────────                        │
│      mi: I / me / we                      │  words list (FR-002)
│      wawa: strong / powerful / energy     │
│      sina means you                       │  wrong pick, multiple choice only (FR-003)
│      mi and sina need no li               │  grammar title (FR-004)
│      Lesson 4 · You and I                 │  book lesson
│      With mi alone as the subject, li is  │  note (FR-005)
│      left out.                            │  ← region ends; scrolls if too tall
│ [            CONTINUE            ]        │  always visible, outside scroll area
└──────────────────────────────────────────┘
```

- **Order**: title, correct answer, word meanings, wrong pick, grammar block. Sections without
  content are omitted entirely (no empty headings).
- **Accessibility**: one `role="status"` region holds title, answer and explanation, so it is
  announced together (FR-007). Words are a list (`<ul>`); the grammar title is a heading-styled
  element inside the region. Continue keeps `autoFocus`.
- **Text**: "word: meaning" lines; wrong pick as "<word> means <meaning>"; lesson line as
  "<chapter> · <lesson title>" (e.g. "Lesson 4 · You and I", "Dictionary · More Words 1").
- **Layout**: sheet `max-height: 75dvh`; the status region scrolls (`overflow-y: auto`);
  Continue stays below it. At 360 px nothing scrolls horizontally; long glosses wrap
  (SC-004). Colours use the existing error tint and error text tokens.
- **Sessions**: identical in lesson, practice and review; the lesson named is the exercise's own.
