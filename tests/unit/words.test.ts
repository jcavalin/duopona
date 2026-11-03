import { getExercise, lessons } from '../../src/content/lessons'
import type { Exercise } from '../../src/content/types'
import { testedWords } from '../../src/content/words'

const words = (key: string) => testedWords(getExercise(key)!)

describe('testedWords (006 FR-007)', () => {
  it('Toki Pona → English multiple choice: the prompt', () => {
    expect(words('you-and-i/mi')).toEqual(['mi'])
  })

  it('English → Toki Pona multiple choice: the answer', () => {
    expect(words('you-and-i/lipu-sin')).toEqual(['lipu', 'sin'])
  })

  it('English → Toki Pona word bank: the answer tiles', () => {
    expect(words('you-and-i/mije-li-wawa')).toEqual(['mije', 'li', 'wawa'])
  })

  it('Toki Pona → English word bank: the prompt', () => {
    expect(words('you-and-i/kulupu-sina-li-wawa')).toEqual(['kulupu', 'sina', 'li', 'wawa'])
  })

  it('ignores punctuation, capitals and repeats; English-only text has no words', () => {
    const ex: Exercise = {
      id: 'x',
      type: 'multipleChoice',
      direction: 'tp-en',
      prompt: 'Jan Pona, jan pona li pona?',
      options: ['a', 'b', 'c'],
      answer: 'a',
    }
    expect(testedWords(ex)).toEqual(['jan', 'pona', 'li'])
    expect(testedWords({ ...ex, prompt: 'The house is big.' })).toEqual([])
  })

  it('every course exercise tests at least one word', () => {
    for (const lesson of lessons) {
      for (const ex of lesson.exercises) {
        expect(testedWords(ex), `${lesson.id}/${ex.id}`).not.toHaveLength(0)
      }
    }
  })
})
