import { useEffect, useRef, type CSSProperties } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { courses } from '../content/lessons'
import { useLanguage, useStrings } from '../i18n/useStrings'
import { DAILY_GOAL, today } from '../lib/days'
import { useAppSelector } from '../store/hooks'
import { selectCanPractice, selectIsUnlocked } from '../store/progressSlice'
import { selectBestStreak, selectMetToday, selectStreak } from '../store/streakSlice'
import { selectCanReview } from '../store/wordsSlice'
import { BubbleIcon, CheckIcon, FlameIcon, GearIcon, LockIcon, StarIcon } from './icons'
import styles from './LessonList.module.css'

/** Horizontal node offsets (× 44px) that make the path zigzag (research R7) */
const OFFSETS = [0, 1, 2, 1, 0, -1, -2, -1]

/** Home screen: the course as a path of lesson nodes (mockup 01, contract S1). */
export default function LessonList() {
  const s = useStrings()
  const lessons = courses[useLanguage()]
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
  const hint = !canPractice ? s.hintFinishLesson : !canReview ? s.hintNoWeakWords : undefined

  useEffect(() => {
    currentRef.current?.scrollIntoView?.({ block: 'center' })
  }, [])

  // Focus returns to the gear when the settings close (014 contract ui-settings.md)
  const settingsRef = useRef<HTMLAnchorElement>(null)
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  useEffect(() => {
    if (previousPath.current === '/settings' && pathname === '/') settingsRef.current?.focus()
    previousPath.current = pathname
  }, [pathname])

  return (
    <div>
      <header className={styles.topBar}>
        <h1 className={styles.wordmark}>{s.wordmark}</h1>
        <div className={styles.counters}>
          <p
            className={`${styles.counter} ${metToday ? styles.streakMet : styles.streakIdle}`}
            aria-label={s.streakLabel(streak, metToday)}
          >
            <FlameIcon size={26} />
            {streak}
          </p>
          <p className={styles.counter} aria-label={s.lessonsDoneLabel(doneCount, lessons.length)}>
            <BubbleIcon size={26} />
            {doneCount} / {lessons.length}
          </p>
          <Link
            ref={settingsRef}
            to="/settings"
            preventScrollReset
            className={`icon-button ${styles.settings}`}
            aria-label={s.settings}
          >
            <GearIcon size={26} />
          </Link>
        </div>
      </header>

      <div className={styles.banner}>
        <p className="label">{s.courseProgress(doneCount, lessons.length)}</p>
        <p className={styles.bannerTitle}>{s.bannerTitle}</p>
        <p className={styles.bannerText}>
          {s.bannerFollowing} <cite>{s.bookTitle}</cite>
        </p>
      </div>

      {/* Daily goal (007 contract U2) */}
      <div className={styles.goal}>
        <p className={`label ${styles.goalLabel}`}>{s.dailyGoal}</p>
        <p className={styles.goalText}>{s.sessionsToday(doneToday, DAILY_GOAL)}</p>
        <div
          className={styles.goalTrack}
          role="progressbar"
          aria-label={s.dailyGoal}
          aria-valuemin={0}
          aria-valuemax={DAILY_GOAL}
          aria-valuenow={doneToday}
        >
          <div className={styles.goalFill} style={{ width: `${(doneToday / DAILY_GOAL) * 100}%` }} />
        </div>
        {best >= 1 && (
          <p className={styles.goalBest}>{s.bestStreak(best)}</p>
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
            {s.practice}
          </button>
          <button
            type="button"
            className={`primary-button ${styles.outline}`}
            aria-disabled={!canReview || undefined}
            aria-describedby={canReview ? undefined : 'practice-hint'}
            onClick={() => canReview && navigate('/practice/review')}
          >
            {s.reviewWeakWords}
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
              {state === 'current' && <span className={`label ${styles.startPill}`}>{s.startPill}</span>}
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
                <div className={styles.nodeLink} role="link" aria-disabled="true" aria-label={s.lessonLocked(lesson.title)}>
                  {node}
                </div>
              ) : (
                <Link
                  ref={state === 'current' ? currentRef : undefined}
                  className={styles.nodeLink}
                  to={`/lesson/${lesson.id}`}
                  aria-label={
                    result
                      ? s.lessonCompleted(lesson.title, result.firstTryCorrect, result.total)
                      : s.lessonStart(lesson.title)
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
        {s.footerBasedOn} <cite>{s.bookTitle}</cite> {s.footerBy} ·{' '}
        <a className={styles.footerLink} href="https://tokipona.org" target="_blank" rel="noopener">
          tokipona.org
        </a>
      </footer>
    </div>
  )
}
