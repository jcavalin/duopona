import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'more-words-2',
  title: 'More Words 2',
  chapter: 'Dictionary',
  newWords: ['kon', 'kule', 'mani', 'moli', 'mun', 'musi', 'nasa', 'selo', 'sike', 'sitelen', 'ko', 'poki'],
  grammar: {
    title: 'Review: the last words',
    explanation: [
      'These are the last words of the course. With them you know every word in the book’s dictionary except the number words.',
      'Use everything you have learned: la for context, e for objects, and lon with place words.',
    ],
  },
  exercises: [
    { id: 'kon', type: 'multipleChoice', direction: 'tp-en', prompt: 'kon', options: ['air / wind / spirit', 'moon / night sky object', 'money / wealth'], answer: 'air / wind / spirit' },
    { id: 'kule', type: 'multipleChoice', direction: 'en-tp', prompt: 'colour / colourful', options: ['kon', 'kule', 'selo', 'sike'], answer: 'kule' },
    { id: 'mani', type: 'multipleChoice', direction: 'tp-en', prompt: 'mani', options: ['fun / game / art', 'box / container / bowl', 'money / wealth'], answer: 'money / wealth' },
    { id: 'moli', type: 'multipleChoice', direction: 'en-tp', prompt: 'dead / to die / death', options: ['musi', 'mun', 'mani', 'moli'], answer: 'moli' },
    { id: 'mun', type: 'multipleChoice', direction: 'tp-en', prompt: 'mun', options: ['skin / outer layer / shell', 'moon / night sky object', 'circle / round / ball'], answer: 'moon / night sky object' },
    { id: 'musi', type: 'multipleChoice', direction: 'en-tp', prompt: 'fun / game / art', options: ['nasa', 'musi', 'moli', 'poki'], answer: 'musi' },
    { id: 'nasa', type: 'multipleChoice', direction: 'tp-en', prompt: 'nasa', options: ['strange / silly / drunk', 'circle / round / ball', 'dead / to die / death'], answer: 'strange / silly / drunk' },
    { id: 'selo', type: 'multipleChoice', direction: 'en-tp', prompt: 'skin / outer layer / shell', options: ['sike', 'ko', 'kon', 'selo'], answer: 'selo' },
    { id: 'sike', type: 'multipleChoice', direction: 'tp-en', prompt: 'sike', options: ['picture / writing / symbol', 'box / container / bowl', 'circle / round / ball'], answer: 'circle / round / ball' },
    { id: 'sitelen', type: 'multipleChoice', direction: 'en-tp', prompt: 'picture / writing / symbol', options: ['lipu', 'sitelen', 'kule', 'mani'], answer: 'sitelen' },
    { id: 'ko', type: 'multipleChoice', direction: 'tp-en', prompt: 'ko', options: ['money / wealth', 'paste / powder / dough', 'air / wind / spirit'], answer: 'paste / powder / dough' },
    { id: 'tenpo-pimeja-la-mi-lukin-e-mun', type: 'wordBank', direction: 'en-tp', prompt: 'At night, I see the moon.', answer: ['tenpo', 'pimeja', 'la', 'mi', 'lukin', 'e', 'mun'], distractors: ['li'], practisesGrammar: true },
    { id: 'mi-pana-e-mani-lon-insa-poki', type: 'wordBank', direction: 'en-tp', prompt: 'I put the money inside the box.', answer: ['mi', 'pana', 'e', 'mani', 'lon', 'insa', 'poki'], distractors: ['tawa'], practisesGrammar: true },
    { id: 'musi-ni-li-nasa', type: 'wordBank', direction: 'tp-en', prompt: 'musi ni li nasa', answer: ['this', 'game', 'is', 'strange'], distractors: ['round', 'dead'] },
  ],
}

export default lesson
