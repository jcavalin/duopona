# Research: Mascot and App Icon

## R1 – How to ship the drawings

**Decision**: Copy the four files from `docs/design/mascot/` into `src/assets/mascot/` unchanged.
Import them as URLs (`import idle from '../assets/mascot/mascot-idle.svg'`), so Vite emits them
with hashed names.

**Rationale**: FR-005 says the drawings are shown unchanged. The files are standalone SVGs (no
text, no external references), so `<img>` renders them exactly as designed. Each file is about
9 KB, mostly an embedded content-credentials `<metadata>` block. Keeping it costs about 25 KB in
total and leaves the files identical to the design. Hashed names give cache-busting for free.

**Alternatives considered**:
- Inline JSX components: about 400 lines of path data to maintain, with risk of id clashes.
  Rejected (KISS).
- `public/mascot/`: unhashed names, plus an `includeAssets` entry. It would work, but hashed
  assets are the default Vite path for images used by components.
- Stripping the metadata: it changes the files and the size gain doesn't matter.

## R2 – `Mascot` component

**Decision**: `src/components/Mascot.tsx` exports
`Mascot({ expression, className }: { expression: 'idle' | 'sad' | 'happy' | 'celebrate'; className?: string })`.
It renders `<img src={urls[expression]} alt="" aria-hidden="true" draggable={false} className={className} data-expression={expression} />`.

- `alt=""` plus `aria-hidden` keeps the mascot decorative (FR-006).
- `data-expression` gives tests and the manual check a stable hook. The tests can also check
  `src`.
- It has three current uses (multiple choice, word bank, summary), which justifies a shared
  component (Principle I).
- Size comes from the caller's CSS class.

## R3 – Where the expression comes from

**Decision**: Map `result` to an expression: `undefined` → idle, `'wrong'` → sad,
`'correct'` → happy.

- `ExerciseScreen` already passes `result` to `MultipleChoice`. It now passes the same value to
  `WordBank` as a new optional `result?: 'correct' | 'wrong'` prop.
- Each exercise is keyed and remounts on the next exercise or a retry, and `result` is undefined
  until feedback. So the mascot is idle on every new exercise with no extra state (FR-003).
- `LessonSummary` (used by both `LessonRoute` and `PracticeRoute`) replaces the
  `.badge`/`.badgeCoin` block with `<Mascot expression="celebrate" className={styles.summaryMascot} />`.
- `DropIcon` is used only in `MultipleChoice`, so it is removed from `icons.tsx`. `BubbleIcon`
  and `StarIcon` stay (the lesson path uses them).

## R4 – Offline

**Decision**: Change the workbox `globPatterns` in `vite.config.ts` from
`**/*.{js,css,html,woff2}` to `**/*.{js,css,html,woff2,svg}`.

**Rationale**: Vite inlines assets under 4 KB as data URIs, but these are about 9 KB, so they
are emitted as files in `dist/assets/`. They must be precached for FR-009. `icon.svg` is already
precached through `includeAssets`, and vite-plugin-pwa removes duplicate entries. The build test
checks for one entry per file.

## R5 – App icons

**Decision**: Copy the five ready-made files (`icon.svg`, `pwa-192x192.png`, `pwa-512x512.png`,
`maskable-icon-512x512.png`, `apple-touch-icon-180x180.png`) from `docs/design/app-icon/` over
the ones in `public/`. Names and sizes are unchanged, so the manifest, `index.html` links and
`includeAssets` stay as they are.

The designed files use different mascot scales per purpose (62%, 50% maskable, 58% apple), which
the assets generator can't reproduce from one SVG. So the comment in `pwa-assets.config.mjs`
changes to say the icons are hand-made in `docs/design/app-icon/` and must not be regenerated,
and the README line about regenerating them is updated.

## R6 – Layout (mockups 03, 05, 07)

- `.promptRow`: `align-items: flex-end` (the bubble is bottom-aligned with the mascot), gap
  about 16 px.
- `.promptMascot`: width 88 px, height 100 px, `flex-shrink: 0`.
- `.prompt` (the bubble): keeps its border and radius and gets `position: relative`, plus a
  tail. The tail is a `::before` 14 × 14 px square rotated 45°, with left and bottom borders in
  `--line` and background `--bg`, placed on the bubble's left edge at mid-height. `min-width: 0`
  and `overflow-wrap: anywhere` keep long prompts inside 360 px.
- `.summaryMascot`: width about 170 px, centred where `.badge` was. The unused `.badge` and
  `.badgeCoin` rules are removed.
- No animation (spec default), so reduced motion needs nothing extra.

## R7 – Tests

- **Integration (lessonFlow)**:
  - multiple choice and word bank show `img[data-expression="idle"]` and no old prompt icon;
  - after a wrong check it is `sad`, after a right check `happy`, and after Continue `idle`
    again;
  - the summary shows `celebrate` and no star badge;
  - the mascot image has `alt=""` and is not exposed by `getAllByRole('img')`.
- **Integration (practiceFlow)**: a practice session shows the expressions too, and its summary
  shows `celebrate`.
- **Build (pwa.test.ts)**:
  - the four mascot SVGs are emitted and listed in the service-worker precache;
  - each `public` icon file is byte-identical to its `docs/design/app-icon/` source, and so is
    each icon in `dist/`.
