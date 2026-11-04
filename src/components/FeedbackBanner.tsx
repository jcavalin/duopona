import { useId, useState } from 'react'
import { explainMistake } from '../content/explanations'
import type { Feedback } from '../store/sessionSlice'
import { CheckIcon, ChevronDownIcon, WrongIcon } from './icons'
import { focusOnMount } from './focusOnMount'
import styles from './Exercise.module.css'

interface Props {
  feedback: Feedback
  /** Key (lessonId/exerciseId) of the exercise the feedback is about */
  exerciseKey: string
  onContinue: () => void
}

type Explanation = NonNullable<ReturnType<typeof explainMistake>>

/**
 * Bottom sheet that replaces the Check bar after an answer (mockups 04 and 06, research R9).
 * After a wrong answer it offers the explanation of the right one (008) behind a "Why?" toggle,
 * hidden until asked for (010 contract C1–C3). The sheet unmounts between answers, so every new
 * wrong-answer sheet starts collapsed.
 */
export default function FeedbackBanner({ feedback, exerciseKey, onContinue }: Props) {
  const [open, setOpen] = useState(false)
  const cardId = useId()
  const { correct } = feedback
  const explanation = correct ? null : explainMistake(exerciseKey, feedback.given)
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
              <strong>pona!</strong> Correct.
            </span>
          ) : (
            <>
              <span className={styles.sheetTitle}>
                Not quite<span className="visually-hidden">.</span>
              </span>{' '}
              <span className={styles.sheetLabel}>Correct answer:</span>{' '}
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
            <span>{open ? 'Hide' : 'Why?'}</span>
            <ChevronDownIcon size={20} />
          </button>
        )}
      </div>
      {hasExplanation && (
        <div id={cardId} className={styles.explain} hidden={!open}>
          <ExplanationContent {...explanation} />
        </div>
      )}
      <button type="button" className={`primary-button${correct ? '' : ' danger'}`} onClick={onContinue} ref={focusOnMount}>
        Continue
      </button>
    </div>
  )
}

function ExplanationContent({ words, wrongPick, grammar }: Explanation) {
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
          <strong lang="tok">{wrongPick.word}</strong> means {wrongPick.meaning}
        </p>
      )}
      {grammar && (
        <div className={`${styles.explainGrammar}${words.length > 0 || wrongPick ? ` ${styles.explainGrammarDivided}` : ''}`}>
          <p className={styles.explainGrammarTitle}>{grammar.title}</p>
          <p className={styles.explainLesson}>From {grammar.lesson}</p>
          <p>{grammar.note}</p>
        </div>
      )}
    </>
  )
}
