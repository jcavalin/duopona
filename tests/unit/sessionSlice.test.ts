import { getLesson } from '../../src/content/lessons'
import reducer, {
  continueLesson,
  quitLesson,
  selectCurrentExercise,
  selectFirstTryCorrect,
  selectPosition,
  startLesson,
  submitAnswer,
  type LessonSession,
} from '../../src/store/sessionSlice'

const lesson = getLesson('basics-1')!
const ids = lesson.exercises.map((e) => e.id)

type S = LessonSession | null
const run = (state: S, ...actions: Parameters<typeof reducer>[1][]) => actions.reduce(reducer, state)
const view = (session: S) => ({ session })

function correctAnswerFor(session: S) {
  const ex = selectCurrentExercise(view(session))!
  return ex.answer
}

function answerAllCorrectly(state: S): S {
  while (state && state.status !== 'finished') {
    state = run(state, submitAnswer(correctAnswerFor(state)), continueLesson())
  }
  return state
}

describe('sessionSlice', () => {
  it('starts with all exercises queued in order', () => {
    const s = run(null, startLesson('basics-1'))!
    expect(s.queue).toEqual(ids)
    expect(s.status).toBe('answering')
    expect(selectPosition(view(s))).toEqual({ done: 0, total: ids.length })
  })

  it('ignores unknown lessons', () => {
    expect(run(null, startLesson('nope'))).toBeNull()
  })

  it('correct multiple-choice answer shows correct feedback and continue removes the exercise', () => {
    let s = run(null, startLesson('basics-1'), submitAnswer('person'))!
    expect(s.status).toBe('feedback')
    expect(s.feedback).toEqual({ correct: true, correctAnswer: 'person' })
    s = run(s, continueLesson())!
    expect(s.queue).toEqual(ids.slice(1))
    expect(s.feedback).toBeNull()
    expect(selectPosition(view(s)).done).toBe(1)
  })

  it('wrong answer records the miss once and moves the exercise to the end on continue', () => {
    let s = run(null, startLesson('basics-1'), submitAnswer('water'))!
    expect(s.feedback).toEqual({ correct: false, correctAnswer: 'person' })
    expect(s.missedOnce).toEqual(['jan'])
    // Feedback still refers to the current exercise
    expect(selectCurrentExercise(view(s))?.id).toBe('jan')
    s = run(s, continueLesson())!
    expect(s.queue).toEqual([...ids.slice(1), 'jan'])
  })

  it('word bank: order matters, case does not; correctAnswer is joined', () => {
    let s: S = run(null, startLesson('basics-1'))
    while (selectCurrentExercise(view(s))!.id !== 'mi-pona') {
      s = run(s, submitAnswer(correctAnswerFor(s)), continueLesson())
    }
    const wrongOrder = run(s, submitAnswer(['pona', 'mi']))!
    expect(wrongOrder.feedback).toEqual({ correct: false, correctAnswer: 'mi pona' })
    const caseInsensitive = run(s, submitAnswer(['Mi', 'PONA']))!
    expect(caseInsensitive.feedback?.correct).toBe(true)
  })

  it('finishes only when every exercise has been answered correctly (FR-015)', () => {
    let s: S = run(null, startLesson('basics-1'), submitAnswer('water'), continueLesson())
    // Answer the remaining first pass correctly
    for (let i = 1; i < ids.length; i++) {
      s = run(s, submitAnswer(correctAnswerFor(s)), continueLesson())
    }
    expect(s!.status).toBe('answering')
    expect(s!.queue).toEqual(['jan'])
    // Missing it again keeps it in the queue
    s = run(s, submitAnswer('food'), continueLesson())
    expect(s!.status).toBe('answering')
    expect(s!.missedOnce).toEqual(['jan'])
    s = run(s, submitAnswer('person'), continueLesson())
    expect(s!.status).toBe('finished')
    expect(selectFirstTryCorrect(view(s))).toBe(ids.length - 1)
  })

  it('perfect run scores everything on the first try', () => {
    const s = answerAllCorrectly(run(null, startLesson('basics-1')))
    expect(selectFirstTryCorrect(view(s))).toBe(ids.length)
  })

  it('increments step on each continue so retries get fresh UI', () => {
    const s = run(null, startLesson('basics-1'), submitAnswer('water'), continueLesson())!
    expect(s.step).toBe(1)
  })

  it('ignores submit during feedback and continue while answering', () => {
    const a = run(null, startLesson('basics-1'))
    expect(run(a, continueLesson())).toEqual(a)
    const f = run(a, submitAnswer('water'))
    expect(run(f, submitAnswer('person'))).toEqual(f)
  })

  it('quitLesson resets to null', () => {
    expect(run(null, startLesson('basics-1'), quitLesson())).toBeNull()
  })
})
