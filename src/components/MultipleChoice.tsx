import { useState } from 'react'
import type { MultipleChoiceExercise } from '../content/types'
import { shuffle } from '../lib/shuffle'
import styles from './Exercise.module.css'

interface Props {
  exercise: MultipleChoiceExercise
  disabled: boolean
  onSubmit: (answer: string) => void
}

export default function MultipleChoice({ exercise, disabled, onSubmit }: Props) {
  const [options] = useState(() => shuffle(exercise.options))
  const [selected, setSelected] = useState<string | null>(null)
  const instruction = exercise.direction === 'tp-en' ? 'Select the correct meaning' : 'Select the Toki Pona word'

  return (
    <div>
      <p className={styles.instruction}>{instruction}</p>
      <p className={styles.prompt}>{exercise.prompt}</p>
      <div className={styles.options} role="group" aria-label="Options">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={styles.option}
            aria-pressed={selected === option}
            disabled={disabled}
            onClick={() => setSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {!disabled && (
        <button type="button" className="primary-button" disabled={selected === null} onClick={() => selected && onSubmit(selected)}>
          Check
        </button>
      )}
    </div>
  )
}
