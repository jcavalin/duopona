import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { availableKeys, hasReviewable } from '../lib/practice'
import type { LearnerProgress } from './progressSlice'

/** Per-word mistake records (006 data-model "Word record"). */
export interface WordStats {
  /** Course word → outstanding mistakes; only counts ≥ 1 are kept */
  mistakes: Record<string, number>
}

export const emptyWords = (): WordStats => ({ mistakes: {} })

const wordsSlice = createSlice({
  name: 'words',
  initialState: emptyWords(),
  reducers: {
    /** First answer to an exercise was wrong: each tested word gains a mistake (FR-008). */
    wordsMissed(state, action: PayloadAction<string[]>) {
      for (const word of action.payload) {
        state.mistakes[word] = (state.mistakes[word] ?? 0) + 1
      }
    },
    /** First answer was right: each tested word loses a mistake, never below zero (FR-009). */
    wordsKnown(state, action: PayloadAction<string[]>) {
      for (const word of action.payload) {
        const count = state.mistakes[word]
        if (count === undefined) continue
        if (count <= 1) delete state.mistakes[word]
        else state.mistakes[word] = count - 1
      }
    },
  },
})

export const { wordsMissed, wordsKnown } = wordsSlice.actions
export default wordsSlice.reducer

/** Weak words (FR-011): every key has a count ≥ 1. */
export const selectWeakWords = (state: { words: WordStats }) => state.words.mistakes

/** Review is offered when a weak word appears in an exercise of a completed lesson (FR-013). */
export const selectCanReview = (state: { words: WordStats; progress: LearnerProgress }) =>
  hasReviewable(availableKeys(Object.keys(state.progress.completedLessons)), state.words.mistakes)
