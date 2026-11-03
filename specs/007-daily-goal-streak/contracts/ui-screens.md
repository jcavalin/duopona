# Contract: UI (Daily Goal and Streak)

Extends [004 ui-screens](../../004-ui-redesign/contracts/) and
[006 ui-screens](../../006-practice-weak-words/contracts/ui-screens.md). Texts are exact.
`N` = shown streak (data-model `selectStreak`), `B` = best streak.

## U1. Home top bar: streak counter

- Placed in the top bar next to the existing "done / total" counter, same size and weight.
- Content: flame icon + `N`.
- Colour: streak colour when met today; muted when not met today (including `N` = 0).
- Accessible label (on the element, icon hidden):
  - met today: `N day streak, practised today` (`1 day streak, …` singular)
  - not yet: `N day streak, not practised today`
- Not interactive. At 360 px the wordmark and both counters fit on one line.

## U2. Home: daily-goal card

Below the course banner, above the Practice row.

| State | Content |
|-------|---------|
| Not met today | label `Daily goal`; text `0 / 1 session today`; progress bar empty |
| Met today | label `Daily goal`; text `Done for today`; progress bar full |
| Always, when `B` ≥ 1 | `Best streak: B days` (`1 day` singular) |

The progress bar has `role="progressbar"`, `aria-valuemin=0`, `aria-valuemax=1`,
`aria-valuenow` 0 or 1, `aria-label="Daily goal"`.

## U3. Summary: goal met

Only on the summary of the session that met today's goal (FR-009), for lessons, practice and
review:

- Under the subtitle, the text `Daily goal met`.
- An extra stat card after the others: label `Streak`, value `N days` (`1 day`), in the
  streak colour. With three cards at 360 px the cards stay readable (wrap to a second row if
  needed, no horizontal scroll).

Later summaries the same day look exactly as before this feature.

## Unchanged

Lesson path, intros, exercise screens, Practice/Review buttons and hints.
