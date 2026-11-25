import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'more-words-2',
  title: 'Más palabras 2',
  chapter: 'Diccionario',
  newWords: ['kon', 'kule', 'mani', 'moli', 'mun', 'musi', 'nasa', 'selo', 'sike', 'sitelen', 'ko', 'poki'],
  grammar: {
    title: 'Repaso: las últimas palabras',
    explanation: [
      'Estas son las últimas palabras del curso. Con ellas conoces todas las palabras del diccionario del libro, menos los números.',
      'Usa todo lo que ya sabes: la para el contexto, e para los objetos y lon con palabras de lugar.',
    ],
  },
  exercises: [
    { id: 'kon', type: 'multipleChoice', direction: 'tp-en', prompt: 'kon', options: ['aire / viento / espíritu', 'luna / estrella', 'dinero / riqueza'], answer: 'aire / viento / espíritu' },
    { id: 'kule', type: 'multipleChoice', direction: 'en-tp', prompt: 'color / colorido', options: ['kon', 'kule', 'selo', 'sike'], answer: 'kule' },
    { id: 'mani', type: 'multipleChoice', direction: 'tp-en', prompt: 'mani', options: ['diversión / juego / arte', 'caja / recipiente / cuenco', 'dinero / riqueza'], answer: 'dinero / riqueza' },
    { id: 'moli', type: 'multipleChoice', direction: 'en-tp', prompt: 'muerto / morir / muerte', options: ['musi', 'mun', 'mani', 'moli'], answer: 'moli' },
    { id: 'mun', type: 'multipleChoice', direction: 'tp-en', prompt: 'mun', options: ['piel / capa exterior / cáscara', 'luna / estrella', 'círculo / redondo / pelota'], answer: 'luna / estrella' },
    { id: 'musi', type: 'multipleChoice', direction: 'en-tp', prompt: 'diversión / juego / arte', options: ['nasa', 'musi', 'moli', 'poki'], answer: 'musi' },
    { id: 'nasa', type: 'multipleChoice', direction: 'tp-en', prompt: 'nasa', options: ['raro / tonto / borracho', 'círculo / redondo / pelota', 'muerto / morir / muerte'], answer: 'raro / tonto / borracho' },
    { id: 'selo', type: 'multipleChoice', direction: 'en-tp', prompt: 'piel / capa exterior / cáscara', options: ['sike', 'ko', 'kon', 'selo'], answer: 'selo' },
    { id: 'sike', type: 'multipleChoice', direction: 'tp-en', prompt: 'sike', options: ['imagen / escritura / símbolo', 'caja / recipiente / cuenco', 'círculo / redondo / pelota'], answer: 'círculo / redondo / pelota' },
    { id: 'sitelen', type: 'multipleChoice', direction: 'en-tp', prompt: 'imagen / escritura / símbolo', options: ['lipu', 'sitelen', 'kule', 'mani'], answer: 'sitelen' },
    { id: 'ko', type: 'multipleChoice', direction: 'tp-en', prompt: 'ko', options: ['dinero / riqueza', 'pasta / polvo / masa', 'aire / viento / espíritu'], answer: 'pasta / polvo / masa' },
    { id: 'tenpo-pimeja-la-mi-lukin-e-mun', type: 'wordBank', direction: 'en-tp', prompt: 'De noche, yo veo la luna.', answer: ['tenpo', 'pimeja', 'la', 'mi', 'lukin', 'e', 'mun'], distractors: ['li'], practisesGrammar: true, grammarNote: 'El tiempo va antes de la; luego, mi lukin e mun, con e antes de lo que se ve.' },
    { id: 'mani-li-lon-insa-poki', type: 'wordBank', direction: 'en-tp', prompt: 'El dinero está dentro de la caja.', answer: ['mani', 'li', 'lon', 'insa', 'poki'], distractors: ['sewi'], practisesGrammar: true, grammarNote: '“Dentro de la caja” es lon insa poki: lon, la palabra de lugar y luego la cosa a la que pertenece.' },
    { id: 'musi-ni-li-nasa', type: 'wordBank', direction: 'tp-en', prompt: 'musi ni li nasa', answer: ['este', 'juego', 'es', 'raro'], distractors: ['redondo', 'muerto'] },
  ],
}

export default lesson
