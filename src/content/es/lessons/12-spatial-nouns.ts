import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'spatial-nouns',
  title: 'Sustantivos de lugar',
  chapter: 'Lección 15',
  newWords: ['insa', 'monsi', 'noka', 'poka', 'sewi', 'sinpin'],
  grammar: {
    title: 'Decir exactamente dónde: lon + palabra de lugar',
    explanation: [
      'Algunos sustantivos nombran una parte del espacio: insa (dentro), monsi (detrás), sinpin (delante), poka (al lado), sewi (arriba) y noka (abajo).',
      'Úsalos después de lon, seguidos de la cosa a la que pertenecen: soweli li lon insa tomo quiere decir “el animal está dentro de la casa”.',
    ],
  },
  exercises: [
    { id: 'insa', type: 'multipleChoice', direction: 'tp-en', prompt: 'insa', options: ['dentro / centro / vientre', 'espalda / detrás', 'frente / cara / pared'], answer: 'dentro / centro / vientre' },
    { id: 'monsi', type: 'multipleChoice', direction: 'en-tp', prompt: 'espalda / detrás', options: ['sinpin', 'monsi', 'noka', 'poka'], answer: 'monsi' },
    { id: 'noka', type: 'multipleChoice', direction: 'tp-en', prompt: 'noka', options: ['lado / cerca / cadera', 'frente / cara / pared', 'pierna / pie / parte de abajo'], answer: 'pierna / pie / parte de abajo' },
    { id: 'poka', type: 'multipleChoice', direction: 'en-tp', prompt: 'lado / cerca / cadera', options: ['insa', 'sewi', 'monsi', 'poka'], answer: 'poka' },
    { id: 'sinpin', type: 'multipleChoice', direction: 'tp-en', prompt: 'sinpin', options: ['dentro / centro / vientre', 'frente / cara / pared', 'espalda / detrás'], answer: 'frente / cara / pared' },
    { id: 'soweli-li-lon-insa-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'El animal está dentro de la casa.', answer: ['soweli', 'li', 'lon', 'insa', 'tomo'], distractors: ['tawa'], practisesGrammar: true, grammarNote: 'Después de lon va la palabra de lugar insa, y luego la cosa a la que pertenece: lon insa tomo.' },
    { id: 'sina-lon-poka-mi', type: 'wordBank', direction: 'en-tp', prompt: 'Tú estás a mi lado.', answer: ['sina', 'lon', 'poka', 'mi'], distractors: ['li'], practisesGrammar: true, grammarNote: 'lon poka mi es “a mi lado”: la palabra de lugar, luego de quién es el lado. Con sina, sin li.' },
    { id: 'suno-li-lon-sewi-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'El sol está encima de la casa.', answer: ['suno', 'li', 'lon', 'sewi', 'tomo'], distractors: ['insa'], practisesGrammar: true, grammarNote: '“Encima” es la parte de arriba de la casa: lon, luego sewi, luego tomo.' },
    { id: 'kili-li-lon-noka-kasi', type: 'multipleChoice', direction: 'tp-en', prompt: 'kili li lon noka kasi', options: ['La fruta está en lo alto de la planta.', 'La fruta está dentro de la planta.', 'La fruta está en la parte de abajo de la planta.'], answer: 'La fruta está en la parte de abajo de la planta.' },
    { id: 'jan-li-lon-monsi-tomo', type: 'wordBank', direction: 'tp-en', prompt: 'jan li lon monsi tomo', answer: ['la', 'persona', 'está', 'detrás', 'de', 'la', 'casa'], distractors: ['dentro', 'delante'] },
    { id: 'lon-sinpin-tomo', type: 'multipleChoice', direction: 'en-tp', prompt: 'delante de la casa', options: ['lon monsi tomo', 'lon sinpin tomo', 'lon insa tomo'], answer: 'lon sinpin tomo' },
    { id: 'lon-sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'lon sewi', options: ['detrás', 'dentro', 'arriba'], answer: 'arriba' },
  ],
}

export default lesson
