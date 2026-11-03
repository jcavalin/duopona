import reducer, { completeLesson, emptyProgress, selectLessonResult } from '../../src/store/progressSlice'

describe('progressSlice', () => {
  const first = { lessonId: 'basics-1', firstTryCorrect: 8, total: 11, completedAt: '2026-11-01T10:00:00.000Z' }

  it('starts empty', () => {
    expect(reducer(undefined, { type: 'init' })).toEqual(emptyProgress())
  })

  it('completing a lesson records its result', () => {
    const state = reducer(undefined, completeLesson(first))
    expect(selectLessonResult('basics-1')({ progress: state })).toEqual({
      firstTryCorrect: 8,
      total: 11,
      completedAt: '2026-11-01T10:00:00.000Z',
    })
  })

  it('re-completing overwrites with the latest attempt', () => {
    let state = reducer(undefined, completeLesson(first))
    state = reducer(state, completeLesson({ ...first, firstTryCorrect: 11, completedAt: '2026-11-02T10:00:00.000Z' }))
    expect(state.completedLessons['basics-1']).toEqual({ firstTryCorrect: 11, total: 11, completedAt: '2026-11-02T10:00:00.000Z' })
  })
})
