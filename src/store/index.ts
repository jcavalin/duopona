import { combineReducers, configureStore } from '@reduxjs/toolkit'
import sessionReducer from './sessionSlice'

const rootReducer = combineReducers({
  session: sessionReducer,
})

export function makeStore() {
  return configureStore({ reducer: rootReducer })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
