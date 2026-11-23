import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Language } from '../i18n/language'

/** Learner settings (014 data-model "Settings"). */
export interface Settings {
  /** Active study language */
  language: Language
  /** true once the learner picked a language in settings; only then is it saved */
  chosen: boolean
}

export const defaultSettings = (): Settings => ({ language: 'en', chosen: false })

const settingsSlice = createSlice({
  name: 'settings',
  initialState: defaultSettings(),
  reducers: {
    /** The learner picked a language; picking the active one still counts as a choice. */
    languageChosen(state, action: PayloadAction<Language>) {
      state.language = action.payload
      state.chosen = true
    },
  },
})

export const { languageChosen } = settingsSlice.actions
export default settingsSlice.reducer

export const selectLanguage = (state: { settings: Settings }) => state.settings.language
