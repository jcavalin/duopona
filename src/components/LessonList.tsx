import { Link } from 'react-router'
import { lessons, sourceLabel } from '../content/lessons'
import { useAppSelector } from '../store/hooks'
import { selectIsUnlocked } from '../store/progressSlice'
import styles from './LessonList.module.css'

export default function LessonList() {
  const progress = useAppSelector((state) => state.progress)
  const completed = progress.completedLessons

  return (
    <div>
      <h1>Duopona</h1>
      <ul className={styles.list}>
        {lessons.map((lesson, index) => {
          const result = completed[lesson.id]
          const unlocked = selectIsUnlocked(lesson.id)({ progress })
          const content = (
            <>
              <span className={styles.number}>Lesson {index + 1}</span>
              <span className={styles.title}>{lesson.title}</span>
              <span className={styles.meta}>
                {sourceLabel(lesson)} · {lesson.exercises.length} exercises
              </span>
              {result && (
                <span className={styles.badge}>
                  Completed · {result.firstTryCorrect}/{result.total}
                </span>
              )}
              {!unlocked && (
                <span className={styles.lockedNote}>
                  <strong>Locked</strong> · Complete the previous lesson to unlock
                </span>
              )}
            </>
          )
          return (
            <li key={lesson.id}>
              {unlocked ? (
                <Link className={result ? `${styles.card} ${styles.done}` : styles.card} to={`/lesson/${lesson.id}`}>
                  {content}
                </Link>
              ) : (
                <div className={`${styles.card} ${styles.locked}`} role="link" aria-disabled="true">
                  {content}
                </div>
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
