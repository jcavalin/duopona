import { dropIndex, moveItem } from '../../src/lib/reorder'

describe('moveItem', () => {
  const list = ['a', 'b', 'c', 'd']

  it('moves an item forward and backward', () => {
    expect(moveItem(list, 0, 3)).toEqual(['b', 'c', 'd', 'a'])
    expect(moveItem(list, 3, 1)).toEqual(['a', 'd', 'b', 'c'])
  })

  it('keeps the order when moved to its own index, and never mutates the input', () => {
    expect(moveItem(list, 2, 2)).toEqual(list)
    moveItem(list, 0, 2)
    expect(list).toEqual(['a', 'b', 'c', 'd'])
  })
})

describe('dropIndex', () => {
  const box = (left: number, top: number) => ({ left, top, width: 80, bottom: top + 48 })
  const row = [box(0, 0), box(90, 0), box(180, 0)] // centres at 40, 130, 220

  it('counts the boxes left of the point on its row', () => {
    expect(dropIndex(row, 20, 24)).toBe(0)
    expect(dropIndex(row, 180, 24)).toBe(2)
    expect(dropIndex(row, 300, 24)).toBe(3)
  })

  it('counts every box of an earlier row (wrapped answer line)', () => {
    const rows = [...row, box(0, 58), box(90, 58)]
    expect(dropIndex(rows, 10, 80)).toBe(3)
    expect(dropIndex(rows, 100, 80)).toBe(4)
  })

  it('puts a point above the first row at the start, and handles no boxes', () => {
    expect(dropIndex(row, 300, -10)).toBe(0)
    expect(dropIndex([], 50, 50)).toBe(0)
  })
})
