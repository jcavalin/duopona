import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('reorder without dragging (US2)', () => {
  it('ArrowRight / ArrowLeft move the focused placed word and keep focus on it', async () => {
    const user = userEvent.setup()
    renderBank()
    placeWords('wawa', 'kulupu', 'sina')
    placedTile('wawa').focus()
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(lineWords()).toEqual(['kulupu', 'sina', 'wawa'])
    expect(placedTile('wawa')).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(lineWords()).toEqual(['kulupu', 'wawa', 'sina'])
    expect(placedTile('wawa')).toHaveFocus()
  })

  it('does nothing at the ends', async () => {
    const user = userEvent.setup()
    renderBank()
    placeWords('wawa', 'kulupu')
    placedTile('wawa').focus()
    await user.keyboard('{ArrowLeft}')
    placedTile('kulupu').focus()
    await user.keyboard('{ArrowRight}')
    expect(lineWords()).toEqual(['wawa', 'kulupu'])
  })

  it('Enter on a focused placed word still removes it', async () => {
    const user = userEvent.setup()
    renderBank()
    placeWords('wawa', 'kulupu')
    placedTile('wawa').focus()
    await user.keyboard('{Enter}')
    expect(lineWords()).toEqual(['kulupu'])
  })

  it('placed words are named by the word and described by the hint (FR-006)', () => {
    renderBank()
    placeWords('wawa')
    expect(placedTile('wawa')).toHaveAccessibleName('wawa')
    expect(placedTile('wawa')).toHaveAccessibleDescription(
      'Press to remove. Drag or use the left and right arrow keys to move.',
    )
  })

  it('after Check the arrow keys change nothing', async () => {
    const user = userEvent.setup()
    const { rerender } = renderBank()
    placeWords('wawa', 'kulupu')
    rerender(<WordBank header={null} exercise={fixture} disabled onSubmit={onSubmit} />)
    fireEvent.keyDown(placedTile('wawa'), { key: 'ArrowRight' })
    await user.keyboard('{ArrowRight}')
    expect(lineWords()).toEqual(['wawa', 'kulupu'])
  })
})

describe('drop a bank word into a chosen spot (US3)', () => {
  const bankTile = (word: string) => bank().getByRole('button', { name: word })

  it('a bank word dragged between two placed words lands there; its bank place shows empty', () => {
    renderBank()
    placeWords('kulupu', 'wawa')
    dragTo(bankTile('sina'), 100, 24) // right of kulupu's centre, left of wawa's
    expect(lineWords()).toEqual(['kulupu', 'sina', 'wawa'])
    expect(bank().queryByRole('button', { name: 'sina' })).not.toBeInTheDocument()
  })

  it('shows a slot in the line while over it, and none once it leaves', () => {
    renderBank()
    placeWords('kulupu', 'wawa')
    const tile = bankTile('sina')
    const start = centre(tile)
    fireEvent.pointerDown(tile, { pointerId: 1, clientX: start.x, clientY: start.y })
    fireEvent.pointerMove(tile, { pointerId: 1, clientX: 100, clientY: 24 })
    const line = screen.getByRole('group', { name: 'Your answer' })
    expect(line.children).toHaveLength(3) // kulupu, slot, wawa
    expect(lineWords()).toEqual(['kulupu', 'wawa']) // the slot is not a button
    fireEvent.pointerMove(tile, { pointerId: 1, clientX: 100, clientY: -100 })
    expect(line.children).toHaveLength(2)
    fireEvent.pointerUp(tile, { pointerId: 1, clientX: 100, clientY: -100 })
    expect(lineWords()).toEqual(['kulupu', 'wawa'])
    expect(bankTile('sina')).toBeInTheDocument()
  })

  it('dropped outside the line, the word stays in the bank', () => {
    renderBank()
    placeWords('kulupu')
    dragTo(bankTile('sina'), 100, -100)
    expect(lineWords()).toEqual(['kulupu'])
    expect(bankTile('sina')).toBeInTheDocument()
  })

  it('a bank tap, even a shaky one, still adds the word at the end (SC-002a)', () => {
    renderBank()
    placeWords('kulupu')
    tap(bankTile('wawa'), 4)
    expect(lineWords()).toEqual(['kulupu', 'wawa'])
  })

  it('a cancelled bank drag changes nothing', () => {
    renderBank()
    placeWords('kulupu', 'wawa')
    dragTo(bankTile('sina'), 100, 24, { cancel: true })
    expect(lineWords()).toEqual(['kulupu', 'wawa'])
    expect(bankTile('sina')).toBeInTheDocument()
  })

  it('after a drop into the line (no click arrives), the next bank tap adds its word', () => {
    renderBank()
    placeWords('kulupu', 'wawa')
    dragTo(bankTile('sina'), 100, 24, { click: false })
    const next = bank().getAllByRole('button')[0] // one of the two li tiles
    tap(next)
    expect(lineWords()).toEqual(['kulupu', 'sina', 'wawa', 'li'])
  })

  it('after Check, bank words cannot be dragged in', () => {
    const { rerender } = renderBank()
    placeWords('kulupu')
    rerender(<WordBank header={null} exercise={fixture} disabled onSubmit={onSubmit} />)
    dragTo(bankTile('sina'), 100, 24)
    expect(lineWords()).toEqual(['kulupu'])
  })
})

describe('mascot (feature 012)', () => {
  it('shows the idle mascot without a result and the sad one with result="wrong"', () => {
    const { rerender } = renderBank()
    const mascot = () => document.querySelector('img[data-expression]')
    expect(mascot()).toHaveAttribute('data-expression', 'idle')
    rerender(<WordBank header={null} exercise={fixture} disabled result="wrong" onSubmit={onSubmit} />)
    expect(mascot()).toHaveAttribute('data-expression', 'sad')
  })
})
