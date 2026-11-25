import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'particles-and-perspective',
  title: 'Partículas y perspectiva',
  chapter: 'Lección 16',
  newWords: ['anpa', 'ante', 'en', 'lete', 'lupa', 'open', 'sama', 'suwi', 'taso', 'tawa'],
  grammar: {
    title: 'Unir sujetos con en, y taso',
    explanation: [
      'en une dos sujetos: mije en meli li moku quiere decir “el hombre y la mujer comen”. Con en, li siempre hace falta, incluso con mi o sina.',
      'taso después de una palabra quiere decir “solo”: mi moku e kili taso quiere decir “yo como solo fruta”. Al principio de la oración quiere decir “pero”: taso mi lete.',
      'tawa también puede querer decir “para” o “en opinión de”: kili suwi li pona tawa mi quiere decir “me gusta la fruta dulce” (la fruta dulce es buena para mí).',
    ],
  },
  exercises: [
    { id: 'anpa', type: 'multipleChoice', direction: 'tp-en', prompt: 'anpa', options: ['abajo / hacia abajo / humilde', 'diferente / otro / cambiado', 'dulce / tierno'], answer: 'abajo / hacia abajo / humilde' },
    { id: 'ante', type: 'multipleChoice', direction: 'en-tp', prompt: 'diferente / otro / cambiado', options: ['sama', 'ante', 'suwi', 'lete'], answer: 'ante' },
    { id: 'lete', type: 'multipleChoice', direction: 'tp-en', prompt: 'lete', options: ['dulce / tierno', 'abrir / empezar', 'frío / crudo'], answer: 'frío / crudo' },
    { id: 'lupa', type: 'multipleChoice', direction: 'en-tp', prompt: 'agujero / puerta / ventana', options: ['open', 'anpa', 'taso', 'lupa'], answer: 'lupa' },
    { id: 'open', type: 'multipleChoice', direction: 'tp-en', prompt: 'open', options: ['solo / pero', 'abrir / empezar', 'igual / similar / como'], answer: 'abrir / empezar' },
    { id: 'sama', type: 'multipleChoice', direction: 'en-tp', prompt: 'igual / similar / como', options: ['ante', 'sama', 'en', 'lete'], answer: 'sama' },
    { id: 'suwi', type: 'multipleChoice', direction: 'tp-en', prompt: 'suwi', options: ['dulce / tierno', 'frío / crudo', 'abajo / hacia abajo / humilde'], answer: 'dulce / tierno' },
    { id: 'mije-en-meli-li-moku', type: 'multipleChoice', direction: 'en-tp', prompt: 'El hombre y la mujer están comiendo.', options: ['mije en meli moku', 'mije en meli li moku', 'mije li meli li moku'], answer: 'mije en meli li moku' },
    { id: 'mi-moku-e-kili-taso', type: 'wordBank', direction: 'en-tp', prompt: 'Yo como solo fruta.', answer: ['mi', 'moku', 'e', 'kili', 'taso'], distractors: ['en'], practisesGrammar: true, grammarNote: 'taso después de una palabra quiere decir “solo”, así que kili taso es “solo fruta”, al final de la parte con e.' },
    { id: 'taso-mi-lete', type: 'wordBank', direction: 'en-tp', prompt: 'Pero yo tengo frío.', answer: ['taso', 'mi', 'lete'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Al principio de la oración, taso quiere decir “pero”; luego va mi lete, sin li después de mi.' },
    { id: 'kili-suwi-li-pona-tawa-mi', type: 'wordBank', direction: 'en-tp', prompt: 'Me gusta la fruta dulce.', answer: ['kili', 'suwi', 'li', 'pona', 'tawa', 'mi'], distractors: ['e'], practisesGrammar: true, grammarNote: 'El toki pona dice “la fruta dulce es buena para mí”: kili suwi li pona, luego tawa mi.' },
    { id: 'lupa-li-open', type: 'wordBank', direction: 'tp-en', prompt: 'lupa li open', answer: ['la', 'puerta', 'está', 'abierta'], distractors: ['fría', 'dulce'] },
    { id: 'ni-li-sama', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni li sama', options: ['Esto es igual.', 'Esto es diferente.', 'Esto está abajo.'], answer: 'Esto es igual.' },
    { id: 'tomo-ante', type: 'multipleChoice', direction: 'tp-en', prompt: 'tomo ante', options: ['la misma casa', 'una casa diferente', 'una casa fría'], answer: 'una casa diferente' },
  ],
}

export default lesson
