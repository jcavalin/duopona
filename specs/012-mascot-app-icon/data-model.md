# Data Model: Mascot and App Icon

No stored data changes: no `localStorage` keys, Redux state or course content are added or
changed.

**Mascot expression** (derived, not stored):

| Screen state | Expression |
|--------------|------------|
| Exercise, before Check (`result` undefined) | `idle` |
| Exercise, feedback sheet after a wrong answer (`result: 'wrong'`) | `sad` |
| Exercise, feedback sheet after a right answer (`result: 'correct'`) | `happy` |
| Session summary (lesson or practice) | `celebrate` |

Transitions: idle → sad or happy on Check. A new exercise or a retry remounts the exercise,
which goes back to idle.
