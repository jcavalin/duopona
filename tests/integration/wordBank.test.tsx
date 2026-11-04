import { fireEvent, render, screen, within } from '@testing-library/react'
import WordBank from '../../src/components/WordBank'
import type { WordBankExercise } from '../../src/content/types'
import { centre, dragTo, stubWordBankLayout, tap } from './wordBankLayout'

// Feature 009: reordering answer tiles. Layout is stubbed (jsdom has none, research R10).
const fixture: WordBankExercise = {
  id: 'fixture',
  type: 'wordBank',
  direction: 'en-tp',
  prompt: 'Your group is strong.',
  answer: ['kulupu', 'sina', 'li', 'wawa'],
  distractors: ['li'], // a repeated word
}

let onSubmit: ReturnType<typeof vi.fn<(answer: string[]) => void>>

function renderBank(disabled = false) {
  onSubmit = vi.fn()
  return render(<WordBank header={null} exercise={fixture} disabled={disabled} onSubmit={onSubmit} />)
}

const line = () => within(screen.getByRole('group', { name: 'Your answer' }))
const bank = () => within(screen.getByRole('group', { name: 'Word bank' }))
const lineWords = () => line().queryAllByRole('button').map((b) => b.textContent)
const placedTile = (word: string) => line().getByRole('button', { name: word })

/** Place words by tapping them in the bank (the first matching tile for repeated words) */
function placeWords(...words: string[]) {
  for (const word of words) fireEvent.click(bank().getAllByRole('button', { name: word })[0])
}

beforeEach(() => {
  stubWordBankLayout()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('drag a placed word (US1)', () => {
  it('moves the word to where it is dropped, and Check grades the shown order', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    dragTo(placedTile('wawa'), 300, 24)
    expect(lineWords()).toEqual(['kulupu', 'sina', 'wawa'])
    fireEvent.click(screen.getByRole('button', { name: 'Check' }))
    expect(onSubmit).toHaveBeenCalledWith(['kulupu', 'sina', 'wawa'])
  })

  it('shows the landing spot and a ghost while dragging, and neither after the drop', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    const tile = placedTile('wawa')
    const start = centre(tile)
    fireEvent.pointerDown(tile, { pointerId: 1, clientX: start.x, clientY: start.y })
    fireEvent.pointerMove(tile, { pointerId: 1, clientX: 300, clientY: 24 })
    expect(lineWords()).toEqual(['kulupu', 'sina', 'wawa']) // preview: the slot at the end
    expect(screen.getByTestId('drag-ghost')).toHaveTextContent('wawa')
    fireEvent.pointerUp(tile, { pointerId: 1, clientX: 300, clientY: 24 })
    expect(screen.queryByTestId('drag-ghost')).not.toBeInTheDocument()
  })

  it('a tap, even a shaky one under 6 px, still removes the word (SC-002)', () => {
    renderBank()
    placeWords('wawa', 'kulupu')
    tap(placedTile('wawa'), 4)
    expect(lineWords()).toEqual(['kulupu'])
    expect(bank().getByRole('button', { name: 'wawa' })).toBeInTheDocument()
  })

  it('dropped on the word bank, the word goes back to the bank (FR-004)', () => {
    renderBank()
    placeWords('wawa', 'kulupu')
    dragTo(placedTile('wawa'), 100, 250)
    expect(lineWords()).toEqual(['kulupu'])
    expect(bank().getByRole('button', { name: 'wawa' })).toBeInTheDocument()
  })

  it('dropped on its own spot, nothing changes and the word stays placed', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    dragTo(placedTile('kulupu'), 140, 24)
    expect(lineWords()).toEqual(['wawa', 'kulupu', 'sina'])
  })

  it('dropped outside both groups, the word lands at the last spot shown', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    const tile = placedTile('sina')
    const start = centre(tile)
    fireEvent.pointerDown(tile, { pointerId: 1, clientX: start.x, clientY: start.y })
    fireEvent.pointerMove(tile, { pointerId: 1, clientX: 10, clientY: 24 })
    fireEvent.pointerMove(tile, { pointerId: 1, clientX: 10, clientY: -100 })
    fireEvent.pointerUp(tile, { pointerId: 1, clientX: 10, clientY: -100 })
    expect(lineWords()).toEqual(['sina', 'wawa', 'kulupu'])
  })

  it('a cancelled drag changes nothing', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    dragTo(placedTile('wawa'), 300, 24, { cancel: true })
    expect(lineWords()).toEqual(['wawa', 'kulupu', 'sina'])
    expect(screen.queryByTestId('drag-ghost')).not.toBeInTheDocument()
  })

  it('after a drop that removes the button, the next tap is not swallowed (research R2)', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    dragTo(placedTile('wawa'), 100, 250, { click: false }) // the button unmounts: no click arrives
    tap(placedTile('kulupu'))
    expect(lineWords()).toEqual(['sina'])
  })

  it('after a cancelled drag, a keyboard click (no press first) still removes the word', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    dragTo(placedTile('wawa'), 300, 24, { cancel: true })
    fireEvent.click(placedTile('kulupu')) // detail 0: keyboard Enter / Space
    expect(lineWords()).toEqual(['wawa', 'sina'])
  })

  it('a keyboard click right after a drop is never swallowed', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    dragTo(placedTile('wawa'), 300, 24, { click: false })
    fireEvent.click(placedTile('kulupu'))
    expect(lineWords()).toEqual(['sina', 'wawa'])
  })

  it('a second pointer pressing another tile mid-drag is ignored', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    const tile = placedTile('wawa')
    const start = centre(tile)
    fireEvent.pointerDown(tile, { pointerId: 1, clientX: start.x, clientY: start.y })
    fireEvent.pointerMove(tile, { pointerId: 1, clientX: 300, clientY: 24 })
    const other = placedTile('kulupu')
    fireEvent.pointerDown(other, { pointerId: 2, clientX: 40, clientY: 24 })
    fireEvent.pointerMove(other, { pointerId: 2, clientX: 300, clientY: 82 })
    fireEvent.pointerUp(other, { pointerId: 2, clientX: 300, clientY: 82 })
    fireEvent.pointerUp(tile, { pointerId: 1, clientX: 300, clientY: 24 })
    expect(lineWords()).toEqual(['kulupu', 'sina', 'wawa'])
  })

  it('moving one of two repeated words never moves the other', () => {
    renderBank()
    placeWords('li', 'li', 'kulupu')
    const [first, second] = line().getAllByRole('button', { name: 'li' })
    dragTo(second, 300, 24)
    const buttons = line().getAllByRole('button')
    expect(buttons.map((b) => b.textContent)).toEqual(['li', 'kulupu', 'li'])
    expect(buttons[0]).toBe(first)
    expect(buttons[2]).toBe(second)
  })

  it('a word on the second row can be dragged to the start of the first (US1-4)', () => {
    renderBank()
    placeWords('wawa', 'kulupu', 'sina', 'li', 'li')
    const last = line().getAllByRole('button')[4]
    expect(centre(last).y).toBe(82) // second row
    dragTo(last, 5, 24)
    expect(lineWords()).toEqual(['li', 'wawa', 'kulupu', 'sina', 'li'])
    expect(line().getAllByRole('button')[0]).toBe(last)
  })

  it('after Check nothing can be dragged or tapped away (FR-008)', () => {
    const { rerender } = renderBank()
    placeWords('wawa', 'kulupu')
    rerender(<WordBank header={null} exercise={fixture} disabled onSubmit={onSubmit} />)
    dragTo(placedTile('wawa'), 300, 24)
    tap(placedTile('kulupu'))
    expect(lineWords()).toEqual(['wawa', 'kulupu'])
  })
})
