import { useStrings } from '../i18n/useStrings'
import { FlameIcon } from './icons'
import Mascot from './Mascot'
import { focusOnMount } from './focusOnMount'
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
  /** Set only on the summary of the session that met today's daily goal (007 contract U3) */
  streak?: number
  onContinue: () => void
  onReplay: () => void
}

/** Lesson or practice complete (mockup 07, contract S5). */
export default function LessonSummary({
  heading,
  replayLabel,
  subtitle,
  nextLessonTitle,
  firstTryCorrect,
  total,
  streak,
  onContinue,
  onReplay,
}: Props) {
  const s = useStrings()
  return (
    <div className="screen">
      <div className={`screen-body ${styles.summary}`}>
        <Mascot expression="celebrate" className={styles.summaryMascot} />
        <h1 className={styles.summaryTitle}>{heading ?? s.lessonComplete}</h1>
        <p className={styles.summaryLesson}>{subtitle}</p>
        {streak !== undefined && <p className={styles.goalMet}>{s.dailyGoalMet}</p>}
        <div className={styles.stats}>
          <div className={`${styles.stat} ${styles.statCorrect}`}>
            <p className={`label ${styles.statLabel}`}>{s.statCorrect}</p>
            <p className={styles.statValue}>
              {firstTryCorrect} / {total}
            </p>
          </div>
          {nextLessonTitle && (
            <div className={`${styles.stat} ${styles.statUnlocked}`}>
              <p className={`label ${styles.statLabel}`}>{s.statUnlocked}</p>
              <p className={`${styles.statValue} ${styles.statNext}`}>{nextLessonTitle}</p>
            </div>
          )}
          {streak !== undefined && (
            <div className={`${styles.stat} ${styles.statStreak}`}>
              <p className={`label ${styles.statLabel}`}>{s.statStreak}</p>
              <p className={styles.statValue}>
                <FlameIcon size={26} />
                {s.dayCount(streak)}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="bottom-bar">
        <button type="button" className="primary-button" onClick={onContinue} ref={focusOnMount}>
          {s.continue}
        </button>
        <button type="button" className="text-button" onClick={onReplay}>
          {replayLabel ?? s.replayLesson}
        </button>
      </div>
    </div>
  )
}
