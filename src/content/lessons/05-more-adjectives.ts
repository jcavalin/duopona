import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'more-adjectives',
  title: 'More Adjectives',
  chapter: 'Lesson 6',
  newWords: ['ala', 'ike', 'mute', 'pu', 'sewi', 'wan', 'mama'],
  grammar: {
    title: 'Saying no with ala, and stacking describing words',
    explanation: [
      'To say “not”, put ala right after the word you want to deny: mi moku ala means “I do not eat”.',
      'A noun can take several describing words in a row. Each one adds to everything before it: soweli lili mute is “many small animals”.',
    ],
  },
  exercises: [
    { id: 'ala', type: 'multipleChoice', direction: 'tp-en', prompt: 'ala', options: ['not / no / none', 'many / a lot / very', 'one / single / united'], answer: 'not / no / none' },
    { id: 'ike', type: 'multipleChoice', direction: 'en-tp', prompt: 'bad / negative', options: ['pona', 'ike', 'sin', 'wawa'], answer: 'ike' },
    { id: 'mute', type: 'multipleChoice', direction: 'tp-en', prompt: 'mute', options: ['one / single / united', 'bad / negative', 'many / a lot / very'], answer: 'many / a lot / very' },
    { id: 'wan', type: 'multipleChoice', direction: 'en-tp', prompt: 'one / single / united', options: ['mute', 'ala', 'lili', 'wan'], answer: 'wan' },
    { id: 'mama', type: 'multipleChoice', direction: 'tp-en', prompt: 'mama', options: ['man / male', 'parent / caretaker / origin', 'group / community'], answer: 'parent / caretaker / origin' },
    { id: 'sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'sewi', options: ['small / little / young', 'new / fresh / extra', 'high / above / divine'], answer: 'high / above / divine' },
    { id: 'lipu-pu', type: 'multipleChoice', direction: 'tp-en', prompt: 'lipu pu', options: ['the official Toki Pona book', 'a new book', 'a bad book'], answer: 'the official Toki Pona book' },
    { id: 'mi-moku-ala', type: 'wordBank', direction: 'en-tp', prompt: 'I do not eat.', answer: ['mi', 'moku', 'ala'], distractors: ['ike'], practisesGrammar: true, grammarNote: 'ala goes right after the word it denies, here the verb: mi moku ala.' },
    { id: 'telo-li-pona-ala', type: 'wordBank', direction: 'en-tp', prompt: 'The water is not good.', answer: ['telo', 'li', 'pona', 'ala'], distractors: ['mute'], practisesGrammar: true, grammarNote: 'ala follows the word it denies, so “not good” is pona ala, after li.' },
    { id: 'soweli-lili-mute', type: 'wordBank', direction: 'tp-en', prompt: 'soweli lili mute', answer: ['many', 'small', 'animals'], distractors: ['one', 'big'], practisesGrammar: true, grammarNote: 'Each describing word adds to everything before it: soweli lili is “small animal”, and mute makes it many of them.' },
    { id: 'mama-mi-li-wawa-mute', type: 'wordBank', direction: 'tp-en', prompt: 'mama mi li wawa mute', answer: ['my', 'parent', 'is', 'very', 'strong'], distractors: ['not', 'new'] },
    { id: 'lipu-ike', type: 'multipleChoice', direction: 'en-tp', prompt: 'a bad book', options: ['ike lipu', 'lipu li ike', 'lipu ike'], answer: 'lipu ike' },
    { id: 'ijo-sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'ijo sewi', options: ['a high thing', 'a new thing', 'one thing'], answer: 'a high thing' },
  ],
}

export default lesson
