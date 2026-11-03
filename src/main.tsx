import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createHashRouter, RouterProvider } from 'react-router'
import './index.css'
import { routes } from './router'
import { makeStore } from './store'

const store = makeStore()
const router = createHashRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
