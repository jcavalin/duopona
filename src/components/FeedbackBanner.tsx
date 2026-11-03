import type { Feedback } from '../store/sessionSlice'
import { CheckIcon, WrongIcon } from './icons'
import styles from './Exercise.module.css'

interface Props {
  feedback: Feedback
  onContinue: () => void
}

/** Bottom sheet that replaces the Check bar after an answer (mockups 04 and 06, research R9). */
export default function FeedbackBanner({ feedback, onContinue }: Props) {
  const { correct } = feedback
  return (
    <div className={`bottom-bar ${styles.sheet} ${correct ? styles.sheetCorrect : styles.sheetWrong}`}>
      <div className={styles.sheetRow}>
        <span className={styles.sheetIcon} aria-hidden="true">
          {correct ? <CheckIcon size={30} /> : <WrongIcon size={30} />}
        </span>
        <p role="status" className={styles.sheetText}>
          {correct ? (
            <span className={styles.sheetTitle}>
              <strong>pona!</strong> Correct.
            </span>
          ) : (
            <>
              <span className={styles.sheetTitle}>
                Not quite<span className="visually-hidden">.</span>
              </span>{' '}
              <span className={styles.sheetLabel}>Correct answer:</span>{' '}
              <span className={styles.sheetAnswer}>{feedback.correctAnswer}</span>
            </>
          )}
        </p>
      </div>
      <button type="button" className={`primary-button${correct ? '' : ' danger'}`} onClick={onContinue} autoFocus>
        Continue
      </button>
    </div>
  )
}
