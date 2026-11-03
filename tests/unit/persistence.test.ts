import { loadProgress, loadWords, saveProgress, saveWords, STORAGE_KEY, WORDS_KEY } from '../../src/store/persistence'
import { emptyProgress } from '../../src/store/progressSlice'
import { emptyWords } from '../../src/store/wordsSlice'

const result = { firstTryCorrect: 8, total: 11, completedAt: '2026-11-01T10:00:00.000Z' }

describe('loadProgress (contract read rules)', () => {
  afterEach(() => vi.restoreAllMocks())

  it('key missing → empty progress', () => {
    expect(loadProgress()).toEqual(emptyProgress())
  })

  it('not valid JSON → empty progress', () => {
    localStorage.setItem(STORAGE_KEY, 'garbage{')
    expect(loadProgress()).toEqual(emptyProgress())
  })

  it.each([
    ['wrong version', { version: 2, completedLessons: { 'basics-1': result } }],
    ['missing version', { completedLessons: { 'basics-1': result } }],
    ['completedLessons not an object', { version: 1, completedLessons: 'nope' }],
    ['malformed result', { version: 1, completedLessons: { 'basics-1': { total: '11' } } }],
    ['not an object', 42],
    ['null', null],
  ])('%s → empty progress', (_name, value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    expect(loadProgress()).toEqual(emptyProgress())
  })

  it('valid v1 → loaded as-is', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completedLessons: { 'basics-1': result } }))
    expect(loadProgress()).toEqual({ completedLessons: { 'basics-1': result } })
  })

  it('localStorage throws → empty progress', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    expect(loadProgress()).toEqual(emptyProgress())
  })
})

describe('saveProgress', () => {
  afterEach(() => vi.restoreAllMocks())

  it('writes version 1 with completed lessons', () => {
    saveProgress({ completedLessons: { 'basics-1': result } })
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({ version: 1, completedLessons: { 'basics-1': result } })
  })

  it('swallows write errors (quota exceeded / disabled)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveProgress({ completedLessons: { 'basics-1': result } })).not.toThrow()
  })
})

describe('word records (006 contract words-storage)', () => {
  afterEach(() => vi.restoreAllMocks())

  it('round trip', () => {
    saveWords({ mistakes: { kili: 2, wawa: 1 } })
    expect(JSON.parse(localStorage.getItem(WORDS_KEY)!)).toEqual({ version: 1, mistakes: { kili: 2, wawa: 1 } })
    expect(loadWords()).toEqual({ mistakes: { kili: 2, wawa: 1 } })
  })

  it('key missing → no weak words', () => {
    expect(loadWords()).toEqual(emptyWords())
  })

  it('not valid JSON → no weak words', () => {
    localStorage.setItem(WORDS_KEY, 'garbage{')
    expect(loadWords()).toEqual(emptyWords())
  })

  it.each([
    ['wrong version', { version: 2, mistakes: { kili: 1 } }],
    ['missing version', { mistakes: { kili: 1 } }],
    ['mistakes not an object', { version: 1, mistakes: 'nope' }],
    ['mistakes an array', { version: 1, mistakes: [1] }],
    ['zero count', { version: 1, mistakes: { kili: 0 } }],
    ['fractional count', { version: 1, mistakes: { kili: 1.5 } }],
    ['string count', { version: 1, mistakes: { kili: '2' } }],
    ['null', null],
  ])('%s → no weak words', (_name, value) => {
    localStorage.setItem(WORDS_KEY, JSON.stringify(value))
    expect(loadWords()).toEqual(emptyWords())
  })

  it('localStorage throws → no weak words; write errors are swallowed', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    expect(loadWords()).toEqual(emptyWords())
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveWords({ mistakes: { kili: 1 } })).not.toThrow()
  })

  it('SC-006: a bad word record never affects progress, and the reverse', () => {
    saveProgress({ completedLessons: { 'basics-1': result } })
    localStorage.setItem(WORDS_KEY, 'garbage{')
    expect(loadProgress()).toEqual({ completedLessons: { 'basics-1': result } })

    saveWords({ mistakes: { kili: 1 } })
    localStorage.setItem(STORAGE_KEY, 'garbage{')
    expect(loadWords()).toEqual({ mistakes: { kili: 1 } })
  })
})
