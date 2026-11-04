import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { lessons, sourceLabel } from '../../src/content/lessons'
import type { Exercise, Lesson } from '../../src/content/types'
import { routes } from '../../src/router'
import { makeStore } from '../../src/store'
import { getMeaning } from '../../src/content/vocabulary'
import { STORAGE_KEY } from '../../src/store/persistence'
import { centre, dragTo, stubWordBankLayout } from './wordBankLayout'

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

/** The path node (link, or disabled link when locked) of the lesson titled exactly `title` (contract S1) */
function card(title = lesson.title): HTMLElement {
  const nodes = within(screen.getByRole('list')).getAllByRole('link')
  return nodes.find((el) => el.getAttribute('aria-label')?.startsWith(`${title}, `))!
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
    expect(screen.getByRole('heading', { name: 'duopona' })).toBeInTheDocument()
    expect(card()).toHaveAttribute('href')
  })

  it('starts the lesson at the first exercise with Check disabled', async () => {
    const { user } = renderApp()
    await startLesson(user)
    expect(screen.getByText(`1/${total}`)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled()
  })

  it('shows "pona! Correct." for a right answer and the correct answer for a wrong one', async () => {
    const { user } = renderApp()
    await startLesson(user)
    await answer(user, true)
    expect(screen.getByRole('status')).toHaveTextContent('pona! Correct.')
    expect(screen.queryByRole('button', { name: 'Check' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText(`2/${total}`)).toBeInTheDocument()

    await answer(user, false)
    const second = lesson.exercises[1]
    const secondAnswer = second.type === 'multipleChoice' ? second.answer : second.answer.join(' ')
    expect(screen.getByRole('status')).toHaveTextContent(`Not quite. Correct answer: ${secondAnswer}`)
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
    expect(screen.getByRole('status')).toHaveTextContent('pona! Correct.')
  })

  it('a sentence placed out of order and fixed by dragging is graded right (009 FR-007)', async () => {
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
    // Last word first: wrong order
    const order = [ex.answer[ex.answer.length - 1], ...ex.answer.slice(0, -1)]
    for (const word of order) await user.click(bank().getAllByRole('button', { name: word })[0])
    const layout = stubWordBankLayout()
    const tiles = line().getAllByRole('button')
    const end = centre(tiles[tiles.length - 1])
    dragTo(tiles[0], end.x + 30, end.y)
    layout.mockRestore()
    expect(line().getAllByRole('button').map((b) => b.textContent)).toEqual(ex.answer)
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByRole('status')).toHaveTextContent('pona! Correct.')
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
    expect(screen.getByText(`${total - 1} / ${total}`)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { name: 'duopona' })).toBeInTheDocument()
  })

  it('Quit returns to the list and discards the session', async () => {
    const { user, store } = renderApp()
    await startLesson(user)
    await answer(user, true)
    await user.click(screen.getByRole('button', { name: 'Quit lesson' }))
    expect(screen.getByRole('heading', { name: 'duopona' })).toBeInTheDocument()
    expect(store.getState().session).toBeNull()
    await startLesson(user)
    expect(screen.getByText(`1/${total}`)).toBeInTheDocument()
  })

  it('browser Back from a lesson discards the session', async () => {
    const { user, router, store } = renderApp()
    await startLesson(user)
    await answer(user, true)
    await router.navigate(-1)
    expect(await screen.findByRole('heading', { name: 'duopona' })).toBeInTheDocument()
    expect(store.getState().session).toBeNull()
  })

  it('unknown lesson ids and unknown paths redirect to the list', async () => {
    renderApp('/lesson/nope')
    expect(await screen.findByRole('heading', { name: 'duopona' })).toBeInTheDocument()
  })

  it('unknown paths redirect to the list', async () => {
    renderApp('/whatever')
    expect(await screen.findByRole('heading', { name: 'duopona' })).toBeInTheDocument()
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
    expect(card()).not.toHaveAccessibleName(/completed/)
  })

  it('completing the lesson marks it completed with its score, and survives a reload', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(card()).toHaveAccessibleName(`${lesson.title}, completed, ${total - 1} of ${total}`)

    // Simulate a reload: throw the app away and start again with a fresh store
    cleanup()
    renderApp()
    expect(card()).toHaveAccessibleName(`${lesson.title}, completed, ${total - 1} of ${total}`)
  })

  it('re-completing shows the latest score', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await startLesson(user)
    while (!screen.queryByRole('heading', { name: 'Lesson complete!' })) {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(card()).toHaveAccessibleName(`${lesson.title}, completed, ${total} of ${total}`)
  })

  it('quitting mid-lesson does not mark it completed', async () => {
    const { user } = renderApp()
    await startLesson(user)
    await answer(user, true)
    await user.click(screen.getByRole('button', { name: 'Quit lesson' }))
    expect(card()).not.toHaveAccessibleName(/completed/)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('progress across several lessons survives a reload (US2 AC1)', async () => {
    const [l1, l2, l3, l4] = lessons
    const { user } = renderApp()
    await completeLesson(user, l1)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await completeLesson(user, l2)
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    cleanup()
    renderApp()
    for (const l of [l1, l2]) {
      const n = l.exercises.length
      expect(card(l.title)).toHaveAccessibleName(`${l.title}, completed, ${n - 1} of ${n}`)
    }
    expect(card(l3.title)).toHaveAttribute('href')
    expect(card(l3.title)).toHaveAccessibleName(`${l3.title}, start`)
    expect(card(l4.title)).toHaveAttribute('aria-disabled', 'true')
  })

  it('old progress from the single-lesson version loads without errors (US2 AC2)', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, completedLessons: { 'basics-1': { firstTryCorrect: 1, total: 1, completedAt: '2026-11-01T00:00:00Z' } } }),
    )
    renderApp()
    expect(screen.getAllByRole('listitem')).toHaveLength(17)
    expect(screen.queryByRole('link', { name: /completed/ })).not.toBeInTheDocument()
    const startable = within(screen.getByRole('list'))
      .getAllByRole('link')
      .filter((el) => el.getAttribute('aria-disabled') !== 'true')
    expect(startable).toHaveLength(1)
  })

  it('garbage saved data loads as empty progress (FR-012)', () => {
    localStorage.setItem(STORAGE_KEY, 'garbage')
    renderApp()
    expect(card()).not.toHaveAccessibleName(/completed/)
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
    })
    const startable = within(screen.getByRole('list')).getAllByRole('link').filter((el) => !isLocked(el))
    expect(startable).toHaveLength(1)
    expect(startable[0]).toBe(card(lessons[0].title))
    for (const l of lessons.slice(1)) {
      const c = card(l.title)
      expect(isLocked(c)).toBe(true)
      expect(c).not.toHaveAttribute('href')
      expect(c).toHaveAccessibleName(`${l.title}, locked`)
    }
  })

  it('clicking a locked lesson does nothing', async () => {
    const { user, router } = renderApp()
    await user.click(card(lessons[1].title))
    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { name: 'duopona' })).toBeInTheDocument()
  })

  it('opening a locked lesson address returns to the list', async () => {
    const { store } = renderApp('/lesson/pi')
    expect(await screen.findByRole('heading', { name: 'duopona' })).toBeInTheDocument()
    expect(store.getState().session).toBeNull()
  })

  it('completing a lesson unlocks the next one', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    const next = card(lessons[1].title)
    expect(isLocked(next)).toBe(false)
    expect(next).toHaveAttribute('href', `/lesson/${lessons[1].id}`)
    expect(isLocked(card(lessons[2].title))).toBe(true)
  })

  it('a completed lesson can be replayed and its score is updated', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(card()).toHaveAccessibleName(`${lesson.title}, completed, ${total - 1} of ${total}`)
    await startLesson(user)
    while (!screen.queryByRole('heading', { name: 'Lesson complete!' })) {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(card()).toHaveAccessibleName(`${lesson.title}, completed, ${total} of ${total}`)
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
    expect(screen.getByText(`${sourceLabel(lesson)} · ${total} exercises`)).toBeInTheDocument()
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
    expect(screen.getByText(`1/${total}`)).toBeInTheDocument()
  })

  it('Back returns to the list without starting or saving anything', async () => {
    const { user, store } = renderApp()
    await openLesson(user)
    await user.click(screen.getByRole('button', { name: 'Back to lessons' }))
    expect(screen.getByRole('heading', { name: 'duopona' })).toBeInTheDocument()
    expect(store.getState().session).toBeNull()
    expect(card()).not.toHaveAccessibleName(/completed/)
  })

  it('replaying a completed lesson shows the introduction again', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await openLesson(user)
    expect(screen.getByRole('heading', { name: lesson.grammar.title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })
})

describe('lesson screens (004 US1)', () => {
  /** Answers correctly until the exercise with `id` is showing */
  async function advanceTo(user: User, id: string) {
    while (currentExercise().id !== id) {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
  }

  const optionButtons = () => within(screen.getByRole('group', { name: 'Options' })).getAllByRole('button')

  it('names the multiple-choice instruction after the direction', async () => {
    const { user } = renderApp()
    await startLesson(user)
    expect(currentExercise().direction).toBe('tp-en')
    expect(screen.getByRole('heading', { level: 1, name: 'Choose the meaning' })).toBeInTheDocument()
    await answer(user, true)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(currentExercise().direction).toBe('en-tp')
    expect(screen.getByRole('heading', { level: 1, name: 'Choose the Toki Pona' })).toBeInTheDocument()
  })

  it('number keys select the matching option and enable Check, but never submit', async () => {
    const { user } = renderApp()
    await startLesson(user)
    expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled()
    await user.keyboard('2')
    expect(optionButtons()[1]).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Check' })).toBeEnabled()
    await user.keyboard('1')
    expect(optionButtons()[0]).toHaveAttribute('aria-pressed', 'true')
    expect(optionButtons()[1]).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('number keys above the option count do nothing', async () => {
    const { user } = renderApp()
    await startLesson(user)
    await user.keyboard('9')
    for (const option of optionButtons()) expect(option).toHaveAttribute('aria-pressed', 'false')
  })

  it('number keys do nothing while feedback is shown', async () => {
    const { user } = renderApp()
    await startLesson(user)
    await answer(user, true)
    const pressedBefore = optionButtons().map((o) => o.getAttribute('aria-pressed'))
    await user.keyboard('1234')
    expect(optionButtons().map((o) => o.getAttribute('aria-pressed'))).toEqual(pressedBefore)
  })

  it('marks the chosen option wrong or correct while feedback is shown', async () => {
    const { user } = renderApp()
    await startLesson(user)
    await answer(user, false)
    const chosen = optionButtons().find((o) => o.getAttribute('aria-pressed') === 'true')!
    expect(chosen).toHaveAttribute('data-result', 'wrong')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await answer(user, true)
    const right = optionButtons().find((o) => o.getAttribute('aria-pressed') === 'true')!
    expect(right).toHaveAttribute('data-result', 'correct')
  })

  it('moves focus to Continue after a right and a wrong answer', async () => {
    const { user } = renderApp()
    await startLesson(user)
    await answer(user, true)
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await answer(user, false)
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus()
  })

  it('shows the Grammar tag only on word-bank exercises that practise the grammar point', async () => {
    const { user } = renderApp()
    await startLesson(user)
    expect(screen.queryByText('Grammar')).not.toBeInTheDocument()
    const withGrammar = lesson.exercises.find((e) => e.type === 'wordBank' && e.practisesGrammar)!
    await advanceTo(user, withGrammar.id)
    expect(screen.getByText('Grammar')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /^Write this in / })).toBeInTheDocument()
    const index = lesson.exercises.indexOf(withGrammar)
    const without = lesson.exercises.slice(index + 1).find((e) => e.type === 'wordBank' && !e.practisesGrammar)!
    await advanceTo(user, without.id)
    expect(screen.queryByText('Grammar')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: without.direction === 'tp-en' ? 'Write this in English' : 'Write this in Toki Pona' })).toBeInTheDocument()
  })
})

describe('lesson path (004 US2)', () => {
  const result = (l: Lesson) => ({ firstTryCorrect: l.exercises.length - 1, total: l.exercises.length, completedAt: '2026-11-03T00:00:00Z' })
  const save = (done: Lesson[], extra: Record<string, unknown> = {}) =>
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, completedLessons: { ...Object.fromEntries(done.map((l) => [l.id, result(l)])), ...extra } }),
    )

  it('a new learner sees 0 of 17 done, lesson 1 to start and every other lesson locked', () => {
    renderApp()
    expect(screen.getByLabelText('0 of 17 lessons done')).toHaveTextContent('0 / 17')
    expect(screen.getByText('Course · 0 of 17 done')).toBeInTheDocument()
    expect(card(lessons[0].title)).toHaveAccessibleName(`${lessons[0].title}, start`)
    for (const l of lessons.slice(1)) expect(card(l.title)).toHaveAccessibleName(`${l.title}, locked`)
  })

  it('after lesson 1 the counter, banner and node states update', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('1 of 17 lessons done')).toBeInTheDocument()
    expect(screen.getByText('Course · 1 of 17 done')).toBeInTheDocument()
    expect(card()).toHaveAccessibleName(`${lesson.title}, completed, ${total - 1} of ${total}`)
    expect(card(lessons[1].title)).toHaveAccessibleName(`${lessons[1].title}, start`)
  })

  it('with every lesson done there is no start node and every node opens its lesson', () => {
    save(lessons)
    renderApp()
    expect(screen.getByLabelText('17 of 17 lessons done')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /, start$/ })).not.toBeInTheDocument()
    for (const l of lessons) expect(card(l.title)).toHaveAttribute('href', `/lesson/${l.id}`)
  })

  it('saved results of unknown lessons do not raise the count', () => {
    save([lessons[0]], { 'removed-lesson': result(lessons[0]) })
    renderApp()
    expect(screen.getByLabelText('1 of 17 lessons done')).toBeInTheDocument()
  })

  it('scrolls the current lesson into view on open', () => {
    const scrollIntoView = vi.fn()
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = scrollIntoView
    try {
      save(lessons.slice(0, 6))
      renderApp()
      expect(scrollIntoView).toHaveBeenCalledTimes(1)
      expect(scrollIntoView.mock.contexts[0]).toBe(card(lessons[6].title))
    } finally {
      Element.prototype.scrollIntoView = original
    }
  })
})

describe('lesson complete (004 US3)', () => {
  /** Plays the open lesson to its summary, answering everything right */
  async function finish(user: User) {
    while (!screen.queryByRole('heading', { name: 'Lesson complete!' })) {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
  }

  it('shows the lesson, the first-try score and the unlocked next lesson, with Continue focused', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    expect(screen.getByRole('heading', { name: 'Lesson complete!' })).toBeInTheDocument()
    expect(screen.getByText(lesson.title)).toBeInTheDocument()
    expect(screen.getByText('Correct')).toBeInTheDocument()
    expect(screen.getByText(`${total - 1} / ${total}`)).toBeInTheDocument()
    expect(screen.getByText('Unlocked')).toBeInTheDocument()
    expect(screen.getByText(lessons[1].title)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus()
  })

  it('Continue returns to the path with the lesson completed', async () => {
    const { user } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { name: 'duopona' })).toBeInTheDocument()
    expect(card()).toHaveAccessibleName(`${lesson.title}, completed, ${total - 1} of ${total}`)
  })

  it('Replay lesson shows the introduction, and replaying updates the score', async () => {
    const { user, store } = renderApp()
    await completeLesson(user)
    await user.click(screen.getByRole('button', { name: 'Replay lesson' }))
    expect(screen.getByRole('heading', { level: 1, name: lesson.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'New words' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText(`1/${total}`)).toBeInTheDocument()
    await finish(user)
    expect(screen.getByText(`${total} / ${total}`)).toBeInTheDocument()
    expect(store.getState().progress.completedLessons[lesson.id].firstTryCorrect).toBe(total)
  })

  it('the last lesson has no Unlocked card', async () => {
    const done = Object.fromEntries(
      lessons.slice(0, -1).map((l) => [l.id, { firstTryCorrect: 1, total: l.exercises.length, completedAt: '2026-11-03T00:00:00Z' }]),
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completedLessons: done }))
    const last = lessons[lessons.length - 1]
    const { user } = renderApp()
    await startLesson(user, last)
    await finish(user)
    expect(screen.getByText(last.title)).toBeInTheDocument()
    expect(screen.getByText('Correct')).toBeInTheDocument()
    expect(screen.queryByText('Unlocked')).not.toBeInTheDocument()
  })
})

describe('mistake explanations (feature 008)', () => {
  const youAndI = lessons.find((l) => l.id === 'you-and-i')!

  /** Marks every lesson before `target` completed so it can be started */
  function unlock(target: Lesson) {
    const before = lessons.slice(0, lessons.indexOf(target))
    const done = Object.fromEntries(
      before.map((l) => [l.id, { firstTryCorrect: 1, total: l.exercises.length, completedAt: '2026-11-04T00:00:00Z' }]),
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completedLessons: done }))
  }

  /** Answers right until the exercise with `id` is current */
  async function playUntil(user: User, id: string) {
    while (currentExercise().id !== id) {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
  }

  /** Opens the collapsed explanation (010) and returns its card */
  async function openExplanation(user: User): Promise<HTMLElement> {
    const toggle = screen.getByRole('button', { name: 'Why?' })
    await user.click(toggle)
    return document.getElementById(toggle.getAttribute('aria-controls')!)!
  }

  it('a wrong pick shows the answer word and the pick with their meanings; a right answer shows none', async () => {
    unlock(youAndI)
    const { user } = renderApp()
    await startLesson(user, youAndI)

    // First exercise answered right: no explanation
    await answer(user, true)
    const right = screen.getByRole('status')
    expect(right).toHaveTextContent('pona! Correct.')
    expect(within(right).queryByRole('list')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    // "group / community": the helper's wrong pick is the first other option, kili
    await playUntil(user, 'kulupu')
    await answer(user, false)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Not quite. Correct answer: kulupu')
    // 010: the explanation is outside the announcement and opens on "Why?"
    expect(status).not.toHaveTextContent('group / community')
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus()
    const card = await openExplanation(user)
    expect(within(card).getByRole('listitem')).toHaveTextContent('kulupu: group / community')
    expect(card).toHaveTextContent('kili means fruit / vegetable')

    // The missed exercise comes back at the end, collapsed again, with the same explanation
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await playUntil(user, 'kulupu')
    await answer(user, false)
    expect(screen.queryByRole('button', { name: 'Hide' })).not.toBeInTheDocument()
    expect(await openExplanation(user)).toHaveTextContent('kulupu: group / communitykili means fruit / vegetable')
  })

  it('a missed grammar exercise names the grammar point, its lesson and the note (US2)', async () => {
    unlock(youAndI)
    const { user } = renderApp()
    await startLesson(user, youAndI)
    await playUntil(user, 'mi-wawa')
    await answer(user, false)
    const exercise = youAndI.exercises.find((e) => e.id === 'mi-wawa')!
    expect(screen.getByRole('status')).toHaveTextContent('Correct answer: mi wawa')
    const card = await openExplanation(user)
    expect(card).toHaveTextContent('mi and sina need no li')
    expect(card).toHaveTextContent('From Lesson 4 · You and I')
    expect(card).toHaveTextContent(exercise.type === 'wordBank' ? exercise.grammarNote! : '')
  })

  it('a wrong sentence lists its Toki Pona words in order', async () => {
    unlock(youAndI)
    const { user } = renderApp()
    await startLesson(user, youAndI)
    await playUntil(user, 'kulupu-sina-li-wawa')
    await answer(user, false)
    const items = within(await openExplanation(user)).getAllByRole('listitem').map((li) => li.textContent)
    expect(items).toEqual([
      `kulupu: ${getMeaning('kulupu')}`,
      `sina: ${getMeaning('sina')}`,
      `li: ${getMeaning('li')}`,
      `wawa: ${getMeaning('wawa')}`,
    ])
  })
})

describe('collapsible explanation (feature 010)', () => {
  // Second lesson on the path, chapter "Lesson 3"; its "good water" exercise is the one in mockups 04a/04b
  const nouns = lessons.find((l) => l.id === 'nouns-and-adjectives')!

  function unlockNouns() {
    const before = lessons.slice(0, lessons.indexOf(nouns))
    const done = Object.fromEntries(
      before.map((l) => [l.id, { firstTryCorrect: 1, total: l.exercises.length, completedAt: '2026-11-04T00:00:00Z' }]),
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completedLessons: done }))
  }

  async function playUntil(user: User, id: string) {
    while (currentExercise().id !== id) {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
  }

  /** Starts the lesson and answers "good water" wrong with "pona telo" */
  async function missGoodWater() {
    unlockNouns()
    const app = renderApp()
    await startLesson(app.user, nouns)
    await playUntil(app.user, 'telo-pona')
    await answer(app.user, false)
    return app
  }

  const card = (toggle: HTMLElement) => document.getElementById(toggle.getAttribute('aria-controls')!)!

  it('a wrong answer opens with the explanation hidden behind "Why?" and focus on Continue (C1)', async () => {
    await missGoodWater()
    const toggle = screen.getByRole('button', { name: 'Why?' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(card(toggle)).not.toBeVisible()
    expect(screen.getByText(/^telo$/)).not.toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('Not quite. Correct answer: telo pona')
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus()
  })

  it('"Why?" reveals the explanation and becomes "Hide"; "Hide" collapses it again (C2)', async () => {
    const { user } = await missGoodWater()
    const toggle = screen.getByRole('button', { name: 'Why?' })
    await user.click(toggle)
    expect(toggle).toHaveAccessibleName('Hide')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const explanation = card(toggle)
    expect(explanation).toBeVisible()
    const items = within(explanation).getAllByRole('listitem').map((li) => li.textContent)
    expect(items).toEqual([`telo: ${getMeaning('telo')}`, `pona: ${getMeaning('pona')}`])
    // "pona telo" is not a single course word: no "means" line; multiple choice has no grammar note
    expect(explanation).not.toHaveTextContent('means')
    expect(explanation).not.toHaveTextContent('From ')
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    expect(screen.getByRole('status')).not.toHaveTextContent('water')

    await user.click(toggle)
    expect(toggle).toHaveAccessibleName('Why?')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(explanation).not.toBeVisible()
  })

  it('the next mistake starts collapsed again (FR-004)', async () => {
    const { user } = await missGoodWater()
    await user.click(screen.getByRole('button', { name: 'Why?' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await answer(user, false)
    const toggle = screen.getByRole('button', { name: 'Why?' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(card(toggle)).not.toBeVisible()
  })

  it('a right answer shows no toggle (FR-005)', async () => {
    unlockNouns()
    const { user } = renderApp()
    await startLesson(user, nouns)
    await answer(user, true)
    expect(screen.getByRole('status')).toHaveTextContent('pona! Correct.')
    expect(screen.queryByRole('button', { name: 'Why?' })).not.toBeInTheDocument()
  })

  it('works from the keyboard and Continue still continues (FR-006, FR-007)', async () => {
    const { user, store } = await missGoodWater()
    const step = store.getState().session!.step
    await user.tab({ shift: true })
    const toggle = screen.getByRole('button', { name: 'Why?' })
    expect(toggle).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(store.getState().session!.status).toBe('feedback')
    await user.keyboard(' ')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.tab()
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(store.getState().session!.step).toBe(step + 1)
  })

  it('opening the explanation changes no state or saved data (FR-008)', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const snapshot = async (open: boolean) => {
      const { user, store } = await missGoodWater()
      if (open) {
        await user.click(screen.getByRole('button', { name: 'Why?' }))
        await user.click(screen.getByRole('button', { name: 'Hide' }))
        await user.click(screen.getByRole('button', { name: 'Why?' }))
      }
      await user.click(screen.getByRole('button', { name: 'Continue' }))
      const { progress, words, session } = store.getState()
      const saved = { ...localStorage }
      cleanup()
      localStorage.clear()
      return { progress, words, session, saved }
    }
    const closed = await snapshot(false)
    const opened = await snapshot(true)
    expect(opened).toEqual(closed)
  })
})
