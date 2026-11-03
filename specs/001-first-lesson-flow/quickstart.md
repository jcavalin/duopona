# Quickstart: First Lesson Flow

How to run the app and prove the feature works.

## Prerequisites

- Node.js 20+ and npm.

## Setup and run

```bash
npm install
npm run dev        # open the printed local URL
npm test           # run all automated tests once
npm run build      # production build into dist/
```

## Manual validation scenarios

| # | Steps | Expected | Covers |
|---|-------|----------|--------|
| 1 | Open the app in a fresh browser profile | Lesson list shows only "Basic Words", not completed | FR-001, FR-014 |
| 2 | Start "Basic Words" | First exercise shown with "1 of N" | FR-002, FR-007 |
| 3 | Press Check with nothing selected | Check is disabled | Edge case |
| 4 | Answer a multiple-choice exercise correctly | "Correct!" + Continue | FR-006 |
| 5 | Answer an exercise wrong | "Wrong — correct answer: …" | FR-006 |
| 6 | Build a word-bank answer, remove a tile, rebuild, Check | Tiles move between bank and answer line; answer checked | FR-005 |
| 7 | Finish the remaining exercises | The missed exercise appears again before the summary | FR-015 |
| 8 | Reach summary | "You got X of N right on the first try." | FR-008 |
| 9 | Back to lessons | "Basic Words" shows Completed + score | FR-009, FR-010 |
| 10 | Reload the page | Still shown as Completed | FR-009, SC-004 |
| 11 | Start lesson, Quit mid-way, reload | Lesson state unchanged (not newly completed) | FR-013 |
| 11b | Start lesson, answer one exercise, press browser Back | Lesson list shown; reopening the lesson starts at "1 of N" | FR-013, routing |
| 11c | Open `#/lesson/does-not-exist` | Redirected to the lesson list | routing |
| 12 | DevTools → set `localStorage["duopona:progress"] = "garbage"`, reload | App loads with no progress, no error | FR-012 |

## Automated coverage

`npm test` MUST cover: session reducer transitions (see
[data-model.md](data-model.md#state-transitions)), progress persistence read/write rules (see
[contracts/progress-storage.md](contracts/progress-storage.md)), and a full lesson flow test
through the UI (see [contracts/ui-screens.md](contracts/ui-screens.md)), including a simulated
reload.
