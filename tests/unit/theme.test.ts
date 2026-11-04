// Feature 011: purple brand colours (specs/011-purple-brand-colours/research.md R6).
// jsdom does not compute colours, so this reads the stylesheets directly.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const SRC = join(__dirname, '../../src')

function cssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name)
    if (e.isDirectory()) return cssFiles(path)
    return e.name.endsWith('.css') ? [path] : []
  })
}

const indexCss = readFileSync(join(SRC, 'index.css'), 'utf8')
const tokens: Record<string, string> = {}
for (const [, name, value] of indexCss.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) {
  tokens[name] = value.toLowerCase()
}

/** Values from docs/design/purple-theme.md */
const expected: Record<string, string> = {
  bg: '#16151f',
  text: '#efeef5',
  'text-muted': '#a3a1b3',
  line: '#2e2c3d',
  'line-deep': '#201e2c',
  'icon-muted': '#9592a8',
  primary: '#6d3fd9',
  'primary-deep': '#4f27a8',
  'primary-text': '#b69cff',
  'primary-text-strong': '#d9cbff',
  'primary-tint': '#2b2150',
  'grammar-tint': '#221c3d',
  success: '#0b7f63',
  'success-deep': '#075e49',
  'success-text': '#7ff0c8',
  'success-tint': '#163a2e',
}

/** Old green-brand and blue-slate values that must be gone */
const oldValues = [
  '#131f24', '#eef2f4', '#9aa8b0', '#2e3d45', '#1e2a30', '#8c9aa2',
  '#3ddba6', '#17392f', '#18302a', '#097257', '#cff1e5', '#e6f7f1',
]
/** Old greens kept only as the "correct" tokens */
const successOnly: Record<string, string> = {
  '#0b7f63': 'success',
  '#075e49': 'success-deep',
  '#7ff0c8': 'success-text',
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const colour = (name: string) => (name.startsWith('#') ? name : tokens[name])

describe('purple brand colours (feature 011)', () => {
  it.each(Object.entries(expected))('--%s is %s', (name, value) => {
    expect(tokens[name]).toBe(value)
  })

  it('leaves no old green-brand or blue-slate value in any stylesheet', () => {
    for (const file of cssFiles(SRC)) {
      const css = readFileSync(file, 'utf8').toLowerCase()
      for (const old of oldValues) expect(css, `${old} in ${file}`).not.toContain(old)
      for (const [green, token] of Object.entries(successOnly)) {
        const uses = css.match(new RegExp(`[^\\n]*${green}[^\\n]*`, 'g')) ?? []
        for (const line of uses) expect(line.trim(), file).toBe(`--${token}: ${green};`)
      }
    }
  })

  it.each([
    ['text', 'bg'],
    ['text-muted', 'bg'],
    ['primary-text', 'bg'],
    ['primary-text', 'primary-tint'],
    ['primary-text', 'grammar-tint'],
    ['primary-text-strong', 'grammar-tint'],
    ['#ffffff', 'primary'],
    ['#ffffff', 'success'],
    ['success-text', 'success-tint'],
  ])('text %s on %s meets 4.5:1', (fg, bg) => {
    expect(contrast(colour(fg), colour(bg))).toBeGreaterThanOrEqual(4.5)
  })

  it.each([
    ['icon-muted', 'bg'],
    ['primary-text', 'bg'],
    ['primary-text', 'success-tint'],
    ['primary-text', 'error-tint'],
  ])('non-text %s on %s meets 3:1', (fg, bg) => {
    expect(contrast(colour(fg), colour(bg))).toBeGreaterThanOrEqual(3)
  })
})
