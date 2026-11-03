# Quickstart: Validate Practice and Review Weak Words

## Prerequisites

- `npm install` (no new packages).
- Automated gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa`, all passing.
- Manual checks: the owner runs `npm run preview` (or `npm run dev`); Chrome DevTools device
  mode at **360×740**. Reference: [contracts/ui-screens.md](contracts/ui-screens.md),
  [contracts/words-storage.md](contracts/words-storage.md).
- To start clean: DevTools → Application → Local storage → delete `duopona:progress` and
  `duopona:words`.

## Automated coverage (what `npm test` must prove)

| Area | Proves |
|------|--------|
| `testedWords` | Words from prompt (tp-en) or answer (en-tp), lower-cased, punctuation dropped, only course words, no duplicates (R1) |
| `pickPractice` / `pickReview` | Only completed-lesson keys, ≤ 10, no duplicates; review: highest-count words included, every pick has a weak word when ≥ 10 exist, random fill otherwise (R3, SC-002, SC-003) |
| `words` slice | +1 on miss, −1 on known, removal at 0, never negative (FR-008, FR-009, SC-004) |
| Word storage | Round trip; every invalid case in the contract reads as empty; a bad `duopona:words` leaves progress intact and the reverse (SC-006) |
| Session slice | Keys across lessons, `total`, retry at the end, `startPractice([])` → no session |
| Integration | Practice/review buttons available or not with the right hint; full practice run to "Practice complete!" with lesson progress unchanged (SC-005); quitting discards the session but keeps word records; a wrong first answer then right on retry gives +1 only; review offered after a miss and gone after answering those words right |

## Manual checks (Chrome)

| # | Steps | Expected |
|---|-------|----------|
| P1 | Clean storage, open `#/` | "Practice" and "Review weak words" shown muted with hint "Finish a lesson to unlock practice."; tapping does nothing |
| P2 | Complete lesson 1 with no mistakes, return home | Practice active; Review still muted, hint "No weak words yet." |
| P3 | Tap Practice | First exercise shows at once; X is "Quit practice"; counter "1/10" |
| P4 | Answer one exercise wrong, finish the session | Missed exercise repeats at the end; "Practice complete!", "Practice", "Correct 9 / 10"; Continue → home with lesson list unchanged; Review now active |
| P5 | DevTools → Local storage → `duopona:words` | `{"version":1,"mistakes":{…}}` with the words of the missed exercise |
| P6 | Tap Review weak words; answer every exercise right first time; repeat until Review turns muted | Each review contains the missed words; each first-try correct answer removes one mistake per word, so a word with N mistakes needs N first-try correct answers; once all are cleared, Review is muted again and `mistakes` is `{}` |
| P7 | Start Practice, answer two exercises, quit with X | Back home; lesson list unchanged; word records from the two answers kept |
| P8 | Set `duopona:words` to `garbage`, reload | App loads, Review muted, lesson progress intact |
| P9 | At 360×740 view home and a practice session | No horizontal scroll; both buttons ≥ 44 px tall, readable, side by side or stacked |
| P10 | After one online load with `npm run preview`, go offline and run a practice session | Works the same |

## Real devices (owner; can be combined with 003/004's open device checks)

| # | Steps | Expected |
|---|-------|----------|
| P-D1 | iPhone Safari and Android Chrome, browser and installed: P3, P4 (one session each) | Buttons easy to tap, no layout issues, practice works installed and offline |

Record results under the matching tasks in `tasks.md`.
