# Mascot and app icon

Design reference for the "Mascot & app icon" item in [ROADMAP.md](../../ROADMAP.md). Turn it into
a feature with `/speckit-specify` when it is picked up; this file is the input, not the spec.
Builds on the dark UI of feature 004 ([ui-redesign.md](ui-redesign.md)); same canvas, second row.

## Why

The prompt icon on exercise screens (`DropIcon` in `MultipleChoice`, `BubbleIcon` in `WordBank`)
suggests a meaning that most sentences don't have. An original mascot, a small purple sprout,
replaces it with one constant character that also reacts to the answer, and becomes the app icon.

## The mascot

Final SVGs (viewBox in each file; no text, no external refs): [`mascot/`](mascot/).
Sheet: [mockups/08-mascot-expressions.png](mockups/08-mascot-expressions.png).

| Expression | File | Where |
|------------|------|-------|
| Idle | `mascot-idle.svg` | Exercise prompt (multiple choice, word bank) before checking |
| Sad | `mascot-sad.svg` | Same spot after a wrong answer (mockups 04, 04a, 04b): drooping leaves, raised brows, frown, sweat drop |
| Happy | `mascot-happy.svg` | Same spot after a right answer (mockup 06): closed happy eyes, open smile, perky leaves |
| Celebrate | `mascot-celebrate.svg` | Lesson / practice complete (mockup 07), replaces the gold star badge: arms up, sparkles |

Shape: rounded body `#6D3FD9` (`--primary` after [purple-theme.md](purple-theme.md)) with a
`#4F27A8` bottom edge (the same "chunky" 3D edge as the buttons), belly and hands `#8457EA`,
leaves `#3DDBA6` (stay green: it is a sprout), eyes white with `#16151F` pupils, cheeks `#FF9AA2`.

### On the exercise screens

- Mascot ~88 × 100 px at the left; the prompt bubble sits to its right, bottom-aligned, with a
  small tail pointing at the mascot (a 14 px square, rotated 45°, left + bottom borders in `line`).
- The expression switches with the answer state: idle → sad or happy when the feedback sheet
  opens; back to idle on the next exercise.
- Decorative: `aria-hidden="true"`; the prompt text and the feedback sheet carry the meaning.
- Respect `prefers-reduced-motion` if the change is animated (e.g. a small bounce on happy).
- On the summary the celebrate mascot is ~170 px, centred above "Lesson complete!".

## App icon

Candidate files with the same names and sizes as today's `public/` icons, ready to swap in:
[`app-icon/`](app-icon/). Sheet: [mockups/09-app-icon.png](mockups/09-app-icon.png).

| File | Size | Notes |
|------|------|-------|
| `icon.svg` | vector | Favicon; rounded square (rx 112/512), mascot at 66 % width |
| `pwa-192x192.png`, `pwa-512x512.png` | 192, 512 | Full-bleed square, mascot at 62 % |
| `maskable-icon-512x512.png` | 512 | Mascot at 50 % so it stays inside the 80 % safe circle |
| `apple-touch-icon-180x180.png` | 180 | Opaque, full-bleed, mascot at 58 % |

Background `#16151F` (the purple theme's app background), mascot idle. Check `theme_color` /
`background_color` in `vite.config.ts` still match. Installed users may need to reinstall, or
wait for the browser to refresh the icon.

## Open points for the spec

- Animate expression changes, or switch instantly?
- Mascot on the lesson path or intro (e.g. next to the course banner)? Not designed yet.
- A name for the mascot (Toki Pona word?) if it ever appears in copy.
