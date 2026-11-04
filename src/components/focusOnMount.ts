/**
 * Callback ref that focuses an element when it mounts, without scrolling.
 * React's autoFocus scrolls the element into view, which made the page jump when the
 * feedback sheet slid up from below the screen. Stable module-level function, so React
 * calls it only on mount.
 */
export function focusOnMount(el: HTMLElement | null) {
  el?.focus({ preventScroll: true })
}
