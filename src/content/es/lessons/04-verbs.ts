import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'verbs',
  title: 'Verbos',
  chapter: 'Lección 5',
  newWords: ['jo', 'kute', 'moku', 'pali', 'sona', 'toki', 'e'],
  grammar: {
    title: 'Hacerle algo a algo: e',
    explanation: [
      'Un verbo puede ir justo después de li, o justo después de mi o sina: mi moku quiere decir “yo como”.',
      'Para decir sobre qué recae la acción, pon e delante: mi moku e kili quiere decir “yo como fruta”.',
      'Con otros sujetos necesitas las dos palabritas: meli li jo e lipu quiere decir “la mujer tiene un libro”.',
    ],
  },
  exercises: [
    { id: 'jo', type: 'multipleChoice', direction: 'tp-en', prompt: 'jo', options: ['tener / sostener', 'oír / escuchar / oreja', 'alimento / comer / beber'], answer: 'tener / sostener' },
    { id: 'kute', type: 'multipleChoice', direction: 'en-tp', prompt: 'oír / escuchar / oreja', options: ['moku', 'kute', 'toki', 'jo'], answer: 'kute' },
    { id: 'moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'moku', options: ['trabajar / hacer / crear', 'saber / conocimiento', 'alimento / comer / beber'], answer: 'alimento / comer / beber' },
    { id: 'pali', type: 'multipleChoice', direction: 'en-tp', prompt: 'trabajar / hacer / crear', options: ['sona', 'jo', 'kute', 'pali'], answer: 'pali' },
    { id: 'sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sona', options: ['hablar / idioma / hola', 'saber / conocimiento', 'tener / sostener'], answer: 'saber / conocimiento' },
    { id: 'toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'hablar / idioma / hola', options: ['moku', 'toki', 'pali', 'sona'], answer: 'toki' },
    { id: 'mi-moku-e-kili', type: 'wordBank', direction: 'en-tp', prompt: 'Yo como fruta.', answer: ['mi', 'moku', 'e', 'kili'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Después de mi, el verbo va directo, sin li, y e marca lo que se come: mi moku e kili.' },
    { id: 'meli-li-jo-e-lipu', type: 'wordBank', direction: 'en-tp', prompt: 'La mujer tiene un libro.', answer: ['meli', 'li', 'jo', 'e', 'lipu'], distractors: ['mi'], practisesGrammar: true, grammarNote: 'meli no es mi ni sina, así que li va antes del verbo, y e va antes de lo que ella tiene.' },
    { id: 'sina-kute-e-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'Tú oyes al animal.', answer: ['sina', 'kute', 'e', 'soweli'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Después de sina no hay li, y e marca lo que se oye: sina kute e soweli.' },
    { id: 'jan-li-pali-e-tomo', type: 'wordBank', direction: 'tp-en', prompt: 'jan li pali e tomo', answer: ['la', 'persona', 'hace', 'la', 'casa'], distractors: ['come', 'agua'] },
    { id: 'mi-sona-e-ni', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi sona e ni', options: ['Esto me conoce.', 'Yo sé esto.', 'Tú sabes esto.'], answer: 'Yo sé esto.' },
    { id: 'mi-toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'Yo estoy hablando.', options: ['mi li toki', 'sina toki', 'mi toki'], answer: 'mi toki' },
  ],
}

export default lesson
