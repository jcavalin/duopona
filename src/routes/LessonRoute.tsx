import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import ExerciseScreen from '../components/ExerciseScreen'
import LessonIntro from '../components/LessonIntro'
import LessonSummary from '../components/LessonSummary'
import { getLesson } from '../content/lessons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectIsUnlocked } from '../store/progressSlice'
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
  // The intro is shown until Start is pressed for this lesson; UI-local state (Constitution III)
  const [startedId, setStartedId] = useState<string | null>(null)
  const started = startedId === lessonId

  // Leaving the route (Quit, Back, browser Back) discards any session (FR-013 of 001).
  useEffect(() => {
    return () => {
      dispatch(quitLesson())
    }
  }, [lessonId, dispatch])

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
    return <LessonSummary firstTryCorrect={firstTryCorrect} total={total} onBack={goHome} />
  }
  return <ExerciseScreen onQuit={goHome} />
}
