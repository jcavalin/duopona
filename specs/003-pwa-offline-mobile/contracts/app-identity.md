# Contract: App Identity (manifest, icons, head tags)

What browsers and home screens see. Checked by `tests/build/pwa.test.ts` (rows marked **auto**)
and manually in Chrome DevTools → Application → Manifest and on devices (quickstart).

## Web app manifest (`dist/manifest.webmanifest`)

| Field | Value | Check |
|-------|-------|-------|
| `name` | `Duopona` | auto |
| `short_name` | `Duopona` | auto |
| `description` | one line, e.g. "Learn Toki Pona in short lessons" | auto (non-empty) |
| `start_url` | `.` | auto |
| `scope` | `.` | auto |
| `display` | `standalone` | auto |
| `background_color` | `#ffffff` (matches light `--color-bg`) | auto |
| `theme_color` | `#ffffff` (matches light `--color-bg` and the light `theme-color` meta; the page's metas override it per color scheme) | auto |
| `lang` | `en` | auto |
| `orientation` | not set (portrait and landscape allowed) | auto (absent) |
| `icons` | 192×192 PNG; 512×512 PNG; 512×512 PNG `purpose: "maskable"` | auto (each file exists in `dist/`) |

## `index.html` head

| Tag | Value | Check |
|-----|-------|-------|
| `<link rel="manifest">` | injected by the build | auto |
| `<meta name="viewport">` | unchanged: `width=device-width, initial-scale=1, viewport-fit=cover` (no `user-scalable=no`) | auto |
| `<meta name="theme-color">` | two tags: `media="(prefers-color-scheme: light)"` → `#ffffff`; `dark` → `#0d1117` | auto |
| `<link rel="apple-touch-icon">` | 180×180 PNG, file exists | auto |
| `<link rel="icon">` | `icon.svg` | auto |
| `<meta name="description">` | same text as manifest `description` | manual |
| `<meta name="apple-mobile-web-app-title">` | `Duopona` | auto |
| `<meta name="apple-mobile-web-app-status-bar-style">` | absent, or `black-translucent` if device check requires (research R7) | manual |

## Icons

- Source: `public/icon.svg`, original artwork; the mark stays inside the central 80 % circle
  so the maskable variant is never clipped.
- Generated PNGs are committed in `public/` (research R6).
- Manual: on Android the home-screen icon fills the system shape (no white ring); on iOS it is
  the icon, not a page screenshot (US2 AC1–AC2).
