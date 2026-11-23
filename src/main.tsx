import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createHashRouter, RouterProvider } from 'react-router'
import './index.css'
import { detectLanguage, deviceLanguageTags } from './i18n/language'
import { routes } from './router'
import { makeStore } from './store'

// No saved choice: the device's preferred languages decide (014 FR-006)
const store = makeStore(detectLanguage(deviceLanguageTags()))
const router = createHashRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
