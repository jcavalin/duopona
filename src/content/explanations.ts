import { getExercise, getLesson } from './lessons'
import { vocabulary } from './vocabulary'
import { testedWords } from './words'

export interface WordMeaning {
  word: string
  meaning: string
}

export interface GrammarExplanation {
  /** The lesson's grammar point title */
  title: string
  /** "<chapter> · <lesson title>", e.g. "Lesson 4 · You and I" */
  lesson: string
  note: string
}

/** Why the right answer is right, shown after a wrong answer (feature 008, data-model). */
export interface Explanation {
  /** Course words of the exercise's Toki Pona side, distinct, first-seen order (FR-002) */
  words: WordMeaning[]
  /** Multiple-choice only: the learner's pick when it is a course word other than the answer (FR-003) */
  wrongPick: WordMeaning | null
  /** Only for exercises that practise their lesson's grammar point (FR-004, FR-005) */
  grammar: GrammarExplanation | null
}

/** The explanation for a missed exercise, or null if the key is unknown (research R1, R3). */
export function explainMistake(key: string, given: string | string[]): Explanation | null {
  const exercise = getExercise(key)
  if (!exercise) return null

  const words = testedWords(exercise).map((word) => ({ word, meaning: vocabulary[word] }))

  let wrongPick: WordMeaning | null = null
  if (exercise.type === 'multipleChoice' && typeof given === 'string') {
    const pick = given.trim().toLowerCase()
    if (Object.hasOwn(vocabulary, pick) && pick !== exercise.answer.toLowerCase()) {
      wrongPick = { word: pick, meaning: vocabulary[pick] }
    }
  }

  let grammar: GrammarExplanation | null = null
  const lesson = getLesson(key.slice(0, key.indexOf('/')))
  if (lesson && exercise.type === 'wordBank' && exercise.practisesGrammar && exercise.grammarNote) {
    grammar = { title: lesson.grammar.title, lesson: `${lesson.chapter} · ${lesson.title}`, note: exercise.grammarNote }
  }

  return { words, wrongPick, grammar }
}
