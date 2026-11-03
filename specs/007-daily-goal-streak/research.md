# Research: Daily Goal and Streak

No open technical questions remained after the spec's clarifications (goal = finished
sessions, fixed at 1/day). These are the design decisions.

## R1. Representing days

- **Decision**: A day is a `YYYY-MM-DD` string of the device's **local** date
  (`getFullYear/getMonth/getDate`, zero-padded), from `today(now = new Date())` in
  `src/lib/days.ts`. `dayBefore(day)` builds `new Date(y, m - 1, d - 1)` and formats it, which
  handles month/year ends and DST (local midnight arithmetic, no 24 h subtraction). Strings
  compare correctly with `<`/`===`. The thunk and the home screen call `today()` and pass the
  string into reducers and selectors.
- **Rationale**: FR-003 asks for the local calendar date; strings are easy to store, compare
  and test; reducers stay pure (Principle III).
- **Alternatives**: `toISOString().slice(0,10)` (UTC, wrong near midnight outside UTC);
  timestamps (need time-zone handling everywhere); a date library (new dependency, Principle I).

## R2. Streak state and transitions

- **Decision**: Store `{ lastDay: string | null, current: number, best: number }`, where
  `lastDay` is the last day the goal was met and `current` the streak length on that day.
  `goalMet(day)`:
  - `lastDay === null`, or `lastDay < dayBefore(day)` (a day was missed): `current = 1`
  - `lastDay === dayBefore(day)`: `current += 1`
  - `lastDay >= day` (same day, or clock moved backwards): no change
  - then `best = max(best, current)`, `lastDay = day` (only when changed).

  The **shown** streak is derived: `current` if `lastDay` is `day` or `dayBefore(day)` or later
  than `day` (clock backwards), else 0 (FR-005). "Met today" = `lastDay >= day`.
- **Rationale**: Three values cover FR-004 to FR-007 and every edge case; no history to grow
  or validate. Treating a later `lastDay` as "today" satisfies the clock-backwards edge case
  (never double count, never negative).
- **Alternatives**: Storing a list of practice days (more data, more validation, only needed
  for a calendar view, which is out of scope); recomputing from lesson `completedAt` (spec
  assumption: not used; practice sessions leave no record).

## R3. Today's goal progress

- **Decision**: With a fixed goal of 1 session, today's progress is `metToday ? 1 : 0`, shown
  as "0 / 1" or "1 / 1"; no per-day session counter is stored. Spec US2 scenario 4 was
  aligned on 2026-11-03: after the goal is met the display stays "1 / 1".
- **Rationale**: Principle I; a counter would only matter for goals above 1.
- **Alternatives**: Counting sessions per day for display ("3 / 1"): extra state for little
  value.

## R4. Storage

- **Decision**: New key `duopona:streak`, value `{ version: 1, lastDay, current, best }`;
  loaded at store creation and saved on change, like `duopona:words`. Invalid data → empty
  streak. See [contracts/streak-storage.md](contracts/streak-storage.md).
- **Rationale**: FR-011/FR-012 require independence from progress and words; matches 006 R5.
- **Alternatives**: Bumping `duopona:progress` to v2 (migration, coupled failures).

## R5. Where the goal is recorded, and the summary announcement

- **Decision**: `continueAndRecord` already runs when a session finishes. It now, for **every**
  session kind, when status becomes `finished`: reads `today()`, checks `selectMetToday`
  before, dispatches `goalMet(day)`, and if it was not met before dispatches
  `markGoalMet()` on the session (sets `session.goalMet = true`). Both routes pass
  `streak={selectStreak(day)}` to `LessonSummary` only when `session.goalMet`; the summary
  then shows "Daily goal met" and a Streak stat card. Quitting never reaches `finished`, so
  nothing is counted (FR-001).
- **Rationale**: One place records completion; the session already lives exactly as long as
  the summary, so the flag disappears with it. Reducers stay pure (date read in the thunk).
- **Alternatives**: Middleware listening for `continueLesson` (more machinery); deriving in
  the route (cannot tell "met by this session" from "met earlier today" after the fact).

## R6. Visuals

- **Decision**: New `FlameIcon` (inline SVG, `currentColor`) next to the existing top-bar
  counter: orange (new `--streak` token, e.g. `#ff9600`, next to the existing `--gold`
  tokens in src/index.css; gold already means "lesson/unlocked") when met today,
  `--icon-muted` when not yet today or 0. Text contrast checked against `--bg` (≥ 4.5:1). Daily-goal card below
  the course banner: label "Daily goal", text "0 / 1 session today" or "Done for today", a
  thin progress bar, and "Best streak: N days". Summary: a third stat card "Streak" with
  "N days" in the streak colour. Styles reuse existing card/label classes. No new mockup; the
  owner reviews in the browser (quickstart S1–S3).
- **Rationale**: Familiar language-app pattern; inline SVG keeps offline behaviour unchanged.
- **Alternatives**: Emoji 🔥 (renders differently per platform, can't follow muted state).

## R7. Updating across midnight

- **Decision**: The home screen computes `today()` at render; it is not re-rendered on a
  timer. Spec edge case accepts correctness on the next render (after a session or reload).
  Returning from a session re-renders the home screen.
- **Rationale**: Principle I; no timers.
- **Alternatives**: A midnight timer or `visibilitychange` listener (extra code for a rare
  case; can be added later if the owner sees stale counts on an installed app).
