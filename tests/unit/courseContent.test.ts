// Content rules for every course lesson: specs/002-book-course/contracts/lesson-content.md
import { explainMistake } from '../../src/content/explanations'
import { exerciseKey, getLesson, lessons, sourceLabel } from '../../src/content/lessons'
import type { Exercise } from '../../src/content/types'
import { getMeaning } from '../../src/content/vocabulary'

const BANNED = ['unpa', 'tu', 'luka', 'nanpa']

/** FR-001: [id, title, chapter, newWords] in teaching order (rule C1). */
const COURSE: [string, string, string, string][] = [
  ['words-and-sentences', 'Words and Sentences', 'Lesson 2', 'ijo jan kili lipu meli ni soweli li'],
  ['nouns-and-adjectives', 'Nouns and Adjectives', 'Lesson 3', 'telo tomo lili pona suli'],
  ['you-and-i', 'You and I', 'Lesson 4', 'mi mije sina kulupu sin wawa'],
  ['verbs', 'Verbs', 'Lesson 5', 'jo kute moku pali sona toki e'],
  ['more-adjectives', 'More Adjectives', 'Lesson 6', 'ala ike mute pu sewi wan mama'],
  ['questions-and-answers', 'Questions and Answers', 'Lesson 7', 'ilo kala ona anu seme'],
  ['prepositions', 'Prepositions', 'Lesson 8', 'pana tawa lon kepeken tan'],
  ['greetings-and-feelings', 'Greetings and Feelings', 'Lesson 10', 'a mu o pilin'],
  ['pi', 'pi', 'Lesson 11', 'kasi sijelo suno tenpo awen tawa pi'],
  ['pre-verbs', 'Pre-Verbs', 'Lesson 13', 'kama ken wile lukin sona'],
  ['colours-and-la', 'Colours and la', 'Lesson 14', 'jelo laso loje pimeja walo la'],
  ['spatial-nouns', 'Spatial Nouns', 'Lesson 15', 'insa monsi noka poka sewi sinpin'],
  ['particles-and-perspective', 'Particles and Perspective', 'Lesson 16', 'anpa ante en lete lupa open sama suwi taso tawa'],
  ['hunting', 'Hunting', 'Lesson 17', 'alasa lawa len linja pakala palisa pipi waso weka'],
  ['cooking', 'Cooking', 'Lesson 18', 'lape olin pan pini seli supa uta'],
  ['more-words-1', 'More Words 1', 'Dictionary', 'ma nasin nena nimi utala akesi jaki kalama kiwen ale esun'],
  ['more-words-2', 'More Words 2', 'Dictionary', 'kon kule mani moli mun musi nasa selo sike sitelen ko poki'],
]

/** The Toki Pona side of an exercise, as written (contract table). */
function tokiPonaText(ex: Exercise): string[] {
  if (ex.direction === 'tp-en') return [ex.prompt]
  if (ex.type === 'multipleChoice') return ex.options
  return [...ex.answer, ...ex.distractors]
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?"'“”‘’]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function tokiPonaTokens(ex: Exercise): string[] {
  return tokiPonaText(ex).flatMap(tokenize)
}

describe('course content', () => {
  it('has the FR-001 lessons in book order (C1)', () => {
    expect(lessons.map((l) => [l.id, l.title, l.chapter, l.newWords.join(' ')])).toEqual(COURSE)
  })

  it('lesson ids are unique (C11)', () => {
    const ids = lessons.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('labels book chapters and the extra dictionary lessons', () => {
    expect(sourceLabel(lessons[0])).toBe('Book: Lesson 2')
    expect(sourceLabel(lessons[16])).toBe('Extra: dictionary words')
  })

  it('getLesson finds course lessons only', () => {
    expect(getLesson(lessons[0].id)).toBe(lessons[0])
    expect(getLesson('nope')).toBeUndefined()
    expect(getLesson('basics-1')).toBeUndefined()
  })

  lessons.forEach((lesson, index) => {
    const introducedSoFar = new Set(lessons.slice(0, index + 1).flatMap((l) => l.newWords))

    describe(`${index + 1}. ${lesson.title}`, () => {
      const wordBanks = lesson.exercises.filter((e) => e.type === 'wordBank')

      it('has 10–15 exercises with at least 3 word banks (C2)', () => {
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(10)
        expect(lesson.exercises.length).toBeLessThanOrEqual(15)
        expect(wordBanks.length).toBeGreaterThanOrEqual(3)
      })

      it('uses every new word in an exercise (C3)', () => {
        const used = new Set(lesson.exercises.flatMap(tokiPonaTokens))
        const unused = lesson.newWords.filter((w) => !used.has(w))
        expect(unused).toEqual([])
      })

      it('uses no word before it is introduced (C4)', () => {
        const early = lesson.exercises.flatMap((ex) =>
          tokiPonaTokens(ex)
            .filter((t) => !introducedSoFar.has(t))
            .map((t) => `${ex.id}: ${t}`),
        )
        expect(early).toEqual([])
      })

      it('practises its grammar point in at least 2 word banks (C5)', () => {
        expect(wordBanks.filter((e) => e.practisesGrammar).length).toBeGreaterThanOrEqual(2)
      })

      it('has a meaning for every new word (C6)', () => {
        expect(lesson.newWords.filter((w) => getMeaning(w) === undefined)).toEqual([])
      })

      it('has grammar text of 1–4 paragraphs', () => {
        expect(lesson.grammar.title).not.toBe('')
        expect(lesson.grammar.explanation.length).toBeGreaterThanOrEqual(1)
        expect(lesson.grammar.explanation.length).toBeLessThanOrEqual(4)
      })

      it('has no capitalised words, so no proper names (C10)', () => {
        const capitalised = lesson.exercises.flatMap((ex) =>
          tokiPonaText(ex)
            .filter((text) => /[A-Z]/.test(text))
            .map((text) => `${ex.id}: ${text}`),
        )
        expect(capitalised).toEqual([])
      })

      it('never uses excluded words (C10)', () => {
        const banned = lesson.exercises.flatMap(tokiPonaTokens).filter((t) => BANNED.includes(t))
        expect(banned).toEqual([])
      })

      it('has unique exercise ids and prompts (C11)', () => {
        const ids = lesson.exercises.map((e) => e.id)
        const prompts = lesson.exercises.map((e) => e.prompt)
        expect(new Set(ids).size).toBe(ids.length)
        expect(new Set(prompts).size).toBe(prompts.length)
      })

      it.each(lesson.exercises.map((e) => [e.id, e] as const))('exercise %s is well-formed (C7, C8)', (_id, ex) => {
        if (ex.type === 'multipleChoice') {
          expect(ex.options.length).toBeGreaterThanOrEqual(3)
          expect(ex.options.length).toBeLessThanOrEqual(4)
          expect(new Set(ex.options).size).toBe(ex.options.length)
          expect(ex.options).toContain(ex.answer)
        } else {
          expect(ex.answer.length).toBeGreaterThan(0)
          expect(ex.answer.length).toBeLessThanOrEqual(8)
          expect(ex.distractors.length).toBeGreaterThanOrEqual(1)
          for (const d of ex.distractors) expect(ex.answer).not.toContain(d)
          expect([...ex.answer].reverse()).not.toEqual(ex.answer)
        }
      })
    })
  })
})

describe('mistake explanations (feature 008)', () => {
  const all = lessons.flatMap((lesson) => lesson.exercises.map((exercise) => ({ lesson, exercise })))

  it('grammar notes appear exactly on the exercises that practise grammar, 49 in all (FR-005)', () => {
    let count = 0
    for (const { lesson, exercise } of all) {
      const grammar = exercise.type === 'wordBank' && exercise.practisesGrammar === true
      const note = exercise.type === 'wordBank' ? exercise.grammarNote : undefined
      expect(typeof note === 'string' && note.trim() !== '', `${lesson.id}/${exercise.id}`).toBe(grammar)
      if (note) {
        count += 1
        expect(note.length, `${lesson.id}/${exercise.id}`).toBeLessThanOrEqual(160)
        expect(note.match(/[.!?](\s|$)/g)?.length ?? 0, `${lesson.id}/${exercise.id}`).toBeLessThanOrEqual(2)
      }
    }
    expect(count).toBe(49)
  })

  it('every exercise explains at least one word or a grammar point when missed (SC-001, SC-002)', () => {
    for (const { lesson, exercise } of all) {
      const e = explainMistake(exerciseKey(lesson.id, exercise.id), 'x')!
      expect(e.words.length > 0 || e.grammar !== null, `${lesson.id}/${exercise.id}`).toBe(true)
      if (exercise.type === 'wordBank' && exercise.practisesGrammar) expect(e.grammar).not.toBeNull()
    }
  })

  it('every wrong multiple-choice option that is a course word explains its meaning (SC-003)', () => {
    for (const { lesson, exercise } of all) {
      if (exercise.type !== 'multipleChoice') continue
      for (const option of exercise.options) {
        if (option === exercise.answer || getMeaning(option) === undefined) continue
        const e = explainMistake(exerciseKey(lesson.id, exercise.id), option)!
        expect(e.wrongPick, `${lesson.id}/${exercise.id} ${option}`).toEqual({ word: option, meaning: getMeaning(option) })
      }
    }
  })
})
