# Contract: Offline Copy and Updates

Behavior of the generated service worker (`dist/sw.js`). Rows marked **auto** are checked by
`tests/build/pwa.test.ts` against the build output; the rest manually (quickstart).

## Registration

| Rule | Check |
|------|-------|
| O1. Only production builds register a worker; `npm run dev` does not | auto (built `index.html` references `registerSW.js`) + manual (dev: no worker in DevTools) |
| O2. Registration needs no app code and never blocks first render (script is deferred/async) | auto (script tag not render-blocking) |

## Precache (FR-001, FR-002)

| Rule | Check |
|------|-------|
| O3. Precache list contains `index.html` | auto |
| O4. Precache list contains **every** `.js` and `.css` file in `dist/` | auto |
| O5. Precache list contains the manifest and all icon PNGs and `icon.svg` | auto |
| O6. Every precache entry has a revision or a content hash in its URL | auto |
| O7. Total precache size < 1 MB | auto (keeps first-visit cost small, SC-006) |

## Navigation (FR-004)

| Rule | Check |
|------|-------|
| O8. Offline navigation to any same-origin path returns the precached `index.html` (`navigateFallback`) | auto (config present in `sw.js`) + manual |

## Updates (FR-010 – FR-012)

| Rule | Check |
|------|-------|
| O9. The worker does not call `skipWaiting()` or `clients.claim()` | auto |
| O10. A new version is used from the next launch after all Duopona windows closed; an open page is never reloaded | manual |
| O11. A version whose install failed never becomes active | Workbox guarantee; manual spot check optional |
| O12. Outdated precaches are deleted when a new version activates (`cleanupOutdatedCaches`) | auto |
| O13. The worker never reads or writes `localStorage` or sends network requests other than fetching app files | by construction (generated worker has no such code) |
