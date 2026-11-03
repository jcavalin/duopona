import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getLesson } from '../content/lessons'
import type { Exercise } from '../content/types'

export interface Feedback {
  correct: boolean
  correctAnswer: string
}

export interface LessonSession {
  lessonId: string
  /** Exercise ids still to answer correctly; head = current exercise */
  queue: string[]
  /** Exercise ids answered wrong at least once */
  missedOnce: string[]
  feedback: Feedback | null
  status: 'answering' | 'feedback' | 'finished'
  /** Increments on every new exercise shown, so retries get fresh UI state */
  step: number
}

type SessionState = LessonSession | null

function findExercise(lessonId: string, exerciseId: string): Exercise | undefined {
  return getLesson(lessonId)?.exercises.find((e) => e.id === exerciseId)
}

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

const sessionSlice = createSlice({
  name: 'session',
  initialState: null as SessionState,
  reducers: {
    startLesson(_state, action: PayloadAction<string>) {
      const lesson = getLesson(action.payload)
      if (!lesson) return null
      return {
        lessonId: lesson.id,
        queue: lesson.exercises.map((e) => e.id),
        missedOnce: [],
        feedback: null,
        status: 'answering',
        step: 0,
      }
    },
    submitAnswer(state, action: PayloadAction<string | string[]>) {
      if (!state || state.status !== 'answering') return
      const exercise = findExercise(state.lessonId, state.queue[0])
      if (!exercise) return
      const correct = isCorrectAnswer(exercise, action.payload)
      if (!correct && !state.missedOnce.includes(exercise.id)) {
        state.missedOnce.push(exercise.id)
      }
      state.feedback = { correct, correctAnswer: formatAnswer(exercise) }
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
    quitLesson() {
      return null
    },
  },
})

export const { startLesson, submitAnswer, continueLesson, quitLesson } = sessionSlice.actions
export default sessionSlice.reducer

type WithSession = { session: SessionState }

export const selectSession = (state: WithSession) => state.session

export function selectCurrentExercise(state: WithSession): Exercise | undefined {
  const s = state.session
  if (!s || s.queue.length === 0) return undefined
  return findExercise(s.lessonId, s.queue[0])
}

export function selectTotal(state: WithSession): number {
  const s = state.session
  return s ? (getLesson(s.lessonId)?.exercises.length ?? 0) : 0
}

/** done = exercises answered correctly so far */
export function selectPosition(state: WithSession): { done: number; total: number } {
  const total = selectTotal(state)
  return { done: total - (state.session?.queue.length ?? 0), total }
}

export function selectFirstTryCorrect(state: WithSession): number {
  return selectTotal(state) - (state.session?.missedOnce.length ?? 0)
}
