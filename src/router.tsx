import { Navigate, type RouteObject } from 'react-router'
import HomeRoute from './routes/HomeRoute'
import LessonRoute from './routes/LessonRoute'

/** Shared by the app (hash router) and tests (memory router). */
export const routes: RouteObject[] = [
  { path: '/', element: <HomeRoute /> },
  { path: '/lesson/:lessonId', element: <LessonRoute /> },
  { path: '*', element: <Navigate to="/" replace /> },
]
