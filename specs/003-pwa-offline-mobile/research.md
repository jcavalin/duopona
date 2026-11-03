# Research: Installable, Offline-Capable PWA

All Technical Context items were resolvable without user input; decisions below.

## R1. How to produce the service worker

- **Decision**: Add `vite-plugin-pwa` 2.x (dev dependency; generates a Workbox service worker
  at build time) in `generateSW` mode. It precaches every build output file (`index.html`,
  hashed JS/CSS, icons, manifest).
- **Rationale**: Offline use needs a list of the exact hashed files of each build, a revision
  per file, an install that fails as a whole if any file fails (FR-012), and removal of the
  previous version's caches. The plugin does all of that from config, with no runtime code in
  the app. All lesson content is bundled into the JS (`src/content/lessons/*.ts`), so
  precaching the build covers all 17 lessons (FR-002) with nothing extra to list. It is the
  mainstream Vite PWA tool (Constitution III); v2.0.0 declares `vite ^8` as a peer.
- **Alternatives considered**:
  - *Hand-written `public/sw.js`*: needs a build step to inject hashed filenames and revisions
    anyway, plus hand-written atomic install and old-cache cleanup, which means reimplementing
    the Workbox precache. Bigger and more error-prone than one config block.
  - *Runtime caching only (cache what was visited)*: fails FR-002 (unvisited lessons would
    work only because they're in the same bundle; fragile if code splitting is ever added) and
    FR-012 (no atomic versions).

## R2. Update strategy

- **Decision**: `registerType: 'prompt'` **without any prompt UI**: the generated worker does
  not call `skipWaiting`/`clientsClaim`. A new version installs in the background, waits, and
  takes over when every Duopona window/tab is closed, i.e. on the next launch. Registration is
  the plugin's injected, deferred `registerSW.js` script (`injectRegister: 'script-defer'`); no app
  code imports `virtual:pwa-register`. The generated worker contains a `SKIP_WAITING` message
  listener, but nothing in the app sends that message.
- **Rationale**: Meets FR-010 (automatic, in use from the next launch), FR-011 (a running
  page is never reloaded, so a lesson is never interrupted; progress lives in `localStorage`,
  which the worker never touches), and FR-012 (Workbox only activates a fully installed
  version; a failed/partial install leaves the old one in place). Zero lines of app code.
- **Alternatives considered**:
  - *`autoUpdate` (skipWaiting + reload)*: reloads the open page when a new version is ready,
    which can interrupt a lesson (violates FR-011).
  - *Swap on `visibilitychange` when on the lesson list*: makes updates land sooner on phones
    where the installed app is kept in memory, at the cost of ~15 lines and a reload path to
    test. Not needed for the spec (SC-004 counts launches); revisit only if real-device checks
    show updates getting stuck.
  - *"Update available" banner*: out of scope (spec Assumptions).

## R3. Routing and offline navigation

- **Decision**: Keep the hash router. Workbox `navigateFallback: 'index.html'` (plugin default
  for `generateSW`) serves the precached shell for any navigation, so `/`, `/#/lesson/<id>` and
  mistyped paths all open the app offline (FR-004).
- **Rationale**: With hash routing, the server only ever sees `/`; the fallback just covers
  stray paths. Unknown routes already redirect to the list (`src/router.tsx` `*` route).
- **Alternatives considered**: none needed.

## R4. Dev server and tests

- **Decision**: The service worker is **not** enabled in `npm run dev` (plugin default
  `devOptions.enabled: false`). Offline and install behavior are validated on a production
  build via `npm run build && npm run preview`. Unit/integration tests (jsdom) are unaffected.
  A new build-output test suite (`tests/build/pwa.test.ts`, run by `npm run test:pwa` after a
  build, with its own `tests/build/vitest.config.ts`; excluded from `npm test`, which has no
  `dist/`) checks the generated manifest and that the worker precaches `index.html`, every
  JS/CSS file in `dist/`, and the icons.
- **Rationale**: A worker in dev would cache dev modules and cause stale-code confusion. jsdom
  has no service worker, so the meaningful automated check is on the build output
  (Constitution IV: behavior, not implementation: "everything needed offline is precached").
  The actual offline/install behavior is checked manually in Chrome (DevTools → Offline,
  Application → Manifest) and on real phones (quickstart).
- **Alternatives considered**: *Playwright offline e2e*: new heavy dependency and browser
  download for a few checks done once per feature; rejected under KISS. *Enabling the worker
  in dev*: rejected as above.

## R5. Manifest and app identity

- **Decision**: Manifest defined in `vite.config.ts` (plugin `manifest` option), emitted as
  `manifest.webmanifest`:
  `name`/`short_name` "Duopona", `description`, `start_url: '.'`, `scope: '.'`,
  `display: 'standalone'`, `background_color: '#ffffff'`, `theme_color: '#ffffff'`
  (matches the light page background and `theme-color` meta), `lang: 'en'`, no `orientation` (portrait and landscape both allowed),
  icons 192, 512, and 512 `purpose: 'maskable'`.
  `index.html` adds: `<meta name="theme-color">` with light/dark `media` variants matching
  `--color-bg`, `<link rel="apple-touch-icon">` (180 px), `<link rel="icon">` (SVG),
  `<meta name="description">`, `<meta name="apple-mobile-web-app-title" content="Duopona">`.
- **Rationale**: Chrome needs name, 192/512 icons, `start_url`, `display` to offer install
  (FR-006). iOS reads the manifest for standalone mode (16.4+) but still uses
  `apple-touch-icon` for the home-screen icon (FR-007, US2 AC2). A maskable icon avoids a
  shrunken icon in a white circle on Android. Relative `start_url`/`scope` keep working if the
  app is later hosted under a sub-path.
- **Alternatives considered**: *Separate static `public/manifest.webmanifest`*: works, but the
  plugin then can't add it to the precache/inject the link automatically; keeping it in config
  is one place.

## R6. Icons

- **Decision**: One original SVG source, `public/icon.svg` (a simple mark in the app green,
  with the safe zone respected so it also works masked). PNGs (`pwa-192x192.png`,
  `pwa-512x512.png`, `maskable-icon-512x512.png`, `apple-touch-icon-180x180.png`) are generated
  **once** with `npx @vite-pwa/assets-generator@2` and committed, using a small
  `pwa-assets.config.mjs` (the `minimal-2023` sizes with `padding: 0`, since the source is
  full-bleed; the preset's default padding adds a white ring). The generator is not added to
  `package.json`.
- **Rationale**: Icons change rarely; committing the PNGs avoids a permanent dev dependency
  (Constitution I). `minimal-2023` is exactly the set Chrome and iOS need.
- **Alternatives considered**: *Generator as devDependency + build hook*: extra dependency
  for a one-off. *Hand-made PNGs in an image editor*: fine too, but less reproducible.

## R7. iOS status bar in installed mode

- **Decision**: No `apple-mobile-web-app-status-bar-style` (iOS default) and rely on the
  `theme-color` metas. Verify on a real iPhone (quickstart). If the bar does not match the app
  background in light and dark mode, switch to `black-translucent`; content already pads by
  `env(safe-area-inset-top)` (`src/index.css`), so nothing would go under the bar.
- **Rationale**: Exact iOS status-bar behavior varies by version and is only reliably known on
  the device; both options are one meta tag.

## R8. Phone usability gaps (FR-013 – FR-015)

- **Decision**:
  - Add `touch-action: manipulation` on `html` (removes double-tap zoom and tap delay without
    disabling pinch zoom; FR-015). Do **not** use `user-scalable=no` (accessibility).
  - Add `-webkit-text-size-adjust: 100%` so iOS doesn't enlarge text on rotation (US4 AC4).
  - Safe areas (FR-013) and 360 px / 44 px (FR-014) were implemented in 002; this feature only
    re-verifies them on real devices in installed mode and fixes failures.
  - Layout jump when feedback appears (FR-015) is checked on device; fixed only if observed.
- **Rationale**: Smallest CSS changes that address known mobile browser behaviors; the rest is
  verification.

## R9. Hosting precondition

- **Decision**: Out of scope (spec Assumptions). Requirements for whoever hosts: HTTPS;
  `sw.js` and `index.html` served with `Cache-Control: no-cache` (or short max-age) so updates
  are discovered; hashed `assets/*` can be cached long-term. Documented in quickstart.
- **Rationale**: Browsers check for a new worker on navigation (and at most daily-bypass HTTP
  cache for the worker script), but a long-cached `index.html` behind a CDN can still delay
  updates; noting it prevents a hard-to-debug "update never arrives" later.

## R10. Node types for the build-output test

- **Decision**: Add `@types/node` as a dev dependency (major matching the local Node), and
  reference it only from `tests/build/pwa.test.ts` (`/// <reference types="node" />`), not in
  `tsconfig.json` `types`.
- **Rationale**: The test reads `dist/` with `node:fs`; `tsc -b` type-checks `tests/`. Scoping
  the reference keeps `process`/`Buffer` out of browser code typings.
- **Alternatives considered**: excluding `tests/build` from type-checking (untyped test code);
  rejected.
