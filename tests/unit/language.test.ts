import { detectLanguage, deviceLanguageTags } from '../../src/i18n/language'

describe('detectLanguage (014 FR-006, research R4)', () => {
  it.each([
    [['pt-BR'], 'pt-BR'],
    [['pt-PT'], 'pt-BR'],
    [['pt'], 'pt-BR'],
    [['PT-br'], 'pt-BR'],
    [['en-GB'], 'en'],
    [['fr-FR'], 'en'],
    [[], 'en'],
    [['fr', 'pt-BR'], 'pt-BR'],
    [['fr-FR', 'pt-BR', 'en'], 'pt-BR'],
    [['en-US', 'pt-BR'], 'en'],
    [['de', 'es'], 'en'],
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
