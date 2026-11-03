# Contract Changes: App Identity (dark only)

Changes to [`specs/003-pwa-offline-mobile/contracts/app-identity.md`](../../003-pwa-offline-mobile/contracts/app-identity.md)
made by this feature (research R3). Update that file's rows when implementing; rows not listed
are unchanged.

| Item | Before (003) | After (004) | Check |
|------|--------------|-------------|-------|
| Manifest `background_color` | `#ffffff` | `#131F24` | auto (`test:pwa`) |
| Manifest `theme_color` | `#ffffff` | `#131F24` | auto (`test:pwa`) |
| `<meta name="theme-color">` | two tags by color scheme (`#ffffff` / `#0d1117`) | one tag, `#131F24`, no `media` | auto |
| `<meta name="apple-mobile-web-app-status-bar-style">` | absent | `black-translucent` | manual (quickstart V7) |
| `:root` `color-scheme` | not set | `dark` | auto (CSS review) |
| Precache `globPatterns` | `**/*.{js,css,html}` | `**/*.{js,css,html,woff2}` | auto (`test:pwa`: both Nunito files precached) |

The app icons stay as they are; they already read well on a dark home screen and are outside
the mockups' scope.
