import { useAppDispatch, useAppSelector } from '../store/hooks'
import { continueAndRecord, submitAndRecord } from '../store/lessonThunks'
import { selectCurrentExercise, selectCurrentKey, selectPosition, selectSession } from '../store/sessionSlice'
import FeedbackBanner from './FeedbackBanner'
import { CloseIcon } from './icons'
import MultipleChoice from './MultipleChoice'
import WordBank from './WordBank'
import styles from './Exercise.module.css'

interface Props {
  onQuit: () => void
  /** Accessible names; lessons keep the defaults, practice passes its own (006 contract S3) */
  quitLabel?: string
  progressLabel?: string
}

export default function ExerciseScreen({ onQuit, quitLabel = 'Quit lesson', progressLabel = 'Lesson progress' }: Props) {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSession)
  const exercise = useAppSelector(selectCurrentExercise)
  const exerciseKey = useAppSelector(selectCurrentKey)
  const { done, total } = useAppSelector(selectPosition)

  if (!session || !exercise || !exerciseKey) return null
  const feedback = session.status === 'feedback' ? session.feedback : undefined
  const key = `${exercise.id}-${session.step}`

  const topBar = (
    <div className={styles.topBar}>
      <button type="button" className="icon-button" aria-label={quitLabel} onClick={onQuit}>
        <CloseIcon size={28} />
      </button>
      <progress className={styles.progress} value={done} max={total} aria-label={progressLabel} />
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
          onSubmit={(a) => dispatch(submitAndRecord(a))}
        />
      ) : (
        <WordBank key={key} header={topBar} exercise={exercise} disabled={!!feedback} onSubmit={(a) => dispatch(submitAndRecord(a))} />
      )}

      {feedback && <FeedbackBanner feedback={feedback} exerciseKey={exerciseKey} onContinue={() => dispatch(continueAndRecord())} />}
    </div>
  )
}
