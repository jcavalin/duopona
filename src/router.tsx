import { useEffect } from 'react'
import { Navigate, Outlet, ScrollRestoration, type RouteObject } from 'react-router'
import { useLanguage } from './i18n/useStrings'
import HomeRoute from './routes/HomeRoute'
import LessonRoute from './routes/LessonRoute'
import PracticeRoute from './routes/PracticeRoute'
import SettingsDialog from './components/SettingsDialog'

/** The page scrolls on window; without this a new screen opens at the previous screen's scroll offset */
function RootLayout() {
  // Browsers and screen readers read the page in the study language (014 FR-010, research R7)
  const language = useLanguage()
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

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
      // Settings open over the home screen, which stays mounted (014 research R6)
      { path: '/', element: <HomeRoute />, children: [{ path: 'settings', element: <SettingsDialog /> }] },
      { path: '/lesson/:lessonId', element: <LessonRoute /> },
      { path: '/practice/:kind', element: <PracticeRoute /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
