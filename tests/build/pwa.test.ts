/// <reference types="node" />
/*
 * Checks dist/ against specs/003-pwa-offline-mobile/contracts (rows marked "auto")
 * and specs/004-ui-redesign/contracts/app-identity-changes.md,
 * and the path rules of specs/005-github-pages-deploy/contracts/sub-path.md (relative base './').
 * Run `npm run build` first; `npm run test:pwa` runs this file.
 *
 * Patterns in the generated (minified) dist/sw.js, vite-plugin-pwa 2.0.0 / Workbox 7:
 *   precache:  e.precacheAndRoute([{url:"index.html",revision:"…"},{url:"assets/x-HASH.js",revision:null},…],{})
 *   fallback:  e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))
 *   cleanup:   e.cleanupOutdatedCaches()
 *   updates:   self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const DIST = join(process.cwd(), 'dist')

function read(file: string): string {
  return readFileSync(join(DIST, file), 'utf8')
}

function filesIn(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? filesIn(path) : [relative(DIST, path).split('\\').join('/')]
  })
}

if (!existsSync(join(DIST, 'sw.js'))) {
  throw new Error('Run `npm run build` before `npm run test:pwa` (dist/sw.js not found)')
}

const sw = read('sw.js')
const indexHtml = read('index.html')
const distFiles = filesIn(DIST)
const precache = [...sw.matchAll(/\{url:"([^"]+)",revision:(null|"[^"]*")\}/g)].map((m) => ({
  url: m[1],
  revision: m[2] === 'null' ? null : m[2].slice(1, -1),
}))
const precachedUrls = precache.map((entry) => entry.url)
const manifest = JSON.parse(read('manifest.webmanifest')) as Record<string, unknown>

describe('offline copy (contracts/offline-and-updates.md)', () => {
  it('finds a precache list in sw.js', () => {
    expect(precache.length).toBeGreaterThan(0)
  })

  it('O1: the built page registers the worker', () => {
    expect(indexHtml).toMatch(/<script[^>]+src="\.\/registerSW\.js"/)
  })

  it('O2: registration does not block the first render', () => {
    const tag = indexHtml.match(/<script[^>]+src="\.\/registerSW\.js"[^>]*>/)?.[0] ?? ''
    expect(tag).toMatch(/\b(defer|async|type="module")\b/)
  })

  it('O3: precaches index.html', () => {
    expect(precachedUrls).toContain('index.html')
  })

  it('O4: precaches every JS and CSS file except the worker itself', () => {
    const needed = distFiles.filter(
      (f) => /\.(js|css)$/.test(f) && f !== 'sw.js' && !/^workbox-[^/]+\.js$/.test(f),
    )
    expect(needed).toContain('registerSW.js')
    for (const file of needed) expect(precachedUrls).toContain(file)
  })

  it('O5: precaches the manifest, icon.svg and every PNG', () => {
    const needed = [
      'manifest.webmanifest',
      'icon.svg',
      ...distFiles.filter((f) => f.endsWith('.png')),
    ]
    for (const file of needed) expect(precachedUrls).toContain(file)
  })

  it('lists each file only once', () => {
    expect(new Set(precachedUrls).size).toBe(precachedUrls.length)
  })

  it('O6: every entry has a revision or a hashed filename', () => {
    for (const { url, revision } of precache) {
      expect(revision || /-[A-Za-z0-9_-]{8,}\./.test(url), url).toBeTruthy()
    }
  })

  it('O7: the offline copy is smaller than 1 MB', () => {
    const total = precachedUrls.reduce((sum, url) => sum + statSync(join(DIST, url)).size, 0)
    expect(total).toBeLessThan(1_048_576)
  })

  it('O8: offline navigation falls back to index.html', () => {
    expect(sw).toContain('NavigationRoute')
    expect(sw).toContain('createHandlerBoundToURL("index.html")')
  })

  it('O9: a new version never takes over an open page', () => {
    expect(sw).not.toContain('clientsClaim')
    const all = sw.match(/skipWaiting\(\)/g) ?? []
    const onMessageOnly = sw.match(/"SKIP_WAITING"===e\.data\.type&&self\.skipWaiting\(\)/g) ?? []
    expect(all.length).toBe(onMessageOnly.length)
  })

  it('O12: outdated precaches are deleted', () => {
    expect(sw).toContain('cleanupOutdatedCaches()')
  })
})

describe('app identity (contracts/app-identity.md)', () => {
  const manifestLink = indexHtml.match(/<link rel="manifest" href="\.\/([^"]+)"/)?.[1]

  it('the page links the manifest', () => {
    expect(manifestLink).toBe('manifest.webmanifest')
  })

  it('has the Duopona name, description, start URL and scope', () => {
    expect(manifest.name).toBe('Duopona')
    expect(manifest.short_name).toBe('Duopona')
    expect(typeof manifest.description).toBe('string')
    expect((manifest.description as string).length).toBeGreaterThan(0)
    expect(manifest.start_url).toBe('.')
    expect(manifest.scope).toBe('.')
    expect(manifest.lang).toBe('en')
  })

  it('opens full-screen with the app colors and any orientation', () => {
    expect(manifest.display).toBe('standalone')
    // Dark only (specs/004-ui-redesign/contracts/app-identity-changes.md)
    expect(manifest.background_color).toBe('#16151F')
    expect(manifest.theme_color).toBe('#16151F')
    expect(manifest).not.toHaveProperty('orientation')
  })

  it('has 192, 512 and maskable 512 PNG icons that exist', () => {
    const icons = manifest.icons as { src: string; sizes: string; type: string; purpose?: string }[]
    const summary = icons.map(({ sizes, type, purpose }) => `${sizes} ${type} ${purpose ?? 'any'}`)
    expect(summary).toEqual(
      expect.arrayContaining([
        '192x192 image/png any',
        '512x512 image/png any',
        '512x512 image/png maskable',
      ]),
    )
    for (const icon of icons) expect(existsSync(join(DIST, icon.src)), icon.src).toBe(true)
  })

  it('keeps the viewport zoomable and edge-to-edge', () => {
    expect(indexHtml).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />',
    )
    expect(indexHtml).not.toContain('user-scalable')
  })

  it('colors the browser bars dark in every color scheme (004)', () => {
    const themeColors = indexHtml.match(/<meta name="theme-color"[^>]*>/g) ?? []
    expect(themeColors).toEqual(['<meta name="theme-color" content="#16151F" />'])
    expect(indexHtml).toContain('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />')
  })

  it('precaches the self-hosted Nunito font files (004)', () => {
    for (const font of ['fonts/nunito-latin-wght-normal.woff2', 'fonts/nunito-latin-wght-italic.woff2']) {
      expect(distFiles, font).toContain(font)
      expect(precachedUrls, font).toContain(font)
    }
  })

  it('has the iOS home-screen icon and title, and an SVG favicon', () => {
    expect(indexHtml).toContain('<link rel="apple-touch-icon" href="./apple-touch-icon-180x180.png" />')
    expect(existsSync(join(DIST, 'apple-touch-icon-180x180.png'))).toBe(true)
    expect(indexHtml).toContain('<meta name="apple-mobile-web-app-title" content="Duopona" />')
    expect(indexHtml).toContain('<link rel="icon" href="./icon.svg" type="image/svg+xml" />')
    expect(existsSync(join(DIST, 'icon.svg'))).toBe(true)
  })
})

describe('sub-path (specs/005-github-pages-deploy/contracts/sub-path.md)', () => {
  it('S1: index.html references nothing from the site root', () => {
    expect(indexHtml).not.toMatch(/\s(src|href)="\/(?!\/)/)
  })

  it('S2: index.html loads every app file with a ./ path', () => {
    for (const ref of [
      'src="./registerSW.js"',
      'href="./manifest.webmanifest"',
      'href="./icon.svg"',
      'href="./apple-touch-icon-180x180.png"',
    ]) {
      expect(indexHtml).toContain(ref)
    }
    expect(indexHtml).toMatch(/<script type="module" crossorigin src="\.\/assets\/index-[^"]+\.js">/)
    expect(indexHtml).toMatch(/<link rel="stylesheet" crossorigin href="\.\/assets\/index-[^"]+\.css">/)
  })

  it('S3: no built CSS file loads anything from the site root', () => {
    const cssFiles = distFiles.filter((f) => f.endsWith('.css'))
    expect(cssFiles.length).toBeGreaterThan(0)
    for (const file of cssFiles) expect(read(file), file).not.toMatch(/url\(\s*['"]?\/(?!\/)/)
  })

  it('S4: the worker is registered relative to the page', () => {
    expect(read('registerSW.js')).toContain("register('./sw.js', { scope: './' })")
  })

  it('S5: no precache URL starts with /', () => {
    for (const url of precachedUrls) expect(url.startsWith('/'), url).toBe(false)
  })

  it('S6: manifest start URL, scope and icons are relative', () => {
    expect(manifest.start_url).toBe('.')
    expect(manifest.scope).toBe('.')
    for (const icon of manifest.icons as { src: string }[]) {
      expect(icon.src.startsWith('/'), icon.src).toBe(false)
    }
  })
})

describe('mascot and app icon (feature 012)', () => {
  it('emits and precaches the four mascot drawings', () => {
    for (const expression of ['idle', 'sad', 'happy', 'celebrate']) {
      const pattern = new RegExp(`^assets/mascot-${expression}-[A-Za-z0-9_-]+\\.svg$`)
      const emitted = distFiles.filter((f) => pattern.test(f))
      expect(emitted, expression).toHaveLength(1)
      expect(precachedUrls).toContain(emitted[0])
    }
  })

  it('ships the mascot icons from docs/design/app-icon unchanged', () => {
    const design = join(process.cwd(), 'docs/design/app-icon')
    for (const file of ['icon.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'maskable-icon-512x512.png', 'apple-touch-icon-180x180.png']) {
      expect(readFileSync(join(DIST, file)).equals(readFileSync(join(design, file))), file).toBe(true)
    }
  })

  it('precaches icon.svg exactly once', () => {
    expect(precachedUrls.filter((u) => u === 'icon.svg')).toHaveLength(1)
  })
})
