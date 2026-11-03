# Contract: UI Screens (changes from feature 001)

Base contract: [../001-first-lesson-flow/contracts/ui-screens.md](../001-first-lesson-flow/contracts/ui-screens.md).
Only differences are listed. All screens MUST meet Constitution V screen rules: targets
≥ 44×44 px, usable at 360 px, no horizontal scroll, content inside safe areas.

## Lesson list (`#/`)

- Lists all 17 lessons in course order. Each card shows lesson number, title, the source label
  and the exercise count: "Book: Lesson 11 · 13 exercises" for book chapters, and
  "Extra: dictionary words · 13 exercises" for the More Words lessons (`chapter` = `"Dictionary"`).
  The lesson intro uses the same source label.
- **Unlocked, not completed**: card is a link to `#/lesson/:id`.
- **Completed**: link + "Completed · X/Y" badge (as in 001).
- **Locked**: not a link; shows "Locked" and the hint "Complete the previous lesson to unlock";
  exposed to assistive tech as disabled (`aria-disabled="true"`).
- Footer credit (FR-011): "Course based on *Toki Pona: The Language of Good* by Sonja Lang ·
  tokipona.org" (link to `https://tokipona.org`, opens in a new tab with `rel="noopener"`).

## Lesson intro (`#/lesson/:id`, before Start)

- Heading: lesson title; sub-heading: book chapter.
- "New words" list: each word with its meaning from `vocabulary.ts`.
- Grammar section: `grammar.title` and its paragraphs.
- "Start" primary button (full width) → first exercise. "Back" returns to the list.

## Lesson route guards

| Situation | Result |
|-----------|--------|
| Unknown id (incl. old `basics-1`) | Redirect to `#/` (unchanged) |
| Locked lesson | Redirect to `#/` |

## Exercise screen and summary

Unchanged behavior. "Quit" grows to a ≥ 44 px touch target.
