import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'words-and-sentences',
  title: 'Words and Sentences',
  chapter: 'Lesson 2',
  newWords: ['ijo', 'jan', 'kili', 'lipu', 'meli', 'ni', 'soweli', 'li'],
  grammar: {
    title: 'Saying what something is: NOUN li NOUN',
    explanation: [
      'A basic Toki Pona sentence names something, then says what it is. The little word li sits between the two parts.',
      'ni li meli means “this is a woman”. There are no words for “a”, “the” or “is”: li does that job.',
    ],
  },
  exercises: [
    { id: 'jan', type: 'multipleChoice', direction: 'tp-en', prompt: 'jan', options: ['person / someone', 'fruit / vegetable', 'thing / object', 'animal / mammal'], answer: 'person / someone' },
    { id: 'kili', type: 'multipleChoice', direction: 'en-tp', prompt: 'fruit / vegetable', options: ['kili', 'lipu', 'meli', 'ijo'], answer: 'kili' },
    { id: 'soweli', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli', options: ['animal / mammal', 'woman / female', 'paper / book / document'], answer: 'animal / mammal' },
    { id: 'lipu', type: 'multipleChoice', direction: 'en-tp', prompt: 'paper / book / document', options: ['lipu', 'soweli', 'jan', 'ni'], answer: 'lipu' },
    { id: 'meli', type: 'multipleChoice', direction: 'tp-en', prompt: 'meli', options: ['woman / female', 'person / someone', 'this / that'], answer: 'woman / female' },
    { id: 'ijo', type: 'multipleChoice', direction: 'en-tp', prompt: 'thing / object', options: ['ijo', 'kili', 'meli', 'soweli'], answer: 'ijo' },
    { id: 'ni', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni', options: ['this / that', 'thing / object', 'animal / mammal', 'fruit / vegetable'], answer: 'this / that' },
    { id: 'ni-li-meli', type: 'wordBank', direction: 'en-tp', prompt: 'This is a woman.', answer: ['ni', 'li', 'meli'], distractors: ['lipu'], practisesGrammar: true },
    { id: 'ijo-li-kili', type: 'wordBank', direction: 'tp-en', prompt: 'ijo li kili', answer: ['the', 'thing', 'is', 'a', 'fruit'], distractors: ['person', 'book'] },
    { id: 'ijo-li-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'The thing is an animal.', answer: ['ijo', 'li', 'soweli'], distractors: ['jan'], practisesGrammar: true },
    { id: 'ni-li-ijo', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni li ijo', options: ['This is a thing.', 'This is an animal.', 'The thing is a book.'], answer: 'This is a thing.' },
    { id: 'ni-li-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'That is an animal.', answer: ['ni', 'li', 'soweli'], distractors: ['jan'], practisesGrammar: true },
    { id: 'ijo-li-lipu', type: 'multipleChoice', direction: 'en-tp', prompt: 'The thing is a book.', options: ['ijo li kili', 'ijo li lipu', 'meli li lipu'], answer: 'ijo li lipu' },
  ],
}

export default lesson
