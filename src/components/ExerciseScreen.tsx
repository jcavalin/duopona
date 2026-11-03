import { useAppDispatch, useAppSelector } from '../store/hooks'
import { continueLesson, selectCurrentExercise, selectPosition, selectSession, submitAnswer } from '../store/sessionSlice'
import FeedbackBanner from './FeedbackBanner'
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
  const showingFeedback = session.status === 'feedback'
  const key = `${exercise.id}-${session.step}`

  return (
    <div>
      <div className={styles.header}>
        <button type="button" className={styles.quit} onClick={onQuit}>
          Quit
        </button>
        <progress className={styles.progress} value={done} max={total} aria-label="Lesson progress" />
        <span className={styles.position}>
          {Math.min(done + 1, total)} of {total}
        </span>
      </div>

      {exercise.type === 'multipleChoice' ? (
        <MultipleChoice key={key} exercise={exercise} disabled={showingFeedback} onSubmit={(a) => dispatch(submitAnswer(a))} />
      ) : (
        <WordBank key={key} exercise={exercise} disabled={showingFeedback} onSubmit={(a) => dispatch(submitAnswer(a))} />
      )}

      {showingFeedback && session.feedback && (
        <FeedbackBanner feedback={session.feedback} onContinue={() => dispatch(continueLesson())} />
      )}
    </div>
  )
}
