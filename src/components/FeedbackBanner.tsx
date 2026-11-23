import { useId, useState } from 'react'
import { explainMistake } from '../content/explanations'
import { useStrings } from '../i18n/useStrings'
import type { Language } from '../i18n/language'
import type { Feedback } from '../store/sessionSlice'
import { CheckIcon, ChevronDownIcon, WrongIcon } from './icons'
import { focusOnMount } from './focusOnMount'
import styles from './Exercise.module.css'

interface Props {
  feedback: Feedback
  /** Key (lessonId/exerciseId) of the exercise the feedback is about */
  exerciseKey: string
  /** The session's study language (014) */
  language: Language
  onContinue: () => void
}

type Explanation = NonNullable<ReturnType<typeof explainMistake>>

/**
 * Bottom sheet that replaces the Check bar after an answer (mockups 04 and 06, research R9).
 * After a wrong answer it offers the explanation of the right one (008) behind a "Why?" toggle,
 * hidden until asked for (010 contract C1–C3). The sheet unmounts between answers, so every new
 * wrong-answer sheet starts collapsed.
 */
export default function FeedbackBanner({ feedback, exerciseKey, language, onContinue }: Props) {
  const s = useStrings()
  const [open, setOpen] = useState(false)
  const cardId = useId()
  const { correct } = feedback
  const explanation = correct ? null : explainMistake(exerciseKey, feedback.given, language)
  const hasExplanation = !!explanation && (explanation.words.length > 0 || !!explanation.wrongPick || !!explanation.grammar)

  return (
    <div className={`bottom-bar ${styles.sheet} ${correct ? styles.sheetCorrect : styles.sheetWrong}`}>
      <div className={styles.sheetRow}>
        <span className={styles.sheetIcon} aria-hidden="true">
          {correct ? <CheckIcon size={30} /> : <WrongIcon size={30} />}
        </span>
        <div role="status" className={styles.sheetText}>
          {correct ? (
            <span className={styles.sheetTitle}>
              <strong lang="tok">pona!</strong> {s.correct}
            </span>
          ) : (
            <>
              <span className={styles.sheetTitle}>
                {s.notQuite}<span className="visually-hidden">.</span>
              </span>{' '}
              <span className={styles.sheetLabel}>{s.correctAnswer}</span>{' '}
              <span className={styles.sheetAnswer}>{feedback.correctAnswer}</span>
            </>
          )}
        </div>
        {hasExplanation && (
          <button
            type="button"
            className={styles.explainToggle}
            aria-expanded={open}
            aria-controls={cardId}
            onClick={() => setOpen((o) => !o)}
          >
            <span>{open ? s.hide : s.why}</span>
            <ChevronDownIcon size={20} />
          </button>
        )}
      </div>
      {hasExplanation && (
        <div id={cardId} className={styles.explain} hidden={!open}>
          <ExplanationContent {...explanation} />
        </div>
      )}
      <button type="button" className={`primary-button ${correct ? 'success' : 'danger'}`} onClick={onContinue} ref={focusOnMount}>
        {s.continue}
      </button>
    </div>
  )
}

function ExplanationContent({ words, wrongPick, grammar }: Explanation) {
  const s = useStrings()
  return (
    <>
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
          <strong lang="tok">{wrongPick.word}</strong> {s.means} {wrongPick.meaning}
        </p>
      )}
      {grammar && (
        <div className={`${styles.explainGrammar}${words.length > 0 || wrongPick ? ` ${styles.explainGrammarDivided}` : ''}`}>
          <p className={styles.explainGrammarTitle}>{grammar.title}</p>
          <p className={styles.explainLesson}>{s.fromLesson(grammar.lesson)}</p>
          <p>{grammar.note}</p>
        </div>
      )}
    </>
  )
}
