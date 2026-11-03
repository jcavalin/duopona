import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { lessons } from '../../src/content/lessons'
import { testedWords } from '../../src/content/words'
import type { Exercise } from '../../src/content/types'
import { routes } from '../../src/router'
import { makeStore } from '../../src/store'
import { STORAGE_KEY, STREAK_KEY, WORDS_KEY } from '../../src/store/persistence'
import { selectCurrentExercise } from '../../src/store/sessionSlice'

type Store = ReturnType<typeof makeStore>
type User = ReturnType<typeof userEvent.setup>

const [l1, l2] = lessons

/** Fakes only Date, so React and user-event timers keep working. */
function setNow(y: number, m: number, d: number, h = 12, min = 0) {
  vi.setSystemTime(new Date(y, m - 1, d, h, min))
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  setNow(2026, 11, 3)
})

afterEach(() => {
  vi.useRealTimers()
})

function renderApp(path = '/') {
  const store = makeStore()
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const user = userEvent.setup()
  const view = render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  )
  return { store, router, user, unmount: view.unmount }
}

/** A new visit: a fresh store loaded from localStorage. */
function reopen(app: { unmount: () => void }, path = '/') {
  app.unmount()
  return renderApp(path)
}

function completeLessons(...ids: string[]) {
  const completedLessons = Object.fromEntries(
    ids.map((id) => [id, { firstTryCorrect: 1, total: 1, completedAt: '2026-11-01T00:00:00.000Z' }]),
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completedLessons }))
}

function current(store: Store): Exercise {
  return selectCurrentExercise(store.getState())!
}

async function answer(user: User, store: Store, correct: boolean, thenContinue = true) {
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
  if (thenContinue) await user.click(screen.getByRole('button', { name: 'Continue' }))
}

const summaryShown = () =>
  screen.queryByRole('heading', { name: 'Lesson complete!' }) ?? screen.queryByRole('heading', { name: 'Practice complete!' })

async function playToSummary(user: User, store: Store) {
  while (!summaryShown()) await answer(user, store, true)
}

/** From home: open a lesson, start it and play to its summary. */
async function playLesson(app: ReturnType<typeof renderApp>, lessonId: string) {
  await app.router.navigate(`/lesson/${lessonId}`)
  await app.user.click(await screen.findByRole('button', { name: 'Start' }))
  await playToSummary(app.user, app.store)
}

async function backHome(user: User) {
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

const streakLabel = (n: number, met: boolean) => `${n} day streak, ${met ? 'practised today' : 'not practised today'}`
const expectStreak = (n: number, met: boolean) => expect(screen.getByLabelText(streakLabel(n, met))).toBeInTheDocument()

describe('streak counter (007 US1)', () => {
  it('counts consecutive days, keeps yesterday, resets after a missed day', async () => {
    let app = renderApp()
    expectStreak(0, false)

    await playLesson(app, l1.id)
    await backHome(app.user)
    expectStreak(1, true)

    setNow(2026, 11, 4)
    app = reopen(app)
    expectStreak(1, false)

    // A practice session counts like a lesson
    await app.user.click(screen.getByRole('button', { name: 'Practice' }))
    await playToSummary(app.user, app.store)
    await backHome(app.user)
    expectStreak(2, true)

    setNow(2026, 11, 6)
    reopen(app)
    expectStreak(0, false)
    expect(JSON.parse(localStorage.getItem(STREAK_KEY)!)).toMatchObject({ current: 2, best: 2 })
  })

  it('quitting a session counts nothing', async () => {
    const app = renderApp()
    await app.router.navigate(`/lesson/${l1.id}`)
    await app.user.click(await screen.findByRole('button', { name: 'Start' }))
    await answer(app.user, app.store, true)
    await app.user.click(screen.getByRole('button', { name: 'Quit lesson' }))
    expectStreak(0, false)
    expect(localStorage.getItem(STREAK_KEY)).toBeNull()
  })

  it('a session finished after midnight counts for the new day', async () => {
    localStorage.setItem(STREAK_KEY, JSON.stringify({ version: 1, lastDay: '2026-11-02', current: 1, best: 1 }))
    setNow(2026, 11, 2, 23, 59)
    const app = renderApp()
    await app.router.navigate(`/lesson/${l1.id}`)
    await app.user.click(await screen.findByRole('button', { name: 'Start' }))
    while (app.store.getState().session!.queue.length > 1) await answer(app.user, app.store, true)
    await answer(app.user, app.store, true, false)
    setNow(2026, 11, 3, 0, 1)
    await app.user.click(screen.getByRole('button', { name: 'Continue' }))
    await backHome(app.user)
    expectStreak(2, true)
    reopen(app)
    expectStreak(2, true)
  })

  it('streak updates leave lesson progress and word records as the sessions made them (FR-014)', async () => {
    completeLessons(l1.id, l2.id)
    const app = renderApp()
    const progress = localStorage.getItem(STORAGE_KEY)
    await app.user.click(screen.getByRole('button', { name: 'Practice' }))
    await playToSummary(app.user, app.store)
    await backHome(app.user)
    expectStreak(1, true)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(progress)
    // All answers were right first time, so no word records were written
    expect(localStorage.getItem(WORDS_KEY)).toBeNull()
  })
})

describe('daily goal and summary (007 US2)', () => {
  const goalBar = () => screen.getByRole('progressbar', { name: 'Daily goal' })

  it('shows progress, announces the goal once, and resets the next day', async () => {
    let app = renderApp()
    expect(screen.getByText('Daily goal')).toBeInTheDocument()
    expect(screen.getByText('0 / 1 session today')).toBeInTheDocument()
    expect(goalBar()).toHaveAttribute('aria-valuenow', '0')
    expect(screen.queryByText(/Best streak/)).not.toBeInTheDocument()

    await playLesson(app, l1.id)
    expect(screen.getByText('Daily goal met')).toBeInTheDocument()
    expect(screen.getByText('Streak')).toBeInTheDocument()
    expect(screen.getByText('1 day')).toBeInTheDocument()

    await backHome(app.user)
    expect(screen.getByText('1 / 1 session today')).toBeInTheDocument()
    expect(goalBar()).toHaveAttribute('aria-valuenow', '1')
    expect(screen.getByText('Best streak: 1 day')).toBeInTheDocument()

    // A second session the same day: plain summary
    await app.user.click(screen.getByRole('button', { name: 'Practice' }))
    await playToSummary(app.user, app.store)
    expect(screen.getByRole('heading', { name: 'Practice complete!' })).toBeInTheDocument()
    expect(screen.queryByText('Daily goal met')).not.toBeInTheDocument()
    expect(screen.queryByText('Streak')).not.toBeInTheDocument()

    // Practise again on the summary starts a new session that is also not announced
    await app.user.click(screen.getByRole('button', { name: 'Practise again' }))
    await playToSummary(app.user, app.store)
    expect(screen.queryByText('Daily goal met')).not.toBeInTheDocument()
    await backHome(app.user)

    setNow(2026, 11, 4)
    app = reopen(app)
    expect(screen.getByText('0 / 1 session today')).toBeInTheDocument()
    expect(screen.getByText('Best streak: 1 day')).toBeInTheDocument()

    await playLesson(app, l2.id)
    expect(screen.getByText('Daily goal met')).toBeInTheDocument()
    expect(screen.getByText('2 days')).toBeInTheDocument()
  })

  it('a review session that meets the goal announces it', async () => {
    completeLessons(l1.id)
    localStorage.setItem(WORDS_KEY, JSON.stringify({ version: 1, mistakes: { [testedWords(l1.exercises[0])[0]]: 1 } }))
    const app = renderApp()
    await app.user.click(screen.getByRole('button', { name: 'Review weak words' }))
    await playToSummary(app.user, app.store)
    expect(screen.getByText('Daily goal met')).toBeInTheDocument()
    expect(screen.getByText('1 day')).toBeInTheDocument()
  })
})
