import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { lessons } from '../../src/content/lessons'
import { routes } from '../../src/router'
import { makeStore } from '../../src/store'
import { SETTINGS_KEY, STORAGE_KEY, STREAK_KEY, WORDS_KEY } from '../../src/store/persistence'
import type { Language } from '../../src/i18n/language'

// Feature 014 US3: the language choice behind the settings gear (contract ui-settings.md).
function renderApp({ path = '/', device = 'en' as Language } = {}) {
  const store = makeStore(device)
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const user = userEvent.setup()
  const view = render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  )
  return { store, router, user, ...view }
}

async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('link', { name: 'Settings' }))
  return screen.getByRole('dialog', { name: 'Settings' })
}

afterEach(() => {
  document.documentElement.lang = 'en'
})

describe('settings (014 US3)', () => {
  it('the home screen shows only a settings link, not the language choice', () => {
    renderApp()
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the settings with the active language checked and focused', async () => {
    const { user, router } = renderApp()
    const dialog = await openSettings(user)
    expect(router.state.location.pathname).toBe('/settings')
    const english = within(dialog).getByRole('radio', { name: 'English' })
    expect(english).toBeChecked()
    expect(english).toHaveFocus()
    expect(within(dialog).getByRole('radio', { name: 'Português' })).not.toBeChecked()
    expect(within(dialog).getByRole('group', { name: 'Language' })).toBeInTheDocument()
    // The home screen stays rendered underneath
    expect(screen.getByText('Learn Toki Pona')).toBeInTheDocument()
  })

  it('switches the whole app at once and saves the choice', async () => {
    const { user } = renderApp()
    const dialog = await openSettings(user)
    await user.click(within(dialog).getByRole('radio', { name: 'Português' }))
    expect(screen.getByRole('dialog', { name: 'Configurações' })).toBeInTheDocument()
    expect(within(dialog).getByRole('radio', { name: 'Português' })).toBeChecked()
    expect(within(dialog).getByRole('radio', { name: 'Português' })).toHaveFocus()
    expect(screen.getByText('Aprenda Toki Pona')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('pt-BR')
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toEqual({ version: 1, language: 'pt-BR' })
    // Option names stay in their own language
    expect(within(dialog).getByRole('radio', { name: 'English' })).toBeInTheDocument()
  })

  it('arrow keys move between the languages', async () => {
    const { user } = renderApp()
    await openSettings(user)
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Português' })).toBeChecked()
    expect(screen.getByText('Aprenda Toki Pona')).toBeInTheDocument()
  })

  it('keeps the choice after a reload', async () => {
    const first = renderApp()
    await openSettings(first.user)
    await first.user.click(screen.getByRole('radio', { name: 'Português' }))
    first.unmount()
    renderApp()
    expect(screen.getByText('Aprenda Toki Pona')).toBeInTheDocument()
  })

  it('leaves progress, word mistakes and the streak untouched (FR-009)', async () => {
    const result = { firstTryCorrect: 9, total: 12, completedAt: '2026-11-20T00:00:00.000Z' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completedLessons: { [lessons[0].id]: result } }))
    localStorage.setItem(WORDS_KEY, JSON.stringify({ version: 1, mistakes: { jan: 2 } }))
    localStorage.setItem(STREAK_KEY, JSON.stringify({ version: 1, lastDay: '2026-11-22', current: 3, best: 5 }))
    const { user, store } = renderApp()
    const before = { ...store.getState(), settings: undefined }
    await openSettings(user)
    await user.click(screen.getByRole('radio', { name: 'Português' }))
    await user.click(screen.getByRole('radio', { name: 'English' }))
    await user.click(screen.getByRole('radio', { name: 'Português' }))
    expect({ ...store.getState(), settings: undefined }).toEqual(before)
  })

  describe('closing', () => {
    it.each([
      ['the close button', async (user: ReturnType<typeof userEvent.setup>, dialog: HTMLElement) => {
        await user.click(within(dialog).getByRole('button', { name: 'Close settings' }))
      }],
      ['Escape (the dialog close event)', async (_user: unknown, dialog: HTMLElement) => {
        act(() => (dialog as HTMLDialogElement).close())
      }],
      ['a tap on the backdrop', async (_user: unknown, dialog: HTMLElement) => {
        fireEvent.click(dialog)
      }],
    ])('%s returns home and focuses the gear', async (_name, closeIt) => {
      const { user, router } = renderApp()
      const dialog = await openSettings(user)
      await closeIt(user, dialog)
      expect(router.state.location.pathname).toBe('/')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Settings' })).toHaveFocus()
      // Went back, rather than adding a new entry
      expect(router.state.historyAction).toBe('POP')
    })

    it('Back closes the settings', async () => {
      const { user, router } = renderApp()
      await openSettings(user)
      await act(() => router.navigate(-1))
      expect(router.state.location.pathname).toBe('/')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('opened directly, closing replaces it with home', async () => {
      const { user, router } = renderApp({ path: '/settings' })
      await user.click(screen.getByRole('button', { name: 'Close settings' }))
      expect(router.state.location.pathname).toBe('/')
      expect(router.state.historyAction).toBe('REPLACE')
    })
  })

  it('on a Portuguese device, choosing English sticks', async () => {
    const first = renderApp({ device: 'pt-BR' })
    expect(screen.getByText('Aprenda Toki Pona')).toBeInTheDocument()
    await first.user.click(screen.getByRole('link', { name: 'Configurações' }))
    await first.user.click(screen.getByRole('radio', { name: 'English' }))
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toEqual({ version: 1, language: 'en' })
    first.unmount()
    renderApp({ device: 'pt-BR' })
    expect(screen.getByText('Learn Toki Pona')).toBeInTheDocument()
  })
})
