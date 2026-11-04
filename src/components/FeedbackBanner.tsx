import { explainMistake } from '../content/explanations'
import type { Feedback } from '../store/sessionSlice'
import { CheckIcon, WrongIcon } from './icons'
import styles from './Exercise.module.css'

interface Props {
  feedback: Feedback
  /** Key (lessonId/exerciseId) of the exercise the feedback is about */
  exerciseKey: string
  onContinue: () => void
}

/**
 * Bottom sheet that replaces the Check bar after an answer (mockups 04 and 06, research R9).
 * After a wrong answer it also explains the right one (008 contract F1).
 */
export default function FeedbackBanner({ feedback, exerciseKey, onContinue }: Props) {
  const { correct } = feedback
  const explanation = correct ? null : explainMistake(exerciseKey, feedback.given)
  return (
    <div className={`bottom-bar ${styles.sheet} ${correct ? styles.sheetCorrect : styles.sheetWrong}`}>
      <div className={styles.sheetRow}>
        <span className={styles.sheetIcon} aria-hidden="true">
          {correct ? <CheckIcon size={30} /> : <WrongIcon size={30} />}
        </span>
        <div role="status" className={styles.sheetText}>
          {correct ? (
            <span className={styles.sheetTitle}>
              <strong>pona!</strong> Correct.
            </span>
          ) : (
            <>
              <span className={styles.sheetTitle}>
                Not quite<span className="visually-hidden">.</span>
              </span>{' '}
              <span className={styles.sheetLabel}>Correct answer:</span>{' '}
              <span className={styles.sheetAnswer}>{feedback.correctAnswer}</span>
              {explanation && <ExplanationBlock {...explanation} />}
            </>
          )}
        </div>
      </div>
      <button type="button" className={`primary-button${correct ? '' : ' danger'}`} onClick={onContinue} autoFocus>
        Continue
      </button>
    </div>
  )
}

function ExplanationBlock({ words, wrongPick, grammar }: NonNullable<ReturnType<typeof explainMistake>>) {
  if (words.length === 0 && !wrongPick && !grammar) return null
  return (
    <div className={styles.explain}>
      {words.length > 0 && (
        <ul className={styles.explainWords}>
          {words.map(({ word, meaning }) => (
            <li key={word}>
              <strong lang="tok">{word}</strong>: {meaning}
            </li>
          ))}
        </ul>
      )}
      {wrongPick && (
        <p className={styles.explainPick}>
          <strong lang="tok">{wrongPick.word}</strong> means {wrongPick.meaning}
        </p>
      )}
      {grammar && (
        <div className={styles.explainGrammar}>
          <p className={styles.explainGrammarTitle}>{grammar.title}</p>
          <p className={styles.explainLesson}>{grammar.lesson}</p>
          <p>{grammar.note}</p>
        </div>
      )}
    </div>
  )
}
