import { useEffect, useState, type ReactNode } from 'react'
import type { MultipleChoiceExercise } from '../content/types'
import { shuffle } from '../lib/shuffle'
import Mascot, { exerciseExpression } from './Mascot'
import { focusOnMount } from './focusOnMount'
import styles from './Exercise.module.css'

interface Props {
  header: ReactNode
  exercise: MultipleChoiceExercise
  disabled: boolean
  /** Set while feedback shows: colors the chosen option (research R9) */
  result?: 'correct' | 'wrong'
  onSubmit: (answer: string) => void
}

export default function MultipleChoice({ header, exercise, disabled, result, onSubmit }: Props) {
  const [options] = useState(() => shuffle(exercise.options))
  const [selected, setSelected] = useState<string | null>(null)
  const instruction = exercise.direction === 'tp-en' ? 'Choose the meaning' : 'Choose the Toki Pona'

  // Number keys 1–n select the matching option; they never submit (research R5)
  useEffect(() => {
    if (disabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const n = Number(event.key)
      if (Number.isInteger(n) && n >= 1 && n <= options.length) setSelected(options[n - 1])
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [disabled, options])

  return (
    <>
      <div className="screen-body">
        {header}
        <h1 className={styles.instruction}>{instruction}</h1>
        <div className={styles.promptRow}>
          <Mascot expression={exerciseExpression(result)} className={styles.promptMascot} />
          <h2 className={styles.prompt}>{exercise.prompt}</h2>
        </div>
        <div className={styles.options} role="group" aria-label="Options">
          {options.map((option, index) => (
            <button
              key={option}
              type="button"
              className={styles.option}
              aria-pressed={selected === option}
              data-result={selected === option ? result : undefined}
              ref={index === 0 ? focusOnMount : undefined} // keyboard users land on the new exercise
              disabled={disabled}
              onClick={() => setSelected(option)}
            >
              <span className={styles.optionNumber} aria-hidden="true">
                {index + 1}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
      {!disabled && (
        <div className="bottom-bar">
          <button type="button" className="primary-button" disabled={selected === null} onClick={() => selected && onSubmit(selected)}>
            Check
          </button>
        </div>
      )}
    </>
  )
}
