import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'nouns-and-adjectives',
  title: 'Sustantivos y adjetivos',
  chapter: 'Lección 3',
  newWords: ['telo', 'tomo', 'lili', 'pona', 'suli'],
  grammar: {
    title: 'La palabra que describe va después del sustantivo',
    explanation: [
      'En toki pona, la palabra que describe va después de la palabra descrita: tomo suli es “una casa grande”, nunca suli tomo.',
      'También puedes poner una palabra que describe después de li para decir cómo es algo: tomo li pona quiere decir “la casa es buena”.',
    ],
  },
  exercises: [
    { id: 'telo', type: 'multipleChoice', direction: 'tp-en', prompt: 'telo', options: ['agua / líquido', 'casa / edificio / habitación', 'pequeño / joven', 'bueno / útil / simple'], answer: 'agua / líquido' },
    { id: 'tomo', type: 'multipleChoice', direction: 'en-tp', prompt: 'casa / edificio / habitación', options: ['telo', 'tomo', 'lipu', 'kili'], answer: 'tomo' },
    { id: 'lili', type: 'multipleChoice', direction: 'tp-en', prompt: 'lili', options: ['grande / importante / largo', 'bueno / útil / simple', 'pequeño / joven'], answer: 'pequeño / joven' },
    { id: 'pona', type: 'multipleChoice', direction: 'en-tp', prompt: 'bueno / útil / simple', options: ['suli', 'lili', 'ijo', 'pona'], answer: 'pona' },
    { id: 'suli', type: 'multipleChoice', direction: 'tp-en', prompt: 'suli', options: ['pequeño / joven', 'grande / importante / largo', 'agua / líquido'], answer: 'grande / importante / largo' },
    { id: 'tomo-lili', type: 'wordBank', direction: 'en-tp', prompt: 'una casa pequeña', answer: ['tomo', 'lili'], distractors: ['suli'], practisesGrammar: true, grammarNote: 'La palabra que describe va después del sustantivo: tomo lili, nunca lili tomo.' },
    { id: 'tomo-li-pona', type: 'wordBank', direction: 'en-tp', prompt: 'La casa es buena.', answer: ['tomo', 'li', 'pona'], distractors: ['telo'], practisesGrammar: true, grammarNote: 'Para decir cómo es la casa, pon la palabra que describe después de li: tomo li pona.' },
    { id: 'jan-suli', type: 'wordBank', direction: 'tp-en', prompt: 'jan suli', answer: ['una', 'persona', 'grande'], distractors: ['pequeña', 'casa'] },
    { id: 'kili-lili-li-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'kili lili li pona', options: ['La fruta buena es pequeña.', 'La fruta es una cosa pequeña.', 'La fruta pequeña es buena.'], answer: 'La fruta pequeña es buena.' },
    { id: 'tomo-suli-li-ijo-pona', type: 'wordBank', direction: 'en-tp', prompt: 'La casa grande es una cosa buena.', answer: ['tomo', 'suli', 'li', 'ijo', 'pona'], distractors: ['lili'], practisesGrammar: true, grammarNote: 'Cada palabra que describe sigue a su sustantivo: tomo suli antes de li, ijo pona después.' },
    { id: 'telo-pona', type: 'multipleChoice', direction: 'en-tp', prompt: 'agua buena', options: ['pona telo', 'telo pona', 'telo suli'], answer: 'telo pona' },
    { id: 'lipu-ni-li-lili', type: 'wordBank', direction: 'en-tp', prompt: 'Este libro es pequeño.', answer: ['lipu', 'ni', 'li', 'lili'], distractors: ['suli'], practisesGrammar: true, grammarNote: 'ni describe a lipu, así que va después: lipu ni es “este libro”. Luego li lili dice que es pequeño.' },
    { id: 'meli-li-suli', type: 'multipleChoice', direction: 'tp-en', prompt: 'meli li suli', options: ['La mujer es grande.', 'La mujer es pequeña.', 'una mujer grande'], answer: 'La mujer es grande.' },
  ],
}

export default lesson
