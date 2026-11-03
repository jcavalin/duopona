import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'verbs',
  title: 'Verbs',
  chapter: 'Lesson 5',
  newWords: ['jo', 'kute', 'moku', 'pali', 'sona', 'toki', 'e'],
  grammar: {
    title: 'Doing something to something: e',
    explanation: [
      'A verb can come right after li, or right after mi or sina: mi moku means “I eat”.',
      'To say what the action is done to, put e before it: mi moku e kili means “I eat fruit”.',
      'With other subjects you need both little words: meli li jo e lipu means “the woman has a book”.',
    ],
  },
  exercises: [
    { id: 'jo', type: 'multipleChoice', direction: 'tp-en', prompt: 'jo', options: ['to have / to hold', 'to hear / to listen / ear', 'food / to eat / to drink'], answer: 'to have / to hold' },
    { id: 'kute', type: 'multipleChoice', direction: 'en-tp', prompt: 'to hear / to listen / ear', options: ['moku', 'kute', 'toki', 'jo'], answer: 'kute' },
    { id: 'moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'moku', options: ['to work / to make / to do', 'to know / knowledge', 'food / to eat / to drink'], answer: 'food / to eat / to drink' },
    { id: 'pali', type: 'multipleChoice', direction: 'en-tp', prompt: 'to work / to make / to do', options: ['sona', 'jo', 'kute', 'pali'], answer: 'pali' },
    { id: 'sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sona', options: ['to talk / language / hello', 'to know / knowledge', 'to have / to hold'], answer: 'to know / knowledge' },
    { id: 'toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'to talk / language / hello', options: ['moku', 'toki', 'pali', 'sona'], answer: 'toki' },
    { id: 'mi-moku-e-kili', type: 'wordBank', direction: 'en-tp', prompt: 'I eat fruit.', answer: ['mi', 'moku', 'e', 'kili'], distractors: ['li'], practisesGrammar: true },
    { id: 'meli-li-jo-e-lipu', type: 'wordBank', direction: 'en-tp', prompt: 'The woman has a book.', answer: ['meli', 'li', 'jo', 'e', 'lipu'], distractors: ['mi'], practisesGrammar: true },
    { id: 'sina-kute-e-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'You hear the animal.', answer: ['sina', 'kute', 'e', 'soweli'], distractors: ['li'], practisesGrammar: true },
    { id: 'jan-li-pali-e-tomo', type: 'wordBank', direction: 'tp-en', prompt: 'jan li pali e tomo', answer: ['the', 'person', 'makes', 'the', 'house'], distractors: ['eats', 'water'] },
    { id: 'mi-sona-e-ni', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi sona e ni', options: ['This knows me.', 'I know this.', 'You know this.'], answer: 'I know this.' },
    { id: 'mi-toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'I am talking.', options: ['mi li toki', 'sina toki', 'mi toki'], answer: 'mi toki' },
  ],
}

export default lesson
