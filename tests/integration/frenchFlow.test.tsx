import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { courses } from '../../src/content/lessons'
import type { Exercise } from '../../src/content/types'
import { getMeaning } from '../../src/content/vocabulary'
import { detectLanguage, deviceLanguageTags } from '../../src/i18n/language'
import { routes } from '../../src/router'
import { makeStore } from '../../src/store'
import { SETTINGS_KEY, STORAGE_KEY } from '../../src/store/persistence'
import { selectCurrentExercise } from '../../src/store/sessionSlice'

// Feature 015 US1/US2: the whole course in French.
type Store = ReturnType<typeof makeStore>
type User = ReturnType<typeof userEvent.setup>

const [l1] = courses.fr

/**
 * Interface text of the other languages that must never show while French is active (SC-001).
 * Single words are compared with whole element texts, so French "Continuer" does not match
 * English "Continue"; longer phrases are searched anywhere (015 analysis I1).
 */
const FOREIGN = [
  // English
  'Learn Toki Pona', 'Daily goal', 'Practice', 'Review weak words', 'New words', 'Check', 'Continue',
  'Not quite', 'Correct answer:', 'Why?', 'Leave this lesson?', 'Keep learning', 'Lesson complete!',
  'Choose the meaning', 'Write this in', 'Quit lesson', 'Settings',
  // Brazilian Portuguese
  'Aprenda Toki Pona', 'Meta diária', 'Praticar', 'Verificar', 'Continuar', 'Não é bem isso', 'Por quê?',
  'Sair desta lição?', 'Lição concluída!', 'Escolha o significado', 'Configurações',
]

function expectNoForeignText() {
  const body = document.body.textContent ?? ''
  const elementTexts = new Set([...document.body.querySelectorAll('*')].map((el) => el.textContent?.trim() ?? ''))
  const labels = [...document.querySelectorAll('[aria-label]')].map((el) => el.getAttribute('aria-label') ?? '')
  for (const foreign of FOREIGN) {
    if (/\s/.test(foreign)) expect(body, foreign).not.toContain(foreign)
    else expect(elementTexts.has(foreign), foreign).toBe(false)
    expect(labels.filter((l) => l === foreign || (/\s/.test(foreign) && l.includes(foreign))), foreign).toEqual([])
  }
}

/** An exact name that may contain U+202F, which accessible names and text matchers turn into a space */
const nb = (text: string) => new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\u202f/g, '\\s')}$`)

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

const chooseFrench = () => localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 1, language: 'fr' }))

const current = (store: Store): Exercise => selectCurrentExercise(store.getState())!

async function answer(user: User, store: Store, correct: boolean) {
  const ex = current(store)
  if (ex.type === 'multipleChoice') {
    const choice = correct ? ex.answer : ex.options.find((o) => o !== ex.answer)!
    await user.click(within(screen.getByRole('group', { name: 'Choix' })).getByRole('button', { name: nb(choice) }))
  } else {
    for (const word of correct ? ex.answer : [ex.distractors[0]]) {
      await user.click(within(screen.getByRole('group', { name: 'Banque de mots' })).getAllByRole('button', { name: nb(word) })[0])
    }
  }
  await user.click(screen.getByRole('button', { name: 'Vérifier' }))
}

afterEach(() => {
  document.documentElement.lang = 'en'
  vi.restoreAllMocks()
})

describe('studying in French (015 US1)', () => {
  it('shows the home screen in French, with the document language set', () => {
    chooseFrench()
    renderApp()
    expect(screen.getByText('Apprends le toki pona')).toBeInTheDocument()
    expect(screen.getByText('Objectif du jour')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'S’entraîner' })).toHaveAccessibleDescription('Termine une leçon pour débloquer l’entraînement.')
    expect(screen.getByRole('link', { name: 'Mots et phrases, commencer' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Noms et adjectifs, verrouillée' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Paramètres' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('fr')
    expectNoForeignText()
  })

  it('plays a whole lesson in French: intro, exercises, why, leave dialog and summary', async () => {
    chooseFrench()
    const { store, user } = renderApp()
    await user.click(screen.getByRole('link', { name: 'Mots et phrases, commencer' }))

    // Introduction
    expect(screen.getByRole('heading', { name: 'Mots et phrases' })).toBeInTheDocument()
    expect(screen.getByText(nb(`Livre\u202f: Leçon 2 · ${l1.exercises.length} exercices`))).toBeInTheDocument()
    expect(screen.getByText(getMeaning('jan', 'fr')!)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: nb(l1.grammar.title) })).toBeInTheDocument()
    expectNoForeignText()
    await user.click(screen.getByRole('button', { name: 'Commencer' }))

    // A wrong answer, with its explanation
    expect(screen.getByRole('heading', { name: 'Choisis le sens' })).toBeInTheDocument()
    expect(store.getState().session?.language).toBe('fr')
    await answer(user, store, false)
    expect(screen.getByRole('status').textContent).toContain('Pas tout à fait')
    expect(screen.getByRole('status').textContent).toContain('Bonne réponse\u202f: personne / quelqu’un')
    await user.click(screen.getByRole('button', { name: nb('Pourquoi\u202f?') }))
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toContain('jan\u202f: personne / quelqu’un')
    expectNoForeignText()

    // The leave dialog, then back to the lesson
    await user.click(screen.getByRole('button', { name: 'Quitter la leçon' }))
    const dialog = screen.getByRole('dialog', { name: nb('Quitter cette leçon\u202f?') })
    expect(dialog).toHaveAccessibleDescription('Ta progression dans cette leçon sera perdue.')
    expectNoForeignText()
    await user.click(within(dialog).getByRole('button', { name: 'Continuer à apprendre' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continuer' }))

    // Every exercise is answerable from the French data
    while (!screen.queryByRole('heading', { name: nb('Leçon terminée\u202f!') })) {
      await answer(user, store, true)
      expect(screen.getByRole('status')).toHaveTextContent('pona! Correct.')
      await user.click(screen.getByRole('button', { name: 'Continuer' }))
    }
    expect(screen.getByText('Noms et adjectifs')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refaire la leçon' })).toBeInTheDocument()
    expectNoForeignText()
    expect(Object.keys(store.getState().progress.completedLessons)).toEqual([l1.id])
  })

  it('uses French for practice sessions and their leave dialog', async () => {
    chooseFrench()
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, completedLessons: { [l1.id]: { firstTryCorrect: 1, total: 1, completedAt: '2026-11-23T00:00:00.000Z' } } }),
    )
    const { store, user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'S’entraîner' }))
    expect(store.getState().session).toMatchObject({ kind: 'practice', language: 'fr' })
    expect(screen.getByRole('progressbar', { name: 'Progression de l’entraînement' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Quitter l’entraînement' }))
    expect(screen.getByRole('dialog', { name: nb('Quitter cet entraînement\u202f?') })).toBeInTheDocument()
    expectNoForeignText()
  })
})

describe('starting in the device language: French (015 US2)', () => {
  const appLike = () => makeStore(detectLanguage(deviceLanguageTags())) // as src/main.tsx does

  it('a French device with no saved choice opens in French and saves nothing', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr-FR', 'en'])
    renderApp(appLike())
    expect(screen.getByText('Apprends le toki pona')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('fr')
    expect(localStorage.getItem(SETTINGS_KEY)).toBeNull()
  })

  it('a Canadian French device opens in French', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr-CA'])
    renderApp(appLike())
    expect(screen.getByText('Apprends le toki pona')).toBeInTheDocument()
  })

  it('a saved Portuguese choice wins over a French device', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr-FR'])
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 1, language: 'pt-BR' }))
    renderApp(appLike())
    expect(screen.getByText('Aprenda Toki Pona')).toBeInTheDocument()
  })
})
