import { emptyProgress, type LearnerProgress, type LessonResult } from './progressSlice'

/** See specs/001-first-lesson-flow/contracts/progress-storage.md */
export const STORAGE_KEY = 'duopona:progress'
const VERSION = 1

function isLessonResult(value: unknown): value is LessonResult {
  if (typeof value !== 'object' || value === null) return false
  const r = value as Record<string, unknown>
  return typeof r.firstTryCorrect === 'number' && typeof r.total === 'number' && typeof r.completedAt === 'string'
}

export function loadProgress(): LearnerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return emptyProgress()
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return emptyProgress()
    const { version, completedLessons } = data as Record<string, unknown>
    if (version !== VERSION || typeof completedLessons !== 'object' || completedLessons === null) return emptyProgress()
    if (!Object.values(completedLessons).every(isLessonResult)) return emptyProgress()
    return { completedLessons: completedLessons as Record<string, LessonResult> }
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(progress: LearnerProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, completedLessons: progress.completedLessons }))
  } catch {
    // Storage full or disabled: keep working with in-memory state for this session.
  }
}
