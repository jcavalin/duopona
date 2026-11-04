import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import type { WordBankExercise } from '../content/types'
import { dropIndex } from '../lib/reorder'
import { shuffle } from '../lib/shuffle'
import { BubbleIcon } from './icons'
import { focusOnMount } from './focusOnMount'
import styles from './Exercise.module.css'

interface Props {
  header: ReactNode
  exercise: WordBankExercise
  disabled: boolean
  onSubmit: (answer: string[]) => void
}

/** Pointer travel (px) before a press becomes a drag instead of a tap (009 research R2) */
const DRAG_THRESHOLD = 6
/** How far below the answer line a drop still lands in it, and above the bank a drop still reaches it.
 * Together less than the line's 28 px bottom margin, so the two never overlap (009 research R5). */
const LINE_REACH = 16
const BANK_REACH = 8

type Source = 'line' | 'bank'

/** A press that may become a drag */
interface Press {
  tile: number
  from: Source
  pointerId: number
  startX: number
  startY: number
  /** Where the tile was grabbed, relative to its top-left corner */
  offsetX: number
  offsetY: number
  width: number
  dragging: boolean
}

/** A running drag (009 data-model) */
interface Drag {
  tile: number
  from: Source
  /** Preview position among the other placed tiles; null = not in the answer line */
  index: number | null
  /** Ghost's top-left corner */
  x: number
  y: number
  width: number
}

/** The answer line as shown while dragging: the dragged tile at its preview position */
function previewOrder(placed: number[], drag: Drag | null): number[] {
  if (!drag) return placed
  const others = placed.filter((i) => i !== drag.tile)
  if (drag.index === null) return others
  return [...others.slice(0, drag.index), drag.tile, ...others.slice(drag.index)]
}

function within(el: Element | null, x: number, y: number, reachUp: number, reachDown: number) {
  if (!el) return false
  const r = el.getBoundingClientRect()
  return x >= r.left && x <= r.left + r.width && y >= r.top - reachUp && y <= r.bottom + reachDown
}

export default function WordBank({ header, exercise, disabled, onSubmit }: Props) {
  // Tiles are tracked by index so repeated words stay distinct.
  const [tiles] = useState(() => shuffle([...exercise.answer, ...exercise.distractors]))
  const [placed, setPlaced] = useState<number[]>([])
  const [drag, setDragState] = useState<Drag | null>(null)
  // Mirrors `drag` for handlers that may run before React re-renders
  const dragRef = useRef<Drag | null>(null)
  const press = useRef<Press | null>(null)
  const suppressClick = useRef(false)
  const lineRef = useRef<HTMLDivElement>(null)
  const bankRef = useRef<HTMLDivElement>(null)
  const placedRefs = useRef(new Map<number, HTMLButtonElement>())
  const instruction = exercise.direction === 'tp-en' ? 'Write this in English' : 'Write this in Toki Pona'

  // Latest committed order, for the window listeners below
  const placedRef = useRef(placed)
  useLayoutEffect(() => {
    placedRef.current = placed
  }, [placed])

  const setDrag = (d: Drag | null) => {
    dragRef.current = d
    setDragState(d)
  }
  const place = (index: number) => setPlaced((p) => [...p, index])
  const remove = (index: number) => setPlaced((p) => p.filter((i) => i !== index))

  /**
   * A tap on a tile, unless it is the click that ends a drag (research R2). Keyboard clicks
   * (`detail === 0`) never end a drag, so they always count.
   */
  const onTileClick = (event: MouseEvent<HTMLButtonElement>, action: () => void) => {
    const afterDrag = suppressClick.current && event.detail !== 0
    suppressClick.current = false
    if (!afterDrag && !disabled) action()
  }

  const onPointerDown = (tile: number, from: Source, event: PointerEvent<HTMLButtonElement>) => {
    // A drop that unmounts the pressed button gets no click, so the flag must not outlive its press.
    suppressClick.current = false
    if (disabled || press.current || (event.pointerType === 'mouse' && event.button !== 0)) return
    const rect = event.currentTarget.getBoundingClientRect()
    press.current = {
      tile,
      from,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      dragging: false,
    }
  }

  // While a press lasts, its moves and release are followed on `window`, not on the pressed
  // button: React moves that button in the DOM as the order changes, which releases pointer
  // capture, so the release could land elsewhere (research R4).
  useEffect(() => {
    const onMove = (event: globalThis.PointerEvent) => {
      const p = press.current
      if (!p || p.pointerId !== event.pointerId) return
      const { clientX: x, clientY: y } = event
      if (!p.dragging) {
        if (Math.hypot(x - p.startX, y - p.startY) < DRAG_THRESHOLD) return
        p.dragging = true
      }
      const placedNow = placedRef.current
      const current = dragRef.current
      let index = current ? current.index : p.from === 'line' ? placedNow.indexOf(p.tile) : null
      if (within(lineRef.current, x, y, 0, LINE_REACH)) {
        const others = placedNow.filter((i) => i !== p.tile)
        const rects = others.flatMap((i) => placedRefs.current.get(i)?.getBoundingClientRect() ?? [])
        index = dropIndex(rects, x, y)
      } else if (p.from === 'bank') {
        index = null
      }
      setDrag({ tile: p.tile, from: p.from, index, x: x - p.offsetX, y: y - p.offsetY, width: p.width })
    }

    const endPress = (event: globalThis.PointerEvent) => {
      const p = press.current
      if (!p || p.pointerId !== event.pointerId) return
      press.current = null
      if (!p.dragging) return
      const d = dragRef.current
      setDrag(null)
      if (!d || event.type === 'pointercancel') return
      suppressClick.current = true // the click that follows a drop is not a tap
      // research R6: where a drop goes
      if (d.from === 'line' && within(bankRef.current, event.clientX, event.clientY, BANK_REACH, 0)) {
        setPlaced((list) => list.filter((i) => i !== d.tile))
      } else if (d.index !== null) {
        setPlaced((list) => previewOrder(list, d))
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', endPress)
    window.addEventListener('pointercancel', endPress)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', endPress)
      window.removeEventListener('pointercancel', endPress)
    }
  }, [])

  const pointerHandlers = (tile: number, from: Source) => ({
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => onPointerDown(tile, from, e),
  })

  return (
    <>
      <div className="screen-body">
        {header}
        <div className={styles.titleRow}>
          <h1 className={styles.instruction}>{instruction}</h1>
          {exercise.practisesGrammar && <span className={`label ${styles.grammarTag}`}>Grammar</span>}
        </div>
        <div className={styles.promptRow}>
          <span className={styles.promptIcon} aria-hidden="true">
            <BubbleIcon size={32} />
          </span>
          <h2 className={styles.prompt}>{exercise.prompt}</h2>
        </div>
        <div ref={lineRef} className={styles.answerLine} role="group" aria-label="Your answer">
          {previewOrder(placed, drag).map((index) => (
            <button
              key={index}
              ref={(el) => {
                if (el) placedRefs.current.set(index, el)
                else placedRefs.current.delete(index)
              }}
              type="button"
              className={drag?.tile === index ? `${styles.tile} ${styles.tileSlot}` : styles.tile}
              disabled={disabled}
              onClick={(e) => onTileClick(e, () => remove(index))}
              {...pointerHandlers(index, 'line')}
            >
              {tiles[index]}
            </button>
          ))}
        </div>
        <div ref={bankRef} className={styles.bank} role="group" aria-label="Word bank">
          {tiles.map((word, index) =>
            placed.includes(index) ? (
              <span key={index} className={styles.tilePlaceholder} aria-hidden="true">
                {word}
              </span>
            ) : (
              <button
                key={index}
                ref={index === 0 ? focusOnMount : undefined} // keyboard users land on the new exercise
                type="button"
                className={styles.tile}
                disabled={disabled}
                onClick={() => place(index)}
              >
                {word}
              </button>
            ),
          )}
        </div>
      </div>
      {drag && (
        <span
          className={`${styles.tile} ${styles.tileGhost}`}
          style={{ left: drag.x, top: drag.y, width: drag.width }}
          aria-hidden="true"
          data-testid="drag-ghost"
        >
          {tiles[drag.tile]}
        </span>
      )}
      {!disabled && (
        <div className="bottom-bar">
          <button type="button" className="primary-button" disabled={placed.length === 0} onClick={() => onSubmit(placed.map((i) => tiles[i]))}>
            Check
          </button>
        </div>
      )}
    </>
  )
}
