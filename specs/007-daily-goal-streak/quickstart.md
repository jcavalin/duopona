# Quickstart: Validate Daily Goal and Streak

## Prerequisites

- `npm install` (no new packages).
- Automated gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa`, all passing.
- Manual checks: the owner runs `npm run preview` (or `npm run dev`); Chrome DevTools device
  mode at **360×740**. Reference: [contracts/ui-screens.md](contracts/ui-screens.md),
  [contracts/streak-storage.md](contracts/streak-storage.md), [data-model.md](data-model.md).
- To start clean: DevTools → Application → Local storage → delete `duopona:streak` (and
  `duopona:progress`, `duopona:words` for a fresh learner).
- To simulate days: edit `duopona:streak` (e.g. set `lastDay` to yesterday's date) and reload,
  or change the system date.

## Automated coverage (what `npm test` must prove)

| Area | Proves |
|------|--------|
| `today` / `dayBefore` | Local date, zero padding, month/year/leap-day boundaries, DST change days (R1) |
| `streak` slice | Every row of the `goalMet` table; `best` follows; 30+ simulated days with gaps and a backwards clock equal a reference count (SC-003) |
| Selectors | Shown streak 0 after a gap, kept on "yesterday", met-today flag, clock backwards |
| Streak storage | Round trip; every invalid case in the contract → empty; bad `duopona:streak` leaves progress and words intact, and the reverse (SC-005) |
| Session slice | `goalMet` false at start, `markGoalMet` sets it |
| Integration | Home shows 0 and "0 / 1 session today"; finishing a lesson shows "Daily goal met" and Streak 1; home then shows "Done for today" and met label; a second session the same day shows no announcement; practice and review count; quitting counts nothing; next simulated day keeps N then N + 1; skipped day shows 0; lesson progress and words unchanged (FR-014) |

## Manual checks (Chrome)

| # | Steps | Expected |
|---|-------|----------|
| S1 | Clean storage, open `#/` | Top bar: muted flame 0; card "Daily goal", "0 / 1 session today", empty bar; no best streak line |
| S2 | Play lesson 1 to the summary | "Lesson complete!", "Daily goal met", stat cards Correct, Unlocked, Streak "1 day" |
| S3 | Continue home | Flame coloured, 1; card "Done for today", full bar, "Best streak: 1 day" |
| S4 | Run Practice to the end | Normal "Practice complete!" summary with no streak block |
| S5 | Set `lastDay` in `duopona:streak` to yesterday, reload; finish a session | Before: flame muted with the same number; after: number + 1, announcement shown |
| S6 | Set `lastDay` to three days ago, reload | Flame muted, 0; best streak unchanged |
| S7 | Set `duopona:streak` to `garbage`, reload | App loads with streak 0; lessons and Review state unchanged |
| S8 | At 360×740 view home and a summary with three stat cards | No horizontal scroll; counters fit in the top bar; cards readable |
| S9 | After one online load with `npm run preview`, go offline and finish a session | Streak updates the same way |

## Real devices (owner)

| # | Steps | Expected |
|---|-------|----------|
| S-D1 | On iPhone (Safari) and Android (Chrome), installed app: finish a session, close and reopen the app | Streak and "Done for today" kept; top bar and summary look right in the safe areas |
