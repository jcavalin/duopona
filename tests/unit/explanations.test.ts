import { describe, expect, it } from 'vitest'
import { explainMistake } from '../../src/content/explanations'
import { exerciseKey, lessons } from '../../src/content/lessons'

const key = (exerciseId: string) => exerciseKey('you-and-i', exerciseId)

describe('explainMistake', () => {
  it('returns null for an unknown exercise', () => {
    expect(explainMistake('nope/nothing', 'x')).toBeNull()
    expect(explainMistake('you-and-i/nothing', 'x')).toBeNull()
  })

  it('English → Toki Pona multiple choice: answer word and the wrong pick', () => {
    expect(explainMistake(key('kulupu'), 'tomo')).toEqual({
      words: [{ word: 'kulupu', meaning: 'group / community' }],
      wrongPick: { word: 'tomo', meaning: 'house / building / room' },
      grammar: null,
    })
  })

  it('no wrong pick when the given answer is the right one', () => {
    expect(explainMistake(key('kulupu'), 'kulupu')?.wrongPick).toBeNull()
  })

  it('Toki Pona → English multiple choice: prompt word, English pick not explained', () => {
    const explanation = explainMistake(key('sin'), 'strong / powerful / energy')
    expect(explanation?.words).toEqual([{ word: 'sin', meaning: 'new / fresh / extra' }])
    expect(explanation?.wrongPick).toBeNull()
  })

  it('word bank: words of the Toki Pona side in sentence order, no wrong pick', () => {
    const explanation = explainMistake(key('kulupu-sina-li-wawa'), ['my', 'group', 'is', 'strong'])
    expect(explanation?.words.map((w) => w.word)).toEqual(['kulupu', 'sina', 'li', 'wawa'])
    expect(explanation?.wrongPick).toBeNull()
  })

  it('a wrong phrase pick is not explained as a word', () => {
    const explanation = explainMistake(key('lipu-sin'), 'sin lipu')
    expect(explanation?.words.map((w) => w.word)).toEqual(['lipu', 'sin'])
    expect(explanation?.wrongPick).toBeNull()
  })

  it('lists every word once and gives each a meaning, across the course', () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        const words = explainMistake(exerciseKey(lesson.id, exercise.id), 'x')!.words
        const names = words.map((w) => w.word)
        expect(new Set(names).size).toBe(names.length)
        for (const { meaning } of words) expect(meaning).toBeTruthy()
      }
    }
  })
})

describe('explainMistake: grammar (US2)', () => {
  it('a grammar exercise names its grammar point, lesson and note', () => {
    const lesson = lessons.find((l) => l.id === 'you-and-i')!
    const exercise = lesson.exercises.find((e) => e.id === 'mi-wawa')!
    expect(explainMistake(key('mi-wawa'), ['mi', 'li', 'wawa'])?.grammar).toEqual({
      title: 'mi and sina need no li',
      lesson: 'Lesson 4 · You and I',
      note: exercise.type === 'wordBank' ? exercise.grammarNote : undefined,
    })
  })

  it('other exercises have no grammar part', () => {
    expect(explainMistake(key('kulupu-sina-li-wawa'), ['x'])?.grammar).toBeNull()
    expect(explainMistake(key('kulupu'), 'tomo')?.grammar).toBeNull()
  })

  it('a Dictionary lesson is named as such', () => {
    const lesson = lessons.find((l) => l.chapter === 'Dictionary')!
    const exercise = lesson.exercises.find((e) => e.type === 'wordBank' && e.practisesGrammar)!
    const grammar = explainMistake(exerciseKey(lesson.id, exercise.id), ['x'])?.grammar
    expect(grammar?.lesson).toBe(`Dictionary · ${lesson.title}`)
  })
})
