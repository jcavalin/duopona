import { Outlet } from 'react-router'
import LessonList from '../components/LessonList'

export default function HomeRoute() {
  return (
    <>
      <LessonList />
      <Outlet />
    </>
  )
}
