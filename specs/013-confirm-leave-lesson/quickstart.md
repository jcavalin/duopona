# Quickstart: Confirm Before Leaving a Lesson

## Automated

```sh
npm test        # integration tests for X, Back, Keep learning, Leave, Escape, backdrop, practice wording
npm run lint
npm run build
```

Expected: everything passes. The existing quit/Back tests confirm with "Leave" and still find the
session discarded.

## Manual checks (browser/device only, Constitution IV)

Run `npm run dev` (desktop), and use the deployed build or `npm run preview` on phones.

| # | Check | Expected |
|---|-------|----------|
| M1 | Desktop: start Lesson 1, answer once, tap X | Dialog centred over a dimmed screen; focus on "Keep learning"; Tab cycles only the two buttons; Escape closes it; X, then "Keep learning" (mouse and Enter): focus is back on X both times; still on the same exercise |
| M2 | Android Chrome, installed: open a lesson from the path, answer once, use the back gesture | Dialog opens and the lesson stays. "Leave" goes to the path. Back again while open keeps it open. (A lesson opened directly as the first history entry cannot block Back; research R3) |
| M3 | iOS Safari (browser and installed): X, then tap the backdrop; then X and "Leave" | Backdrop tap keeps the lesson; Leave returns to the path; safe areas respected |
| M4 | 360 px width: X with the wrong-answer sheet and explanation open | Dialog fits with no horizontal scroll; both buttons fully visible; after "Keep learning" the sheet and explanation are as before |
