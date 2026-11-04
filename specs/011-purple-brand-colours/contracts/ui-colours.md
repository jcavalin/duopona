# UI Contract: Colour Meaning

Which colour each element uses after feature 011. The values are in
[docs/design/purple-theme.md](../../../docs/design/purple-theme.md).

## Brand (purple)

| Element | Token(s) |
|---------|----------|
| Primary buttons (Start, Check, Practice; not the two sheet Continue buttons, see below) | `--primary`, edge `--primary-deep`, white text |
| Lesson banner on the path | `--primary`, edge `--primary-deep`, white text |
| Current lesson node and its ring | `--primary`, edge `--primary-deep`, ring `--primary-tint` |
| Lesson progress fill | `--primary` |
| Selected multiple-choice option | `--primary-tint` background, `--primary-text` border and text |
| Unlocked stat on the summary | `--primary-text` border, `--primary` label |
| Headings, wordmark, links | `--primary-text` |
| Lesson intro headings / grammar card | `--primary-text`, `--primary-text-strong`, `--grammar-tint` |
| Keyboard focus ring | `--primary-text`, 3 px, 2 px offset |

## Correct (green, only on the correct-answer sheet)

| Element | Token |
|---------|-------|
| Sheet background | `--success-tint` |
| Check icon circle | `--success` |
| "pona! Correct." text | `--success-text` |
| Continue button | `.primary-button.success`: `--success`, edge `--success-deep`, white text |

No other element may use a `--success*` token.

## Unchanged

- Wrong-answer sheet: `--error*`, Continue `.primary-button.danger`, 010 toggle/card
  `--explain-*`.
- Gold (correct stat, star badge), streak (orange), disabled buttons (`--line`,
  `--text-muted`).

## Outside the page

- `<meta name="theme-color" content="#16151F" />`
- Manifest `background_color: '#16151F'`, `theme_color: '#16151F'`
