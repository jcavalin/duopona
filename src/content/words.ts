import type { Exercise } from './types'
import { vocabulary } from './vocabulary'

/**
 * The course words an exercise tests: those in its Toki Pona text, i.e. the prompt for
 * Toki Pona → English and the answer for English → Toki Pona (006 FR-007, research R1).
 * Distinct, in first-seen order.
 */
export function testedWords(exercise: Exercise): string[] {
  const text =
    exercise.direction === 'tp-en'
      ? exercise.prompt
      : exercise.type === 'multipleChoice'
        ? exercise.answer
        : exercise.answer.join(' ')
  const tokens = text.toLowerCase().split(/[^a-z]+/)
  return [...new Set(tokens.filter((t) => t !== '' && Object.hasOwn(vocabulary, t)))]
}
