# Research: Purple Brand Colours

## R1 – Where the colours live

**Decision**: Change the token values in `src/index.css` `:root` and leave the selectors that use
them alone.

**Findings** (audit on 2026-11-04):
- All brand colours go through `--primary*` tokens. They are used in `index.css`
  (`.primary-button`, focus ring, links/headings), `LessonList.module.css` (banner, current
  node and ring, headings), `LessonIntro.module.css` (headings, grammar card) and
  `Exercise.module.css` (progress fill, selected option, correct sheet, unlocked stat).
- There are no hard-coded copies of the green or the blue-slate in `src/`. The progress inner
  shadow and the banner secondary-text colours that purple-theme.md lists "if hard-coded" do not
  exist (the banner text is `#ffffff`), so nothing to change there.
- The background colour is also hard-coded outside CSS, in `vite.config.ts` (manifest) and
  `index.html` (theme-color meta). See R5.

**Alternatives considered**: renaming `--primary*` to `--brand*`. Rejected: the name is still
right ("primary" action colour) and renaming touches every module for no user value (KISS).

## R2 – Keeping "correct" green

**Decision**: Add `--success: #0b7f63`, `--success-deep: #075e49` and
`--success-text: #7ff0c8` next to the existing `--success-tint: #163a2e`. Three uses of
`--primary*` mean "correct" and move to the new tokens:

| Element | Now | New |
|---------|-----|-----|
| `.sheetCorrect .sheetIcon` background | `--primary` | `--success` |
| `.sheetCorrect .sheetText` colour | `--primary-text-strong` | `--success-text` |
| Correct sheet Continue (`primary-button`) | `--primary` / `--primary-deep` | `--success` / `--success-deep` via `.primary-button.success` |

`FeedbackBanner` already picks `danger` for a wrong answer. It now picks `success` for a right
one: `primary-button ${correct ? 'success' : 'danger'}`.

**Audit of other `--primary*` uses**: selected option (`--primary-tint`) means "chosen" and the
unlocked stat means progress, so both stay brand (purple), as mockups 03 and 07 show. Exercises
have no per-tile or per-option "correct" state, so nothing else moves.

**Alternatives considered**: scoping `--primary` to green inside `.sheetCorrect`. Rejected: it
hides the meaning, and the focus ring there (`--primary-text`) would turn green as well.

## R3 – Contrast (FR-008)

**Decision**: Use the purple-theme.md values unchanged. All pairs pass (WCAG relative luminance):

| Pair | Ratio |
|------|-------|
| `--text` on `--bg` | 15.69 |
| `--text-muted` on `--bg` | 7.15 |
| `--primary-text` on `--bg` | 7.91 |
| `--primary-text` on `--primary-tint` (selected option) | 6.40 |
| `--primary-text` on `--grammar-tint` | 7.06 |
| `--primary-text-strong` on `--grammar-tint` | 10.71 |
| white on `--primary` (buttons, banner, node) | 6.24 |
| white on `--success` (correct Continue) | 4.96 |
| `--success-text` on `--success-tint` | 9.05 |
| `--icon-muted` on `--bg` (non-text, ≥ 3) | 5.99 |

Focus ring: `--primary-text` is drawn with a 2 px offset, so it sits on the background next to
the element: 7.91 on `--bg`, 5.47 on `--success-tint` and 6.77 on `--error-tint` (non-text
needs 3:1).

## R4 – Mascot and app icon

**Decision**: Out of scope. The icons in `public/` stay. Feature 012 replaces them with the
ready-made purple files in `docs/design/app-icon/`.

## R5 – Manifest and browser bar

**Decision**: `background_color` and `theme_color` in `vite.config.ts`, and the
`<meta name="theme-color">` in `index.html`, become `#16151F`, uppercase like today.
`tests/build/pwa.test.ts` asserts the exact strings and is updated to match.

## R6 – Tests

**Decision**:
- **New `tests/unit/theme.test.ts`**: reads `src/index.css` and every `src/**/*.css` with
  `node:fs`.
  - It parses the `:root` custom properties with a regex and checks each token value from
    purple-theme.md, plus the four `--success*` values.
  - It checks that no stylesheet contains an old green-brand or blue-slate value
    (`#131f24`, `#eef2f4`, `#9aa8b0`, `#2e3d45`, `#1e2a30`, `#8c9aa2`, `#3ddba6`, `#17392f`,
    `#18302a`, case-insensitive) outside the `--success*` declarations. `#0b7f63`, `#075e49`
    and `#7ff0c8` are allowed only as the `--success*` values.
  - It computes the R3 contrast pairs from the parsed tokens, each ≥ 4.5 (≥ 3 for the
    non-text ones).
- **Integration (`lessonFlow.test.tsx`)**: after a right answer, Continue has the `success`
  class and not `danger`; after a wrong answer it has `danger`. This checks that the correct
  sheet uses the success styling.
- **Build (`pwa.test.ts`)**: expected manifest and meta colour `#16151F`.

jsdom does not compute CSS-module colours, so how the screens look is checked by hand against
the mockups (quickstart).

**Alternatives considered**: screenshot diff tests. Rejected: they need a browser-automation
stack (Principle IV rationale, KISS).
