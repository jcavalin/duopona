import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { exerciseKey, lessons } from '../../src/content/lessons'
import { testedWords } from '../../src/content/words'
import type { Exercise } from '../../src/content/types'
import { routes } from '../../src/router'
import { makeStore } from '../../src/store'
import { loadWords, STORAGE_KEY, WORDS_KEY } from '../../src/store/persistence'
import { selectCurrentExercise } from '../../src/store/sessionSlice'

type Store = ReturnType<typeof makeStore>
type User = ReturnType<typeof userEvent.setup>

/** Saves lesson progress (contract progress-storage v1) so the next store starts with it. */
function completeLessons(...ids: string[]) {
  const completedLessons = Object.fromEntries(
    ids.map((id) => [id, { firstTryCorrect: 1, total: 1, completedAt: '2026-11-03T00:00:00.000Z' }]),
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completedLessons }))
}

function renderApp(path = '/') {
  const store = makeStore()
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const user = userEvent.setup()
  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  )
  return { store, router, user }
}

/** Prompts are not unique across lessons, so read the current exercise from the store. */
function current(store: Store): Exercise {
  return selectCurrentExercise(store.getState())!
}

async function answer(user: User, store: Store, correct: boolean) {
  const ex = current(store)
  if (ex.type === 'multipleChoice') {
    const choice = correct ? ex.answer : ex.options.find((o) => o !== ex.answer)!
    await user.click(within(screen.getByRole('group', { name: 'Options' })).getByRole('button', { name: choice }))
  } else {
    const words = correct ? ex.answer : [ex.distractors[0]]
    for (const word of words) {
      await user.click(within(screen.getByRole('group', { name: 'Word bank' })).getAllByRole('button', { name: word })[0])
    }
  }
  await user.click(screen.getByRole('button', { name: 'Check' }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

/** Answers until the summary shows; `wrongFirst` misses the first exercise once. */
async function playToEnd(user: User, store: Store, wrongFirst = false) {
  if (wrongFirst) await answer(user, store, false)
  while (!screen.queryByRole('heading', { name: 'Practice complete!' })) {
    await answer(user, store, true)
  }
}

const [l1, l2] = lessons

describe('practice session (006 US1)', () => {
  it('is unavailable with a reason before any lesson is completed', async () => {
    const { user, router } = renderApp()
    const practice = screen.getByRole('button', { name: 'Practice' })
    expect(practice).toHaveAttribute('aria-disabled', 'true')
    expect(practice).toHaveAccessibleDescription('Finish a lesson to unlock practice.')
    await user.click(practice)
    expect(router.state.location.pathname).toBe('/')
  })

  it('redirects /practice/practice home when unavailable, and unknown kinds always', () => {
    const { router } = renderApp('/practice/practice')
    expect(router.state.location.pathname).toBe('/')
    completeLessons(l1.id)
    const other = renderApp('/practice/unknown')
    expect(other.router.state.location.pathname).toBe('/')
  })

  it('plays 10 exercises from completed lessons and leaves lesson progress unchanged (SC-005)', async () => {
    completeLessons(l1.id, l2.id)
    const saved = localStorage.getItem(STORAGE_KEY)
    const { user, store } = renderApp()
    const labelsBefore = within(screen.getByRole('list'))
      .getAllByRole('link')
      .map((el) => el.getAttribute('aria-label'))

    await user.click(screen.getByRole('button', { name: 'Practice' }))
    expect(screen.getByRole('button', { name: 'Quit practice' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Practice progress' })).toHaveAttribute('max', '10')
    expect(screen.getByText('1/10')).toBeInTheDocument()

    const session = store.getState().session!
    expect(session.kind).toBe('practice')
    expect(session.queue).toHaveLength(10)
    for (const key of session.queue) {
      expect(key.startsWith(`${l1.id}/`) || key.startsWith(`${l2.id}/`)).toBe(true)
    }

    await playToEnd(user, store, true)
    expect(screen.getByText('Practice')).toBeInTheDocument()
    expect(screen.getByText('9 / 10')).toBeInTheDocument()
    expect(screen.queryByText('Unlocked')).not.toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBe(saved)

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    const labelsAfter = within(screen.getByRole('list'))
      .getAllByRole('link')
      .map((el) => el.getAttribute('aria-label'))
    expect(labelsAfter).toEqual(labelsBefore)
  })

  it('"Practise again" starts a new session of 10', async () => {
    completeLessons(l1.id)
    const { user, store } = renderApp('/practice/practice')
    await playToEnd(user, store)
    await user.click(screen.getByRole('button', { name: 'Practise again' }))
    expect(screen.getByText('1/10')).toBeInTheDocument()
    expect(store.getState().session?.status).toBe('answering')
  })

  it('quitting discards the session and keeps progress', async () => {
    completeLessons(l1.id)
    const saved = localStorage.getItem(STORAGE_KEY)
    const { user, store, router } = renderApp('/practice/practice')
    await answer(user, store, true)
    await user.click(screen.getByRole('button', { name: 'Quit practice' }))
    expect(router.state.location.pathname).toBe('/')
    expect(store.getState().session).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBe(saved)
  })
})

/** Saves word records (contract words-storage v1) so the next store starts with them. */
function saveMistakes(mistakes: Record<string, number>) {
  localStorage.setItem(WORDS_KEY, JSON.stringify({ version: 1, mistakes }))
}

const mistakes = (store: Store) => store.getState().words.mistakes

async function startFirstLesson(user: User) {
  await user.click(screen.getByRole('button', { name: 'Start' }))
}

describe('word records (006 US2)', () => {
  it('a miss counts once per exercise, even when the retry is answered right', async () => {
    const { user, store } = renderApp(`/lesson/${l1.id}`)
    await startFirstLesson(user)
    const missed = current(store)
    const words = testedWords(missed)
    await answer(user, store, false)
    for (const w of words) expect(mistakes(store)[w]).toBe(1)
    expect(loadWords().mistakes).toEqual(mistakes(store))

    // Play on until the missed exercise comes back, then answer it right
    while (current(store) !== missed) await answer(user, store, true)
    const beforeRetry = { ...mistakes(store) }
    await answer(user, store, true)
    expect(mistakes(store)).toEqual(beforeRetry)
  })

  it('a word missed in this session is not cleared by a later right answer in the same session', async () => {
    const { user, store } = renderApp(`/lesson/${l1.id}`)
    await startFirstLesson(user)
    // Miss the first exercise that tests li; several later ones test li again
    while (!testedWords(current(store)).includes('li')) await answer(user, store, true)
    const missedEx = current(store)
    await answer(user, store, false)
    let laterWithLi = 0
    while (current(store) !== missedEx) {
      if (testedWords(current(store)).includes('li')) laterWithLi++
      await answer(user, store, true)
    }
    expect(laterWithLi).toBeGreaterThan(0)
    for (const w of testedWords(missedEx)) expect(mistakes(store)[w]).toBe(1)
  })

  it('a first-try correct answer removes a mistake from each tested word', async () => {
    const words = testedWords(l1.exercises[0])
    saveMistakes(Object.fromEntries(words.map((w) => [w, 1])))
    const { user, store } = renderApp(`/lesson/${l1.id}`)
    await startFirstLesson(user)
    await answer(user, store, true)
    for (const w of words) expect(mistakes(store)[w]).toBeUndefined()
  })

  it('keeps mistakes after quitting and after a reload', async () => {
    const { user, store } = renderApp(`/lesson/${l1.id}`)
    await startFirstLesson(user)
    const words = testedWords(current(store))
    await answer(user, store, false)
    await user.click(screen.getByRole('button', { name: 'Quit lesson' }))
    for (const w of words) expect(mistakes(store)[w]).toBe(1)

    const reloaded = makeStore()
    expect(reloaded.getState().words.mistakes).toEqual(mistakes(store))
  })

  it('records answers in practice sessions too', async () => {
    completeLessons(l1.id)
    const { user, store } = renderApp('/practice/practice')
    const words = testedWords(current(store))
    await answer(user, store, false)
    for (const w of words) expect(mistakes(store)[w]).toBe(1)
  })
})

describe('review weak words (006 US3)', () => {
  /** A word tested by exactly one exercise of lesson 1, and that exercise */
  const single = (() => {
    for (const ex of l1.exercises) {
      for (const w of testedWords(ex)) {
        if (l1.exercises.filter((e) => testedWords(e).includes(w)).length === 1) return { word: w, ex }
      }
    }
    throw new Error('lesson 1 has no word tested by a single exercise')
  })()

  it('is unavailable with "No weak words yet." when nothing was missed', () => {
    completeLessons(l1.id)
    renderApp()
    expect(screen.getByRole('button', { name: 'Practice' })).not.toHaveAttribute('aria-disabled')
    const review = screen.getByRole('button', { name: 'Review weak words' })
    expect(review).toHaveAttribute('aria-disabled', 'true')
    expect(review).toHaveAccessibleDescription('No weak words yet.')
  })

  it('redirects /practice/review home when there is nothing to review', () => {
    completeLessons(l1.id)
    const { router } = renderApp('/practice/review')
    expect(router.state.location.pathname).toBe('/')
  })

  it('reviews the weak word and stays on the summary when the last one is cleared', async () => {
    completeLessons(l1.id)
    saveMistakes({ [single.word]: 1 })
    const { user, store, router } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Review weak words' }))
    expect(router.state.location.pathname).toBe('/practice/review')
    expect(screen.getByRole('button', { name: 'Quit practice' })).toBeInTheDocument()

    const session = store.getState().session!
    expect(session.kind).toBe('review')
    expect(session.queue).toContain(exerciseKey(l1.id, single.ex.id))
    for (const key of session.queue) expect(key.startsWith(`${l1.id}/`)).toBe(true)

    // Answering everything right first time clears the only weak word mid-session
    while (!screen.queryByRole('heading', { name: 'Practice complete!' })) {
      await answer(user, store, true)
      expect(router.state.location.pathname).toBe('/practice/review')
    }
    expect(mistakes(store)).toEqual({})
    expect(screen.getByText('Weak words')).toBeInTheDocument()

    // Nothing left: "Practise again" goes home, where the button is unavailable again
    await user.click(screen.getByRole('button', { name: 'Practise again' }))
    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('button', { name: 'Review weak words' })).toHaveAttribute('aria-disabled', 'true')
  })
})

describe('mistake explanations in practice (008 US2)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('a missed grammar exercise names its own lesson in a practice session', async () => {
    const pi = lessons.find((l) => l.id === 'pi')!
    completeLessons(pi.id)
    // Fixed shuffle so the session order is the same every run (008 analysis U1)
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const { user, store } = renderApp('/practice/practice')
    const grammarKeys = pi.exercises
      .filter((e) => e.type === 'wordBank' && e.practisesGrammar)
      .map((e) => exerciseKey(pi.id, e.id))
    expect(store.getState().session!.queue.some((k) => grammarKeys.includes(k))).toBe(true)

    while (!grammarKeys.includes(store.getState().session!.queue[0])) {
      await answer(user, store, true)
    }
    const ex = current(store)
    if (ex.type !== 'wordBank') throw new Error('expected a word bank')
    await user.click(within(screen.getByRole('group', { name: 'Word bank' })).getAllByRole('button', { name: ex.distractors[0] })[0])
    await user.click(screen.getByRole('button', { name: 'Check' }))

    // 010: the explanation opens on "Why?"
    const toggle = screen.getByRole('button', { name: 'Why?' })
    await user.click(toggle)
    const card = document.getElementById(toggle.getAttribute('aria-controls')!)!
    expect(card).toHaveTextContent(pi.grammar.title)
    expect(card).toHaveTextContent(`From ${pi.chapter} · ${pi.title}`)
    expect(card).toHaveTextContent(ex.grammarNote!)
  })
})

describe('mascot in practice (feature 012)', () => {
  const mascot = () => document.querySelector('img[data-expression]')

  it('reacts to answers and celebrates on the practice summary', async () => {
    completeLessons(l1.id)
    const { user, store } = renderApp('/practice/practice')
    expect(mascot()).toHaveAttribute('data-expression', 'idle')
    const ex = current(store)
    const pick = (correct: boolean) =>
      ex.type === 'multipleChoice'
        ? [correct ? ex.answer : ex.options.find((o) => o !== ex.answer)!]
        : correct
          ? ex.answer
          : [ex.distractors[0]]
    const group = ex.type === 'multipleChoice' ? 'Options' : 'Word bank'
    for (const word of pick(true)) {
      await user.click(within(screen.getByRole('group', { name: group })).getAllByRole('button', { name: word })[0])
    }
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(mascot()).toHaveAttribute('data-expression', 'happy')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(mascot()).toHaveAttribute('data-expression', 'idle')

    await playToEnd(user, store)
    expect(mascot()).toHaveAttribute('data-expression', 'celebrate')
  })
})
