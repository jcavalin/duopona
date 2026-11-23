import { makeStore } from '../../src/store'
import { SETTINGS_KEY } from '../../src/store/persistence'
import reducer, { defaultSettings, languageChosen, selectLanguage } from '../../src/store/settingsSlice'

describe('settings slice (014 data-model)', () => {
  it('starts in English, not chosen', () => {
    expect(reducer(undefined, { type: 'init' })).toEqual({ language: 'en', chosen: false })
  })

  it('languageChosen sets the language and marks it chosen, even when it is unchanged', () => {
    expect(reducer(defaultSettings(), languageChosen('pt-BR'))).toEqual({ language: 'pt-BR', chosen: true })
    expect(reducer(defaultSettings(), languageChosen('en'))).toEqual({ language: 'en', chosen: true })
  })

  it('selectLanguage reads the language', () => {
    expect(selectLanguage({ settings: { language: 'pt-BR', chosen: false } })).toBe('pt-BR')
  })
})

describe('store settings (014 research R4)', () => {
  it('uses the device language when nothing is saved, and writes nothing', () => {
    const store = makeStore('pt-BR')
    expect(store.getState().settings).toEqual({ language: 'pt-BR', chosen: false })
    store.dispatch({ type: 'unrelated' })
    expect(localStorage.getItem(SETTINGS_KEY)).toBeNull()
  })

  it('a saved choice beats the device language', () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 1, language: 'en' }))
    expect(makeStore('pt-BR').getState().settings).toEqual({ language: 'en', chosen: true })
  })

  it('saves a choice', () => {
    const store = makeStore('en')
    store.dispatch(languageChosen('pt-BR'))
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toEqual({ version: 1, language: 'pt-BR' })
  })
})
