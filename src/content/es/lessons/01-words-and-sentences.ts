import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'words-and-sentences',
  title: 'Palabras y oraciones',
  chapter: 'Lección 2',
  newWords: ['ijo', 'jan', 'kili', 'lipu', 'meli', 'ni', 'soweli', 'li'],
  grammar: {
    title: 'Decir qué es algo: SUSTANTIVO li SUSTANTIVO',
    explanation: [
      'Una oración básica en toki pona nombra algo y luego dice qué es. La palabrita li va entre las dos partes.',
      'ni li meli quiere decir “esto es una mujer”. No hay palabras para “un”, “el” ni “es”: li hace ese trabajo.',
    ],
  },
  exercises: [
    { id: 'jan', type: 'multipleChoice', direction: 'tp-en', prompt: 'jan', options: ['persona / alguien', 'fruta / verdura', 'cosa / objeto', 'animal / mamífero terrestre'], answer: 'persona / alguien' },
    { id: 'kili', type: 'multipleChoice', direction: 'en-tp', prompt: 'fruta / verdura', options: ['kili', 'lipu', 'meli', 'ijo'], answer: 'kili' },
    { id: 'soweli', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli', options: ['animal / mamífero terrestre', 'mujer / femenino', 'papel / libro / documento'], answer: 'animal / mamífero terrestre' },
    { id: 'lipu', type: 'multipleChoice', direction: 'en-tp', prompt: 'papel / libro / documento', options: ['lipu', 'soweli', 'jan', 'ni'], answer: 'lipu' },
    { id: 'meli', type: 'multipleChoice', direction: 'tp-en', prompt: 'meli', options: ['mujer / femenino', 'persona / alguien', 'esto / eso'], answer: 'mujer / femenino' },
    { id: 'ijo', type: 'multipleChoice', direction: 'en-tp', prompt: 'cosa / objeto', options: ['ijo', 'kili', 'meli', 'soweli'], answer: 'ijo' },
    { id: 'ni', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni', options: ['esto / eso', 'cosa / objeto', 'animal / mamífero terrestre', 'fruta / verdura'], answer: 'esto / eso' },
    { id: 'ni-li-meli', type: 'wordBank', direction: 'en-tp', prompt: 'Esto es una mujer.', answer: ['ni', 'li', 'meli'], distractors: ['lipu'], practisesGrammar: true, grammarNote: 'ni nombra la cosa y meli dice qué es, así que li va entre las dos. Ninguna palabra dice “es una”: li hace ese trabajo.' },
    { id: 'ijo-li-kili', type: 'wordBank', direction: 'tp-en', prompt: 'ijo li kili', answer: ['la', 'cosa', 'es', 'una', 'fruta'], distractors: ['persona', 'libro'] },
    { id: 'ijo-li-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'La cosa es un animal.', answer: ['ijo', 'li', 'soweli'], distractors: ['jan'], practisesGrammar: true, grammarNote: 'ijo es el sujeto y soweli dice qué es, así que li va entre los dos. El toki pona no tiene “el”, “un” ni “es”.' },
    { id: 'ni-li-ijo', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni li ijo', options: ['Esto es una cosa.', 'Esto es un animal.', 'La cosa es un libro.'], answer: 'Esto es una cosa.' },
    { id: 'ni-li-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'Eso es un animal.', answer: ['ni', 'li', 'soweli'], distractors: ['jan'], practisesGrammar: true, grammarNote: '“Eso” también se dice ni, así que el patrón es el mismo: la cosa, luego li, luego qué es.' },
    { id: 'ijo-li-lipu', type: 'multipleChoice', direction: 'en-tp', prompt: 'La cosa es un libro.', options: ['ijo li kili', 'ijo li lipu', 'meli li lipu'], answer: 'ijo li lipu' },
  ],
}

export default lesson
