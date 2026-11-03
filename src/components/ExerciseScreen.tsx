import { useAppDispatch, useAppSelector } from '../store/hooks'
import { continueAndRecord } from '../store/lessonThunks'
import { selectCurrentExercise, selectPosition, selectSession, submitAnswer } from '../store/sessionSlice'
import FeedbackBanner from './FeedbackBanner'
import { CloseIcon } from './icons'
import MultipleChoice from './MultipleChoice'
import WordBank from './WordBank'
import styles from './Exercise.module.css'

interface Props {
  onQuit: () => void
}

export default function ExerciseScreen({ onQuit }: Props) {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSession)
  const exercise = useAppSelector(selectCurrentExercise)
  const { done, total } = useAppSelector(selectPosition)

  if (!session || !exercise) return null
  const feedback = session.status === 'feedback' ? session.feedback : undefined
  const key = `${exercise.id}-${session.step}`

  const topBar = (
    <div className={styles.topBar}>
      <button type="button" className="icon-button" aria-label="Quit lesson" onClick={onQuit}>
        <CloseIcon size={28} />
      </button>
      <progress className={styles.progress} value={done} max={total} aria-label="Lesson progress" />
      <span className={styles.position}>
        {Math.min(done + 1, total)}/{total}
      </span>
    </div>
  )

  // Each exercise renders its body and its Check bar; the feedback sheet takes the bar's place (research R4, R9).
  return (
    <div className="screen">
      {exercise.type === 'multipleChoice' ? (
        <MultipleChoice
          key={key}
          header={topBar}
          exercise={exercise}
          disabled={!!feedback}
          result={feedback ? (feedback.correct ? 'correct' : 'wrong') : undefined}
          onSubmit={(a) => dispatch(submitAnswer(a))}
        />
      ) : (
        <WordBank key={key} header={topBar} exercise={exercise} disabled={!!feedback} onSubmit={(a) => dispatch(submitAnswer(a))} />
      )}

      {feedback && <FeedbackBanner feedback={feedback} onContinue={() => dispatch(continueAndRecord())} />}
    </div>
  )
}
