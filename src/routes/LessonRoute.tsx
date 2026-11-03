import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import ExerciseScreen from '../components/ExerciseScreen'
import LessonSummary from '../components/LessonSummary'
import { getLesson } from '../content/lessons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { quitLesson, selectFirstTryCorrect, selectSession, selectTotal, startLesson } from '../store/sessionSlice'

export default function LessonRoute() {
  const { lessonId = '' } = useParams()
  const lesson = getLesson(lessonId)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const session = useAppSelector(selectSession)
  const firstTryCorrect = useAppSelector(selectFirstTryCorrect)
  const total = useAppSelector(selectTotal)

  // Entering the route starts a fresh session; leaving it (Quit, Back button) discards it (FR-013).
  useEffect(() => {
    if (!lesson) return
    dispatch(startLesson(lesson.id))
    return () => {
      dispatch(quitLesson())
    }
  }, [lesson, dispatch])

  if (!lesson) return <Navigate to="/" replace />
  if (!session || session.lessonId !== lesson.id) return null

  const goHome = () => navigate('/')

  if (session.status === 'finished') {
    return <LessonSummary firstTryCorrect={firstTryCorrect} total={total} onBack={goHome} />
  }
  return <ExerciseScreen onQuit={goHome} />
}
