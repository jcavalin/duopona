import { lessons } from '../../src/content/lessons'
import reducer, { completeLesson, emptyProgress, selectIsUnlocked, selectLessonResult } from '../../src/store/progressSlice'

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

describe('selectIsUnlocked', () => {
  const [l1, l2, l3] = lessons
  const done = { firstTryCorrect: 1, total: 1, completedAt: '2026-11-03T10:00:00.000Z' }
  const progressWith = (...ids: string[]) => ({
    progress: { completedLessons: Object.fromEntries(ids.map((id) => [id, done])) },
  })

  it('unlocks only the first lesson for a new learner', () => {
    expect(selectIsUnlocked(l1.id)(progressWith())).toBe(true)
    expect(selectIsUnlocked(l2.id)(progressWith())).toBe(false)
  })

  it('unlocks the next lesson once the previous one is completed', () => {
    const state = progressWith(l1.id)
    expect(selectIsUnlocked(l2.id)(state)).toBe(true)
    expect(selectIsUnlocked(l3.id)(state)).toBe(false)
  })

  it('ignores old progress keys that are not course lessons', () => {
    const state = progressWith('basics-1')
    expect(lessons.filter((l) => selectIsUnlocked(l.id)(state)).map((l) => l.id)).toEqual([l1.id])
  })

  it('returns false for unknown lessons', () => {
    expect(selectIsUnlocked('nope')(progressWith(l1.id))).toBe(false)
  })
})
