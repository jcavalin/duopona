/** Small inline icons (research R6). Decorative: always hidden from assistive technology. */

interface IconProps {
  size?: number
}

function Stroke({ size = 24, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Stroke>
  )
}

export function WrongIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M7 7l10 10M17 7L7 17" strokeWidth={3.5} />
    </Stroke>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth={3.5} />
    </Stroke>
  )
}

export function StarIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false">
      <path
        d="M12 2.8l2.75 5.75 6.3.8-4.6 4.35 1.15 6.25L12 16.9l-5.6 3.05 1.15-6.25-4.6-4.35 6.3-.8z"
        strokeLinejoin="round"
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  )
}

export function LockIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Stroke>
  )
}

export function DropIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3c3 4 6 7.2 6 10.5a6 6 0 0 1-12 0C6 10.2 9 7 12 3z" />
      <path d="M9.5 14.5a2.6 2.6 0 0 0 2.2 2.3" />
    </Stroke>
  )
}

export function BubbleIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4V5a1 1 0 0 1 1-1z" />
    </Stroke>
  )
}

export function FlameIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3c.6 3.2 5 5.4 5 10.5a5 5 0 0 1-10 0c0-2.6 1.4-4.3 2.6-5.3.2 1.7.9 2.8 2 3.4.6-3.3-.6-5.6.4-8.6z" />
    </Stroke>
  )
}
