/** Small inline icons (research R6). Decorative: always hidden from assistive technology. */

import { useId } from 'react'

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

export function ChevronDownIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M6 9l6 6 6-6" />
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

export function GearIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
      <circle cx="12" cy="12" r="6.5" />
    </Stroke>
  )
}

/** Simplified flags for the language choice (014). Drawn inline: emoji flags show as letters on Windows. */
function Flag({ size = 28, children }: IconProps & { children: React.ReactNode }) {
  const clipId = useId()
  return (
    <svg
      className="flag"
      viewBox="0 0 30 20"
      width={size}
      height={(size * 2) / 3}
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id={clipId}>
        <rect width="30" height="20" rx="3" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{children}</g>
    </svg>
  )
}

/** English: the United States flag, stars reduced to a grid of dots */
export function FlagUS(props: IconProps) {
  return (
    <Flag {...props}>
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#b22234" />
      ))}
      <rect width="13" height={(20 * 7) / 13} fill="#3c3b6e" />
      {[2.2, 6.5, 10.8].flatMap((x) =>
        [2.2, 5.4, 8.6].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#fff" />),
      )}
    </Flag>
  )
}

/** Brazilian Portuguese: the Brazil flag, without the motto and stars */
export function FlagBR(props: IconProps) {
  return (
    <Flag {...props}>
      <rect width="30" height="20" fill="#009c3b" />
      <path d="M15 2.5L27 10L15 17.5L3 10Z" fill="#ffdf00" />
      <circle cx="15" cy="10" r="4.6" fill="#002776" />
      <path d="M10.6 9.2q4.6-1.4 8.8 1.4" stroke="#fff" strokeWidth="0.9" fill="none" />
    </Flag>
  )
}

/** Spanish: the flag of Spain (without the coat of arms, 017 research R4) */
export function FlagES(props: IconProps) {
  return (
    <Flag {...props}>
      <rect width="30" height="5" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
      <rect y="15" width="30" height="5" fill="#aa151b" />
    </Flag>
  )
}

/** French: the flag of France */
export function FlagFR(props: IconProps) {
  return (
    <Flag {...props}>
      <rect width="10" height="20" fill="#002654" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ce1126" />
    </Flag>
  )
}
