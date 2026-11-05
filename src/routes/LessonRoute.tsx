import { useEffect, useLayoutEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import ExerciseScreen from '../components/ExerciseScreen'
import LessonIntro from '../components/LessonIntro'
import LessonSummary from '../components/LessonSummary'
import { getLesson, lessons } from '../content/lessons'
import { today } from '../lib/days'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectIsUnlocked } from '../store/progressSlice'
import { selectStreak } from '../store/streakSlice'
import { quitLesson, selectFirstTryCorrect, selectSession, selectTotal, startLesson } from '../store/sessionSlice'

export default function LessonRoute() {
  const { lessonId = '' } = useParams()
  const unlocked = useAppSelector(selectIsUnlocked(lessonId))
  // Unknown and locked lessons are not playable (FR-012)
  const lesson = unlocked ? getLesson(lessonId) : undefined
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const session = useAppSelector(selectSession)
  const firstTryCorrect = useAppSelector(selectFirstTryCorrect)
  const total = useAppSelector(selectTotal)
  const streak = useAppSelector(selectStreak(today()))
  // The intro is shown until Start is pressed for this lesson; UI-local state (Constitution III)
  const [startedId, setStartedId] = useState<string | null>(null)
  const started = startedId === lessonId

  // Leaving the route (Quit, Back, browser Back) discards any session (FR-013 of 001).
  useEffect(() => {
    return () => {
      dispatch(quitLesson())
    }
  }, [lessonId, dispatch])

  // Intro, exercises and summary share one route, so switching between them is not a navigation:
  // start each at the top instead of at the previous screen's scroll offset
  const screenKind = !started ? 'intro' : session?.status === 'finished' ? 'summary' : 'exercises'
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [screenKind])

  if (!lesson) return <Navigate to="/" replace />

  const goHome = () => navigate('/')

  if (!started) {
    const start = () => {
      dispatch(startLesson(lesson.id))
      setStartedId(lesson.id)
    }
    return <LessonIntro lesson={lesson} onStart={start} onBack={goHome} />
  }

  if (!session || session.lessonId !== lesson.id) return null

  if (session.status === 'finished') {
    const next = lessons[lessons.findIndex((l) => l.id === lesson.id) + 1]
    return (
      <LessonSummary
        subtitle={lesson.title}
        nextLessonTitle={next?.title}
        firstTryCorrect={firstTryCorrect}
        total={total}
        streak={session.goalMet ? streak : undefined}
        onContinue={goHome}
        // Back to the introduction; Start begins a fresh session (research R10)
        onReplay={() => setStartedId(null)}
      />
    )
  }
  return <ExerciseScreen onQuit={goHome} />
}
