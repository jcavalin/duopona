import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'colours-and-la',
  title: 'Colours and la',
  chapter: 'Lesson 14',
  newWords: ['jelo', 'laso', 'loje', 'pimeja', 'walo', 'la'],
  grammar: {
    title: 'Colours, and setting the scene with la',
    explanation: [
      'Colours are describing words like any other: kili loje is “a red fruit”. laso covers both blue and green.',
      'la lets you set the scene first. Put a context before la, then the main sentence: tenpo suno la mi pali means “in the daytime, I work”.',
      'The context can also be a whole sentence, like “if” or “when”: sina pali la mi moku means “if you work, I eat”.',
    ],
  },
  exercises: [
    { id: 'jelo', type: 'multipleChoice', direction: 'tp-en', prompt: 'jelo', options: ['yellow', 'red', 'white / pale'], answer: 'yellow' },
    { id: 'laso', type: 'multipleChoice', direction: 'en-tp', prompt: 'blue / green', options: ['loje', 'laso', 'walo', 'pimeja'], answer: 'laso' },
    { id: 'loje', type: 'multipleChoice', direction: 'tp-en', prompt: 'loje', options: ['yellow', 'black / dark', 'red'], answer: 'red' },
    { id: 'pimeja', type: 'multipleChoice', direction: 'en-tp', prompt: 'black / dark', options: ['walo', 'jelo', 'laso', 'pimeja'], answer: 'pimeja' },
    { id: 'walo', type: 'multipleChoice', direction: 'tp-en', prompt: 'walo', options: ['blue / green', 'white / pale', 'red'], answer: 'white / pale' },
    { id: 'tenpo-suno-la-mi-pali', type: 'wordBank', direction: 'en-tp', prompt: 'In the daytime, I work.', answer: ['tenpo', 'suno', 'la', 'mi', 'pali'], distractors: ['li'], practisesGrammar: true },
    { id: 'tenpo-pimeja-la-mi-awen', type: 'wordBank', direction: 'en-tp', prompt: 'At night, I stay in the house.', answer: ['tenpo', 'pimeja', 'la', 'mi', 'awen', 'lon', 'tomo'], distractors: ['li'], practisesGrammar: true },
    { id: 'kili-loje', type: 'wordBank', direction: 'en-tp', prompt: 'a red fruit', answer: ['kili', 'loje'], distractors: ['laso'] },
    { id: 'tenpo-ni-la-mi-moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'tenpo ni la mi moku', options: ['I ate this.', 'I want to eat this.', 'Now I am eating.'], answer: 'Now I am eating.' },
    { id: 'telo-laso-li-suli', type: 'wordBank', direction: 'tp-en', prompt: 'telo laso li suli', answer: ['the', 'blue', 'water', 'is', 'big'], distractors: ['red', 'small'] },
    { id: 'tomo-li-walo', type: 'multipleChoice', direction: 'en-tp', prompt: 'The house is white.', options: ['tomo walo', 'tomo li walo', 'walo li tomo'], answer: 'tomo li walo' },
    { id: 'sina-pali-la-mi-moku', type: 'wordBank', direction: 'en-tp', prompt: 'If you work, I eat.', answer: ['sina', 'pali', 'la', 'mi', 'moku'], distractors: ['e'], practisesGrammar: true },
  ],
}

export default lesson
