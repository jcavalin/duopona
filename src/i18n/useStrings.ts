import { useAppSelector } from '../store/hooks'
import { selectLanguage } from '../store/settingsSlice'
import type { Language } from './language'
import { strings, type Strings } from './strings'

/** The active study language (014). */
export function useLanguage(): Language {
  return useAppSelector(selectLanguage)
}

/** Interface text in the active study language (014 research R1). */
export function useStrings(): Strings {
  return strings[useLanguage()]
}
