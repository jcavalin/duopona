import { vocabulary } from '../src/content/vocabulary'

const NO_BREAK = new Set(['\u202f', ' '])

/**
 * French typography (015 contract course-content-fr.md, rule F1): ? ! ; : follow a narrow or plain
 * no-break space. A mark right after a Toki Pona word is Toki Pona punctuation (e.g. "seme?"), which
 * has no space, so it is exempt (015 analysis U1). Returns a short description of each error.
 */
export function frenchTypographyErrors(text: string): string[] {
  const errors: string[] = []
  ;[...text].forEach((char, i, chars) => {
    if (!'?!;:'.includes(char) || NO_BREAK.has(chars[i - 1])) return
    const word = chars.slice(0, i).join('').match(/[\p{L}’']+$/u)?.[0]
    if (word !== undefined && Object.hasOwn(vocabulary, word)) return
    errors.push(`“${chars.slice(Math.max(0, i - 12), i + 1).join('')}”`)
  })
  return errors
}
