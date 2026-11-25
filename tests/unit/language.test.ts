import { detectLanguage, deviceLanguageTags } from '../../src/i18n/language'

describe('detectLanguage (014, 015 and 017 FR-006)', () => {
  it.each([
    [['pt-BR'], 'pt-BR'],
    [['pt-PT'], 'pt-BR'],
    [['pt'], 'pt-BR'],
    [['PT-br'], 'pt-BR'],
    [['en-GB'], 'en'],
    [['de-DE'], 'en'],
    [[], 'en'],
    [['de', 'pt-BR'], 'pt-BR'],
    [['de-DE', 'pt-BR', 'en'], 'pt-BR'],
    [['en-US', 'pt-BR'], 'en'],
    [['de', 'it'], 'en'],
    // French (015)
    [['fr'], 'fr'],
    [['fr-FR'], 'fr'],
    [['fr-CA'], 'fr'],
    [['FR-be'], 'fr'],
    [['de', 'fr-CH'], 'fr'],
    [['en-US', 'fr'], 'en'],
    [['pt-BR', 'fr'], 'pt-BR'],
    [['fr', 'pt-BR'], 'fr'],
    // Spanish (017)
    [['es'], 'es'],
    [['es-ES'], 'es'],
    [['es-MX'], 'es'],
    [['es-419'], 'es'],
    [['ES-ar'], 'es'],
    [['de', 'es-AR'], 'es'],
    [['en-US', 'es'], 'en'],
    [['fr', 'es'], 'fr'],
    [['es', 'pt-BR'], 'es'],
  ] as const)('%j → %s', (tags, expected) => {
    expect(detectLanguage(tags)).toBe(expected)
  })
})

describe('deviceLanguageTags', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns navigator.languages', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['pt-BR', 'en'])
    expect(deviceLanguageTags()).toEqual(['pt-BR', 'en'])
  })

  it('falls back to navigator.language when languages is empty', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue([])
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('pt-PT')
    expect(deviceLanguageTags()).toEqual(['pt-PT'])
  })
})
