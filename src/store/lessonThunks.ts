import type { AppDispatch, RootState } from './index'
import { completeLesson } from './progressSlice'
import { continueLesson, selectFirstTryCorrect, selectTotal } from './sessionSlice'

/** Continue to the next exercise; when the lesson finishes, record it as completed (FR-009). */
export function continueAndRecord() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(continueLesson())
    const state = getState()
    if (state.session?.status === 'finished') {
      dispatch(
        completeLesson({
          lessonId: state.session.lessonId,
          firstTryCorrect: selectFirstTryCorrect(state),
          total: selectTotal(state),
          completedAt: new Date().toISOString(),
        }),
      )
    }
  }
}
