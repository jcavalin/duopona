# Quickstart: Study in French

## Automated

```sh
npm test        # content rules for en, pt-BR, fr; P1–P3/P6–P8 and F1–F2 for French;
                # strings parity; detection; storage; French session + settings flows
npm run lint
npm run build
npm run test:pwa
```

Expected: everything passes, and the English and Portuguese tests still pass unchanged.

## Manual checks (browser/device only, Constitution IV)

Run `npm run dev` on desktop. On phones, use `npm run preview` or the deployed build.

| # | Check | Expected |
|---|-------|----------|
| M1 | Desktop Chrome, no saved choice: browser languages Français (France) first; then Français (Canada); then English first with Français second | Français, Français, English. `document.documentElement.lang` matches |
| M2 | Desktop: gear → Français, reload, offline (DevTools), reload; then switch to Português and English | French persists, offline too. Every switch is instant. Progress, streak and weak words are unchanged |
| M3 | 360 px width, French: home (top bar, "Revoir les mots difficiles"), settings with three options, a lesson intro, a word bank, the wrong-answer sheet with "Pourquoi ?" open, the leave dialog, the summary | No horizontal scroll and no clipped text. No `?`, `!` or `:` starts a line |
| M4 | Android Chrome, installed: choose Français, close and reopen | Opens in French |
| M5 | Owner review of the French course (SC-006): read every intro, play every exercise | Natural French; one correct answer per exercise; notes in tasks.md |
| M6 | iOS Safari (browser and installed): switch to Français, close by tapping the backdrop | Switches at once; safe areas respected |
