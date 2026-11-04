/** A screen box; a `DOMRect` fits */
export interface Rect {
  left: number
  top: number
  width: number
  bottom: number
}

/** Returns a new array with `list[from]` moved to index `to`; the input is unchanged. */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const result = list.filter((_, i) => i !== from)
  result.splice(to, 0, list[from])
  return result
}

/**
 * Where a dragged word lands among the other words (009 research R5): the number of `rects`
 * before the point. A rect is before it when the point is below the rect's row, or on its row and
 * right of its centre, so wrapped rows work.
 */
export function dropIndex(rects: readonly Rect[], x: number, y: number): number {
  return rects.filter((r) => y > r.bottom || (y >= r.top && x > r.left + r.width / 2)).length
}
