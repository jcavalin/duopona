import { vocabulary } from '../src/content/vocabulary'

const OPENING: Record<string, string> = { '?': '¿', '!': '¡' }

/**
 * Spanish punctuation (017 contract course-content-es.md, rule S1): a "?" or "!" needs its opening
 * "¿" or "¡" earlier in the same sentence, and no space before it. A sentence starts after the
 * previous ".", "?" or "!", or at the start of the text. A mark with no opening mark, right after a
 * Toki Pona word, is Toki Pona punctuation (e.g. "sina wawa ala wawa?") and is exempt, as in F1.
 * Returns a short description of each error.
 */
export function spanishPunctuationErrors(text: string): string[] {
  const errors: string[] = []
  const chars = [...text]
  let sentenceStart = 0
  chars.forEach((char, i) => {
    if (char === '.') sentenceStart = i + 1
    if (!(char in OPENING)) return
    const around = `“${chars.slice(Math.max(0, i - 12), i + 1).join('')}”`
    if (/\s/.test(chars[i - 1] ?? '')) errors.push(`space before: ${around}`)
    else if (!chars.slice(sentenceStart, i).includes(OPENING[char])) {
      const word = chars.slice(0, i).join('').match(/\p{L}+$/u)?.[0]
      if (word === undefined || !Object.hasOwn(vocabulary, word)) errors.push(`no ${OPENING[char]}: ${around}`)
    }
    sentenceStart = i + 1
  })
  return errors
}

/** Rule S5: forms that only Spain uses, which neutral Spanish avoids (spec FR-014) */
export function nonNeutralSpanish(text: string): string[] {
  return [...text.matchAll(/(?<!\p{L})(vosotros|vosotras|vuestros|vuestras|vuestro|vuestra|os)(?!\p{L})/giu)].map((m) => m[0])
}
