import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'prepositions',
  title: 'Prepositions',
  chapter: 'Lesson 8',
  newWords: ['pana', 'tawa', 'lon', 'kepeken', 'tan'],
  grammar: {
    title: 'Where, to where, from where, with what',
    explanation: [
      'lon, tawa, tan and kepeken add extra detail at the end of a sentence: where something is (lon), where it goes (tawa), where it comes from (tan) and what tool is used (kepeken).',
      'They come after the verb and its e part: mi pana e kili tawa meli means “I give fruit to the woman”.',
      'They can also be the verb on their own: sina lon tomo means “you are in the house”.',
    ],
  },
  exercises: [
    { id: 'pana', type: 'multipleChoice', direction: 'tp-en', prompt: 'pana', options: ['to give / to send', 'to have / to hold', 'to hear / to listen / ear'], answer: 'to give / to send' },
    { id: 'tawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'to / toward / moving', options: ['tan', 'tawa', 'lon', 'pana'], answer: 'tawa' },
    { id: 'lon', type: 'multipleChoice', direction: 'tp-en', prompt: 'lon', options: ['from / because of', 'using / with (a tool)', 'at / in / present'], answer: 'at / in / present' },
    { id: 'kepeken', type: 'multipleChoice', direction: 'en-tp', prompt: 'using / with (a tool)', options: ['tawa', 'jo', 'pali', 'kepeken'], answer: 'kepeken' },
    { id: 'tan', type: 'multipleChoice', direction: 'tp-en', prompt: 'tan', options: ['to / toward / moving', 'from / because of', 'at / in / present'], answer: 'from / because of' },
    { id: 'sina-lon-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'You are in the house.', answer: ['sina', 'lon', 'tomo'], distractors: ['tawa'], practisesGrammar: true },
    { id: 'mi-pana-e-kili-tawa-meli', type: 'wordBank', direction: 'en-tp', prompt: 'I give fruit to the woman.', answer: ['mi', 'pana', 'e', 'kili', 'tawa', 'meli'], distractors: ['lon'], practisesGrammar: true },
    { id: 'ona-li-pali-kepeken-ilo', type: 'wordBank', direction: 'en-tp', prompt: 'She works using a tool.', answer: ['ona', 'li', 'pali', 'kepeken', 'ilo'], distractors: ['tan'], practisesGrammar: true },
    { id: 'kala-li-tan-telo', type: 'wordBank', direction: 'tp-en', prompt: 'kala li tan telo', answer: ['the', 'fish', 'comes', 'from', 'water'], distractors: ['goes', 'in'] },
    { id: 'mi-tawa-tomo', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi tawa tomo', options: ['I go to the house.', 'I am in the house.', 'I come from the house.'], answer: 'I go to the house.' },
    { id: 'soweli-li-lon-telo', type: 'multipleChoice', direction: 'en-tp', prompt: 'The animal is at the water.', options: ['soweli li tan telo', 'soweli li lon telo', 'soweli li tawa telo'], answer: 'soweli li lon telo' },
    { id: 'mi-toki-tawa-sina', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi toki tawa sina', options: ['You talk to me.', 'I come from you.', 'I talk to you.'], answer: 'I talk to you.' },
  ],
}

export default lesson
