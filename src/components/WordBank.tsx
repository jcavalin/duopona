import { useState, type ReactNode } from 'react'
import type { WordBankExercise } from '../content/types'
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

export default function WordBank({ header, exercise, disabled, onSubmit }: Props) {
  // Tiles are tracked by index so repeated words stay distinct.
  const [tiles] = useState(() => shuffle([...exercise.answer, ...exercise.distractors]))
  const [placed, setPlaced] = useState<number[]>([])
  const instruction = exercise.direction === 'tp-en' ? 'Write this in English' : 'Write this in Toki Pona'

  const place = (index: number) => setPlaced((p) => [...p, index])
  const remove = (index: number) => setPlaced((p) => p.filter((i) => i !== index))

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
        <div className={styles.answerLine} role="group" aria-label="Your answer">
          {placed.map((index) => (
            <button key={index} type="button" className={styles.tile} disabled={disabled} onClick={() => remove(index)}>
              {tiles[index]}
            </button>
          ))}
        </div>
        <div className={styles.bank} role="group" aria-label="Word bank">
          {tiles.map((word, index) =>
            placed.includes(index) ? (
              <span key={index} className={styles.tilePlaceholder} aria-hidden="true">
                {word}
              </span>
            ) : (
              <button
                key={index}
                type="button"
                className={styles.tile}
                disabled={disabled}
                ref={index === 0 ? focusOnMount : undefined} // keyboard users land on the new exercise
                onClick={() => place(index)}
              >
                {word}
              </button>
            ),
          )}
        </div>
      </div>
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
