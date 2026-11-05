import { Navigate, Outlet, ScrollRestoration, type RouteObject } from 'react-router'
import HomeRoute from './routes/HomeRoute'
import LessonRoute from './routes/LessonRoute'
import PracticeRoute from './routes/PracticeRoute'

/** The page scrolls on window; without this a new screen opens at the previous screen's scroll offset */
function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}

/** Shared by the app (hash router) and tests (memory router). */
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomeRoute /> },
      { path: '/lesson/:lessonId', element: <LessonRoute /> },
      { path: '/practice/:kind', element: <PracticeRoute /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
