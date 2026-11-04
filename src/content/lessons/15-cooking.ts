import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'cooking',
  title: 'Cooking',
  chapter: 'Lesson 18',
  newWords: ['lape', 'olin', 'pan', 'pini', 'seli', 'supa', 'uta'],
  grammar: {
    title: 'Review: a cooking story',
    explanation: [
      'This lesson takes place in a kitchen and mixes the grammar you have learned: pre-verbs with e, lon with place words, and describing words.',
      'seli means fire or heat, so seli e pan is “to heat the bread”, which is how Toki Pona says “to cook”.',
    ],
  },
  exercises: [
    { id: 'pan', type: 'multipleChoice', direction: 'tp-en', prompt: 'pan', options: ['grain / bread / rice', 'fire / heat / warm', 'table / flat surface'], answer: 'grain / bread / rice' },
    { id: 'seli', type: 'multipleChoice', direction: 'en-tp', prompt: 'fire / heat / warm', options: ['lete', 'seli', 'pan', 'supa'], answer: 'seli' },
    { id: 'supa', type: 'multipleChoice', direction: 'tp-en', prompt: 'supa', options: ['mouth / lips', 'to sleep / to rest', 'table / flat surface'], answer: 'table / flat surface' },
    { id: 'uta', type: 'multipleChoice', direction: 'en-tp', prompt: 'mouth / lips', options: ['lawa', 'noka', 'sinpin', 'uta'], answer: 'uta' },
    { id: 'pini', type: 'multipleChoice', direction: 'tp-en', prompt: 'pini', options: ['to love / love', 'finished / past / to end', 'to sleep / to rest'], answer: 'finished / past / to end' },
    { id: 'olin', type: 'multipleChoice', direction: 'en-tp', prompt: 'to love / love', options: ['pilin', 'olin', 'wile', 'lape'], answer: 'olin' },
    { id: 'lape', type: 'multipleChoice', direction: 'tp-en', prompt: 'lape', options: ['to sleep / to rest', 'to love / love', 'mouth / lips'], answer: 'to sleep / to rest' },
    { id: 'mi-wile-seli-e-pan', type: 'wordBank', direction: 'en-tp', prompt: 'I want to cook the bread.', answer: ['mi', 'wile', 'seli', 'e', 'pan'], distractors: ['li'], practisesGrammar: true, grammarNote: 'The pre-verb wile comes before seli, and e pan follows the main verb seli.' },
    { id: 'pan-li-lon-anpa-supa', type: 'wordBank', direction: 'en-tp', prompt: 'The bread is under the table.', answer: ['pan', 'li', 'lon', 'anpa', 'supa'], distractors: ['sewi'], practisesGrammar: true, grammarNote: '“Under” is the bottom of the table: lon, then anpa, then supa.' },
    { id: 'mi-olin-e-pan-seli', type: 'wordBank', direction: 'tp-en', prompt: 'mi olin e pan seli', answer: ['I', 'love', 'warm', 'bread'], distractors: ['cold', 'table'] },
    { id: 'uta-mi-li-seli', type: 'multipleChoice', direction: 'tp-en', prompt: 'uta mi li seli', options: ['My mouth is cold.', 'My mouth is hot.', 'My head is hot.'], answer: 'My mouth is hot.' },
    { id: 'moku-li-pini', type: 'wordBank', direction: 'en-tp', prompt: 'The food is finished.', answer: ['moku', 'li', 'pini'], distractors: ['open'] },
  ],
}

export default lesson
