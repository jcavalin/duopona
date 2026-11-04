import { exerciseKey, getExercise, getLesson, lessons } from '../../src/content/lessons'
import type { Exercise, MultipleChoiceExercise, WordBankExercise } from '../../src/content/types'
import reducer, {
  continueLesson,
  markGoalMet,
  quitLesson,
  selectCurrentExercise,
  selectFirstTryCorrect,
  selectPosition,
  startLesson,
  startPractice,
  submitAnswer,
  type LessonSession,
} from '../../src/store/sessionSlice'

const lesson = lessons[0]
const ids = lesson.exercises.map((e) => exerciseKey(lesson.id, e.id))
const first = lesson.exercises[0] as MultipleChoiceExercise
const firstKey = exerciseKey(lesson.id, first.id)
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
    expect(s.kind).toBe('lesson')
    expect(s.lessonId).toBe(lesson.id)
    expect(s.total).toBe(ids.length)
    expect(s.status).toBe('answering')
    expect(selectPosition(view(s))).toEqual({ done: 0, total: ids.length })
  })

  it('ignores unknown lessons', () => {
    expect(run(null, startLesson('nope'))).toBeNull()
  })

  it('correct multiple-choice answer shows correct feedback and continue removes the exercise', () => {
    let s = run(null, startLesson(lesson.id), submitAnswer(first.answer))!
    expect(s.status).toBe('feedback')
    expect(s.feedback).toEqual({ correct: true, correctAnswer: first.answer, given: first.answer })
    s = run(s, continueLesson())!
    expect(s.queue).toEqual(ids.slice(1))
    expect(s.feedback).toBeNull()
    expect(selectPosition(view(s)).done).toBe(1)
  })

  it('wrong answer records the miss once and moves the exercise to the end on continue', () => {
    let s = run(null, startLesson(lesson.id), submitAnswer(firstWrong))!
    expect(s.feedback).toEqual({ correct: false, correctAnswer: first.answer, given: firstWrong })
    expect(s.missedOnce).toEqual([firstKey])
    // Feedback still refers to the current exercise
    expect(selectCurrentExercise(view(s))?.id).toBe(first.id)
    s = run(s, continueLesson())!
    expect(s.queue).toEqual([...ids.slice(1), firstKey])
  })

  it('word bank: order matters, case does not; correctAnswer is joined', () => {
    let s: S = run(null, startLesson(lesson.id))
    while (selectCurrentExercise(view(s))!.id !== wordBank.id) {
      s = run(s, submitAnswer(correctAnswerFor(s)), continueLesson())
    }
    const wrongOrder = run(s, submitAnswer([...wordBank.answer].reverse()))!
    expect(wrongOrder.feedback).toEqual({
      correct: false,
      correctAnswer: wordBank.answer.join(' '),
      given: [...wordBank.answer].reverse(),
    })
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
    expect(s!.queue).toEqual([firstKey])
    // Missing it again keeps it in the queue
    s = run(s, submitAnswer(firstWrong2), continueLesson())
    expect(s!.status).toBe('answering')
    expect(s!.missedOnce).toEqual([firstKey])
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

describe('sessionSlice: practice sessions (006)', () => {
  // The same exercise id exists in two lessons; keys tell them apart.
  const keys = ['verbs/toki', 'greetings-and-feelings/toki', exerciseKey(lesson.id, first.id)]

  it('starts nothing for an empty key list', () => {
    expect(run(null, startPractice({ kind: 'practice', keys: [] }))).toBeNull()
  })

  it('runs exercises from several lessons with the lesson retry rule', () => {
    let s = run(null, startPractice({ kind: 'review', keys }))!
    expect(s).toMatchObject({ kind: 'review', lessonId: null, queue: keys, total: 3, status: 'answering' })
    expect(selectPosition(view(s))).toEqual({ done: 0, total: 3 })
    expect(selectCurrentExercise(view(s))).toBe(getLesson('verbs')!.exercises.find((e) => e.id === 'toki'))

    s = run(s, submitAnswer(wrongAnswerFor(selectCurrentExercise(view(s))!)), continueLesson())!
    expect(s.missedOnce).toEqual(['verbs/toki'])
    expect(s.queue).toEqual([keys[1], keys[2], keys[0]])
    expect(selectCurrentExercise(view(s))).toBe(getLesson('greetings-and-feelings')!.exercises.find((e) => e.id === 'toki'))

    s = answerAllCorrectly(s)!
    expect(s.status).toBe('finished')
    expect(selectFirstTryCorrect(view(s))).toBe(2)
  })
})

describe('sessionSlice: goalMet flag (007)', () => {
  it('is false at the start of lesson and practice sessions', () => {
    expect(run(null, startLesson(lesson.id))!.goalMet).toBe(false)
    expect(run(null, startPractice({ kind: 'practice', keys: [firstKey] }))!.goalMet).toBe(false)
  })

  it('markGoalMet sets it only on a finished session', () => {
    const started = run(null, startLesson(lesson.id))
    expect(run(started, markGoalMet())!.goalMet).toBe(false)
    const finished = answerAllCorrectly(started)!
    expect(finished.status).toBe('finished')
    expect(run(finished, markGoalMet())!.goalMet).toBe(true)
    expect(run(null, markGoalMet())).toBeNull()
  })
})

describe('getExercise', () => {
  it('resolves keys and rejects anything else', () => {
    expect(getExercise(exerciseKey(lesson.id, first.id))).toBe(first)
    expect(getExercise('nope/toki')).toBeUndefined()
    expect(getExercise(`${lesson.id}/nope`)).toBeUndefined()
    expect(getExercise('toki')).toBeUndefined()
  })
})
