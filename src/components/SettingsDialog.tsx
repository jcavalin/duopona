import { useEffect, useId, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { Language } from '../i18n/language'
import { useLanguage, useStrings } from '../i18n/useStrings'
import { useAppDispatch } from '../store/hooks'
import { languageChosen } from '../store/settingsSlice'
import { CloseIcon, FlagBR, FlagFR, FlagUS } from './icons'

/** Each language is named in itself, whatever the active language (contract ui-settings.md) */
const OPTIONS: { value: Language; label: string; Flag: typeof FlagUS }[] = [
  { value: 'en', label: 'English', Flag: FlagUS },
  { value: 'fr', label: 'Français', Flag: FlagFR },
  { value: 'pt-BR', label: 'Português', Flag: FlagBR },
]

/**
 * Settings at #/settings over the home screen (014 contract ui-settings.md, research R6): a native
 * modal dialog, like the leave dialog. Closing goes back in history, so Back closes it too.
 */
export default function SettingsDialog() {
  const s = useStrings()
  const language = useLanguage()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const ref = useRef<HTMLDialogElement>(null)
  const checkedRef = useRef<HTMLInputElement>(null)
  const titleId = useId()

  // The route unmounts the dialog instead of closing it (as 013's leave dialog), so Back never
  // fires `close` and navigates twice.
  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
    checkedRef.current?.focus()
  }, [])

  // Opened directly as the first page there is nothing to go back to (contract "Opened directly")
  const close = () => (location.key !== 'default' ? navigate(-1) : navigate('/', { replace: true }))

  return (
    <dialog
      ref={ref}
      className="leave-dialog settings-dialog"
      aria-labelledby={titleId}
      // Escape closes the dialog natively and fires `close`
      onClose={close}
      // A click on the dialog element itself is a click on the backdrop
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="settings-dialog-body">
        <div className="settings-dialog-header">
          <h2 id={titleId} className="leave-dialog-title">
            {s.settings}
          </h2>
          <button type="button" className="icon-button" aria-label={s.closeSettings} onClick={close}>
            <CloseIcon size={24} />
          </button>
        </div>
        <fieldset className="settings-fieldset">
          <legend className="label">{s.language}</legend>
          {OPTIONS.map(({ value, label, Flag }) => (
            <label key={value} className="settings-option" lang={value}>
              <input
                ref={value === language ? checkedRef : undefined}
                type="radio"
                name="language"
                value={value}
                checked={value === language}
                onChange={() => dispatch(languageChosen(value))}
              />
              <Flag />
              {label}
            </label>
          ))}
        </fieldset>
      </div>
    </dialog>
  )
}
