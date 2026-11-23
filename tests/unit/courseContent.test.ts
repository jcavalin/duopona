// Content rules for every course lesson: specs/002-book-course/contracts/lesson-content.md
import { explainMistake } from '../../src/content/explanations'
import { courses, exerciseKey, getLesson, lessons } from '../../src/content/lessons'
import { strings } from '../../src/i18n/strings'
import type { Exercise, Lesson } from '../../src/content/types'
import { getMeaning, vocabularies } from '../../src/content/vocabulary'
import { LANGUAGES } from '../../src/i18n/language'

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
    expect(strings.en.sourceLabel(lessons[0].chapter)).toBe('Book: Lesson 2')
    expect(strings.en.sourceLabel(lessons[16].chapter)).toBe('Extra: dictionary words')
  })

  it('getLesson finds course lessons only', () => {
    expect(getLesson(lessons[0].id)).toBe(lessons[0])
    expect(getLesson('nope')).toBeUndefined()
    expect(getLesson('basics-1')).toBeUndefined()
  })

  // Rules C2–C11 apply to every study language (014 contract course-content-pt.md)
  describe.each(LANGUAGES)('%s', (language) => {
    const course = courses[language]

    course.forEach((lesson, index) => {
      const introducedSoFar = new Set(course.slice(0, index + 1).flatMap((l) => l.newWords))

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
          expect(lesson.newWords.filter((w) => getMeaning(w, language) === undefined)).toEqual([])
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
})

describe.each(LANGUAGES)('mistake explanations (feature 008) in %s', (language) => {
  const all = courses[language].flatMap((lesson) => lesson.exercises.map((exercise) => ({ lesson, exercise })))

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
      const e = explainMistake(exerciseKey(lesson.id, exercise.id), 'x', language)!
      expect(e.words.length > 0 || e.grammar !== null, `${lesson.id}/${exercise.id}`).toBe(true)
      if (exercise.type === 'wordBank' && exercise.practisesGrammar) expect(e.grammar).not.toBeNull()
    }
  })

  it('every wrong multiple-choice option that is a course word explains its meaning (SC-003)', () => {
    for (const { lesson, exercise } of all) {
      if (exercise.type !== 'multipleChoice') continue
      for (const option of exercise.options) {
        if (option === exercise.answer || getMeaning(option, language) === undefined) continue
        const e = explainMistake(exerciseKey(lesson.id, exercise.id), option, language)!
        expect(e.wrongPick, `${lesson.id}/${exercise.id} ${option}`).toEqual({ word: option, meaning: getMeaning(option, language) })
      }
    }
  })
})

/** The text of a lesson that is not Toki Pona, field by field (014 contract, rules P2 and P2b). */
function studyLanguageText(lesson: Lesson): [string, string][] {
  const fields: [string, string][] = [
    ['title', lesson.title],
    ['chapter', lesson.chapter],
    ['grammar.title', lesson.grammar.title],
    ...lesson.grammar.explanation.map((p, i): [string, string] => [`grammar.explanation[${i}]`, p]),
  ]
  for (const ex of lesson.exercises) {
    const at = (field: string) => `${ex.id}.${field}`
    if (ex.direction === 'en-tp') fields.push([at('prompt'), ex.prompt])
    if (ex.type === 'multipleChoice' && ex.direction === 'tp-en') {
      ex.options.forEach((o, i) => fields.push([at(`options[${i}]`), o]))
    }
    if (ex.type === 'wordBank' && ex.direction === 'tp-en') {
      fields.push([at('answer'), ex.answer.join(' ')], [at('distractors'), ex.distractors.join(' ')])
    }
    if (ex.type === 'wordBank' && ex.grammarNote !== undefined) fields.push([at('grammarNote'), ex.grammarNote])
  }
  return fields
}

/** Fields whose Portuguese text may equal the English one, with the reason (rule P2b). */
const SAME_IN_BOTH = new Set([
  'pi/title', // the lesson is named after the Toki Pona word
])

describe('Brazilian Portuguese course (014 contract course-content-pt.md)', () => {
  const pt = courses['pt-BR']

  it('has the same lessons, ids and new words, in order (P1)', () => {
    expect(pt.map((l) => [l.id, l.newWords])).toEqual(lessons.map((l) => [l.id, l.newWords]))
  })

  lessons.forEach((en, index) => {
    const lesson = pt[index]

    describe(en.id, () => {
      it('has the same exercises with the same Toki Pona side (P1)', () => {
        const shape = (ex: Exercise) => [ex.id, ex.type, ex.direction, ex.type === 'wordBank' ? ex.practisesGrammar === true : false]
        expect(lesson.exercises.map(shape)).toEqual(en.exercises.map(shape))
        lesson.exercises.forEach((ex, i) => {
          const english = en.exercises[i]
          expect(tokiPonaText(ex), ex.id).toEqual(tokiPonaText(english))
          if (ex.direction === 'en-tp' && ex.type === 'multipleChoice' && english.type === 'multipleChoice') {
            expect(ex.answer, ex.id).toBe(english.answer)
          }
        })
      })

      it('has every other text present (P2)', () => {
        const empty = studyLanguageText(lesson).filter(([, text]) => text.trim() === '')
        expect(empty).toEqual([])
        expect(lesson.grammar.explanation.length).toBeGreaterThanOrEqual(1)
        expect(lesson.grammar.explanation.length).toBeLessThanOrEqual(4)
      })

      it('has every other text translated (P2b)', () => {
        const english = new Map(studyLanguageText(en))
        const untranslated = studyLanguageText(lesson)
          .filter(([field, text]) => english.get(field) === text && !SAME_IN_BOTH.has(`${en.id}/${field}`))
          .map(([field]) => field)
        expect(untranslated).toEqual([])
      })

      it('has distinct multiple-choice options (P6)', () => {
        for (const ex of lesson.exercises) {
          if (ex.type === 'multipleChoice') expect(new Set(ex.options).size, ex.id).toBe(ex.options.length)
        }
      })

      it('labels the chapter as in the English book (P7)', () => {
        const expected = en.chapter === 'Dictionary' ? 'Dicionário' : en.chapter.replace(/^Lesson (\d+)$/, 'Lição $1')
        expect(lesson.chapter).toBe(expected)
      })
    })
  })

  it('has a gloss for every English vocabulary word, and no others (P3)', () => {
    const ptGlosses = vocabularies['pt-BR']
    expect(Object.keys(ptGlosses)).toEqual(Object.keys(vocabularies.en))
    for (const [word, gloss] of Object.entries(ptGlosses)) {
      expect(gloss.trim(), word).not.toBe('')
      expect(gloss, word).not.toBe(vocabularies.en[word])
    }
  })
})
