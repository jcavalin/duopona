import { Navigate, type RouteObject } from 'react-router'
import HomeRoute from './routes/HomeRoute'
import LessonRoute from './routes/LessonRoute'
import PracticeRoute from './routes/PracticeRoute'

/** Shared by the app (hash router) and tests (memory router). */
export const routes: RouteObject[] = [
  { path: '/', element: <HomeRoute /> },
  { path: '/lesson/:lessonId', element: <LessonRoute /> },
  { path: '/practice/:kind', element: <PracticeRoute /> },
  { path: '*', element: <Navigate to="/" replace /> },
]
