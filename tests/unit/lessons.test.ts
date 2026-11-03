import { getLesson, lessons } from '../../src/content/lessons'

describe('lesson content', () => {
  it('has only the "Basic Words" lesson', () => {
    expect(lessons.map((l) => l.title)).toEqual(['Basic Words'])
    expect(getLesson('basics-1')?.title).toBe('Basic Words')
    expect(getLesson('nope')).toBeUndefined()
  })

  for (const lesson of lessons) {
    describe(lesson.title, () => {
      it('has unique exercise ids', () => {
        const ids = lesson.exercises.map((e) => e.id)
        expect(new Set(ids).size).toBe(ids.length)
      })

      it.each(lesson.exercises.map((e) => [e.id, e] as const))('exercise %s is well-formed', (_id, exercise) => {
        if (exercise.type === 'multipleChoice') {
          expect(exercise.options.length).toBeGreaterThanOrEqual(3)
          expect(exercise.options.length).toBeLessThanOrEqual(4)
          expect(new Set(exercise.options).size).toBe(exercise.options.length)
          expect(exercise.options).toContain(exercise.answer)
        } else {
          expect(exercise.answer.length).toBeGreaterThan(0)
          for (const d of exercise.distractors) expect(exercise.answer).not.toContain(d)
        }
      })
    })
  }
})
