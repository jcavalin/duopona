import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { lessons } from '../../src/content/lessons'
import type { Exercise, Lesson } from '../../src/content/types'
import { routes } from '../../src/router'
import { makeStore } from '../../src/store'
import { getMeaning } from '../../src/content/vocabulary'
import { STORAGE_KEY } from '../../src/store/persistence'

const lesson = lessons[0]
const total = lesson.exercises.length
/** The lesson being played, so helpers can find the current exercise */
let playing: Lesson = lesson

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

function currentExercise(): Exercise {
  const prompt = screen.getByRole('heading', { level: 2 }).textContent
  // Prompts are unique within the lesson
  return playing.exercises.find((e) => e.prompt === prompt)!
}

type User = ReturnType<typeof userEvent.setup>

async function answer(user: User, correct: boolean) {
  const ex = currentExercise()
  if (ex.type === 'multipleChoice') {
    const choice = correct ? ex.answer : ex.options.find((o) => o !== ex.answer)!
    await user.click(within(screen.getByRole('group', { name: 'Options' })).getByRole('button', { name: choice }))
  } else {
    // A distractor alone is never the answer; [0] picks the first of repeated tiles
    const words = correct ? ex.answer : [ex.distractors[0]]
    for (const word of words) {
      await user.click(within(screen.getByRole('group', { name: 'Word bank' })).getAllByRole('button', { name: word })[0])
    }
  }
  await user.click(screen.getByRole('button', { name: 'Check' }))
}

/** The list card (link, or disabled link when locked) whose title is exactly `title` */
function card(title = lesson.title): HTMLElement {
  return screen.getByText(title, { selector: 'span' }).closest<HTMLElement>('a, [role="link"]')!
}

async function openLesson(user: User, l: Lesson = lesson) {
  playing = l
  await user.click(card(l.title))
}

/** Opens the lesson and presses Start on its introduction */
async function startLesson(user: User, l: Lesson = lesson) {
  await openLesson(user, l)
  await user.click(screen.getByRole('button', { name: 'Start' }))
}

describe('first lesson flow', () => {
  it('lesson list shows the first course lesson', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
    expect(card()).toHaveAttribute('href')
  })

  it('starts the lesson at the first exercise with Check disabled', async () => {
    const { user } = renderApp()
    await startLesson(user)
    expect(screen.getByText(`1 of ${total}`)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled()
  })

  it('shows "Correct!" for a right answer and the correct answer for a wrong one', async () => {
    const { user } = renderApp()
    await startLesson(user)
    await answer(user, true)
    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
    expect(screen.queryByRole('button', { name: 'Check' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText(`2 of ${total}`)).toBeInTheDocument()

    await answer(user, false)
    const second = lesson.exercises[1]
    const secondAnswer = second.type === 'multipleChoice' ? second.answer : second.answer.join(' ')
    expect(screen.getByRole('status')).toHaveTextContent(`Wrong — correct answer: ${secondAnswer}`)
  })

  it('word bank tiles move between bank and answer line', async () => {
    const { user } = renderApp()
    await startLesson(user)
    while (currentExercise().type !== 'wordBank') {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    const ex = currentExercise()
    if (ex.type !== 'wordBank') throw new Error('expected a word bank')
    const bank = () => within(screen.getByRole('group', { name: 'Word bank' }))
    const line = () => within(screen.getByRole('group', { name: 'Your answer' }))
    const distractor = ex.distractors[0]

    await user.click(bank().getByRole('button', { name: distractor }))
    expect(line().getByRole('button', { name: distractor })).toBeInTheDocument()
    expect(bank().queryByRole('button', { name: distractor })).not.toBeInTheDocument()
    await user.click(line().getByRole('button', { name: distractor }))
    expect(line().queryByRole('button', { name: distractor })).not.toBeInTheDocument()

    for (const word of ex.answer) {
      await user.click(bank().getAllByRole('button', { name: word })[0])
    }
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
  })

  it('repeats missed exercises before the summary and counts first-try answers', async () => {
    const { user } = renderApp()
    await startLesson(user)
    const missedPrompt = currentExercise().prompt
    await answer(user, false)
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    for (let i = 1; i < total; i++) {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    // The missed exercise comes back
    expect(currentExercise().prompt).toBe(missedPrompt)
    expect(screen.queryByRole('heading', { name: 'Lesson complete!' })).not.toBeInTheDocument()
    await answer(user, true)
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByRole('heading', { name: 'Lesson complete!' })).toBeInTheDocument()
    expect(screen.getByText(`You got ${total - 1} of ${total} right on the first try.`)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    expect(screen.getByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
  })

  it('Quit returns to the list and discards the session', async () => {
    const { user, store } = renderApp()
    await startLesson(user)
    await answer(user, true)
    await user.click(screen.getByRole('button', { name: 'Quit' }))
    expect(screen.getByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
    expect(store.getState().session).toBeNull()
    await startLesson(user)
    expect(screen.getByText(`1 of ${total}`)).toBeInTheDocument()
  })

  it('browser Back from a lesson discards the session', async () => {
    const { user, router, store } = renderApp()
    await startLesson(user)
    await answer(user, true)
    await router.navigate(-1)
    expect(await screen.findByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
    expect(store.getState().session).toBeNull()
  })

  it('unknown lesson ids and unknown paths redirect to the list', async () => {
    renderApp('/lesson/nope')
    expect(await screen.findByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
  })

  it('unknown paths redirect to the list', async () => {
    renderApp('/whatever')
    expect(await screen.findByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
  })
})

async function completeLesson(user: User, l: Lesson = lesson) {
  await startLesson(user, l)
  await answer(user, false)
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  while (!screen.queryByRole('heading', { name: 'Lesson complete!' })) {
    await answer(user, true)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
  }
}

describe('saved progress (US2)', () => {
  it('a new learner has no completed lessons', () => {
    renderApp()
    expect(card()).not.toHaveTextContent('Completed')
  })

  it('completing the lesson marks it completed with its score, and survives a reload', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    expect(card()).toHaveTextContent(`Completed · ${total - 1}/${total}`)

    // Simulate a reload: throw the app away and start again with a fresh store
    cleanup()
    renderApp()
    expect(card()).toHaveTextContent(`Completed · ${total - 1}/${total}`)
  })

  it('re-completing shows the latest score', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    await startLesson(user)
    while (!screen.queryByRole('heading', { name: 'Lesson complete!' })) {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    expect(card()).toHaveTextContent(`Completed · ${total}/${total}`)
  })

  it('quitting mid-lesson does not mark it completed', async () => {
    const { user } = renderApp()
    await startLesson(user)
    await answer(user, true)
    await user.click(screen.getByRole('button', { name: 'Quit' }))
    expect(card()).not.toHaveTextContent('Completed')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('progress across several lessons survives a reload (US2 AC1)', async () => {
    const [l1, l2, l3, l4] = lessons
    const { user } = renderApp()
    await completeLesson(user, l1)
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    await completeLesson(user, l2)
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))

    cleanup()
    renderApp()
    for (const l of [l1, l2]) {
      const n = l.exercises.length
      expect(card(l.title)).toHaveTextContent(`Completed · ${n - 1}/${n}`)
    }
    expect(card(l3.title)).toHaveAttribute('href')
    expect(card(l3.title)).not.toHaveTextContent('Completed')
    expect(card(l4.title)).toHaveAttribute('aria-disabled', 'true')
  })

  it('old progress from the single-lesson version loads without errors (US2 AC2)', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, completedLessons: { 'basics-1': { firstTryCorrect: 1, total: 1, completedAt: '2026-11-01T00:00:00Z' } } }),
    )
    renderApp()
    expect(screen.getAllByRole('listitem')).toHaveLength(17)
    expect(screen.queryByText(/Completed/)).not.toBeInTheDocument()
    const startable = within(screen.getByRole('list'))
      .getAllByRole('link')
      .filter((el) => el.getAttribute('aria-disabled') !== 'true')
    expect(startable).toHaveLength(1)
  })

  it('garbage saved data loads as empty progress (FR-012)', () => {
    localStorage.setItem(STORAGE_KEY, 'garbage')
    renderApp()
    expect(card()).not.toHaveTextContent('Completed')
  })
})

describe('course in book order (US1)', () => {
  const isLocked = (el: HTMLElement) => el.getAttribute('aria-disabled') === 'true'

  it('lists all 17 lessons in order; only the first is startable', () => {
    renderApp()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(17)
    lessons.forEach((l, i) => {
      expect(items[i]).toHaveTextContent(l.title)
      expect(items[i]).toHaveTextContent(`Book: ${l.chapter}`)
      expect(items[i]).toHaveTextContent(`Lesson ${i + 1}`)
    })
    const startable = within(screen.getByRole('list')).getAllByRole('link').filter((el) => !isLocked(el))
    expect(startable).toHaveLength(1)
    expect(startable[0]).toBe(card(lessons[0].title))
    for (const l of lessons.slice(1)) {
      const c = card(l.title)
      expect(isLocked(c)).toBe(true)
      expect(c).not.toHaveAttribute('href')
      expect(c).toHaveTextContent('Locked')
      expect(c).toHaveTextContent('Complete the previous lesson to unlock')
    }
  })

  it('clicking a locked lesson does nothing', async () => {
    const { user, router } = renderApp()
    await user.click(card(lessons[1].title))
    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
  })

  it('opening a locked lesson address returns to the list', async () => {
    const { store } = renderApp('/lesson/pi')
    expect(await screen.findByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
    expect(store.getState().session).toBeNull()
  })

  it('completing a lesson unlocks the next one', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    const next = card(lessons[1].title)
    expect(isLocked(next)).toBe(false)
    expect(next).toHaveAttribute('href', `/lesson/${lessons[1].id}`)
    expect(isLocked(card(lessons[2].title))).toBe(true)
  })

  it('a completed lesson can be replayed and its score is updated', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    expect(card()).toHaveTextContent(`Completed · ${total - 1}/${total}`)
    await startLesson(user)
    while (!screen.queryByRole('heading', { name: 'Lesson complete!' })) {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    expect(card()).toHaveTextContent(`Completed · ${total}/${total}`)
  })

  it('credits the book and tokipona.org', () => {
    renderApp()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Toki Pona: The Language of Good by Sonja Lang')
    const link = screen.getByRole('link', { name: 'tokipona.org' })
    expect(link).toHaveAttribute('href', 'https://tokipona.org')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })
})

describe('lesson introduction (US3)', () => {
  it('shows the new words with meanings and the grammar point before any exercise', async () => {
    const { user, store } = renderApp()
    await openLesson(user)
    expect(screen.getByRole('heading', { level: 1, name: lesson.title })).toBeInTheDocument()
    expect(screen.getByText(`Book: ${lesson.chapter}`)).toBeInTheDocument()
    for (const word of lesson.newWords) {
      const term = screen.getByText(word, { selector: 'dt' })
      expect(term.nextElementSibling).toHaveTextContent(getMeaning(word)!)
    }
    expect(screen.getByRole('heading', { name: lesson.grammar.title })).toBeInTheDocument()
    for (const paragraph of lesson.grammar.explanation) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
    expect(screen.queryByRole('button', { name: 'Check' })).not.toBeInTheDocument()
    expect(store.getState().session).toBeNull()
  })

  it('Start shows the first exercise', async () => {
    const { user } = renderApp()
    await openLesson(user)
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText(`1 of ${total}`)).toBeInTheDocument()
  })

  it('Back returns to the list without starting or saving anything', async () => {
    const { user, store } = renderApp()
    await openLesson(user)
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
    expect(store.getState().session).toBeNull()
    expect(card()).not.toHaveTextContent('Completed')
  })

  it('replaying a completed lesson shows the introduction again', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    await openLesson(user)
    expect(screen.getByRole('heading', { name: lesson.grammar.title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })
})
