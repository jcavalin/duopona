import type { Feedback } from '../store/sessionSlice'
import styles from './Exercise.module.css'

interface Props {
  feedback: Feedback
  onContinue: () => void
}

export default function FeedbackBanner({ feedback, onContinue }: Props) {
  return (
    <div className={feedback.correct ? styles.correct : styles.wrong}>
      <p role="status" className={styles.feedbackText}>
        {feedback.correct ? 'Correct!' : `Wrong — correct answer: ${feedback.correctAnswer}`}
      </p>
      <button type="button" className="primary-button" onClick={onContinue} autoFocus>
        Continue
      </button>
    </div>
  )
}
