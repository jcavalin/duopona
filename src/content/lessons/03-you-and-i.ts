import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'you-and-i',
  title: 'You and I',
  chapter: 'Lesson 4',
  newWords: ['mi', 'mije', 'sina', 'kulupu', 'sin', 'wawa'],
  grammar: {
    title: 'mi and sina need no li',
    explanation: [
      'When the subject is just mi (I, we) or just sina (you), leave li out: mi wawa means “I am strong”.',
      'Every other subject still takes li: mije li wawa means “the man is strong”.',
      'Placed after a noun, mi and sina mean “my” and “your”: kulupu mi is “my group”.',
    ],
  },
  exercises: [
    { id: 'mi', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi', options: ['I / me / we', 'you', 'man / male'], answer: 'I / me / we' },
    { id: 'sina', type: 'multipleChoice', direction: 'en-tp', prompt: 'you', options: ['mi', 'sina', 'mije', 'meli'], answer: 'sina' },
    { id: 'mije', type: 'multipleChoice', direction: 'tp-en', prompt: 'mije', options: ['woman / female', 'group / community', 'man / male'], answer: 'man / male' },
    { id: 'kulupu', type: 'multipleChoice', direction: 'en-tp', prompt: 'group / community', options: ['kili', 'lipu', 'tomo', 'kulupu'], answer: 'kulupu' },
    { id: 'sin', type: 'multipleChoice', direction: 'tp-en', prompt: 'sin', options: ['strong / powerful / energy', 'new / fresh / extra', 'small / little / young'], answer: 'new / fresh / extra' },
    { id: 'wawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'strong / powerful / energy', options: ['sin', 'wawa', 'suli', 'pona'], answer: 'wawa' },
    { id: 'mi-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'I am strong.', answer: ['mi', 'wawa'], distractors: ['li', 'sina'], practisesGrammar: true },
    { id: 'sina-pona', type: 'wordBank', direction: 'en-tp', prompt: 'You are good.', answer: ['sina', 'pona'], distractors: ['li', 'mi'], practisesGrammar: true },
    { id: 'mije-li-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'The man is strong.', answer: ['mije', 'li', 'wawa'], distractors: ['mi'], practisesGrammar: true },
    { id: 'sina-jan-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sina jan pona', options: ['You are a good person.', 'I am a good person.', 'The person is good.'], answer: 'You are a good person.' },
    { id: 'kulupu-sina-li-wawa', type: 'wordBank', direction: 'tp-en', prompt: 'kulupu sina li wawa', answer: ['your', 'group', 'is', 'strong'], distractors: ['my', 'new'] },
    { id: 'lipu-sin', type: 'multipleChoice', direction: 'en-tp', prompt: 'a new book', options: ['sin lipu', 'lipu li sin', 'lipu sin'], answer: 'lipu sin' },
    { id: 'mi-meli', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi meli', options: ['I am a woman.', 'You are a woman.', 'my house'], answer: 'I am a woman.' },
  ],
}

export default lesson
