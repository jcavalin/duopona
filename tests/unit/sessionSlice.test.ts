import { lessons } from '../../src/content/lessons'
import type { Exercise, MultipleChoiceExercise, WordBankExercise } from '../../src/content/types'
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

const lesson = lessons[0]
const ids = lesson.exercises.map((e) => e.id)
const first = lesson.exercises[0] as MultipleChoiceExercise
const firstWrong = first.options.find((o) => o !== first.answer)!
const firstWrong2 = first.options.filter((o) => o !== first.answer)[1]
const wordBank = lesson.exercises.find((e): e is WordBankExercise => e.type === 'wordBank')!

/** A wrong answer for any exercise. */
function wrongAnswerFor(ex: Exercise): string | string[] {
  return ex.type === 'multipleChoice' ? ex.options.find((o) => o !== ex.answer)! : [ex.distractors[0]]
}

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
    const s = run(null, startLesson(lesson.id))!
    expect(s.queue).toEqual(ids)
    expect(s.status).toBe('answering')
    expect(selectPosition(view(s))).toEqual({ done: 0, total: ids.length })
  })

  it('ignores unknown lessons', () => {
    expect(run(null, startLesson('nope'))).toBeNull()
  })

  it('correct multiple-choice answer shows correct feedback and continue removes the exercise', () => {
    let s = run(null, startLesson(lesson.id), submitAnswer(first.answer))!
    expect(s.status).toBe('feedback')
    expect(s.feedback).toEqual({ correct: true, correctAnswer: first.answer })
    s = run(s, continueLesson())!
    expect(s.queue).toEqual(ids.slice(1))
    expect(s.feedback).toBeNull()
    expect(selectPosition(view(s)).done).toBe(1)
  })

  it('wrong answer records the miss once and moves the exercise to the end on continue', () => {
    let s = run(null, startLesson(lesson.id), submitAnswer(firstWrong))!
    expect(s.feedback).toEqual({ correct: false, correctAnswer: first.answer })
    expect(s.missedOnce).toEqual([first.id])
    // Feedback still refers to the current exercise
    expect(selectCurrentExercise(view(s))?.id).toBe(first.id)
    s = run(s, continueLesson())!
    expect(s.queue).toEqual([...ids.slice(1), first.id])
  })

  it('word bank: order matters, case does not; correctAnswer is joined', () => {
    let s: S = run(null, startLesson(lesson.id))
    while (selectCurrentExercise(view(s))!.id !== wordBank.id) {
      s = run(s, submitAnswer(correctAnswerFor(s)), continueLesson())
    }
    const wrongOrder = run(s, submitAnswer([...wordBank.answer].reverse()))!
    expect(wrongOrder.feedback).toEqual({ correct: false, correctAnswer: wordBank.answer.join(' ') })
    const caseInsensitive = run(s, submitAnswer(wordBank.answer.map((w) => w.toUpperCase())))!
    expect(caseInsensitive.feedback?.correct).toBe(true)
  })

  it('finishes only when every exercise has been answered correctly (FR-015)', () => {
    let s: S = run(null, startLesson(lesson.id), submitAnswer(firstWrong), continueLesson())
    // Answer the remaining first pass correctly
    for (let i = 1; i < ids.length; i++) {
      s = run(s, submitAnswer(correctAnswerFor(s)), continueLesson())
    }
    expect(s!.status).toBe('answering')
    expect(s!.queue).toEqual([first.id])
    // Missing it again keeps it in the queue
    s = run(s, submitAnswer(firstWrong2), continueLesson())
    expect(s!.status).toBe('answering')
    expect(s!.missedOnce).toEqual([first.id])
    s = run(s, submitAnswer(first.answer), continueLesson())
    expect(s!.status).toBe('finished')
    expect(selectFirstTryCorrect(view(s))).toBe(ids.length - 1)
  })

  it('perfect run scores everything on the first try', () => {
    const s = answerAllCorrectly(run(null, startLesson(lesson.id)))
    expect(selectFirstTryCorrect(view(s))).toBe(ids.length)
  })

  it('increments step on each continue so retries get fresh UI', () => {
    const s = run(null, startLesson(lesson.id), submitAnswer(wrongAnswerFor(first)), continueLesson())!
    expect(s.step).toBe(1)
  })

  it('ignores submit during feedback and continue while answering', () => {
    const a = run(null, startLesson(lesson.id))
    expect(run(a, continueLesson())).toEqual(a)
    const f = run(a, submitAnswer(firstWrong))
    expect(run(f, submitAnswer(first.answer))).toEqual(f)
  })

  it('quitLesson resets to null', () => {
    expect(run(null, startLesson(lesson.id), quitLesson())).toBeNull()
  })
})
