import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Language } from '../i18n/language'
import {
  loadProgress,
  loadSettings,
  loadStreak,
  loadWords,
  saveProgress,
  saveSettings,
  saveStreak,
  saveWords,
} from './persistence'
import progressReducer from './progressSlice'
import sessionReducer from './sessionSlice'
import settingsReducer from './settingsSlice'
import streakReducer from './streakSlice'
import wordsReducer from './wordsSlice'

const rootReducer = combineReducers({
  progress: progressReducer,
  session: sessionReducer,
  words: wordsReducer,
  streak: streakReducer,
  settings: settingsReducer,
})

/**
 * Creates the store with progress, word records, the streak and settings loaded from localStorage,
 * and saves each whenever it changes. `deviceLanguage` is used when no language was chosen (014 R4).
 */
export function makeStore(deviceLanguage: Language = 'en') {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      progress: loadProgress(),
      words: loadWords(),
      streak: loadStreak(),
      settings: loadSettings(deviceLanguage),
    },
  })

  let lastProgress = store.getState().progress
  let lastWords = store.getState().words
  let lastStreak = store.getState().streak
  let lastSettings = store.getState().settings
  store.subscribe(() => {
    const { progress, words, streak, settings } = store.getState()
    if (progress !== lastProgress) {
      lastProgress = progress
      saveProgress(progress)
    }
    if (words !== lastWords) {
      lastWords = words
      saveWords(words)
    }
    if (streak !== lastStreak) {
      lastStreak = streak
      saveStreak(streak)
    }
    if (settings !== lastSettings) {
      lastSettings = settings
      saveSettings(settings)
    }
  })

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
