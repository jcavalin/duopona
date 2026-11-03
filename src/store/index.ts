import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { loadProgress, loadStreak, loadWords, saveProgress, saveStreak, saveWords } from './persistence'
import progressReducer from './progressSlice'
import sessionReducer from './sessionSlice'
import streakReducer from './streakSlice'
import wordsReducer from './wordsSlice'

const rootReducer = combineReducers({
  progress: progressReducer,
  session: sessionReducer,
  words: wordsReducer,
  streak: streakReducer,
})

/** Creates the store with progress, word records and the streak loaded from localStorage, and saves each whenever it changes. */
export function makeStore() {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: { progress: loadProgress(), words: loadWords(), streak: loadStreak() },
  })

  let lastProgress = store.getState().progress
  let lastWords = store.getState().words
  let lastStreak = store.getState().streak
  store.subscribe(() => {
    const { progress, words, streak } = store.getState()
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
  })

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
