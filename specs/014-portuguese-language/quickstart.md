# Quickstart: Study in Brazilian Portuguese

## Automated

```sh
npm test        # content rules for both languages (P1–P3, P6–P8), strings completeness,
                # language detection, settings storage, Portuguese session + settings flows
npm run lint
npm run build
npm run test:pwa
```

Expected: everything passes. The existing English tests run unchanged, because jsdom reports an
English device.

## Manual checks (browser/device only, Constitution IV)

Run `npm run dev` on desktop. On phones, use `npm run preview` or the deployed build.

| # | Check | Expected |
|---|-------|----------|
| M1 | Desktop Chrome: clear site data, set the browser language to Português (Brasil) first, open the app; then repeat with Português (Portugal), English and Français | Português, Português, English, English. `document.documentElement.lang` matches |
| M2 | Desktop: gear → Português, reload, go offline (DevTools), reload | The app opens in Portuguese, offline too. Progress, streak and weak words are unchanged |
| M3 | 360 px width (DevTools), Portuguese: home, settings dialog, a lesson intro, a word bank, the wrong-answer sheet with "Why?" open, the leave dialog, the summary | No horizontal scroll, no clipped buttons or tiles |
| M4 | Android Chrome, installed: gear opens settings, back gesture closes them; choose a language, close and reopen the app | Back closes only the dialog, not the app. The chosen language persists |
| M5 | Owner review of the Portuguese course (SC-006): read every lesson intro and play every exercise in Portuguese | Natural Brazilian Portuguese; every exercise has exactly one correct answer; notes and corrections are recorded in tasks.md |
| M6 | iOS Safari (browser and installed): open settings, switch language, close by tapping the backdrop | Switches at once; the backdrop tap closes; safe areas respected |
