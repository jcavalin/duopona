import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { getLesson } from '../../src/content/lessons'
import type { Exercise } from '../../src/content/types'
import { routes } from '../../src/router'
import { makeStore } from '../../src/store'

const lesson = getLesson('basics-1')!
const total = lesson.exercises.length

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
  const prompt = document.querySelector('[class*="prompt"]')!.textContent
  // Prompts are unique within the lesson
  return lesson.exercises.find((e) => e.prompt === prompt)!
}

type User = ReturnType<typeof userEvent.setup>

async function answer(user: User, correct: boolean) {
  const ex = currentExercise()
  if (ex.type === 'multipleChoice') {
    const choice = correct ? ex.answer : ex.options.find((o) => o !== ex.answer)!
    await user.click(within(screen.getByRole('group', { name: 'Options' })).getByRole('button', { name: choice }))
  } else {
    const words = correct ? ex.answer : [...ex.answer].reverse()
    for (const word of words) {
      await user.click(within(screen.getByRole('group', { name: 'Word bank' })).getByRole('button', { name: word }))
    }
  }
  await user.click(screen.getByRole('button', { name: 'Check' }))
}

async function startLesson(user: User) {
  await user.click(screen.getByRole('link', { name: /Basic Words/ }))
}

describe('first lesson flow', () => {
  it('lesson list shows only "Basic Words"', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: 'Duopona' })).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Basic Words/ })).toBeInTheDocument()
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
    expect(screen.getByRole('status')).toHaveTextContent('Wrong — correct answer: good')
  })

  it('word bank tiles move between bank and answer line', async () => {
    const { user } = renderApp()
    await startLesson(user)
    while (currentExercise().type !== 'wordBank') {
      await answer(user, true)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    const bank = () => within(screen.getByRole('group', { name: 'Word bank' }))
    const line = () => within(screen.getByRole('group', { name: 'Your answer' }))

    await user.click(bank().getByRole('button', { name: 'sina' }))
    expect(line().getByRole('button', { name: 'sina' })).toBeInTheDocument()
    expect(bank().queryByRole('button', { name: 'sina' })).not.toBeInTheDocument()
    await user.click(line().getByRole('button', { name: 'sina' }))
    expect(line().queryByRole('button', { name: 'sina' })).not.toBeInTheDocument()

    await user.click(bank().getByRole('button', { name: 'mi' }))
    await user.click(bank().getByRole('button', { name: 'pona' }))
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
