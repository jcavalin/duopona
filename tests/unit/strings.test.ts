// Interface text completeness (014 research R1, FR-013)
import { strings } from '../../src/i18n/strings'

/** Keys whose text is the same in both languages, with the reason */
const SAME_IN_BOTH = new Set([
  'wordmark', // the app name
  'bookTitle', // the course follows the English edition of the book
])

const SAMPLE_ARGS: Record<string, unknown[]> = {
  sourceLabel: ['Lesson 2'],
  lessonLocked: ['X'],
  lessonStart: ['X'],
  lessonCompleted: ['X', 3, 5],
  fromLesson: ['X'],
}

describe('interface strings (014)', () => {
  const en = strings.en as Record<string, unknown>
  const pt = strings['pt-BR'] as Record<string, unknown>

  it('Portuguese has exactly the English keys, each of the same kind', () => {
    expect(Object.keys(pt).sort()).toEqual(Object.keys(en).sort())
    for (const key of Object.keys(en)) expect(typeof pt[key], key).toBe(typeof en[key])
  })

  it.each(Object.keys(strings.en))('%s is translated and not empty', (key) => {
    const text = (value: unknown) =>
      typeof value === 'function' ? String((value as (...a: unknown[]) => unknown)(...(SAMPLE_ARGS[key] ?? [1, true]))) : String(value)
    expect(text(pt[key]).trim()).not.toBe('')
    if (!SAME_IN_BOTH.has(key)) expect(text(pt[key])).not.toBe(text(en[key]))
  })

  it('labels each language’s chapters', () => {
    expect(strings.en.sourceLabel('Lesson 5')).toBe('Book: Lesson 5')
    expect(strings.en.sourceLabel('Dictionary')).toBe('Extra: dictionary words')
    expect(strings['pt-BR'].sourceLabel('Lição 5')).toBe('Livro: Lição 5')
    expect(strings['pt-BR'].sourceLabel('Dicionário')).toBe('Extra: palavras do dicionário')
  })

  it('uses singular and plural forms', () => {
    expect(strings.en.dayCount(1)).toBe('1 day')
    expect(strings.en.dayCount(2)).toBe('2 days')
    expect(strings['pt-BR'].dayCount(1)).toBe('1 dia')
    expect(strings['pt-BR'].dayCount(3)).toBe('3 dias')
    expect(strings['pt-BR'].bestStreak(1)).toBe('Melhor sequência: 1 dia')
  })
})
