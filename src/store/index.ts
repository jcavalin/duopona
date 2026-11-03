import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { loadProgress, saveProgress } from './persistence'
import progressReducer from './progressSlice'
import sessionReducer from './sessionSlice'

const rootReducer = combineReducers({
  progress: progressReducer,
  session: sessionReducer,
})

/** Creates the store with progress loaded from localStorage, and saves progress whenever it changes. */
export function makeStore() {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: { progress: loadProgress() },
  })

  let lastProgress = store.getState().progress
  store.subscribe(() => {
    const { progress } = store.getState()
    if (progress !== lastProgress) {
      lastProgress = progress
      saveProgress(progress)
    }
  })

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
