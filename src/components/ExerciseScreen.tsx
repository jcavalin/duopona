import { useEffect, useRef } from 'react'
import { useBlocker } from 'react-router'
import { useStrings } from '../i18n/useStrings'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { continueAndRecord, submitAndRecord } from '../store/lessonThunks'
import { selectCurrentExercise, selectCurrentKey, selectPosition, selectSession } from '../store/sessionSlice'
import FeedbackBanner from './FeedbackBanner'
import { CloseIcon } from './icons'
import LeaveDialog from './LeaveDialog'
import MultipleChoice from './MultipleChoice'
import WordBank from './WordBank'
import styles from './Exercise.module.css'

interface Props {
  onQuit: () => void
  /** Picks the accessible names (006 contract S3) and the leave wording (013); default 'lesson' */
  kind?: 'lesson' | 'practice'
}

/** X and Back are confirmed first (013): leaving the exercise screen is held until "Leave". */
export default function ExerciseScreen({ onQuit, kind = 'lesson' }: Props) {
  const s = useStrings()
  const practice = kind === 'practice'
  const quitLabel = practice ? s.quitPractice : s.quitLesson
  const progressLabel = practice ? s.practiceProgress : s.lessonProgress
  const leaveTitle = practice ? s.leavePracticeTitle : s.leaveLessonTitle
  const leaveMessage = practice ? s.leavePracticeMessage : s.leaveLessonMessage
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSession)
  const exercise = useAppSelector(selectCurrentExercise)
  const exerciseKey = useAppSelector(selectCurrentKey)
  const { done, total } = useAppSelector(selectPosition)
  const quitRef = useRef<HTMLButtonElement>(null)

  // X navigates home and Back pops history; both are held here while exercises show (research R1).
  // The intro and summary don't render this screen, so they are never blocked (FR-007).
  const blocker = useBlocker(({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname)

  // Focus X once the dialog is gone: while the modal is open X is inert and ignores focus() (research R4)
  const wasBlocked = useRef(false)
  useEffect(() => {
    if (blocker.state === 'blocked') wasBlocked.current = true
    else if (blocker.state === 'unblocked' && wasBlocked.current) {
      wasBlocked.current = false
      quitRef.current?.focus()
    }
  }, [blocker.state])

  if (!session || !exercise || !exerciseKey) return null
  const feedback = session.status === 'feedback' ? session.feedback : undefined
  const key = `${exercise.id}-${session.step}`

  const topBar = (
    <div className={styles.topBar}>
      <button ref={quitRef} type="button" className="icon-button" aria-label={quitLabel} onClick={onQuit}>
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
        <WordBank
          key={key}
          header={topBar}
          exercise={exercise}
          disabled={!!feedback}
          result={feedback ? (feedback.correct ? 'correct' : 'wrong') : undefined}
          onSubmit={(a) => dispatch(submitAndRecord(a))} />
      )}

      {feedback && <FeedbackBanner feedback={feedback} exerciseKey={exerciseKey} language={session.language} onContinue={() => dispatch(continueAndRecord())} />}

      {blocker.state === 'blocked' && (
        <LeaveDialog title={leaveTitle} message={leaveMessage} onStay={() => blocker.reset()} onLeave={() => blocker.proceed()} />
      )}
    </div>
  )
}
