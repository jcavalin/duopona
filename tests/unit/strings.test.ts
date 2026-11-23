// Interface text completeness (014 research R1, 015 research R7, FR-013)
import { LANGUAGES, type Language } from '../../src/i18n/language'
import { strings } from '../../src/i18n/strings'
import { frenchTypographyErrors } from '../frenchTypography'

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

describe.each(TRANSLATIONS)('interface strings in %s (014, 015)', (language) => {
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
      // The word–meaning separator is plain punctuation, shared by English and Portuguese
      if (key === 'wordMeaningSeparator' && language === 'pt-BR' && other === 'en') continue
      expect(text(key, own[key]), `${key} vs ${other}`).not.toBe(text(key, (strings[other] as Record<string, unknown>)[key]))
    }
  })
})

describe('interface strings, per language', () => {
  it('labels each language’s chapters', () => {
    expect(strings.en.sourceLabel('Lesson 5')).toBe('Book: Lesson 5')
    expect(strings.en.sourceLabel('Dictionary')).toBe('Extra: dictionary words')
    expect(strings['pt-BR'].sourceLabel('Lição 5')).toBe('Livro: Lição 5')
    expect(strings['pt-BR'].sourceLabel('Dicionário')).toBe('Extra: palavras do dicionário')
    expect(strings.fr.sourceLabel('Leçon 5')).toBe('Livre\u202f: Leçon 5')
    expect(strings.fr.sourceLabel('Dictionnaire')).toBe('Extra\u202f: mots du dictionnaire')
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
})
