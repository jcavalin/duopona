import { loadProgress, saveProgress, STORAGE_KEY } from '../../src/store/persistence'
import { emptyProgress } from '../../src/store/progressSlice'

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
