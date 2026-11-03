import { sourceLabel } from '../content/lessons'
import type { Lesson } from '../content/types'
import { getMeaning } from '../content/vocabulary'
import { CloseIcon } from './icons'
import styles from './LessonIntro.module.css'

interface Props {
  lesson: Lesson
  onStart: () => void
  onBack: () => void
}

/** Shown before the exercises: new words with meanings and the grammar point (FR-013 of 002; mockup 02). */
export default function LessonIntro({ lesson, onStart, onBack }: Props) {
  return (
    <div className="screen">
      <div className="screen-body">
        <button type="button" className="icon-button" aria-label="Back to lessons" onClick={onBack}>
          <CloseIcon size={28} />
        </button>
        <p className={`label ${styles.overline}`}>
          {sourceLabel(lesson)} · {lesson.exercises.length} exercises
        </p>
        <h1 className={styles.title}>{lesson.title}</h1>

        <section aria-labelledby="new-words">
          <h2 id="new-words" className={styles.heading}>
            New words
          </h2>
          <dl className={styles.words}>
            {lesson.newWords.map((word) => (
              <div key={word} className={styles.word}>
                <dt>{word}</dt>
                <dd>{getMeaning(word)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="grammar" className={styles.grammar}>
          <h2 id="grammar">{lesson.grammar.title}</h2>
          {lesson.grammar.explanation.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      </div>

      <div className="bottom-bar">
        {/* No autoFocus: it would scroll the page past the title and new words on phones */}
        <button type="button" className="primary-button" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  )
}
