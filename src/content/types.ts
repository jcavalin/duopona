export type Direction = 'tp-en' | 'en-tp'

export interface MultipleChoiceExercise {
  id: string
  type: 'multipleChoice'
  prompt: string
  direction: Direction
  /** 3–4 items, no duplicates */
  options: string[]
  /** MUST be one of `options` */
  answer: string
}

export interface WordBankExercise {
  id: string
  type: 'wordBank'
  prompt: string
  direction: Direction
  /** Ordered words of the correct answer */
  answer: string[]
  /** Extra tiles; none may make an alternative correct answer */
  distractors: string[]
  /** true when answering requires the lesson's grammar point; ≥ 2 per lesson */
  practisesGrammar?: boolean
}

export type Exercise = MultipleChoiceExercise | WordBankExercise

export interface Grammar {
  title: string
  /** 1–4 short original paragraphs */
  explanation: string[]
}

export interface Lesson {
  /** Stable kebab-case slug, used in URLs and saved progress; never rename after release */
  id: string
  /** Book chapter title */
  title: string
  /** Book reference, e.g. "Lesson 2", or "Dictionary" */
  chapter: string
  /** Words first taught here; an earlier word MAY be re-listed only when this lesson teaches a new role for it */
  newWords: string[]
  grammar: Grammar
  exercises: Exercise[]
}
