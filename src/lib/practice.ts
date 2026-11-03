import { exerciseKey, getExercise, lessons } from '../content/lessons'
import { testedWords } from '../content/words'
import { shuffle } from './shuffle'

/** Exercises per practice or review session (spec FR-002, FR-014) */
export const SESSION_SIZE = 10

/** Keys of every exercise in the given lessons, in course order; ids not in the course are ignored. */
export function availableKeys(completedLessonIds: readonly string[]): string[] {
  const completed = new Set(completedLessonIds)
  return lessons
    .filter((lesson) => completed.has(lesson.id))
    .flatMap((lesson) => lesson.exercises.map((e) => exerciseKey(lesson.id, e.id)))
}

/** Up to SESSION_SIZE distinct random keys (research R3). */
export function pickPractice(keys: readonly string[], random: () => number = Math.random): string[] {
  return shuffle(keys, random).slice(0, SESSION_SIZE)
}

function wordsOf(key: string): string[] {
  const exercise = getExercise(key)
  return exercise ? testedWords(exercise) : []
}

const isWeak = (mistakes: Record<string, number>) => (word: string) => (mistakes[word] ?? 0) >= 1

/** True when some key tests a weak word, i.e. a review would have something to review (FR-013). */
export function hasReviewable(keys: readonly string[], mistakes: Record<string, number>): boolean {
  return keys.some((key) => wordsOf(key).some(isWeak(mistakes)))
}

/**
 * Up to SESSION_SIZE distinct keys favouring weak words (research R3): one exercise per weak
 * word, most mistakes first; then other exercises with weak words; then random ones.
 */
export function pickReview(
  keys: readonly string[],
  mistakes: Record<string, number>,
  random: () => number = Math.random,
): string[] {
  const weak = isWeak(mistakes)
  const words = new Map(keys.map((key) => [key, wordsOf(key)]))
  const present = new Set([...words.values()].flat().filter(weak))
  // Random order first, then a stable sort: ties between equal counts stay random.
  const ranked = shuffle([...present], random).sort((a, b) => mistakes[b] - mistakes[a])

  const chosen: string[] = []
  const pool = shuffle(keys, random)
  const take = (key: string) => {
    if (chosen.length < SESSION_SIZE && !chosen.includes(key)) chosen.push(key)
  }

  for (const word of ranked) {
    const key = pool.find((k) => !chosen.includes(k) && words.get(k)!.includes(word))
    if (key) take(key)
  }
  for (const key of pool) if (words.get(key)!.some(weak)) take(key)
  for (const key of pool) take(key)

  return shuffle(chosen, random)
}
