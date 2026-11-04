import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { exerciseKey, getExercise, getLesson } from '../content/lessons'
import type { Exercise } from '../content/types'

export interface Feedback {
  correct: boolean
  correctAnswer: string
  /** The answer as submitted; session only, never saved (008 research R4) */
  given: string | string[]
}

export type SessionKind = 'lesson' | 'practice' | 'review'

export interface LessonSession {
  kind: SessionKind
  /** Set only when kind is 'lesson' */
  lessonId: string | null
  /** Exercise keys (lessonId/exerciseId) still to answer correctly; head = current exercise */
  queue: string[]
  /** Exercise keys answered wrong at least once */
  missedOnce: string[]
  /** Number of exercises in the session */
  total: number
  feedback: Feedback | null
  status: 'answering' | 'feedback' | 'finished'
  /** Increments on every new exercise shown, so retries get fresh UI state */
  step: number
  /** This session's finish met today's daily goal (007 research R5); not saved */
  goalMet: boolean
}

type SessionState = LessonSession | null

export function isCorrectAnswer(exercise: Exercise, answer: string | string[]): boolean {
  if (exercise.type === 'multipleChoice') {
    return answer === exercise.answer
  }
  if (!Array.isArray(answer) || answer.length !== exercise.answer.length) return false
  return answer.every((word, i) => word.toLowerCase() === exercise.answer[i].toLowerCase())
}

function formatAnswer(exercise: Exercise): string {
  return exercise.type === 'multipleChoice' ? exercise.answer : exercise.answer.join(' ')
}

function newSession(kind: SessionKind, lessonId: string | null, keys: string[]): LessonSession {
  return {
    kind,
    lessonId,
    queue: [...keys],
    missedOnce: [],
    total: keys.length,
    feedback: null,
    status: 'answering',
    step: 0,
    goalMet: false,
  }
}

const sessionSlice = createSlice({
  name: 'session',
  initialState: null as SessionState,
  reducers: {
    startLesson(_state, action: PayloadAction<string>) {
      const lesson = getLesson(action.payload)
      if (!lesson) return null
      return newSession(
        'lesson',
        lesson.id,
        lesson.exercises.map((e) => exerciseKey(lesson.id, e.id)),
      )
    },
    /** Exercises chosen from several lessons (feature 006); an empty list starts nothing. */
    startPractice(_state, action: PayloadAction<{ kind: 'practice' | 'review'; keys: string[] }>) {
      const { kind, keys } = action.payload
      if (keys.length === 0) return null
      return newSession(kind, null, keys)
    },
    submitAnswer(state, action: PayloadAction<string | string[]>) {
      if (!state || state.status !== 'answering') return
      const key = state.queue[0]
      const exercise = getExercise(key)
      if (!exercise) return
      const correct = isCorrectAnswer(exercise, action.payload)
      if (!correct && !state.missedOnce.includes(key)) {
        state.missedOnce.push(key)
      }
      state.feedback = { correct, correctAnswer: formatAnswer(exercise), given: action.payload }
      state.status = 'feedback'
    },
    continueLesson(state) {
      if (!state || state.status !== 'feedback' || !state.feedback) return
      const head = state.queue.shift()!
      if (!state.feedback.correct) state.queue.push(head) // missed: retry at the end (FR-015)
      state.feedback = null
      state.step += 1
      state.status = state.queue.length === 0 ? 'finished' : 'answering'
    },
    /** Set by continueAndRecord when this session's finish met today's goal (007 FR-009). */
    markGoalMet(state) {
      if (state?.status === 'finished') state.goalMet = true
    },
    quitLesson() {
      return null
    },
  },
})

export const { startLesson, startPractice, submitAnswer, continueLesson, markGoalMet, quitLesson } =
  sessionSlice.actions
export default sessionSlice.reducer

type WithSession = { session: SessionState }

export const selectSession = (state: WithSession) => state.session

export function selectCurrentKey(state: WithSession): string | undefined {
  return state.session?.queue[0]
}

export function selectCurrentExercise(state: WithSession): Exercise | undefined {
  const key = selectCurrentKey(state)
  return key === undefined ? undefined : getExercise(key)
}

export function selectTotal(state: WithSession): number {
  return state.session?.total ?? 0
}

/** done = exercises answered correctly so far */
export function selectPosition(state: WithSession): { done: number; total: number } {
  const total = selectTotal(state)
  return { done: total - (state.session?.queue.length ?? 0), total }
}

export function selectFirstTryCorrect(state: WithSession): number {
  return selectTotal(state) - (state.session?.missedOnce.length ?? 0)
}
