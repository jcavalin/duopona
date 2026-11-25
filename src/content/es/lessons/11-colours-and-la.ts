import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'colours-and-la',
  title: 'Colores y la',
  chapter: 'Lección 14',
  newWords: ['jelo', 'laso', 'loje', 'pimeja', 'walo', 'la'],
  grammar: {
    title: 'Colores, y situar la escena con la',
    explanation: [
      'Los colores son palabras que describen como las demás: kili loje es “una fruta roja”. laso abarca tanto el azul como el verde.',
      'la permite situar la escena primero. Pon un contexto antes de la y, después, la oración principal: tenpo suno la mi pali quiere decir “de día, yo trabajo”.',
      'El contexto también puede ser una oración entera, como “si” o “cuando”: sina pali la mi moku quiere decir “si tú trabajas, yo como”.',
    ],
  },
  exercises: [
    { id: 'jelo', type: 'multipleChoice', direction: 'tp-en', prompt: 'jelo', options: ['amarillo', 'rojo', 'blanco / claro'], answer: 'amarillo' },
    { id: 'laso', type: 'multipleChoice', direction: 'en-tp', prompt: 'azul / verde', options: ['loje', 'laso', 'walo', 'pimeja'], answer: 'laso' },
    { id: 'loje', type: 'multipleChoice', direction: 'tp-en', prompt: 'loje', options: ['amarillo', 'negro / oscuro', 'rojo'], answer: 'rojo' },
    { id: 'pimeja', type: 'multipleChoice', direction: 'en-tp', prompt: 'negro / oscuro', options: ['walo', 'jelo', 'laso', 'pimeja'], answer: 'pimeja' },
    { id: 'walo', type: 'multipleChoice', direction: 'tp-en', prompt: 'walo', options: ['azul / verde', 'blanco / claro', 'rojo'], answer: 'blanco / claro' },
    { id: 'tenpo-suno-la-mi-pali', type: 'wordBank', direction: 'en-tp', prompt: 'De día, yo trabajo.', answer: ['tenpo', 'suno', 'la', 'mi', 'pali'], distractors: ['li'], practisesGrammar: true, grammarNote: 'tenpo suno sitúa la escena, así que va primero, luego la, luego la oración principal mi pali.' },
    { id: 'tenpo-pimeja-la-mi-awen', type: 'wordBank', direction: 'en-tp', prompt: 'De noche, yo me quedo en casa.', answer: ['tenpo', 'pimeja', 'la', 'mi', 'awen', 'lon', 'tomo'], distractors: ['li'], practisesGrammar: true, grammarNote: 'El tiempo, tenpo pimeja, va antes de la; la oración principal va después, con lon tomo al final.' },
    { id: 'kili-loje', type: 'wordBank', direction: 'en-tp', prompt: 'una fruta roja', answer: ['kili', 'loje'], distractors: ['laso'] },
    { id: 'tenpo-ni-la-mi-moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'tenpo ni la mi moku', options: ['Yo comí esto.', 'Yo quiero comer esto.', 'Ahora yo estoy comiendo.'], answer: 'Ahora yo estoy comiendo.' },
    { id: 'telo-laso-li-suli', type: 'wordBank', direction: 'tp-en', prompt: 'telo laso li suli', answer: ['el', 'agua', 'azul', 'es', 'grande'], distractors: ['roja', 'pequeña'] },
    { id: 'tomo-li-walo', type: 'multipleChoice', direction: 'en-tp', prompt: 'La casa es blanca.', options: ['tomo walo', 'tomo li walo', 'walo li tomo'], answer: 'tomo li walo' },
    { id: 'sina-pali-la-mi-moku', type: 'wordBank', direction: 'en-tp', prompt: 'Si tú trabajas, yo como.', answer: ['sina', 'pali', 'la', 'mi', 'moku'], distractors: ['e'], practisesGrammar: true, grammarNote: 'La parte del “si” es una oración entera antes de la; la oración principal mi moku va después.' },
  ],
}

export default lesson
