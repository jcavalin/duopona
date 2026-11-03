# Contract: UI Screens

What the learner sees and can do on each screen. Tests target these labels and roles
(behavior, not implementation — Constitution Principle IV).

## Routes

| URL | Screen |
|-----|--------|
| `#/` | Lesson list |
| `#/lesson/:lessonId` | Exercise screen; summary once the lesson is finished |
| anything else, or an unknown `lessonId` | Redirect to `#/` |

Browser Back from a lesson returns to the lesson list and discards the session (same as Quit).
Opening a lesson URL directly (bookmark, reload mid-lesson) starts that lesson from the first
exercise.

## Lesson list (`#/`)

- Heading: "Duopona".
- One lesson card per lesson (only "Basic Words" in this feature — FR-014).
- A completed lesson shows a "Completed" badge and its latest score (e.g., "8/10") — FR-010.
- Activating a lesson card starts the lesson — FR-002.

## Exercise screen (session `answering` / `feedback`)

- Progress indicator: "N of M" and a progress bar — FR-007.
- "Quit" button returns to the lesson list without saving — FR-013.
- Prompt text with an instruction:
  - Multiple choice: "Select the correct meaning" / "Select the Toki Pona word".
  - Word bank: "Translate this sentence".
- **Multiple choice**: options are radio-like buttons; one can be selected.
- **Word bank**: tapping a tile in the bank moves it to the answer line; tapping a tile in the
  answer line moves it back.
- "Check" button: disabled until an answer is given.
- **Feedback** (after Check): a banner reading "Correct!" or "Wrong — correct answer: …"
  (FR-006); answer inputs become read-only; "Continue" button appears.

## Summary screen (session `finished`)

- Heading: "Lesson complete!".
- Text: "You got X of M right on the first try." — FR-008.
- "Back to lessons" button returns to the lesson list, which now shows the lesson as completed.
