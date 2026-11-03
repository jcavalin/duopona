import reducer, { emptyWords, selectWeakWords, wordsKnown, wordsMissed, type WordStats } from '../../src/store/wordsSlice'

const run = (state: WordStats, ...actions: Parameters<typeof reducer>[1][]) => actions.reduce(reducer, state)

describe('wordsSlice (006 FR-008, FR-009, FR-011)', () => {
  it('a miss adds one mistake per word', () => {
    expect(run(emptyWords(), wordsMissed(['kili', 'pona'])).mistakes).toEqual({ kili: 1, pona: 1 })
    expect(run(emptyWords(), wordsMissed(['kili']), wordsMissed(['kili'])).mistakes).toEqual({ kili: 2 })
  })

  it('known removes one mistake and drops the word at zero', () => {
    const s = run(emptyWords(), wordsMissed(['kili']), wordsMissed(['kili']), wordsKnown(['kili']))
    expect(s.mistakes).toEqual({ kili: 1 })
    expect(run(s, wordsKnown(['kili'])).mistakes).toEqual({})
  })

  it('known on a word without mistakes changes nothing (never negative)', () => {
    const s = run(emptyWords(), wordsMissed(['kili']), wordsKnown(['pona', 'kili', 'pona']))
    expect(s.mistakes).toEqual({})
  })

  it('SC-004: missed once then known once is no longer weak', () => {
    const s = run(emptyWords(), wordsMissed(['wawa']), wordsKnown(['wawa']))
    expect(selectWeakWords({ words: s })).toEqual({})
  })
})
