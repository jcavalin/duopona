import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'particles-and-perspective',
  title: 'Particles and Perspective',
  chapter: 'Lesson 16',
  newWords: ['anpa', 'ante', 'en', 'lete', 'lupa', 'open', 'sama', 'suwi', 'taso', 'tawa'],
  grammar: {
    title: 'Joining subjects with en, and taso',
    explanation: [
      'en joins two subjects: mije en meli li moku means “the man and the woman eat”. With en, li is always needed, even with mi or sina.',
      'taso after a word means “only”: mi moku e kili taso means “I eat only fruit”. At the start of a sentence it means “but”: taso mi lete.',
      'tawa can also mean “for” or “in the opinion of”: kili suwi li pona tawa mi means “I like sweet fruit” (sweet fruit is good to me).',
    ],
  },
  exercises: [
    { id: 'anpa', type: 'multipleChoice', direction: 'tp-en', prompt: 'anpa', options: ['below / down / humble', 'different / other / changed', 'sweet / cute'], answer: 'below / down / humble' },
    { id: 'ante', type: 'multipleChoice', direction: 'en-tp', prompt: 'different / other / changed', options: ['sama', 'ante', 'suwi', 'lete'], answer: 'ante' },
    { id: 'lete', type: 'multipleChoice', direction: 'tp-en', prompt: 'lete', options: ['sweet / cute', 'to open / to start', 'cold / raw'], answer: 'cold / raw' },
    { id: 'lupa', type: 'multipleChoice', direction: 'en-tp', prompt: 'hole / door / window', options: ['open', 'anpa', 'taso', 'lupa'], answer: 'lupa' },
    { id: 'open', type: 'multipleChoice', direction: 'tp-en', prompt: 'open', options: ['only / but', 'to open / to start', 'same / similar / like'], answer: 'to open / to start' },
    { id: 'sama', type: 'multipleChoice', direction: 'en-tp', prompt: 'same / similar / like', options: ['ante', 'sama', 'en', 'lete'], answer: 'sama' },
    { id: 'suwi', type: 'multipleChoice', direction: 'tp-en', prompt: 'suwi', options: ['sweet / cute', 'cold / raw', 'below / down / humble'], answer: 'sweet / cute' },
    { id: 'mije-en-meli-li-moku', type: 'multipleChoice', direction: 'en-tp', prompt: 'The man and the woman are eating.', options: ['mije en meli moku', 'mije en meli li moku', 'mije li meli li moku'], answer: 'mije en meli li moku' },
    { id: 'mi-moku-e-kili-taso', type: 'wordBank', direction: 'en-tp', prompt: 'I eat only fruit.', answer: ['mi', 'moku', 'e', 'kili', 'taso'], distractors: ['en'], practisesGrammar: true },
    { id: 'taso-mi-lete', type: 'wordBank', direction: 'en-tp', prompt: 'But I am cold.', answer: ['taso', 'mi', 'lete'], distractors: ['li'], practisesGrammar: true },
    { id: 'kili-suwi-li-pona-tawa-mi', type: 'wordBank', direction: 'en-tp', prompt: 'I like sweet fruit.', answer: ['kili', 'suwi', 'li', 'pona', 'tawa', 'mi'], distractors: ['e'], practisesGrammar: true },
    { id: 'lupa-li-open', type: 'wordBank', direction: 'tp-en', prompt: 'lupa li open', answer: ['the', 'door', 'is', 'open'], distractors: ['cold', 'sweet'] },
    { id: 'ni-li-sama', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni li sama', options: ['This is the same.', 'This is different.', 'This is below.'], answer: 'This is the same.' },
    { id: 'tomo-ante', type: 'multipleChoice', direction: 'tp-en', prompt: 'tomo ante', options: ['the same house', 'a different house', 'a cold house'], answer: 'a different house' },
  ],
}

export default lesson
