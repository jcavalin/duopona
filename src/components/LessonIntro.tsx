import type { Lesson } from '../content/types'
import { getMeaning } from '../content/vocabulary'
import styles from './LessonIntro.module.css'

interface Props {
  lesson: Lesson
  onStart: () => void
  onBack: () => void
}

/** Shown before the exercises: new words with meanings and the grammar point (FR-013). */
export default function LessonIntro({ lesson, onStart, onBack }: Props) {
  return (
    <div className={styles.intro}>
      <button type="button" className={styles.back} onClick={onBack}>
        Back
      </button>
      <h1 className={styles.title}>{lesson.title}</h1>
      <p className={styles.chapter}>Book: {lesson.chapter}</p>

      <section aria-labelledby="new-words">
        <h2 id="new-words">New words</h2>
        <dl className={styles.words}>
          {lesson.newWords.map((word) => (
            <div key={word} className={styles.word}>
              <dt>{word}</dt>
              <dd>{getMeaning(word)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="grammar">
        <h2 id="grammar">{lesson.grammar.title}</h2>
        {lesson.grammar.explanation.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {/* No autoFocus: it would scroll the page past the title and new words on phones */}
      <button type="button" className="primary-button" onClick={onStart}>
        Start
      </button>
    </div>
  )
}
