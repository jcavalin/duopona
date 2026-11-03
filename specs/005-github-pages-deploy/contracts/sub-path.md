# Contract: Path-independent build output (FR-007, FR-009, FR-010)

`dist/` must work unchanged at `https://jcavalin.github.io/duopona/` and at a site root
(`http://localhost:4173/`). Achieved with Vite `base: './'` (research R1). Rows marked **auto**
are checked by `tests/build/pwa.test.ts` (`npm run test:pwa`, pipeline step C7).

## Rules

| ID | Rule | Check |
|----|------|-------|
| S1 | No `src="/…"` or `href="/…"` in `dist/index.html` | auto |
| S2 | `index.html` loads the app script, stylesheet, manifest, `registerSW.js`, `icon.svg` and `apple-touch-icon-180x180.png` with `./` paths | auto |
| S3 | No `url(/…)` in any built CSS file (fonts resolve relative to the CSS file) | auto |
| S4 | `registerSW.js` registers `./sw.js` with scope `./` | auto |
| S5 | No precache URL in `sw.js` starts with `/`; navigation fallback is `createHandlerBoundToURL("index.html")` (existing O8) | auto |
| S6 | Manifest `start_url` and `scope` are `.`; no icon `src` starts with `/` | auto |
| S7 | Routing stays hash-based (`createHashRouter`): the host only receives the app root, so reloads and bookmarks never 404 (research R2) | unchanged code; manual row in quickstart |
| S8 | Served from a site root (`npm run preview`) and under `/duopona/` (`npx vite preview --base /duopona/`), the app loads, installs and works offline | manual |

## Changes to existing build-output expectations

The 003/004 checks that pinned root paths change to the relative form; their meaning is
unchanged:

| Existing check | Before | After |
|----------------|--------|-------|
| O1/O2 registration script | `src="/registerSW.js"` | `src="./registerSW.js"` |
| Manifest link | `href="/manifest.webmanifest"` | `href="./manifest.webmanifest"` |
| iOS icon | `href="/apple-touch-icon-180x180.png"` | `href="./apple-touch-icon-180x180.png"` |
| Favicon | `href="/icon.svg"` | `href="./icon.svg"` |

Everything else in `specs/003-pwa-offline-mobile/contracts/` and
`specs/004-ui-redesign/contracts/app-identity-changes.md` stays as is.
