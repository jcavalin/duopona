/// <reference types="node" />
/*
 * Checks dist/ against specs/003-pwa-offline-mobile/contracts (rows marked "auto")
 * and specs/004-ui-redesign/contracts/app-identity-changes.md.
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

describe('offline copy (contracts/offline-and-updates.md)', () => {
  it('finds a precache list in sw.js', () => {
    expect(precache.length).toBeGreaterThan(0)
  })

  it('O1: the built page registers the worker', () => {
    expect(indexHtml).toMatch(/<script[^>]+src="\/registerSW\.js"/)
  })

  it('O2: registration does not block the first render', () => {
    const tag = indexHtml.match(/<script[^>]+src="\/registerSW\.js"[^>]*>/)?.[0] ?? ''
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
  const manifestLink = indexHtml.match(/<link rel="manifest" href="\/([^"]+)"/)?.[1]

  it('the page links the manifest', () => {
    expect(manifestLink).toBe('manifest.webmanifest')
  })

  const manifest = JSON.parse(read('manifest.webmanifest')) as Record<string, unknown>

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
    expect(manifest.background_color).toBe('#131F24')
    expect(manifest.theme_color).toBe('#131F24')
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
    expect(themeColors).toEqual(['<meta name="theme-color" content="#131F24" />'])
    expect(indexHtml).toContain('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />')
  })

  it('precaches the self-hosted Nunito font files (004)', () => {
    for (const font of ['fonts/nunito-latin-wght-normal.woff2', 'fonts/nunito-latin-wght-italic.woff2']) {
      expect(distFiles, font).toContain(font)
      expect(precachedUrls, font).toContain(font)
    }
  })

  it('has the iOS home-screen icon and title, and an SVG favicon', () => {
    expect(indexHtml).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />')
    expect(existsSync(join(DIST, 'apple-touch-icon-180x180.png'))).toBe(true)
    expect(indexHtml).toContain('<meta name="apple-mobile-web-app-title" content="Duopona" />')
    expect(indexHtml).toContain('<link rel="icon" href="/icon.svg" type="image/svg+xml" />')
    expect(existsSync(join(DIST, 'icon.svg'))).toBe(true)
  })
})
