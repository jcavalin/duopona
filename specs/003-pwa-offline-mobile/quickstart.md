# Quickstart: Installable, Offline-Capable PWA

## Run

```bash
npm install
npm test                 # unit + integration (unchanged by this feature)
npm run build            # emits dist/ with manifest.webmanifest and sw.js
npm run test:pwa         # checks dist/ against contracts/app-identity.md and offline-and-updates.md
npm run preview          # serves dist/ at http://localhost:4173 (worker active here, not in `npm run dev`)
npm run preview -- --host  # same, reachable from phones on the LAN (see "Real devices")
```

Regenerate icons only when `public/icon.svg` changes (uses `pwa-assets.config.mjs`: no padding):

```bash
npx @vite-pwa/assets-generator@2
```

## Desktop validation (Chrome, `npm run preview`)

Use a fresh profile or DevTools → Application → Storage → "Clear site data" first.

| # | Steps | Expected | Covers |
|---|-------|----------|--------|
| 1 | Open the app; DevTools → Application → Manifest | Name, icons (incl. maskable), standalone, no errors; "Installability" section shows no issues | FR-006, FR-007 |
| 2 | Application → Service workers | One worker "activated and running" | FR-001 |
| 3 | Network → Offline; reload | Lesson list with progress | US1 AC1 |
| 4 | Still offline: play a lesson never opened before to the end | Intro, exercises, feedback, summary all work; next lesson unlocks | US1 AC2–AC3, FR-002–003 |
| 5 | Still offline: open `/#/lesson/<id>` of an unlocked lesson, then `/nonexistent` | Lesson opens; then the lesson list | US1 AC4, FR-004 |
| 6 | Install via the address-bar install icon; open the installed app | Own window, no address bar, lesson list | US2 AC3 |
| 7 | Update: online, start a lesson; in another terminal change a visible string, `npm run build` (preview keeps serving `dist/`); keep playing | Lesson not interrupted; DevTools shows the new worker "waiting" | FR-011, O10 |
| 8 | Close every Duopona tab/window; reopen | The changed string is visible; progress intact | FR-010, SC-004 |
| 9 | Throttle to "Slow 4G", clear site data, reload; note time until lesson list is usable vs. with the worker unregistered | Difference ≤ 3 s | SC-006 |

## Real devices

Serving: browsers allow workers and installing only on HTTPS or `localhost`, so plain
`http://<lan-ip>:4173` is **not** enough on a phone. Use one of:
- Android: USB + Chrome `chrome://inspect` → Port forwarding `4173 → localhost:4173`, open
  `http://localhost:4173` on the phone.
- iPhone (and Android): an HTTPS tunnel to `npm run preview` (e.g. `cloudflared tunnel --url
  http://localhost:4173`), or a deploy of `dist/` to any static HTTPS host.

Do each row on a real **iPhone (Safari)** and a real **Android phone (Chrome)**:

| # | Steps | Expected | Covers |
|---|-------|----------|--------|
| D1 | Open in the browser; play one lesson | No horizontal scroll; all buttons/tiles easy to tap; no double-tap zoom; no layout jump on feedback | US4 AC2–AC3, FR-014–015 |
| D2 | Install (Android: menu → Install app; iOS: Share → Add to Home Screen) | Home-screen icon with the Duopona icon and name | US2 AC1–AC2, SC-003 |
| D3 | Open the installed app; check every screen (list, intro, exercise, feedback, summary) in light and dark mode | Full-screen; nothing under the notch/status bar/home indicator; status bar matches the app (else apply research R7 fallback); no horizontal scroll; targets ≥ 44 px | US2 AC3, US4 AC1, FR-013, FR-014 |
| D4 | From every screen, return to the lesson list with in-app controls only | Always possible | US2 AC4, FR-008 |
| D5 | Airplane mode; launch the installed app; play a lesson | Works fully | US1, US2 AC5, SC-001 |
| D6 | Rotate to landscape on intro and exercise | Usable, nothing unreachable, text not enlarged | US4 AC4 |
| D7 | Time from tapping the icon to a usable lesson list (offline) | < 2 s | SC-002 |
| D8 | In the **installed** app, with fresh data: run 002 quickstart scenarios 1, 2, 6, 7 (close and reopen instead of reload), 8 | Same results as in the browser: locked list, locked tap does nothing, lesson 2 unlocks, progress kept, replay works | FR-016 |

Record results (device, OS and browser versions) in tasks.md next to the task.

## Hosting notes (for whoever deploys `dist/`)

- HTTPS required.
- Serve `index.html`, `sw.js` and `manifest.webmanifest` with `Cache-Control: no-cache`;
  `assets/*` (hashed) may be cached for a year.
