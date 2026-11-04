import { fireEvent } from '@testing-library/react'

/**
 * jsdom has no layout (009 research R10). This stubs `getBoundingClientRect` with a simple word-bank
 * layout: the answer line at y 0–116 and the word bank at y 200–300, both 400 px wide; tiles in
 * either group sit 4 per row, 80×48 with 10 px gaps, rows 58 px apart, by their place among the
 * group's children.
 */
export function stubWordBankLayout() {
  const rect = (left: number, top: number, width: number, height: number) =>
    ({ left, top, width, height, x: left, y: top, right: left + width, bottom: top + height, toJSON: () => ({}) }) as DOMRect
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const label = this.getAttribute('aria-label')
    if (label === 'Your answer') return rect(0, 0, 400, 116)
    if (label === 'Word bank') return rect(0, 200, 400, 100)
    const group = this.parentElement
    const groupLabel = group?.getAttribute('aria-label')
    if (group && (groupLabel === 'Your answer' || groupLabel === 'Word bank')) {
      const k = [...group.children].indexOf(this)
      const top = (groupLabel === 'Word bank' ? 200 : 0) + Math.floor(k / 4) * 58
      return rect((k % 4) * 90, top, 80, 48)
    }
    return rect(0, 0, 0, 0)
  })
}

/** Centre of an element under the stubbed layout */
export function centre(el: Element) {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

interface DragOptions {
  pointerId?: number
  /** Fire the click browsers send after the release (default true) */
  click?: boolean
  cancel?: boolean
}

/** Press `el`, move past the drag threshold, move to (x, y) and release there, like a mouse drag */
export function dragTo(el: Element, x: number, y: number, { pointerId = 1, click = true, cancel = false }: DragOptions = {}) {
  const start = centre(el)
  const at = (cx: number, cy: number) => ({ pointerId, clientX: cx, clientY: cy, button: 0, pointerType: 'mouse' })
  fireEvent.pointerDown(el, at(start.x, start.y))
  fireEvent.pointerMove(el, at(start.x + 10, start.y))
  fireEvent.pointerMove(el, at(x, y))
  if (cancel) fireEvent.pointerCancel(el, at(x, y))
  else fireEvent.pointerUp(el, at(x, y))
  if (click && !cancel) fireEvent.click(el, { detail: 1 }) // a pointer click, not a keyboard one
}

/** A press that moves `dx` px and releases, then the click: a (shaky) tap */
export function tap(el: Element, dx = 0) {
  const start = centre(el)
  const at = (cx: number) => ({ pointerId: 1, clientX: cx, clientY: start.y, button: 0, pointerType: 'mouse' })
  fireEvent.pointerDown(el, at(start.x))
  if (dx) fireEvent.pointerMove(el, at(start.x + dx))
  fireEvent.pointerUp(el, at(start.x + dx))
  fireEvent.click(el, { detail: 1 })
}
