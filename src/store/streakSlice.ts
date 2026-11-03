import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { dayBefore } from '../lib/days'

/** Daily-goal streak (007 data-model "Streak record"). Days are `YYYY-MM-DD` local dates. */
export interface StreakRecord {
  /** Last day the daily goal was met; null = never */
  lastDay: string | null
  /** Streak length on lastDay; 0 only when lastDay is null */
  current: number
  /** Longest streak ever reached (FR-007) */
  best: number
}

export const emptyStreak = (): StreakRecord => ({ lastDay: null, current: 0, best: 0 })

const streakSlice = createSlice({
  name: 'streak',
  initialState: emptyStreak(),
  reducers: {
    /** A session was finished on `day` (data-model transition table). */
    goalMet(state, action: PayloadAction<string>) {
      const day = action.payload
      // Same day, or the clock moved backwards: treat as the same day (spec edge cases)
      if (state.lastDay !== null && state.lastDay >= day) return
      state.current = state.lastDay === dayBefore(day) ? state.current + 1 : 1
      state.lastDay = day
      state.best = Math.max(state.best, state.current)
    },
  },
})

export const { goalMet } = streakSlice.actions
export default streakSlice.reducer

type WithStreak = { streak: StreakRecord }

/** The daily goal is met for `day` (a later lastDay means the clock moved backwards). */
export const selectMetToday =
  (day: string) =>
  ({ streak }: WithStreak): boolean =>
    streak.lastDay !== null && streak.lastDay >= day

/** Streak shown on `day`: kept while it ends today or yesterday, else 0 (FR-005). */
export const selectStreak =
  (day: string) =>
  ({ streak }: WithStreak): number =>
    streak.lastDay !== null && streak.lastDay >= dayBefore(day) ? streak.current : 0

export const selectBestStreak = (state: WithStreak) => state.streak.best
