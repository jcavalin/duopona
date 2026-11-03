import { getExercise, lessons } from '../../src/content/lessons'
import { testedWords } from '../../src/content/words'
import { availableKeys, hasReviewable, pickPractice, pickReview, SESSION_SIZE } from '../../src/lib/practice'

/** Deterministic pseudo-random sequence for repeatable picks. */
function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
}

const [l1, l2] = lessons
const twoLessons = availableKeys([l1.id, l2.id])

describe('availableKeys', () => {
  it('lists every exercise of the given lessons, in course order', () => {
    expect(twoLessons).toEqual([
      ...l1.exercises.map((e) => `${l1.id}/${e.id}`),
      ...l2.exercises.map((e) => `${l2.id}/${e.id}`),
    ])
    expect(availableKeys([l2.id, l1.id])).toEqual(twoLessons)
  })

  it('ignores ids not in the course and returns nothing for no lessons', () => {
    expect(availableKeys(['nope', l1.id])).toEqual(availableKeys([l1.id]))
    expect(availableKeys([])).toEqual([])
  })
})

describe('pickPractice', () => {
  it('picks SESSION_SIZE distinct keys from the input', () => {
    const picked = pickPractice(twoLessons, seeded(1))
    expect(picked).toHaveLength(SESSION_SIZE)
    expect(new Set(picked).size).toBe(SESSION_SIZE)
    for (const key of picked) expect(twoLessons).toContain(key)
  })

  it('varies with the random source', () => {
    expect(pickPractice(twoLessons, seeded(1))).not.toEqual(pickPractice(twoLessons, seeded(2)))
  })

  it('uses every key once when there are fewer than SESSION_SIZE', () => {
    const few = twoLessons.slice(0, 4)
    expect([...pickPractice(few, seeded(3))].sort()).toEqual([...few].sort())
  })

  it('SC-002: 20 sessions only use completed lessons, never twice in a pass', () => {
    for (let i = 0; i < 20; i++) {
      const picked = pickPractice(twoLessons)
      expect(new Set(picked).size).toBe(picked.length)
      for (const key of picked) expect(key.startsWith(`${l1.id}/`) || key.startsWith(`${l2.id}/`)).toBe(true)
    }
  })
})

const wordsOf = (key: string) => testedWords(getExercise(key)!)
const testsAny = (key: string, mistakes: Record<string, number>) => wordsOf(key).some((w) => (mistakes[w] ?? 0) >= 1)
const all = availableKeys(lessons.map((l) => l.id))

describe('pickReview (006 FR-014, research R3)', () => {
  it('with no weak words fills with distinct random keys', () => {
    const picked = pickReview(twoLessons, {}, seeded(1))
    expect(picked).toHaveLength(SESSION_SIZE)
    expect(new Set(picked).size).toBe(SESSION_SIZE)
  })

  it('SC-003: every pick tests a weak word when at least 10 such exercises exist', () => {
    const mistakes = { li: 2, mi: 1 }
    expect(all.filter((k) => testsAny(k, mistakes)).length).toBeGreaterThanOrEqual(SESSION_SIZE)
    for (let seed = 1; seed <= 20; seed++) {
      const picked = pickReview(all, mistakes, seeded(seed))
      expect(picked).toHaveLength(SESSION_SIZE)
      expect(new Set(picked).size).toBe(SESSION_SIZE)
      for (const key of picked) expect(testsAny(key, mistakes)).toBe(true)
    }
  })

  it('one exercise per weak word first, so a frequent word cannot crowd out the others', () => {
    // li is in dozens of exercises; the rarer words must still each get one
    const rare = ['kulupu', 'wawa', 'sin']
    const mistakes = { li: 5, kulupu: 1, wawa: 1, sin: 1 }
    for (let seed = 1; seed <= 10; seed++) {
      const covered = new Set(pickReview(all, mistakes, seeded(seed)).flatMap(wordsOf))
      for (const w of rare) expect(covered).toContain(w)
    }
  })

  it('includes the word with more mistakes when there is room for one exercise only', () => {
    // Twelve weak words, ten places: the two lowest-count words may drop out, never the top one
    const words = ['ijo', 'jan', 'kili', 'lipu', 'meli', 'soweli', 'telo', 'tomo', 'lili', 'suli', 'mije', 'kulupu']
    const mistakes = Object.fromEntries(words.map((w, i) => [w, i === 0 ? 9 : 1]))
    for (let seed = 1; seed <= 10; seed++) {
      const covered = new Set(pickReview(all, mistakes, seeded(seed)).flatMap(wordsOf))
      expect(covered).toContain('ijo')
    }
  })

  it('includes every weak-word exercise when there are fewer than 10, then fills at random', () => {
    const keys = availableKeys([l1.id])
    const mistakes = { kili: 1 }
    const withKili = keys.filter((k) => testsAny(k, mistakes))
    expect(withKili.length).toBeLessThan(SESSION_SIZE)
    const picked = pickReview(keys, mistakes, seeded(4))
    expect(picked).toHaveLength(SESSION_SIZE)
    expect(new Set(picked).size).toBe(SESSION_SIZE)
    for (const key of withKili) expect(picked).toContain(key)
  })

  it('ignores weak words that no available exercise tests', () => {
    const keys = availableKeys([l1.id])
    expect(hasReviewable(keys, { utala: 3 })).toBe(false)
    expect(pickReview(keys, { utala: 3 }, seeded(5))).toHaveLength(SESSION_SIZE)
  })

  it('returns all keys when fewer than SESSION_SIZE exist', () => {
    const few = twoLessons.slice(0, 3)
    expect([...pickReview(few, { ijo: 1 }, seeded(6))].sort()).toEqual([...few].sort())
  })

  it('FR-015: varies with the random source', () => {
    const mistakes = { li: 2, mi: 1 }
    expect(pickReview(all, mistakes, seeded(1))).not.toEqual(pickReview(all, mistakes, seeded(2)))
  })
})

describe('hasReviewable', () => {
  it('is true only when an available exercise tests a weak word', () => {
    expect(hasReviewable(twoLessons, {})).toBe(false)
    expect(hasReviewable(twoLessons, { kili: 1 })).toBe(true)
    expect(hasReviewable([], { kili: 1 })).toBe(false)
  })
})
