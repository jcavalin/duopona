# Quickstart: Study in Spanish

## Automated

```sh
npm test        # content rules for en, pt-BR, fr, es; P1–P3/P6–P8 and S1–S2 for Spanish;
                # es↔pt-BR overlap list (no stale entries); strings parity; detection; storage;
                # Spanish session + settings flows
npm run lint
npm run build
npm run test:pwa
```

Expected: everything passes, and the English, Portuguese and French tests still pass, except for
the settings order, which now has Español second (contract
[ui-settings.md](contracts/ui-settings.md)).

## Manual checks (browser/device only, Constitution IV)

The user runs `npm run dev` on desktop. On phones, use `npm run preview` or the deployed build.

| # | Check | Expected |
|---|-------|----------|
| M1 | Desktop Chrome, no saved choice: browser languages Español (España) first; then Español (México); then English first with Español second | Español, Español, English. `document.documentElement.lang` matches |
| M2 | Desktop: gear → Español, reload, go offline (DevTools), reload; then switch to each other language and back | Spanish persists, offline too. Every switch is instant. Progress, streak and weak words are unchanged |
| M3 | 360 px width, Spanish: home (top bar, "Repasar palabras difíciles"), settings with four options, a lesson intro, a word bank, the wrong-answer sheet with "¿Por qué?" open, the leave dialog, the summary | No horizontal scroll, no clipped text, and no scrolling inside the settings dialog |
| M4 | Android Chrome, installed: choose Español, close and reopen | Opens in Spanish |
| M5 | Owner review of the Spanish course (SC-006): read every intro, play every exercise | Natural, neutral Spanish; one correct answer per exercise; notes in tasks.md |
| M6 | iOS Safari (browser and installed): switch to Español, close by tapping the backdrop; then finish lesson 1 in Spanish and in Portuguese | Switches at once; safe areas respected. On the summary, “Sustantivos y adjetivos” / “Substantivos e adjetivos” on the Desbloqueada / Liberada tile breaks with a hyphen, not mid-letter (`hyphens: auto`, T022) |
