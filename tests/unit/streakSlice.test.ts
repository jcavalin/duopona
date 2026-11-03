import { dayBefore } from '../../src/lib/days'
import reducer, {
  emptyStreak,
  goalMet,
  selectBestStreak,
  selectMetToday,
  selectStreak,
  type StreakRecord,
} from '../../src/store/streakSlice'

const run = (state: StreakRecord, ...days: string[]) => days.reduce((s, d) => reducer(s, goalMet(d)), state)
const wrap = (streak: StreakRecord) => ({ streak })

describe('goalMet transitions (007 data-model)', () => {
  it('never met → current 1', () => {
    expect(run(emptyStreak(), '2026-11-03')).toEqual({ lastDay: '2026-11-03', current: 1, best: 1 })
  })

  it('met yesterday → current + 1', () => {
    expect(run({ lastDay: '2026-11-02', current: 4, best: 4 }, '2026-11-03')).toEqual({
      lastDay: '2026-11-03',
      current: 5,
      best: 5,
    })
  })

  it('missed a day → back to 1, best kept', () => {
    expect(run({ lastDay: '2026-10-31', current: 4, best: 6 }, '2026-11-03')).toEqual({
      lastDay: '2026-11-03',
      current: 1,
      best: 6,
    })
  })

  it('same day → unchanged', () => {
    const state = { lastDay: '2026-11-03', current: 2, best: 2 }
    expect(run(state, '2026-11-03')).toBe(state)
  })

  it('clock moved backwards → unchanged', () => {
    const state = { lastDay: '2026-11-03', current: 2, best: 2 }
    expect(run(state, '2026-11-02')).toBe(state)
  })

  it('across a month end', () => {
    expect(run(emptyStreak(), '2026-10-30', '2026-10-31', '2026-11-01').current).toBe(3)
  })

  it('best follows current and never drops', () => {
    const state = run(emptyStreak(), '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-05')
    expect(state.current).toBe(1)
    expect(selectBestStreak(wrap(state))).toBe(3)
  })
})

describe('selectors', () => {
  const state = wrap({ lastDay: '2026-11-03', current: 3, best: 5 })

  it('met today on the same day, or when lastDay is later (clock back)', () => {
    expect(selectMetToday('2026-11-03')(state)).toBe(true)
    expect(selectMetToday('2026-11-02')(state)).toBe(true)
    expect(selectMetToday('2026-11-04')(state)).toBe(false)
    expect(selectMetToday('2026-11-03')(wrap(emptyStreak()))).toBe(false)
  })

  it('streak kept today and yesterday, 0 after a missed day', () => {
    expect(selectStreak('2026-11-03')(state)).toBe(3)
    expect(selectStreak('2026-11-04')(state)).toBe(3)
    expect(selectStreak('2026-11-05')(state)).toBe(0)
    expect(selectStreak('2026-11-02')(state)).toBe(3)
    expect(selectStreak('2026-11-03')(wrap(emptyStreak()))).toBe(0)
  })
})

describe('simulated days (SC-003)', () => {
  // p = practised, s = skipped, b = clock moved back one day and practised again
  const events = 'pppspppbppsspppppbpsppppppsppbpppspppppp'

  it(`shown streak equals the reference count over ${events.length} days`, () => {
    expect(events.length).toBeGreaterThanOrEqual(30)
    let state = emptyStreak()
    const practised = new Set<string>()
    let day = '2026-01-01'
    const next = (d: string) => {
      const [y, m, dd] = d.split('-').map(Number)
      const n = new Date(y, m - 1, dd + 1)
      return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
    }
    for (const event of events) {
      day = next(day)
      if (event === 'p') {
        state = reducer(state, goalMet(day))
        practised.add(day)
      } else if (event === 'b') {
        // Practising on a clock set to yesterday counts nothing new
        const before = state
        state = reducer(state, goalMet(dayBefore(day)))
        expect(state).toBe(before)
      }
      // Reference: consecutive practised days ending today, or yesterday when today is not practised
      let d = practised.has(day) ? day : dayBefore(day)
      let expected = 0
      while (practised.has(d)) {
        expected += 1
        d = dayBefore(d)
      }
      expect(selectStreak(day)(wrap(state))).toBe(expected)
      expect(state.best).toBeGreaterThanOrEqual(state.current)
    }
  })
})
