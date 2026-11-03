import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { loadProgress, loadWords, saveProgress, saveWords } from './persistence'
import progressReducer from './progressSlice'
import sessionReducer from './sessionSlice'
import wordsReducer from './wordsSlice'

const rootReducer = combineReducers({
  progress: progressReducer,
  session: sessionReducer,
  words: wordsReducer,
})

/** Creates the store with progress and word records loaded from localStorage, and saves each whenever it changes. */
export function makeStore() {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: { progress: loadProgress(), words: loadWords() },
  })

  let lastProgress = store.getState().progress
  let lastWords = store.getState().words
  store.subscribe(() => {
    const { progress, words } = store.getState()
    if (progress !== lastProgress) {
      lastProgress = progress
      saveProgress(progress)
    }
    if (words !== lastWords) {
      lastWords = words
      saveWords(words)
    }
  })

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
