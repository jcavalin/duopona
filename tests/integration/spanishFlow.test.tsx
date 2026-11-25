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

// Feature 017 US1/US2: the whole course in Spanish.
type Store = ReturnType<typeof makeStore>
type User = ReturnType<typeof userEvent.setup>

const [l1] = courses.es

/**
 * Interface text of the other languages that must never show while Spanish is active (SC-001).
 * Single words are compared with whole element texts, longer phrases are searched anywhere
 * (015 analysis I1). Words that Spanish shares ("Continuar", "Idioma") are left out.
 */
const FOREIGN = [
  // English
  'Learn Toki Pona', 'Daily goal', 'Practice', 'Review weak words', 'New words', 'Check', 'Continue',
  'Not quite', 'Correct answer:', 'Why?', 'Leave this lesson?', 'Keep learning', 'Lesson complete!',
  'Choose the meaning', 'Write this in', 'Quit lesson', 'Settings',
  // Brazilian Portuguese
  'Aprenda Toki Pona', 'Meta diária', 'Praticar', 'Verificar', 'Não é bem isso', 'Por quê?',
  'Sair desta lição?', 'Lição concluída!', 'Escolha o significado', 'Configurações',
  // French
  'Apprends le toki pona', 'Objectif du jour', 'S’entraîner', 'Vérifier', 'Continuer', 'Pas tout à fait',
  'Pourquoi\u202f?', 'Leçon terminée', 'Choisis le sens', 'Paramètres',
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

const chooseSpanish = () => localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 1, language: 'es' }))

const current = (store: Store): Exercise => selectCurrentExercise(store.getState())!

async function answer(user: User, store: Store, correct: boolean) {
  const ex = current(store)
  if (ex.type === 'multipleChoice') {
    const choice = correct ? ex.answer : ex.options.find((o) => o !== ex.answer)!
    await user.click(within(screen.getByRole('group', { name: 'Opciones' })).getByRole('button', { name: choice }))
  } else {
    for (const word of correct ? ex.answer : [ex.distractors[0]]) {
      await user.click(within(screen.getByRole('group', { name: 'Banco de palabras' })).getAllByRole('button', { name: word })[0])
    }
  }
  await user.click(screen.getByRole('button', { name: 'Comprobar' }))
}

afterEach(() => {
  document.documentElement.lang = 'en'
  vi.restoreAllMocks()
})

describe('studying in Spanish (017 US1)', () => {
  it('shows the home screen in Spanish, with the document language set', () => {
    chooseSpanish()
    renderApp()
    expect(screen.getByText('Aprende toki pona')).toBeInTheDocument()
    expect(screen.getByText('Meta diaria')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Practicar' })).toHaveAccessibleDescription('Termina una lección para desbloquear la práctica.')
    expect(screen.getByRole('link', { name: 'Palabras y oraciones, empezar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sustantivos y adjetivos, aún bloqueada' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Configuración' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('es')
    expectNoForeignText()
  })

  it('plays a whole lesson in Spanish: intro, exercises, why, leave dialog and summary', async () => {
    chooseSpanish()
    const { store, user } = renderApp()
    await user.click(screen.getByRole('link', { name: 'Palabras y oraciones, empezar' }))

    // Introduction
    expect(screen.getByRole('heading', { name: 'Palabras y oraciones' })).toBeInTheDocument()
    expect(screen.getByText(`Libro: Lección 2 · ${l1.exercises.length} ejercicios`)).toBeInTheDocument()
    expect(screen.getByText(getMeaning('jan', 'es')!)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: l1.grammar.title })).toBeInTheDocument()
    expectNoForeignText()
    await user.click(screen.getByRole('button', { name: 'Empezar' }))

    // A wrong answer, with its explanation
    expect(screen.getByRole('heading', { name: 'Elige el significado' })).toBeInTheDocument()
    expect(store.getState().session?.language).toBe('es')
    await answer(user, store, false)
    expect(screen.getByRole('status').textContent).toContain('No del todo')
    expect(screen.getByRole('status').textContent).toContain('Solución correcta: persona / alguien')
    await user.click(screen.getByRole('button', { name: '¿Por qué?' }))
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toContain('jan: persona / alguien')
    expectNoForeignText()

    // The leave dialog, then back to the lesson
    await user.click(screen.getByRole('button', { name: 'Salir de la lección' }))
    const dialog = screen.getByRole('dialog', { name: '¿Salir de esta lección?' })
    expect(dialog).toHaveAccessibleDescription('Tu progreso en esta lección se perderá.')
    expectNoForeignText()
    await user.click(within(dialog).getByRole('button', { name: 'Seguir aprendiendo' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    // Every exercise is answerable from the Spanish data
    while (!screen.queryByRole('heading', { name: '¡Lección completada!' })) {
      await answer(user, store, true)
      expect(screen.getByRole('status')).toHaveTextContent('pona! Correcto.')
      await user.click(screen.getByRole('button', { name: 'Continuar' }))
    }
    expect(screen.getByText('Sustantivos y adjetivos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Repetir lección' })).toBeInTheDocument()
    expectNoForeignText()
    expect(Object.keys(store.getState().progress.completedLessons)).toEqual([l1.id])
  })

  it('uses Spanish for practice sessions and their leave dialog', async () => {
    chooseSpanish()
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, completedLessons: { [l1.id]: { firstTryCorrect: 1, total: 1, completedAt: '2026-11-25T00:00:00.000Z' } } }),
    )
    const { store, user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Practicar' }))
    expect(store.getState().session).toMatchObject({ kind: 'practice', language: 'es' })
    expect(screen.getByRole('progressbar', { name: 'Progreso de la práctica' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Salir de la práctica' }))
    expect(screen.getByRole('dialog', { name: '¿Salir de esta práctica?' })).toBeInTheDocument()
    expectNoForeignText()
  })
})

describe('starting in the device language: Spanish (017 US2)', () => {
  const appLike = () => makeStore(detectLanguage(deviceLanguageTags())) // as src/main.tsx does

  it('a Spanish device with no saved choice opens in Spanish and saves nothing', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['es-MX', 'en'])
    renderApp(appLike())
    expect(screen.getByText('Aprende toki pona')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('es')
    expect(localStorage.getItem(SETTINGS_KEY)).toBeNull()
  })

  it('a Latin American Spanish device (es-419) opens in Spanish', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['es-419'])
    renderApp(appLike())
    expect(screen.getByText('Aprende toki pona')).toBeInTheDocument()
  })

  it('a saved French choice wins over a Spanish device', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['es-ES'])
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 1, language: 'fr' }))
    renderApp(appLike())
    expect(screen.getByText('Apprends le toki pona')).toBeInTheDocument()
  })
})
