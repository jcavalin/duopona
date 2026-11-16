import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'

// jsdom has no scrolling; screens reset the window scroll when they open
window.scrollTo = vi.fn() as typeof window.scrollTo

// jsdom has no modal dialogs (013 research R6): open/close and the `close` event only
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.mocked(window.scrollTo).mockClear()
})
