# Quickstart: Mascot and App Icon

## Automated

```sh
npm test          # unit + integration (mascot expressions, summary, a11y)
npm run lint
npm run build
npm run test:pwa  # mascot SVGs precached; icons match docs/design/app-icon/
```

## Manual check (looks and icons; jsdom does not render images)

Run `npm run dev` and open the app in a desktop browser (narrow window or device emulation).

| # | Check | Expected |
|---|-------|----------|
| M1 | Multiple-choice exercise (mockup 03) and word-bank exercise (05) | Idle mascot at the left, prompt in a bubble with a tail pointing at it; no drop/bubble icon |
| M2 | Answer wrong (04, 04a), then open "Why?" (04b) | Sad mascot; explanation behaves as in 010 |
| M3 | Answer right (06), Continue | Happy mascot, then idle on the next exercise |
| M4 | Finish a lesson (07) and a Practice session | Celebrating mascot centred above the heading, no star badge |
| M5 | 360 px width, longest prompt | Mascot and bubble side by side, the text wraps, no horizontal scroll |
| M6 | Browser tab | Favicon is the mascot on a rounded dark square |
| M7 | Phone: install (Android Chrome) / add to home screen (iOS Safari); then airplane mode and play an exercise | Home-screen icon is the mascot (whole mascot inside Android's shape); the mascot shows offline |

Record results (or an owner waiver) in tasks.md, as Principle IV requires.
