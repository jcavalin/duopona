# Data Model: Collapsible Mistake Explanations

No stored data, no Redux changes, no course content changes.

## Explanation visibility (UI state, not stored)

| Field | Type | Initial | Notes |
|-------|------|---------|-------|
| `open` | boolean | `false` | Local to the wrong-answer feedback sheet |

**Transitions**

- The sheet opens after a wrong answer → `open = false`.
- "Why?" is activated → `open = true`.
- "Hide" is activated → `open = false`.
- Continue → the sheet unmounts and the state is discarded. The next sheet starts at `false`
  (FR-004).

**Rules**

- The toggle exists only when `explainMistake()` returns an explanation with at least one line
  (FR-002).
- `open` has no effect on scoring, word mistakes, progress, streaks or `localStorage` (FR-008).

## Reused (unchanged)

- **Explanation** from 008 (`src/content/explanations.ts`, `explainMistake`): `words`,
  `wrongPick`, `grammar { title, lesson, note }`.
