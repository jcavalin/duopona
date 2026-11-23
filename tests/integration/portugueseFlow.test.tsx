import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { courses } from '../../src/content/lessons'
import { detectLanguage, deviceLanguageTags } from '../../src/i18n/language'
import type { Exercise } from '../../src/content/types'
import { getMeaning } from '../../src/content/vocabulary'
import { routes } from '../../src/router'
import { makeStore } from '../../src/store'
import { SETTINGS_KEY, STORAGE_KEY } from '../../src/store/persistence'
import { selectCurrentExercise } from '../../src/store/sessionSlice'

// Feature 014 US1: the whole course in Brazilian Portuguese.
type Store = ReturnType<typeof makeStore>
type User = ReturnType<typeof userEvent.setup>

const [l1] = courses['pt-BR']

/** English interface text that must never show while Portuguese is active (SC-001) */
const ENGLISH_ONLY = [
  'Learn Toki Pona',
  'Daily goal',
  'Practice',
  'Review weak words',
  'New words',
  'Check',
  'Continue',
  'Not quite',
  'Correct answer:',
  'Why?',
  'Leave this lesson?',
  'Keep learning',
  'Lesson complete!',
  'Choose the meaning',
  'Write this in',
  'Quit lesson',
]

function expectNoEnglish() {
  const text = document.body.textContent ?? ''
  const labels = [...document.querySelectorAll('[aria-label]')].map((el) => el.getAttribute('aria-label') ?? '')
  for (const english of ENGLISH_ONLY) {
    expect(text, english).not.toContain(english)
    expect(labels.filter((l) => l.includes(english)), english).toEqual([])
  }
}

function renderApp(store: Store = makeStore(), path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const user = userEvent.setup()
  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  )
  return { store, router, user }
}

function choosePortuguese() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 1, language: 'pt-BR' }))
}

const current = (store: Store): Exercise => selectCurrentExercise(store.getState())!

async function answer(user: User, store: Store, correct: boolean) {
  const ex = current(store)
  if (ex.type === 'multipleChoice') {
    const choice = correct ? ex.answer : ex.options.find((o) => o !== ex.answer)!
    await user.click(within(screen.getByRole('group', { name: 'Opções' })).getByRole('button', { name: choice }))
  } else {
    for (const word of correct ? ex.answer : [ex.distractors[0]]) {
      await user.click(within(screen.getByRole('group', { name: 'Banco de palavras' })).getAllByRole('button', { name: word })[0])
    }
  }
  await user.click(screen.getByRole('button', { name: 'Verificar' }))
}

afterEach(() => {
  document.documentElement.lang = 'en'
})

describe('studying in Brazilian Portuguese (014 US1)', () => {
  it('shows the home screen in Portuguese, with the document language set', () => {
    choosePortuguese()
    renderApp()
    expect(screen.getByText('Aprenda Toki Pona')).toBeInTheDocument()
    expect(screen.getByText('Meta diária')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Praticar' })).toHaveAccessibleDescription('Conclua uma lição para liberar a prática.')
    expect(screen.getByRole('link', { name: 'Palavras e frases, começar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Substantivos e adjetivos, bloqueada' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('pt-BR')
    expectNoEnglish()
  })

  it('plays a whole lesson in Portuguese: intro, exercises, why, leave dialog and summary', async () => {
    choosePortuguese()
    const { store, user } = renderApp()
    await user.click(screen.getByRole('link', { name: 'Palavras e frases, começar' }))

    // Introduction
    expect(screen.getByRole('heading', { name: 'Palavras e frases' })).toBeInTheDocument()
    expect(screen.getByText(`Livro: Lição 2 · ${l1.exercises.length} exercícios`)).toBeInTheDocument()
    expect(screen.getByText(getMeaning('jan', 'pt-BR')!)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: l1.grammar.title })).toBeInTheDocument()
    expectNoEnglish()
    await user.click(screen.getByRole('button', { name: 'Começar' }))

    // A wrong answer, with its explanation
    expect(screen.getByRole('heading', { name: 'Escolha o significado' })).toBeInTheDocument()
    expect(store.getState().session?.language).toBe('pt-BR')
    await answer(user, store, false)
    expect(screen.getByRole('status')).toHaveTextContent('Não é bem isso. Resposta correta: pessoa / alguém')
    await user.click(screen.getByRole('button', { name: 'Por quê?' }))
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toContain('jan: pessoa / alguém')
    expectNoEnglish()

    // The leave dialog, then back to the lesson
    await user.click(screen.getByRole('button', { name: 'Sair da lição' }))
    const dialog = screen.getByRole('dialog', { name: 'Sair desta lição?' })
    expect(dialog).toHaveAccessibleDescription('Seu progresso nesta lição será perdido.')
    expectNoEnglish()
    await user.click(within(dialog).getByRole('button', { name: 'Continuar aprendendo' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    // Every exercise is answerable from the Portuguese data
    while (!screen.queryByRole('heading', { name: 'Lição concluída!' })) {
      await answer(user, store, true)
      expect(screen.getByRole('status')).toHaveTextContent('pona! Correto.')
      await user.click(screen.getByRole('button', { name: 'Continuar' }))
    }
    expect(screen.getByText('Substantivos e adjetivos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refazer lição' })).toBeInTheDocument()
    expectNoEnglish()
    expect(Object.keys(store.getState().progress.completedLessons)).toEqual([l1.id])
  })

  it('uses Portuguese for practice sessions and their leave dialog', async () => {
    choosePortuguese()
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, completedLessons: { [l1.id]: { firstTryCorrect: 1, total: 1, completedAt: '2026-11-23T00:00:00.000Z' } } }),
    )
    const { store, user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Praticar' }))
    expect(store.getState().session).toMatchObject({ kind: 'practice', language: 'pt-BR' })
    expect(screen.getByRole('progressbar', { name: 'Progresso da prática' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sair da prática' }))
    expect(screen.getByRole('dialog', { name: 'Sair desta prática?' })).toBeInTheDocument()
    expectNoEnglish()
  })
})

describe('starting in the device language (014 US2)', () => {
  afterEach(() => vi.restoreAllMocks())

  const appLike = () => makeStore(detectLanguage(deviceLanguageTags())) // as src/main.tsx does

  it('a Portuguese device with no saved choice opens in Portuguese', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['pt-BR', 'en'])
    renderApp(appLike())
    expect(screen.getByText('Aprenda Toki Pona')).toBeInTheDocument()
    expect(localStorage.getItem(SETTINGS_KEY)).toBeNull()
  })

  it('a German device opens in English', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['de-DE'])
    renderApp(appLike())
    expect(screen.getByText('Learn Toki Pona')).toBeInTheDocument()
  })

  it('a saved English choice wins over a Portuguese device', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['pt-BR'])
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 1, language: 'en' }))
    renderApp(appLike())
    expect(screen.getByText('Learn Toki Pona')).toBeInTheDocument()
  })
})
