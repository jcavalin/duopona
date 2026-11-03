import { Link } from 'react-router'
import { lessons } from '../content/lessons'
import { useAppSelector } from '../store/hooks'
import styles from './LessonList.module.css'

export default function LessonList() {
  const completed = useAppSelector((state) => state.progress.completedLessons)

  return (
    <div>
      <h1>Duopona</h1>
      <ul className={styles.list}>
        {lessons.map((lesson) => {
          const result = completed[lesson.id]
          return (
            <li key={lesson.id}>
              <Link className={result ? `${styles.card} ${styles.done}` : styles.card} to={`/lesson/${lesson.id}`}>
                <span className={styles.title}>{lesson.title}</span>
                <span className={styles.meta}>{lesson.exercises.length} exercises</span>
                {result && (
                  <span className={styles.badge}>
                    Completed · {result.firstTryCorrect}/{result.total}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
