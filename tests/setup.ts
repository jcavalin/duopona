import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'

// jsdom has no scrolling; screens reset the window scroll when they open
window.scrollTo = vi.fn() as typeof window.scrollTo

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.mocked(window.scrollTo).mockClear()
})
