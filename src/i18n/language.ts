/** Study languages (014 data-model): the language of everything except Toki Pona. */
export type Language = 'en' | 'pt-BR' | 'fr'

export const LANGUAGES: readonly Language[] = ['en', 'pt-BR', 'fr']

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language)
}

/**
 * The study language for a device's preferred languages, in order (014 FR-006, 015 FR-006):
 * the first tag that is English, Portuguese (any variant) or French (any variant) decides;
 * otherwise English.
 */
export function detectLanguage(tags: readonly string[]): Language {
  for (const tag of tags) {
    const primary = tag.split('-')[0].toLowerCase()
    if (primary === 'pt') return 'pt-BR'
    if (primary === 'fr') return 'fr'
    if (primary === 'en') return 'en'
  }
  return 'en'
}

/** The browser's preferred language tags, most preferred first. */
export function deviceLanguageTags(): readonly string[] {
  if (typeof navigator === 'undefined') return []
  if (navigator.languages?.length) return navigator.languages
  return navigator.language ? [navigator.language] : []
}
