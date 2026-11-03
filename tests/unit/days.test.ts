import { dayBefore, today } from '../../src/lib/days'

describe('today (007 research R1)', () => {
  it('zero-pads month and day', () => {
    expect(today(new Date(2026, 0, 5, 12))).toBe('2026-01-05')
  })

  it('uses the local date late in the evening, not UTC', () => {
    expect(today(new Date(2026, 10, 3, 23, 59))).toBe('2026-11-03')
    expect(today(new Date(2026, 10, 3, 0, 1))).toBe('2026-11-03')
  })

  it('defaults to now', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 3, 12))
    expect(today()).toBe('2026-11-03')
    vi.useRealTimers()
  })
})

describe('dayBefore', () => {
  it.each([
    ['2026-11-03', '2026-11-02'],
    ['2026-03-01', '2026-02-28'],
    ['2028-03-01', '2028-02-29'],
    ['2027-01-01', '2026-12-31'],
    // DST change days (EU and US dates) give the previous calendar day in any time zone
    ['2026-03-30', '2026-03-29'],
    ['2026-03-09', '2026-03-08'],
    ['2026-10-26', '2026-10-25'],
    ['2026-11-02', '2026-11-01'],
  ])('%s → %s', (day, expected) => {
    expect(dayBefore(day)).toBe(expected)
  })
})
