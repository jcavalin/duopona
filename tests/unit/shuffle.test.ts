import { shuffle } from '../../src/lib/shuffle'

describe('shuffle', () => {
  const items = [1, 2, 3, 4, 5]

  it('returns a new array with the same items', () => {
    const result = shuffle(items)
    expect(result).not.toBe(items)
    expect([...result].sort()).toEqual(items)
    expect(items).toEqual([1, 2, 3, 4, 5])
  })

  it('is deterministic for a given random source', () => {
    const fixed = () => 0
    expect(shuffle(items, fixed)).toEqual(shuffle(items, fixed))
    expect(shuffle(items, fixed)).not.toEqual(items)
  })
})
