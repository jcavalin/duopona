# Quickstart: Wrong-Answer Sheet Layout Fix

## Automated

```bash
npm test          # all unit and integration tests, including the C5 structure test
npm run lint
npm run build
```

Expected: all pass; the existing 010 "Why?"/"Hide" tests pass unchanged.

## Manual checks

### M1. 360 px layout in three languages (headless Chrome, implementer)

On the built app at 360 × 800, for English, Portuguese and French:

1. Answer a multiple-choice exercise wrong (one-word answer).
   - Title on one line; label and answer use the full width beside the icon.
   - "Why?" on its own line under the answer, starting where the text starts.
   - No sideways scrolling.
2. Tap "Why?": it becomes "Hide" in the same place; the card opens below; Continue stays visible.
3. Answer a word-bank exercise wrong (sentence answer): the answer wraps across the full text width,
   and the toggle stays below it.
4. Answer right: the right-answer sheet looks as before.

Compare with `docs/design/mockups/04c-wrong-answer-layout-fix.png` ([contract C1, C2, C5](contracts/ui-feedback-sheet.md)).

### M2. Phone (owner; may be waived)

Repeat M1 steps 1–3 on Android Chrome and iOS Safari, in the browser or installed.
