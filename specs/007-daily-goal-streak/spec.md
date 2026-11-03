# Feature Specification: Daily Goal and Streak

**Feature Branch**: `007-daily-goal-streak`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "Daily goal / streak: encourage a little practice every day.
Learners see a streak of consecutive days on which they practised, and a small daily goal they
can meet; the app stays fully offline with progress stored locally." (ROADMAP.md, Next:
"Daily goal / streak: encourage a little practice every day.")

## Clarifications

### Session 2026-11-03

- Q: What should the daily goal count? → A: Finished sessions (lesson, practice or review).
- Q: Is the goal fixed or learner-chosen? → A: Fixed; set to 1 finished session per day.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Streak of practice days (Priority: P1)

A learner finishes a lesson, a practice session or a weak-word review. That day now counts as a
practice day. The home screen top bar shows a streak counter: the number of consecutive days,
ending today or yesterday, on which they met the daily goal. Coming back the next day and
finishing a session again raises it by one; skipping a whole day resets it.

**Why this priority**: The streak is the main daily motivator and needs only "did the learner
practise today", so it is valuable on its own.

**Independent Test**: With the device date set to successive days, finish one session per day
for three days and confirm the counter reads 1, 2, 3; skip a day and confirm it shows 0, then 1
after the next finished session.

**Acceptance Scenarios**:

1. **Given** a learner has never practised, **When** they view the home screen, **Then** the
   streak counter shows 0.
2. **Given** a streak of 0, **When** the learner finishes a session that meets the daily goal,
   **Then** the streak becomes 1 and the counter shows it as met for today on returning home.
3. **Given** a streak of N met yesterday and not yet met today, **When** the learner opens the
   app, **Then** the counter still shows N, marked as not yet extended today.
4. **Given** a streak of N met yesterday, **When** the learner meets the goal today, **Then**
   the streak becomes N + 1.
5. **Given** the goal was last met two or more days ago, **When** the learner opens the app,
   **Then** the streak shows 0.
6. **Given** the learner already met the goal today, **When** they finish more sessions,
   **Then** the streak does not increase again today.
7. **Given** a learner quits a session before its end, **When** they return home, **Then**
   nothing is counted for the streak or the daily goal.

---

### User Story 2 - Daily goal progress (Priority: P2)

The home screen shows today's progress towards a small daily goal, "0 / 1 session today" before practising and "1 / 1" after,
with a simple progress indicator. When a finished session completes the goal, the summary
screen says so ("Daily goal met") and shows the new streak.

**Why this priority**: It makes "a little every day" concrete and gives a moment of reward,
but the streak alone already delivers the core habit loop.

**Independent Test**: Start a new day, finish sessions one by one, and confirm the progress
updates after each, the summary announces the goal once when it is reached, and progress
starts from zero the next day.

**Acceptance Scenarios**:

1. **Given** a new day, **When** the learner views the home screen, **Then** today's progress
   shows 0 towards the goal.
2. **Given** the learner finishes a session, **When** they return home, **Then** today's
   progress has increased by that session's contribution.
3. **Given** a finished session brings today's progress to the goal, **When** its summary
   appears, **Then** it says the daily goal is met and shows the updated streak.
4. **Given** the goal is already met today, **When** the learner finishes another session,
   **Then** progress keeps counting but the summary does not announce the goal again.
5. **Given** a learner views the home screen at a new day, **When** the screen appears,
   **Then** today's progress starts from zero.

---

### Edge Cases

- **Midnight during a session**: the session counts for the day on which it is finished.
- **Device date moved backwards** (time zone change, manual clock change): the streak and
  goal never become negative or count the same day twice; a date earlier than the last
  practice day is treated as that same day.
- **Travel across time zones**: days follow the device's local calendar date at the moment a
  session is finished; a lost or doubled day from a time-zone jump is accepted.
- **Saved data missing, unreadable or from an unknown format**: the streak starts from 0 and
  the app keeps working; lesson progress and word records are not affected.
- **Storage unavailable**: the streak and goal work for the current visit but are not kept.
- **Practice and review sessions**: they count exactly like lessons.
- **App left open across midnight on the home screen**: the counter is correct the next time
  the home screen is shown (e.g. after a session or reload); live updating at midnight is not
  required.

## Requirements *(mandatory)*

### Functional Requirements

**Counting practice**

- **FR-001**: A lesson, practice session or weak-word review MUST count towards today's goal
  only when finished (its summary is reached); quitting MUST NOT count.
- **FR-002**: Each finished session MUST add 1 to today's progress, whatever its number of
  exercises or score.
- **FR-003**: "Today" MUST be the device's local calendar date when the session is finished.

**Streak**

- **FR-004**: A day MUST count as a streak day when today's progress reached the daily goal on
  that day.
- **FR-005**: The streak MUST be the number of consecutive streak days ending today, or ending
  yesterday when today is not yet a streak day; otherwise it MUST be 0.
- **FR-006**: The home screen top bar MUST show the streak, distinguishing "already extended
  today" from "not yet extended today", with an accessible text label (e.g. "3 day streak,
  practised today").
- **FR-007**: The best (longest) streak reached MUST be kept and shown on the home screen.

**Daily goal**

- **FR-008**: The home screen MUST show today's progress towards the goal as a number and a
  progress indicator.
- **FR-009**: The session summary MUST say "Daily goal met" and show the streak when that
  session made today's progress reach the goal; it MUST NOT repeat this on later sessions the
  same day.
- **FR-010**: The daily goal MUST be fixed at 1 finished session per day; the learner cannot
  change it.

**Storage and constraints**

- **FR-011**: Streak and goal data MUST be saved on the device, survive reloads and app
  restarts, and be stored separately from lesson progress and word records so that a problem
  with one never resets the others.
- **FR-012**: Unreadable or unknown-format streak data MUST be reset to an empty streak
  without errors shown to the learner.
- **FR-013**: The feature MUST work fully offline, on 360 px wide screens, and in the
  installed app, like the rest of the app; it MUST NOT send any data off the device.
- **FR-014**: The feature MUST NOT change lesson completion, scores, unlocking or word records.

### Key Entities

- **Practice day**: a local calendar date plus the progress made towards the goal on it.
- **Streak record**: the last date the goal was met, the current streak length on that date,
  and the best streak ever reached.
- **Daily goal**: fixed at 1 finished session per day.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner can see their streak and today's goal progress on the home screen
  without any extra tap.
- **SC-002**: Meeting the daily goal takes about 5 minutes or less of practice for a
  learner who knows the material.
- **SC-003**: Over any sequence of simulated days (finished sessions, skipped days, clock moved
  backwards), the shown streak always equals the number of consecutive goal-met days ending
  today or yesterday; verified by automated tests over at least 30 simulated days.
- **SC-004**: After reload, restart or going offline, the streak, best streak and today's
  progress are unchanged in 100% of checks.
- **SC-005**: Corrupted or missing streak data never prevents the app from opening or resets
  lesson progress or word records.

## Assumptions

- Days follow the device's local calendar; there are no accounts, so streaks are per device
  and per browser (installed app and browser tab on the same device share it where the
  platform shares storage).
- No goal setting: a fixed goal keeps the home screen simple (Constitution Principle I).
- A missed day resets the streak to 0; there are no streak freezes, repairs or rewards.
- No reminders or notifications: they need permissions and background work beyond this
  feature's scope.
- No history calendar or statistics beyond current and best streak.
- Existing learners start with a streak of 0; past lesson completion dates are not used to
  rebuild a streak.
- The streak counter replaces nothing in the top bar; the existing "done / total" counter
  stays.
