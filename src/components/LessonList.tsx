import { useEffect, useRef, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router'
import { lessons } from '../content/lessons'
import { DAILY_GOAL, today } from '../lib/days'
import { useAppSelector } from '../store/hooks'
import { selectCanPractice, selectIsUnlocked } from '../store/progressSlice'
import { selectBestStreak, selectMetToday, selectStreak } from '../store/streakSlice'
import { selectCanReview } from '../store/wordsSlice'
import { BubbleIcon, CheckIcon, FlameIcon, LockIcon, StarIcon } from './icons'
import styles from './LessonList.module.css'

/** Horizontal node offsets (× 44px) that make the path zigzag (research R7) */
const OFFSETS = [0, 1, 2, 1, 0, -1, -2, -1]

/** Home screen: the course as a path of lesson nodes (mockup 01, contract S1). */
export default function LessonList() {
  const progress = useAppSelector((state) => state.progress)
  const completed = progress.completedLessons
  // Only count lessons that exist in the course (research R11)
  const doneCount = lessons.filter((lesson) => Object.hasOwn(completed, lesson.id)).length
  const currentRef = useRef<HTMLAnchorElement>(null)
  const navigate = useNavigate()
  const canPractice = useAppSelector(selectCanPractice)
  const canReview = useAppSelector(selectCanReview)
  // Read at render; the home screen re-renders after every session (007 research R7)
  const day = today()
  const streak = useAppSelector(selectStreak(day))
  const metToday = useAppSelector(selectMetToday(day))
  const best = useAppSelector(selectBestStreak)
  const doneToday = metToday ? 1 : 0
  const hint = !canPractice
    ? 'Finish a lesson to unlock practice.'
    : !canReview
      ? 'No weak words yet.'
      : undefined

  useEffect(() => {
    currentRef.current?.scrollIntoView?.({ block: 'center' })
  }, [])

  return (
    <div>
      <header className={styles.topBar}>
        <h1 className={styles.wordmark}>duopona</h1>
        <div className={styles.counters}>
          <p
            className={`${styles.counter} ${metToday ? styles.streakMet : styles.streakIdle}`}
            aria-label={`${streak} day streak, ${metToday ? 'practised today' : 'not practised today'}`}
          >
            <FlameIcon size={26} />
            {streak}
          </p>
          <p className={styles.counter} aria-label={`${doneCount} of ${lessons.length} lessons done`}>
            <BubbleIcon size={26} />
            {doneCount} / {lessons.length}
          </p>
        </div>
      </header>

      <div className={styles.banner}>
        <p className="label">
          Course · {doneCount} of {lessons.length} done
        </p>
        <p className={styles.bannerTitle}>Learn Toki Pona</p>
        <p className={styles.bannerText}>
          Following <cite>Toki Pona: The Language of Good</cite>
        </p>
      </div>

      {/* Daily goal (007 contract U2) */}
      <div className={styles.goal}>
        <p className={`label ${styles.goalLabel}`}>Daily goal</p>
        <p className={styles.goalText}>
          {doneToday} / {DAILY_GOAL} session today
        </p>
        <div
          className={styles.goalTrack}
          role="progressbar"
          aria-label="Daily goal"
          aria-valuemin={0}
          aria-valuemax={DAILY_GOAL}
          aria-valuenow={doneToday}
        >
          <div className={styles.goalFill} style={{ width: `${(doneToday / DAILY_GOAL) * 100}%` }} />
        </div>
        {best >= 1 && (
          <p className={styles.goalBest}>
            Best streak: {best} {best === 1 ? 'day' : 'days'}
          </p>
        )}
      </div>

      {/* Practice row (006 contract S1): unavailable buttons stay focusable and point to the hint */}
      <div className={styles.practice}>
        <div className={styles.practiceRow}>
          <button
            type="button"
            className="primary-button"
            aria-disabled={!canPractice || undefined}
            aria-describedby={canPractice ? undefined : 'practice-hint'}
            onClick={() => canPractice && navigate('/practice/practice')}
          >
            Practice
          </button>
          <button
            type="button"
            className={`primary-button ${styles.outline}`}
            aria-disabled={!canReview || undefined}
            aria-describedby={canReview ? undefined : 'practice-hint'}
            onClick={() => canReview && navigate('/practice/review')}
          >
            Review weak words
          </button>
        </div>
        {hint && (
          <p id="practice-hint" className={styles.practiceHint}>
            {hint}
          </p>
        )}
      </div>

      <ul className={styles.path}>
        {lessons.map((lesson, index) => {
          const result = completed[lesson.id]
          const state = result ? 'completed' : selectIsUnlocked(lesson.id)({ progress }) ? 'current' : 'locked'
          const style = { '--offset': OFFSETS[index % OFFSETS.length] } as CSSProperties
          const node = (
            <>
              {state === 'current' && <span className={`label ${styles.startPill}`}>Start</span>}
              <span className={`${styles.node} ${styles[state]}`}>
                {state === 'completed' && <CheckIcon size={34} />}
                {state === 'current' && <StarIcon size={34} />}
                {state === 'locked' && <LockIcon size={30} />}
              </span>
              <span className={styles.title}>{lesson.title}</span>
            </>
          )
          return (
            <li key={lesson.id} className={styles.item} style={style}>
              {state === 'locked' ? (
                <div className={styles.nodeLink} role="link" aria-disabled="true" aria-label={`${lesson.title}, locked`}>
                  {node}
                </div>
              ) : (
                <Link
                  ref={state === 'current' ? currentRef : undefined}
                  className={styles.nodeLink}
                  to={`/lesson/${lesson.id}`}
                  aria-label={
                    result
                      ? `${lesson.title}, completed, ${result.firstTryCorrect} of ${result.total}`
                      : `${lesson.title}, start`
                  }
                >
                  {node}
                </Link>
              )}
            </li>
          )
        })}
      </ul>

      <footer className={styles.footer}>
        Course based on <cite>Toki Pona: The Language of Good</cite> by Sonja Lang ·{' '}
        <a className={styles.footerLink} href="https://tokipona.org" target="_blank" rel="noopener">
          tokipona.org
        </a>
      </footer>
    </div>
  )
}
