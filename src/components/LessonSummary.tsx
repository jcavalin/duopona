import { StarIcon } from './icons'
import styles from './Exercise.module.css'

interface Props {
  /** Defaults to the lesson texts; practice passes its own (006 contract S5) */
  heading?: string
  replayLabel?: string
  /** Lesson title, or the practice kind */
  subtitle: string
  /** Title of the lesson after this one; absent for the last lesson */
  nextLessonTitle?: string
  firstTryCorrect: number
  total: number
  onContinue: () => void
  onReplay: () => void
}

/** Lesson or practice complete (mockup 07, contract S5). */
export default function LessonSummary({
  heading = 'Lesson complete!',
  replayLabel = 'Replay lesson',
  subtitle,
  nextLessonTitle,
  firstTryCorrect,
  total,
  onContinue,
  onReplay,
}: Props) {
  return (
    <div className="screen">
      <div className={`screen-body ${styles.summary}`}>
        <div className={styles.badge} aria-hidden="true">
          <span className={styles.badgeCoin}>
            <StarIcon size={44} />
          </span>
        </div>
        <h1 className={styles.summaryTitle}>{heading}</h1>
        <p className={styles.summaryLesson}>{subtitle}</p>
        <div className={styles.stats}>
          <div className={`${styles.stat} ${styles.statCorrect}`}>
            <p className={`label ${styles.statLabel}`}>Correct</p>
            <p className={styles.statValue}>
              {firstTryCorrect} / {total}
            </p>
          </div>
          {nextLessonTitle && (
            <div className={`${styles.stat} ${styles.statUnlocked}`}>
              <p className={`label ${styles.statLabel}`}>Unlocked</p>
              <p className={`${styles.statValue} ${styles.statNext}`}>{nextLessonTitle}</p>
            </div>
          )}
        </div>
      </div>
      <div className="bottom-bar">
        <button type="button" className="primary-button" onClick={onContinue} autoFocus>
          Continue
        </button>
        <button type="button" className="text-button" onClick={onReplay}>
          {replayLabel}
        </button>
      </div>
    </div>
  )
}
