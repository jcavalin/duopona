// Interface text completeness (014 research R1, 015 research R7, FR-013)
import { LANGUAGES, type Language } from '../../src/i18n/language'
import { strings } from '../../src/i18n/strings'
import { frenchTypographyErrors } from '../frenchTypography'
import { nonNeutralSpanish, spanishPunctuationErrors } from '../spanishTypography'

type Translation = Exclude<Language, 'en'>
const TRANSLATIONS = LANGUAGES.filter((l): l is Translation => l !== 'en')

/** Keys whose text may be the same as in another language, with the reason */
const SAME_ACROSS: Record<Translation, Set<string>> = {
  'pt-BR': new Set([
    'wordmark', // the app name
    'bookTitle', // the course follows the English edition of the book
    'footerBy', // “de Sonja Lang” in both Portuguese and French
  ]),
  fr: new Set([
    'wordmark',
    'bookTitle',
    'correct', // “Correct.” is the French word too
    'footerBy', // “de Sonja Lang” in both Portuguese and French
  ]),
  es: new Set([
    'wordmark',
    'bookTitle',
    'footerBy', // “de Sonja Lang” in Spanish, Portuguese and French
  ]),
}

/**
 * Keys whose Spanish and Portuguese texts are the same word, with the reason (017 research R7).
 * Checked in both directions, since the Portuguese pass compares with Spanish too.
 */
const SAME_ES_PT = new Map([
  ['language', '“Idioma” is the word in both'],
  ['grammarTag', '“Gramática” is the word in both'],
  ['hide', '“Ocultar” is the word in both'],
  ['continue', '“Continuar” is the word in both'],
])

/** Whether two languages may share this key's text (017 analysis I1) */
function mayShare(key: string, a: Language, b: Language, ownText: string): boolean {
  // The word–meaning separator is plain punctuation, shared by every language without French spacing
  if (key === 'wordMeaningSeparator' && ownText === ': ') return true
  const pair = new Set([a, b])
  return pair.has('es') && pair.has('pt-BR') && SAME_ES_PT.has(key)
}

const SAMPLE_ARGS: Record<string, unknown[]> = {
  sourceLabel: ['Lesson 2'],
  lessonLocked: ['X'],
  lessonStart: ['X'],
  lessonCompleted: ['X', 3, 5],
  fromLesson: ['X'],
}

const text = (key: string, value: unknown) =>
  typeof value === 'function' ? String((value as (...a: unknown[]) => unknown)(...(SAMPLE_ARGS[key] ?? [2, true]))) : String(value)

describe.each(TRANSLATIONS)('interface strings in %s (014, 015, 017)', (language) => {
  const own = strings[language] as Record<string, unknown>

  it('has exactly the English keys, each of the same kind', () => {
    const en = strings.en as Record<string, unknown>
    expect(Object.keys(own).sort()).toEqual(Object.keys(en).sort())
    for (const key of Object.keys(en)) expect(typeof own[key], key).toBe(typeof en[key])
  })

  it.each(Object.keys(strings.en))('%s is translated and not empty', (key) => {
    expect(text(key, own[key]).trim()).not.toBe('')
    if (SAME_ACROSS[language].has(key)) return
    for (const other of LANGUAGES.filter((l) => l !== language)) {
      if (mayShare(key, language, other, text(key, own[key]))) continue
      expect(text(key, own[key]), `${key} vs ${other}`).not.toBe(text(key, (strings[other] as Record<string, unknown>)[key]))
    }
  })
})

describe('interface strings, per language', () => {
  it('lists only Spanish–Portuguese pairs that are still the same (017 research R7)', () => {
    const stale = [...SAME_ES_PT.keys()].filter((key) => text(key, (strings.es as Record<string, unknown>)[key]) !== text(key, (strings['pt-BR'] as Record<string, unknown>)[key]))
    expect(stale).toEqual([])
  })

  it('labels each language’s chapters', () => {
    expect(strings.en.sourceLabel('Lesson 5')).toBe('Book: Lesson 5')
    expect(strings.en.sourceLabel('Dictionary')).toBe('Extra: dictionary words')
    expect(strings['pt-BR'].sourceLabel('Lição 5')).toBe('Livro: Lição 5')
    expect(strings['pt-BR'].sourceLabel('Dicionário')).toBe('Extra: palavras do dicionário')
    expect(strings.fr.sourceLabel('Leçon 5')).toBe('Livre\u202f: Leçon 5')
    expect(strings.fr.sourceLabel('Dictionnaire')).toBe('Extra\u202f: mots du dictionnaire')
    expect(strings.es.sourceLabel('Lección 5')).toBe('Libro: Lección 5')
    expect(strings.es.sourceLabel('Diccionario')).toBe('Extra: palabras del diccionario')
  })

  it('uses singular and plural forms', () => {
    expect(strings.en.dayCount(1)).toBe('1 day')
    expect(strings.en.dayCount(2)).toBe('2 days')
    expect(strings['pt-BR'].dayCount(1)).toBe('1 dia')
    expect(strings['pt-BR'].dayCount(3)).toBe('3 dias')
    expect(strings['pt-BR'].bestStreak(1)).toBe('Melhor sequência: 1 dia')
    // French uses the singular for 0 and 1 (015 research R5)
    expect(strings.fr.dayCount(0)).toBe('0 jour')
    expect(strings.fr.dayCount(1)).toBe('1 jour')
    expect(strings.fr.dayCount(2)).toBe('2 jours')
    expect(strings.fr.exerciseCount(12)).toBe('12 exercices')
    // Spanish uses the singular only for 1 (017 research R5)
    expect(strings.es.dayCount(0)).toBe('0 días')
    expect(strings.es.dayCount(1)).toBe('1 día')
    expect(strings.es.dayCount(2)).toBe('2 días')
    expect(strings.es.bestStreak(1)).toBe('Mejor racha: 1 día')
  })

  it('puts a no-break space before ? ! ; : in French (F1)', () => {
    const fr = strings.fr as Record<string, unknown>
    // The book title is English, with English punctuation
    const errors = Object.keys(fr).filter((key) => key !== 'bookTitle').flatMap((key) => {
      const samples = typeof fr[key] === 'function' ? [text(key, fr[key]), String((fr[key] as (...a: unknown[]) => unknown)(1, false))] : [text(key, fr[key])]
      return samples.flatMap((sample) => frenchTypographyErrors(sample).map((e) => `${key}: ${e}`))
    })
    expect(errors).toEqual([])
  })

  it('opens every Spanish question and exclamation, and uses neutral Spanish (S1, S5)', () => {
    const es = strings.es as Record<string, unknown>
    const errors = Object.keys(es).filter((key) => key !== 'bookTitle').flatMap((key) => {
      const samples = typeof es[key] === 'function' ? [text(key, es[key]), String((es[key] as (...a: unknown[]) => unknown)(1, false))] : [text(key, es[key])]
      return samples.flatMap((sample) => [...spanishPunctuationErrors(sample), ...nonNeutralSpanish(sample)].map((e) => `${key}: ${e}`))
    })
    expect(errors).toEqual([])
  })
})
