# Data Model: Installable, Offline-Capable PWA

This feature adds **no learner data** and does not change any persisted format. The entities
from the spec map to build/browser artifacts as follows.

## App version

One production build: `dist/index.html`, hashed `dist/assets/*.js|css`, icons and
`manifest.webmanifest`.

- **Identity**: the precache manifest inside the generated `sw.js` (file URL + revision per
  file). Any changed file → new revision → new version.
- **Lifecycle** (browser-managed, R2):

  ```text
  (none) --first online visit--> installing --all files cached--> active
  active --new sw.js found--> active + installing(new)
  installing(new) --any file fails--> discarded; old stays active        (FR-012)
  installing(new) --all files cached--> active + waiting(new)
  waiting(new) --all Duopona windows closed, next launch--> active(new); old caches deleted
  ```

- **Rule**: a page is always served entirely by one version (never mixed).

## Offline copy

The Cache Storage entries holding the active version's precached files (Workbox precache
cache). Holds no learner data. May be evicted by the browser; the app then behaves like a
first visit (spec Edge Cases).

## Learner progress (unchanged)

`localStorage["duopona:progress"]`, version 1, defined in
`specs/001-first-lesson-flow/contracts/progress-storage.md`. The service worker never reads or
writes it, so updates cannot change it (FR-011). On iOS the installed app and Safari keep
separate copies (spec Edge Cases).

## App identity

Static config, see [contracts/app-identity.md](contracts/app-identity.md): name, icons, colors,
start URL, display mode.
