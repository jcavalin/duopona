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
}

export type Exercise = MultipleChoiceExercise | WordBankExercise

export interface Lesson {
  id: string
  title: string
  exercises: Exercise[]
}
