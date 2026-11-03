/** Days are `YYYY-MM-DD` strings of the device's local calendar date (007 research R1). */

/** Finished sessions per day (FR-010). */
export const DAILY_GOAL = 1

const pad = (n: number) => String(n).padStart(2, '0')

/** The local calendar date of `now`; never derived from UTC. */
export function today(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** The calendar day before `day`; local date arithmetic handles month/year ends and DST. */
export function dayBefore(day: string): string {
  const [y, m, d] = day.split('-').map(Number)
  return today(new Date(y, m - 1, d - 1))
}
