# UI Contract: Leave Confirmation Dialog

## When it opens

| Screen | X | Browser / device Back |
|--------|---|-----------------------|
| Lesson intro | leaves (unchanged) | leaves (unchanged) |
| Exercise (lesson, practice, review), with or without the feedback sheet | opens dialog | opens dialog |
| Summary | leaves (unchanged) | leaves (unchanged) |

## Content

| Part | Lesson | Practice / review |
|------|--------|-------------------|
| Role / name | `dialog`, named by the title | same |
| Title (heading) | "Leave this lesson?" | "Leave this practice?" |
| Message (description) | "Your progress in this lesson will be lost." | "Your progress in this practice will be lost." |
| Primary button (initial focus) | "Keep learning" | "Keep learning" |
| Secondary button | "Leave" | "Leave" |

## Behaviour

| Action while open | Result |
|-------------------|--------|
| Keep learning / Escape / tap backdrop | Dialog closes; session unchanged; focus on X |
| Leave | Home lesson path; session discarded as quitting does today |
| Back again | Dialog stays open; nothing leaves |
| Tap/keys on the exercise behind | Ignored (inert; number keys ignored) |
| X tapped twice quickly | The second tap lands on the backdrop and closes the dialog (Keep learning); it never leaves |

## Props (`LeaveDialog`)

- `title: string`
- `message: string`
- `onStay(): void`
- `onLeave(): void`

`ExerciseScreen` gets a `leaveTitle`/`leaveMessage` pair. Lessons use the defaults and
`PracticeRoute` passes the practice wording.
