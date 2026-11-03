# Quickstart: Book-Based Toki Pona Course

## Run

```bash
npm install
npm run dev     # open the printed URL
npm test        # includes the course content rules (contracts/lesson-content.md)
npm run build
```

## Manual validation

Use a fresh browser profile (or clear `localStorage["duopona:progress"]`).

| # | Steps | Expected | Covers |
|---|-------|----------|--------|
| 1 | Open the app | 17 lessons in FR-001 order; only lesson 1 startable; others "Locked"; credit footer visible | FR-001, FR-011, FR-012 |
| 2 | Tap a locked lesson | Nothing starts | FR-012 |
| 3 | Open `#/lesson/pi` directly while locked | Redirected to the list | FR-012 |
| 4 | Start lesson 1 | Intro shows new words with meanings and the grammar explanation; "Start" begins exercises | FR-013 |
| 5 | Play lesson 1 with one wrong answer | Feedback, retry at end, summary — same as feature 001 | FR-009 |
| 6 | Back to list | Lesson 1 "Completed"; lesson 2 unlocked | FR-010, FR-012 |
| 7 | Reload | Same state as step 6 | SC-005 |
| 8 | Replay lesson 1 | Intro shown again; playable; score updated | FR-014 |
| 9 | Phone width 360 px (DevTools) on list, intro, exercise, summary | No horizontal scroll; all buttons ≥ 44 px tall | Constitution V |
| 10 | Old progress: set `localStorage["duopona:progress"]` to `{"version":1,"completedLessons":{"basics-1":{"firstTryCorrect":1,"total":1,"completedAt":"2026-11-01T00:00:00Z"}}}`, reload | App loads; nothing shown as completed | US2 AC2 |

## Content review (before merge)

For each lesson, a reviewer with the book open checks rules C5 (grammar flag truthful),
C6 (meanings), C7/C8 (single correct answer), C9 (nothing copied) from
[contracts/lesson-content.md](contracts/lesson-content.md).

## Unlock everything for testing

Complete lessons quickly by playing them, or in DevTools add every lesson id to
`completedLessons` in `localStorage["duopona:progress"]` and reload.
