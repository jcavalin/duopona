import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface LessonResult {
  firstTryCorrect: number
  total: number
  /** ISO 8601 timestamp of the latest completion */
  completedAt: string
}

export interface LearnerProgress {
  /** Key present ⇔ lesson completed */
  completedLessons: Record<string, LessonResult>
}

export const emptyProgress = (): LearnerProgress => ({ completedLessons: {} })

const progressSlice = createSlice({
  name: 'progress',
  initialState: emptyProgress(),
  reducers: {
    /** Re-completing a lesson overwrites its previous result. */
    completeLesson(state, action: PayloadAction<LessonResult & { lessonId: string }>) {
      const { lessonId, ...result } = action.payload
      state.completedLessons[lessonId] = result
    },
  },
})

export const { completeLesson } = progressSlice.actions
export default progressSlice.reducer

export const selectLessonResult = (lessonId: string) => (state: { progress: LearnerProgress }) =>
  state.progress.completedLessons[lessonId]
