# UI Contract: Mascot and App Icon

## C1 – Exercise prompt row (multiple choice and word bank; mockups 03, 05)

- Left: the mascot image, about 88 × 100 px. `alt=""`, `aria-hidden="true"`,
  `data-expression` is one of `idle | sad | happy`.
- Right: the prompt as the existing `<h2>` (accessible name unchanged), styled as a bubble with a
  tail pointing at the mascot. It is bottom-aligned with the mascot and wraps long text at 360 px.
- No `DropIcon` or `BubbleIcon` in the prompt row.

## C2 – Expression by state

| State | `data-expression` |
|-------|-------------------|
| Before Check | `idle` |
| Wrong-answer sheet open | `sad` |
| Correct-answer sheet open | `happy` |
| Next exercise / retry | `idle` |

The same rules apply in lessons, Practice and Review weak words.

## C3 – Summary (mockup 07)

- The celebrating mascot (`data-expression="celebrate"`, about 170 px wide, decorative) sits
  centred above the heading, in place of the star badge.
- The heading, subtitle, "Daily goal met", stats and buttons are unchanged.

## C4 – Accessibility

- The mascot is never in the accessibility tree. Feedback announcements (`role="status"`),
  focus on Continue and the prompt heading are unchanged.

## C5 – App icons (mockup 09)

| File in `public/` | Source |
|-------------------|--------|
| `icon.svg` | `docs/design/app-icon/icon.svg` |
| `pwa-192x192.png` | `docs/design/app-icon/pwa-192x192.png` |
| `pwa-512x512.png` | `docs/design/app-icon/pwa-512x512.png` |
| `maskable-icon-512x512.png` | `docs/design/app-icon/maskable-icon-512x512.png` |
| `apple-touch-icon-180x180.png` | `docs/design/app-icon/apple-touch-icon-180x180.png` |

The manifest entries, `index.html` links, background and theme colour (`#16151F`) are unchanged.
