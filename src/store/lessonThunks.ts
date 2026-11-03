import { getExercise } from '../content/lessons'
import { today } from '../lib/days'
import { testedWords } from '../content/words'
import { availableKeys, hasReviewable, pickPractice, pickReview } from '../lib/practice'
import type { AppDispatch, RootState } from './index'
import { completeLesson } from './progressSlice'
import {
  continueLesson,
  markGoalMet,
  selectCurrentKey,
  selectFirstTryCorrect,
  selectTotal,
  startPractice,
  submitAnswer,
} from './sessionSlice'
import { goalMet, selectMetToday } from './streakSlice'
import { wordsKnown, wordsMissed } from './wordsSlice'

function wordsOf(key: string): string[] {
  const exercise = getExercise(key)
  return exercise ? testedWords(exercise) : []
}

/**
 * Check an answer and, for the first answer to this exercise in the session, update the
 * tested words' mistake counts (006 FR-008 to FR-010, research R4). Retries change nothing, and
 * words missed earlier in this session keep their mistakes until a later session.
 */
export function submitAndRecord(answer: string | string[]) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const before = getState()
    const key = selectCurrentKey(before)
    if (!before.session || key === undefined) return
    // A correctly answered exercise leaves the queue, so "not missed yet" means "first answer".
    const firstTry = !before.session.missedOnce.includes(key)
    dispatch(submitAnswer(answer))
    const after = getState().session
    if (!firstTry || after?.status !== 'feedback' || !after.feedback) return
    const words = wordsOf(key)
    if (after.feedback.correct) {
      // Mistakes made in this session are only cleared in a later one (owner decision 2026-11-03)
      const missedNow = new Set(before.session.missedOnce.flatMap(wordsOf))
      const known = words.filter((w) => !missedNow.has(w))
      if (known.length > 0) dispatch(wordsKnown(known))
    } else if (words.length > 0) {
      dispatch(wordsMissed(words))
    }
  }
}

/**
 * Continue to the next exercise. When a lesson (not practice) finishes, record it as completed
 * (FR-009; 006 FR-005). When any session finishes, count it towards today's daily goal and flag
 * the session if it met the goal (007 FR-001, FR-009); quitting never reaches 'finished'.
 */
export function continueAndRecord() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(continueLesson())
    const state = getState()
    const session = state.session
    if (session?.status === 'finished' && session.kind === 'lesson' && session.lessonId) {
      dispatch(
        completeLesson({
          lessonId: session.lessonId,
          firstTryCorrect: selectFirstTryCorrect(state),
          total: selectTotal(state),
          completedAt: new Date().toISOString(),
        }),
      )
    }
    if (session?.status === 'finished') {
      const day = today()
      const metBefore = selectMetToday(day)(getState())
      dispatch(goalMet(day))
      if (!metBefore) dispatch(markGoalMet())
    }
  }
}

/** Start a practice or review session from the completed lessons; random choice stays out of reducers (research R3). */
export function startPracticeSession(kind: 'practice' | 'review') {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState()
    const keys = availableKeys(Object.keys(state.progress.completedLessons))
    if (kind === 'practice') {
      dispatch(startPractice({ kind, keys: pickPractice(keys) }))
    } else if (hasReviewable(keys, state.words.mistakes)) {
      dispatch(startPractice({ kind, keys: pickReview(keys, state.words.mistakes) }))
    }
  }
}
