import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import ExerciseScreen from '../components/ExerciseScreen'
import LessonSummary from '../components/LessonSummary'
import { today } from '../lib/days'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { startPracticeSession } from '../store/lessonThunks'
import { selectCanPractice } from '../store/progressSlice'
import { selectStreak } from '../store/streakSlice'
import { quitLesson, selectFirstTryCorrect, selectSession, selectTotal } from '../store/sessionSlice'
import { selectCanReview } from '../store/wordsSlice'

const SUBTITLES = { practice: 'Practice', review: 'Weak words' } as const
type Kind = keyof typeof SUBTITLES

function isKind(value: string): value is Kind {
  return value === 'practice' || value === 'review'
}

/** Practice or review session: exercises from completed lessons, no intro (006 contract "Route #/practice/:kind"). */
export default function PracticeRoute() {
  const { kind = '' } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const canPractice = useAppSelector(selectCanPractice)
  const canReview = useAppSelector(selectCanReview)
  const session = useAppSelector(selectSession)
  const firstTryCorrect = useAppSelector(selectFirstTryCorrect)
  const total = useAppSelector(selectTotal)
  const streak = useAppSelector(selectStreak(today()))
  const valid = isKind(kind)
  const available = kind === 'review' ? canReview : canPractice

  // Start on entry; leaving the route (Quit, Back) discards the session, as for lessons.
  useEffect(() => {
    if (!isKind(kind)) return
    dispatch(startPracticeSession(kind))
    return () => {
      dispatch(quitLesson())
    }
  }, [kind, dispatch])

  const goHome = () => navigate('/')

  // Availability is only checked before this route's session exists, so answers that clear the
  // last weak word never redirect mid-session or from the summary (tasks T030).
  if (!valid || !session || session.kind !== kind) {
    return !valid || !available ? <Navigate to="/" replace /> : null
  }

  if (session.status === 'finished') {
    return (
      <LessonSummary
        heading="Practice complete!"
        subtitle={SUBTITLES[kind]}
        replayLabel="Practise again"
        firstTryCorrect={firstTryCorrect}
        total={total}
        streak={session.goalMet ? streak : undefined}
        onContinue={goHome}
        // Nothing left to review: go home instead of starting an empty session (contract S5)
        onReplay={() => (available ? dispatch(startPracticeSession(kind)) : goHome())}
      />
    )
  }
  return <ExerciseScreen onQuit={goHome} quitLabel="Quit practice" progressLabel="Practice progress" />
}
