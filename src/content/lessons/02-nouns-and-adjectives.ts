import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'nouns-and-adjectives',
  title: 'Nouns and Adjectives',
  chapter: 'Lesson 3',
  newWords: ['telo', 'tomo', 'lili', 'pona', 'suli'],
  grammar: {
    title: 'Describing words come after the noun',
    explanation: [
      'In Toki Pona a describing word follows the word it describes: tomo suli is “a big house”, never suli tomo.',
      'You can also put a describing word after li to say what something is like: tomo li pona means “the house is good”.',
    ],
  },
  exercises: [
    { id: 'telo', type: 'multipleChoice', direction: 'tp-en', prompt: 'telo', options: ['water / liquid', 'house / building / room', 'small / little / young', 'good / simple / fix'], answer: 'water / liquid' },
    { id: 'tomo', type: 'multipleChoice', direction: 'en-tp', prompt: 'house / building / room', options: ['telo', 'tomo', 'lipu', 'kili'], answer: 'tomo' },
    { id: 'lili', type: 'multipleChoice', direction: 'tp-en', prompt: 'lili', options: ['big / important / long', 'good / simple / fix', 'small / little / young'], answer: 'small / little / young' },
    { id: 'pona', type: 'multipleChoice', direction: 'en-tp', prompt: 'good / simple / fix', options: ['suli', 'lili', 'ijo', 'pona'], answer: 'pona' },
    { id: 'suli', type: 'multipleChoice', direction: 'tp-en', prompt: 'suli', options: ['small / little / young', 'big / important / long', 'water / liquid'], answer: 'big / important / long' },
    { id: 'tomo-lili', type: 'wordBank', direction: 'en-tp', prompt: 'a small house', answer: ['tomo', 'lili'], distractors: ['suli'], practisesGrammar: true },
    { id: 'tomo-li-pona', type: 'wordBank', direction: 'en-tp', prompt: 'The house is good.', answer: ['tomo', 'li', 'pona'], distractors: ['telo'], practisesGrammar: true },
    { id: 'jan-suli', type: 'wordBank', direction: 'tp-en', prompt: 'jan suli', answer: ['a', 'big', 'person'], distractors: ['small', 'house'] },
    { id: 'kili-lili-li-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'kili lili li pona', options: ['The good fruit is small.', 'The fruit is a small thing.', 'The small fruit is good.'], answer: 'The small fruit is good.' },
    { id: 'tomo-suli-li-ijo-pona', type: 'wordBank', direction: 'en-tp', prompt: 'The big house is a good thing.', answer: ['tomo', 'suli', 'li', 'ijo', 'pona'], distractors: ['lili'], practisesGrammar: true },
    { id: 'telo-pona', type: 'multipleChoice', direction: 'en-tp', prompt: 'good water', options: ['pona telo', 'telo pona', 'telo suli'], answer: 'telo pona' },
    { id: 'lipu-ni-li-lili', type: 'wordBank', direction: 'en-tp', prompt: 'This book is small.', answer: ['lipu', 'ni', 'li', 'lili'], distractors: ['suli'], practisesGrammar: true },
    { id: 'meli-li-suli', type: 'multipleChoice', direction: 'tp-en', prompt: 'meli li suli', options: ['The woman is big.', 'The woman is small.', 'a big woman'], answer: 'The woman is big.' },
  ],
}

export default lesson
