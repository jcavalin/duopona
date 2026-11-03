# Data Model: Daily Goal and Streak

## Day (value)

`YYYY-MM-DD` string of the device's local calendar date (research R1). Compared as strings.

## Streak record (`state.streak`, saved as `duopona:streak` v1)

| Field | Type | Rule |
|-------|------|------|
| `lastDay` | Day \| `null` | Last day the daily goal was met; `null` = never |
| `current` | integer ≥ 0 | Streak length on `lastDay`; 0 only when `lastDay` is `null` |
| `best` | integer ≥ `current` | Longest streak ever reached (FR-007) |

Empty record: `{ lastDay: null, current: 0, best: 0 }`.

### Transition `goalMet(day)` (a session was finished on `day`)

| Before | After |
|--------|-------|
| `lastDay` is `null` | `lastDay = day`, `current = 1` |
| `lastDay === dayBefore(day)` | `lastDay = day`, `current + 1` |
| `lastDay < dayBefore(day)` (gap of ≥ 1 day) | `lastDay = day`, `current = 1` |
| `lastDay >= day` (same day, or clock moved backwards) | unchanged |

After any change: `best = max(best, current)`.

### Derived values (selectors take `day`)

| Selector | Value |
|----------|-------|
| `selectMetToday(day)` | `lastDay !== null && lastDay >= day` |
| `selectStreak(day)` | `current` if `lastDay >= dayBefore(day)`, else `0` (FR-005) |
| `selectBestStreak` | `best` |
| today's goal progress | `selectMetToday(day) ? 1 : 0` of goal `1` (R3) |

## Daily goal (constant)

`DAILY_GOAL = 1` finished session (lesson, practice or review), FR-010.

## Session (changed, `state.session`)

| Field | Change |
|-------|--------|
| `goalMet` | new, `boolean`, `false` at start; set by `markGoalMet()` when the finish of this session met today's goal (research R5). Not saved |

## Unchanged

Lesson progress (`duopona:progress` v1), word records (`duopona:words` v1).
