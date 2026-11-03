import styles from './Exercise.module.css'

interface Props {
  firstTryCorrect: number
  total: number
  onBack: () => void
}

export default function LessonSummary({ firstTryCorrect, total, onBack }: Props) {
  return (
    <div className={styles.summary}>
      <h1>Lesson complete!</h1>
      <p>
        You got {firstTryCorrect} of {total} right on the first try.
      </p>
      <button type="button" className="primary-button" onClick={onBack} autoFocus>
        Back to lessons
      </button>
    </div>
  )
}
