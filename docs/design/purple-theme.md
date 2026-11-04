# Purple brand colours

> Implemented in [`specs/011-purple-brand-colours/`](../../specs/011-purple-brand-colours/). The
> progress-shadow and banner-text rows had no hard-coded values to change.

Design reference for the "Purple brand colours" item in [ROADMAP.md](../../ROADMAP.md). Turn it
into a feature with `/speckit-specify` when it is picked up; this file is the input, not the spec.

**Why**: green is the colour most tied to Duolingo. A purple brand sets Duopona apart, and it
frees green to mean only "correct" (today the primary button and the correct-answer sheet share
the same green).

All mockups in [`mockups/`](mockups/) and the canvas linked from [ui-redesign.md](ui-redesign.md)
now show the purple theme. Layout, type and shapes do not change; only colours.

## Token changes (`src/index.css`)

| Token | Now (green) | New (purple) | Notes |
|-------|-------------|--------------|-------|
| `--bg` | `#131f24` | `#16151f` | Neutral violet-grey instead of blue-slate |
| `--text` | `#eef2f4` | `#efeef5` | |
| `--text-muted` | `#9aa8b0` | `#a3a1b3` | |
| `--line` | `#2e3d45` | `#2e2c3d` | |
| `--line-deep` | `#1e2a30` | `#201e2c` | |
| `--icon-muted` | `#8c9aa2` | `#9592a8` | |
| `--primary` | `#0b7f63` | `#6d3fd9` | Buttons, current node, progress fill, banner; white text 6.2:1 |
| `--primary-deep` | `#075e49` | `#4f27a8` | 3D bottom edge |
| `--primary-text` | `#3ddba6` | `#b69cff` | Lilac: links, headings, wordmark on the dark bg |
| `--primary-text-strong` | `#7ff0c8` | `#d9cbff` | Headings on tinted surfaces, hover |
| `--primary-tint` | `#17392f` | `#2b2150` | Selected option, current-node ring |
| `--grammar-tint` | `#18302a` | `#221c3d` | Grammar card on the intro |
| progress fill inner shadow | `#097257` | `#5a31bd` | If hard-coded |
| banner secondary text | `#cff1e5` / `#e6f7f1` | `#dcd0ff` / `#eee8ff` | If hard-coded |

**Unchanged**: error (`--error*`), gold (`--gold*`), streak, white.

## New success tokens (keep "correct" green)

Anything that means "correct" must stop using `--primary*` and use its own tokens with the old
green values, so it stays green after the swap:

| New token | Value | Use |
|-----------|-------|-----|
| `--success` | `#0b7f63` | Correct-sheet icon circle and its Continue button |
| `--success-deep` | `#075e49` | That button's bottom edge |
| `--success-text` | `#7ff0c8` | "pona! Correct." title |
| `--success-tint` | `#163a2e` | Correct-answer sheet (already exists, unchanged) |

Audit every use of `--primary*` that means "right answer" (correct sheet, correct tiles or
options, if any) and move it to `--success*`.

## Elsewhere

- `vite.config.ts`: `background_color` and `theme_color` → `#16151F`; `index.html`
  `<meta name="theme-color">` if present.
- App icons: replaced by the "Mascot & app icon" item ([mascot.md](mascot.md)); its icon files
  already use the purple palette, so do this item first.
- Check contrast after the swap (text 4.5:1): the values above were picked to pass on `--bg`.
