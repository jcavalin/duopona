import { Link } from 'react-router'
import { lessons } from '../content/lessons'
import styles from './LessonList.module.css'

export default function LessonList() {
  return (
    <div>
      <h1>Duopona</h1>
      <ul className={styles.list}>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link className={styles.card} to={`/lesson/${lesson.id}`}>
              <span className={styles.title}>{lesson.title}</span>
              <span className={styles.meta}>{lesson.exercises.length} exercises</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
