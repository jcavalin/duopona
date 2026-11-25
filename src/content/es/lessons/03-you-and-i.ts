import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'you-and-i',
  title: 'Tú y yo',
  chapter: 'Lección 4',
  newWords: ['mi', 'mije', 'sina', 'kulupu', 'sin', 'wawa'],
  grammar: {
    title: 'mi y sina no necesitan li',
    explanation: [
      'Cuando el sujeto es solo mi (yo, nosotros) o solo sina (tú), no se pone li: mi wawa quiere decir “yo soy fuerte”.',
      'Cualquier otro sujeto sigue llevando li: mije li wawa quiere decir “el hombre es fuerte”.',
      'Después de un sustantivo, mi y sina quieren decir “mi” y “tu”: kulupu mi es “mi grupo”.',
    ],
  },
  exercises: [
    { id: 'mi', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi', options: ['yo / mí / nosotros', 'tú / usted / ustedes', 'hombre / masculino'], answer: 'yo / mí / nosotros' },
    { id: 'sina', type: 'multipleChoice', direction: 'en-tp', prompt: 'tú / usted / ustedes', options: ['mi', 'sina', 'mije', 'meli'], answer: 'sina' },
    { id: 'mije', type: 'multipleChoice', direction: 'tp-en', prompt: 'mije', options: ['mujer / femenino', 'grupo / comunidad', 'hombre / masculino'], answer: 'hombre / masculino' },
    { id: 'kulupu', type: 'multipleChoice', direction: 'en-tp', prompt: 'grupo / comunidad', options: ['kili', 'lipu', 'tomo', 'kulupu'], answer: 'kulupu' },
    { id: 'sin', type: 'multipleChoice', direction: 'tp-en', prompt: 'sin', options: ['fuerte / poderoso / energía', 'nuevo / fresco / extra', 'pequeño / joven'], answer: 'nuevo / fresco / extra' },
    { id: 'wawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'fuerte / poderoso / energía', options: ['sin', 'wawa', 'suli', 'pona'], answer: 'wawa' },
    { id: 'mi-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'Yo soy fuerte.', answer: ['mi', 'wawa'], distractors: ['li', 'sina'], practisesGrammar: true, grammarNote: 'Con solo mi como sujeto, li no se pone: mi wawa.' },
    { id: 'sina-pona', type: 'wordBank', direction: 'en-tp', prompt: 'Tú eres bueno.', answer: ['sina', 'pona'], distractors: ['li', 'mi'], practisesGrammar: true, grammarNote: 'Con solo sina como sujeto, li no se pone: sina pona.' },
    { id: 'mije-li-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'El hombre es fuerte.', answer: ['mije', 'li', 'wawa'], distractors: ['mi'], practisesGrammar: true, grammarNote: 'mije no es mi ni sina, así que sigue necesitando li: mije li wawa.' },
    { id: 'sina-jan-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sina jan pona', options: ['Tú eres una buena persona.', 'Yo soy una buena persona.', 'La persona es buena.'], answer: 'Tú eres una buena persona.' },
    { id: 'kulupu-sina-li-wawa', type: 'wordBank', direction: 'tp-en', prompt: 'kulupu sina li wawa', answer: ['tu', 'grupo', 'es', 'fuerte'], distractors: ['mi', 'nuevo'] },
    { id: 'lipu-sin', type: 'multipleChoice', direction: 'en-tp', prompt: 'un libro nuevo', options: ['sin lipu', 'lipu li sin', 'lipu sin'], answer: 'lipu sin' },
    { id: 'mi-meli', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi meli', options: ['Yo soy una mujer.', 'Tú eres una mujer.', 'mi casa'], answer: 'Yo soy una mujer.' },
  ],
}

export default lesson
