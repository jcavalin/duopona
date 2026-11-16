import { useEffect, useId, useRef } from 'react'

interface Props {
  title: string
  message: string
  onStay: () => void
  onLeave: () => void
}

/**
 * Leave confirmation (013 contract ui-leave-dialog.md); native modal dialog, research R2.
 * The browser makes the screen behind it inert, draws the backdrop and closes it on Escape.
 */
export default function LeaveDialog({ title, message, onStay, onLeave }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const stayRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const messageId = useId()

  // The parent unmounts the dialog instead of closing it: a close() here would fire onClose
  // (and so onStay) after Leave.
  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
    // Initial focus on the safe choice (FR-008), set explicitly rather than left to the browser
    stayRef.current?.focus()
  }, [])

  return (
    <dialog
      ref={ref}
      className="leave-dialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      // Escape closes the dialog natively; `close` is used, not `cancel` (research R4)
      onClose={onStay}
      // A click on the dialog element itself is a click on the backdrop; the body fills the box
      onClick={(event) => {
        if (event.target === event.currentTarget) onStay()
      }}
    >
      <div className="leave-dialog-body">
        <h2 id={titleId} className="leave-dialog-title">
          {title}
        </h2>
        <p id={messageId} className="leave-dialog-message">
          {message}
        </p>
        <button ref={stayRef} type="button" className="primary-button" onClick={onStay}>
          Keep learning
        </button>
        <button type="button" className="text-button leave-dialog-leave" onClick={onLeave}>
          Leave
        </button>
      </div>
    </dialog>
  )
}
