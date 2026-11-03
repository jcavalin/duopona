import { useState } from 'react'
import type { WordBankExercise } from '../content/types'
import { shuffle } from '../lib/shuffle'
import styles from './Exercise.module.css'

interface Props {
  exercise: WordBankExercise
  disabled: boolean
  onSubmit: (answer: string[]) => void
}

export default function WordBank({ exercise, disabled, onSubmit }: Props) {
  // Tiles are tracked by index so repeated words stay distinct.
  const [tiles] = useState(() => shuffle([...exercise.answer, ...exercise.distractors]))
  const [placed, setPlaced] = useState<number[]>([])

  const place = (index: number) => setPlaced((p) => [...p, index])
  const remove = (index: number) => setPlaced((p) => p.filter((i) => i !== index))

  return (
    <div>
      <p className={styles.instruction}>Translate this sentence</p>
      <p className={styles.prompt}>{exercise.prompt}</p>
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
            <button key={index} type="button" className={styles.tile} disabled={disabled} onClick={() => place(index)}>
              {word}
            </button>
          ),
        )}
      </div>
      {!disabled && (
        <button type="button" className="primary-button" disabled={placed.length === 0} onClick={() => onSubmit(placed.map((i) => tiles[i]))}>
          Check
        </button>
      )}
    </div>
  )
}
