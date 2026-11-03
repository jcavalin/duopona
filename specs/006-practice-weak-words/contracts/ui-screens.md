# UI Contract: Practice and Review Screens

Additions to the screens in [004 ui-screens](../../004-ui-redesign/contracts/ui-screens.md).
Tests query by these roles and names. "(new)" marks a new element; everything not listed is
unchanged, including all lesson texts.

## S1. Lesson path (home, `#/`): practice row (new)

Placed under the banner, above the path. Two buttons side by side (each ≥ 44 px tall; they
stack when there is no room at 360 px), in the chunky button shape (styles below).

| Element | Role / name | Behavior |
|---------|-------------|----------|
| Practice | `button` "Practice" | Available: opens `#/practice/practice`. Unavailable (no completed lesson): `aria-disabled="true"`, does nothing, `aria-describedby` the hint |
| Review | `button` "Review weak words" | Available (FR-013): opens `#/practice/review`. Unavailable: `aria-disabled="true"`, does nothing, `aria-describedby` the hint |
| Hint | text, shown only when a button is unavailable | "Finish a lesson to unlock practice." (no completed lesson), otherwise "No weak words yet." (review unavailable) |

Practice uses the green chunky `primary-button`; Review weak words uses the same shape in an outline style (background `var(--bg)`, `2px` `var(--line)` border, `4px` bottom edge, `var(--primary-text)` text).

Unavailable buttons stay focusable so the reason is announced; they use the muted style of a
locked node.

## Route `#/practice/:kind`

| `kind` | Session | When not available |
|--------|---------|--------------------|
| `practice` | 10 random exercises from completed lessons (research R3) | redirect to `#/` |
| `review` | 10 exercises favouring weak words (research R3) | redirect to `#/` |
| anything else | – | redirect to `#/` |

No introduction screen: the first exercise shows immediately. Reloading the route starts a new
session. Leaving it (Quit, browser Back) discards the session.

## S3. Exercise in practice

Same as a lesson exercise, except:

| Element | Role / name |
|---------|-------------|
| Close | `button` "Quit practice" (lessons keep "Quit lesson"); goes to `#/` |
| Progress | `progressbar` "Practice progress", max = session total (lessons keep "Lesson progress") |

## S4. Feedback sheet

Unchanged.

## S5. Practice complete

The lesson summary component with practice texts:

| Element | Role / name | Content |
|---------|-------------|---------|
| Title | `heading` level 1 "Practice complete!" | |
| Subtitle | text | "Practice" or "Weak words" |
| Correct card | text "Correct" + "X / Y" | First-try correct out of session total |
| Unlocked card | – | Never shown |
| Continue | `button` "Continue", focused | Goes to `#/` |
| Again | `button` "Practise again" | Starts a new session of the same kind on the same route; if the kind is no longer available (e.g. no weak words left), goes to `#/` |
