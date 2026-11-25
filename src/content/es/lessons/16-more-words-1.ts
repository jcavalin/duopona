import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'more-words-1',
  title: 'Más palabras 1',
  chapter: 'Diccionario',
  newWords: ['ma', 'nasin', 'nena', 'nimi', 'utala', 'akesi', 'jaki', 'kalama', 'kiwen', 'ale', 'esun'],
  grammar: {
    title: 'Repaso: más palabras',
    explanation: [
      'Estas palabras completan el vocabulario del diccionario del libro. Practícalas con toda la gramática que conoces.',
      'ale quiere decir “todo” o “todos” (también puedes encontrarlo escrito ali). nimi quiere decir “palabra” o “nombre”.',
    ],
  },
  exercises: [
    { id: 'ma', type: 'multipleChoice', direction: 'tp-en', prompt: 'ma', options: ['tierra / país / lugar', 'camino / carretera / método', 'colina / bulto / nariz'], answer: 'tierra / país / lugar' },
    { id: 'nasin', type: 'multipleChoice', direction: 'en-tp', prompt: 'camino / carretera / método', options: ['nena', 'nasin', 'ma', 'nimi'], answer: 'nasin' },
    { id: 'nena', type: 'multipleChoice', direction: 'tp-en', prompt: 'nena', options: ['piedra / roca / duro', 'sonido / ruido', 'colina / bulto / nariz'], answer: 'colina / bulto / nariz' },
    { id: 'nimi', type: 'multipleChoice', direction: 'en-tp', prompt: 'palabra / nombre', options: ['toki', 'kalama', 'lipu', 'nimi'], answer: 'nimi' },
    { id: 'utala', type: 'multipleChoice', direction: 'tp-en', prompt: 'utala', options: ['cazar / recolectar', 'luchar / batalla', 'mercado / tienda / comercio'], answer: 'luchar / batalla' },
    { id: 'akesi', type: 'multipleChoice', direction: 'en-tp', prompt: 'reptil / anfibio', options: ['pipi', 'akesi', 'waso', 'kala'], answer: 'akesi' },
    { id: 'jaki', type: 'multipleChoice', direction: 'tp-en', prompt: 'jaki', options: ['sucio / asqueroso / tóxico', 'piedra / roca / duro', 'todo / todas las cosas / vida'], answer: 'sucio / asqueroso / tóxico' },
    { id: 'kalama', type: 'multipleChoice', direction: 'en-tp', prompt: 'sonido / ruido', options: ['kiwen', 'esun', 'ale', 'kalama'], answer: 'kalama' },
    { id: 'esun', type: 'multipleChoice', direction: 'tp-en', prompt: 'esun', options: ['piedra / roca / duro', 'tierra / país / lugar', 'mercado / tienda / comercio'], answer: 'mercado / tienda / comercio' },
    { id: 'utala-la-mi-kute-e-kalama-mute', type: 'wordBank', direction: 'en-tp', prompt: 'En una pelea, yo oigo muchos sonidos.', answer: ['utala', 'la', 'mi', 'kute', 'e', 'kalama', 'mute'], distractors: ['li'], practisesGrammar: true, grammarNote: 'utala sitúa la escena antes de la. En la oración principal, e marca lo que se oye, y mute va después de kalama.' },
    { id: 'akesi-li-lon-sewi-kiwen', type: 'wordBank', direction: 'en-tp', prompt: 'El reptil está encima de la piedra.', answer: ['akesi', 'li', 'lon', 'sewi', 'kiwen'], distractors: ['e'], practisesGrammar: true, grammarNote: '“Encima de” es lon sewi, seguido de la cosa: lon sewi kiwen.' },
    { id: 'nimi-pi-ma-ni-li-seme', type: 'wordBank', direction: 'tp-en', prompt: 'nimi pi ma ni li seme?', answer: ['cuál', 'es', 'el', 'nombre', 'de', 'esta', 'tierra'], distractors: ['carretera', 'colina'] },
    { id: 'soweli-ale-li-lon-ma', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli ale li lon ma', options: ['Todos los animales están en la tierra.', 'Un animal está en la tierra.', 'Los animales están en el agua.'], answer: 'Todos los animales están en la tierra.' },
  ],
}

export default lesson
