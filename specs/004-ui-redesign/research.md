# Research: Dark Duolingo-Style UI Redesign

All decisions below resolve the plan's Technical Context; nothing is left open.

## R1. Typeface: self-hosted Nunito, Latin subset only

- **Decision**: Copy two files, `nunito-latin-wght-normal.woff2` (~39 KB) and
  `nunito-latin-wght-italic.woff2` (~42 KB), from the npm package
  `@fontsource-variable/nunito@5.3.0` into `public/fonts/`, together with the font's SIL Open
  Font License as `public/fonts/OFL.txt`. Declare them with two `@font-face` rules in
  `src/index.css` (`font-family: 'Nunito'`, `font-weight: 200 1000`, `font-display: swap`).
  The package is fetched once with `npm pack` and **not** added to `package.json`.
- **Rationale**: Nunito is the mockups' face (design reference "Type and shape"). One variable
  file covers weights 600–900. All app text is ASCII (English, Toki Pona, "Sonja Lang"), so
  the Latin subset is enough. Files in `public/` need no dependency (Constitution I) and make no
  third-party request (II). Italic is a real file because the banner and grammar cards use
  italic (mockups 01, 02); a synthesized slant looked wrong at 900 weight.
- **Alternatives considered**: (a) Add `@fontsource-variable/nunito` as a dependency and import
  its CSS: one import line, but it brings five subsets (Cyrillic, Vietnamese …) that the
  precache would also store (~135 KB normal only) and adds a dependency for two files.
  (b) Google Fonts `<link>`: third-party request, fails offline. Rejected.

## R2. Offline copy of the font

- **Decision**: Add `woff2` to Workbox `globPatterns` in `vite.config.ts`
  (`'**/*.{js,css,html,woff2}'`). Extend `tests/build/pwa.test.ts` to assert both font files
  are precached.
- **Rationale**: 003's precache only takes JS, CSS and HTML (+ icons via the plugin). Without
  this, the first offline launch would fall back to a system font (fails SC-006).
- **Alternatives considered**: Runtime caching of fonts: works only after a font was seen
  online; precache is simpler and already the app's model (003 R1).

## R3. Dark only: theme color, manifest colors, iOS status bar

- **Decision**: Replace the two `prefers-color-scheme` `theme-color` metas with one
  `<meta name="theme-color" content="#131F24">`; set manifest `background_color` and
  `theme_color` to `#131F24`; add `color-scheme: dark` on `:root` (native scrollbars, form
  controls); remove the light palette and the `@media (prefers-color-scheme: dark)` block.
  Add `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` so the
  installed iOS app draws the dark background under the status bar; the existing safe-area
  top padding keeps content below it. Update 003's `contracts/app-identity.md` rows accordingly.
- **Rationale**: FR-002 requires the browser and system UI to match the dark background in
  every device setting. iOS `default` style shows a white status bar in standalone mode, which
  breaks the dark look (003 research R7 already named `black-translucent` as the fix).
- **Alternatives considered**: `black` status bar: a solid black strip, visibly different from
  `#131F24`. Rejected.

## R4. Screen layout: sticky bottom bar instead of fixed

- **Decision**: Every lesson screen (intro, exercise, summary) is a flex column with
  `min-height: 100dvh`: a scrolling body (`flex: 1`) followed by a bottom bar with
  `position: sticky; bottom: 0`. The bar holds Start / Check / Continue, and the feedback sheet
  takes the bar's place. Padding moves from `#root` into the screens so bars and sheets can
  span the full column width; bottom bars pad `28px + env(safe-area-inset-bottom)`.
  Three global classes in `src/index.css`: `.screen`, `.screen-body`, `.bottom-bar`.
- **Rationale**: A sticky element stays in normal flow, so content can always scroll above it
  and is never hidden underneath (spec edge case "Small or short screens") without measuring
  the bar's height. Three screens use it, so shared classes are justified (Constitution I).
  `100dvh` follows the mobile browser's visible height as its toolbars appear and disappear.
- **Alternatives considered**: `position: fixed` plus a matching `padding-bottom` on the page:
  the padding must track the bar's height, which changes (feedback sheet with a long correct
  answer). A shared `<Screen>` React component: adds a layer for something CSS does alone.

## R5. Number-key shortcuts for multiple choice

- **Decision**: In `MultipleChoice`, a `keydown` listener on `window` (added in `useEffect`,
  removed on cleanup) selects option *n* when the key is `1`–`9`, *n* ≤ number of options, no
  modifier key is held, and the exercise is not `disabled`. It only selects, never submits.
  Each option's number badge is `aria-hidden`; the accessible name stays the option text.
- **Rationale**: Clarification Q2. `window` catches keys wherever focus is on the page; the
  component unmounts between exercises (keyed by exercise and step), so the listener never
  outlives its exercise.
- **Alternatives considered**: `accesskey`: browser-specific modifiers, not plain number keys.
  Submitting on keypress: a typo would submit; Check stays the single submit action.

## R6. Icons: inline SVG, no library

- **Decision**: One file `src/components/icons.tsx` exports small components: `CloseIcon` (X),
  `CheckIcon`, `StarIcon`, `LockIcon`, `DropIcon` (multiple-choice prompt), `BubbleIcon`
  (word-bank prompt and the top-bar counter), `WrongIcon` (X in the red circle). Each is a
  24×24 `viewBox`, `stroke="currentColor"` or `fill="currentColor"`, `aria-hidden="true"`,
  drawn with original simple paths.
- **Rationale**: Seven tiny icons do not justify an icon dependency (Constitution I); inline SVG
  inherits color tokens and works offline with no extra request.
- **Prompt icon rule** (spec FR-011): the prompt kind is the exercise type. Multiple-choice
  prompts are words or short phrases → `DropIcon` (as mockup 03); word-bank prompts are
  sentences → `BubbleIcon` (as mockup 05).
- **Alternatives considered**: `lucide-react`: fine library, but a dependency for seven glyphs.

## R7. Lesson path zigzag

- **Decision**: Nodes are a single list in course order. Each node is shifted horizontally by
  a repeating pattern of offsets `[0, 1, 2, 1, 0, -1, -2, -1]` × 44 px (CSS custom property
  `--offset` set inline per node, applied with `transform: translateX`). At 360 px width the
  widest offset (88 px) plus half a 76 px node stays inside the column. Labels sit under each
  node and wrap within a 160 px max width.
- **Rationale**: Matches the mockup's gentle snake with no layout math or SVG connectors.
- **Alternatives considered**: An SVG path connecting nodes: not in the mockup, more code.

## R8. Node semantics and scrolling to the current lesson

- **Decision**: Completed and current nodes are router `Link`s; locked nodes keep today's
  `div role="link" aria-disabled="true"`. Each node has an `aria-label` built from title, state
  and (completed) score, e.g. "Words and Sentences, completed, 12 of 13", "Nouns and
  Adjectives, start", "You and I, locked". The current node gets a ref; a mount effect calls
  `ref.current?.scrollIntoView?.({ block: 'center' })` (optional call because jsdom lacks it).
  The "Start" label above the current node is part of the link.
- **Rationale**: FR-006–FR-008. Keeps 002's tested locked/unlocked behavior and URL scheme.
- **Alternatives considered**: Scroll only when the node is off screen: `block: 'center'` is
  already a no-op visually for the first few lessons.

## R9. Feedback sheet and option result colors

- **Decision**: `FeedbackBanner` becomes the bottom sheet (rendered by `ExerciseScreen` in place
  of the exercise's bottom bar, as today it is rendered instead of Check). `MultipleChoice` gets
  a new optional prop `result?: 'correct' | 'wrong'` passed by `ExerciseScreen` while feedback
  shows; the selected option then gets a green or red style. The sheet slides up with a 200 ms
  transform transition, disabled under `prefers-reduced-motion: reduce` (FR-022).
  `role="status"` and `autoFocus` on Continue stay as today (FR-016).
- **Rationale**: Minimal change to the existing component split; no store change.

## R10. Summary: lesson title, next lesson, replay

- **Decision**: `LessonSummary` receives `lessonTitle`, `nextLessonTitle?: string`,
  `onContinue` and `onReplay`. `LessonRoute` computes the next lesson from the `lessons`
  array (index + 1). `onReplay` calls `setStartedId(null)`, which shows the intro again;
  pressing Start dispatches `startLesson` as for any lesson, which replaces the finished
  session.
- **Rationale**: FR-017, FR-018 with only route-local UI state (Constitution III). Progress was
  already saved when the summary appeared, so replay cannot lose anything.

## R11. Home counter and banner data

- **Decision**: "N / 17" and "N of 17 done" use `Object.keys(completedLessons).length` filtered
  to ids present in `lessons`, and `lessons.length`. Computed in `LessonList`; no new selector.
- **Rationale**: Saved progress could in theory hold an id of a removed lesson; filtering keeps
  the count ≤ 17. One use only, so no selector (Constitution I).

## R12. Contrast check of the token palette

- **Decision**: Verify each foreground/background pair in the design reference once with a
  contrast calculator during implementation and record the ratios in quickstart row V9; adjust
  only a failing pair (the most likely candidate is `text-muted #9AA8B0` on `line #2E3D45` for
  locked labels, if used there; on `bg #131F24` it is ~7:1).
- **Rationale**: FR-004 / SC-005; the palette was designed for contrast but not measured.
