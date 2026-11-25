import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'pi',
  title: 'pi',
  chapter: 'Lección 11',
  newWords: ['kasi', 'sijelo', 'suno', 'tenpo', 'awen', 'tawa', 'pi'],
  grammar: {
    title: 'Agrupar palabras que describen con pi',
    explanation: [
      'Normalmente, cada palabra que describe se suma a todo lo anterior. pi cambia eso: las palabras después de pi forman un grupo que describe junto al sustantivo.',
      'tomo kulupu suli es “una casa comunitaria grande” (la casa es grande). tomo pi kulupu suli es “la casa del grupo grande” (el grupo es grande).',
      'tawa también puede ser verbo o palabra que describe, con el sentido de “ir” o “en movimiento”: soweli li tawa quiere decir “el animal se está moviendo”.',
    ],
  },
  exercises: [
    { id: 'kasi', type: 'multipleChoice', direction: 'tp-en', prompt: 'kasi', options: ['planta / hoja / árbol', 'cuerpo / estado físico', 'sol / luz / brillante'], answer: 'planta / hoja / árbol' },
    { id: 'sijelo', type: 'multipleChoice', direction: 'en-tp', prompt: 'cuerpo / estado físico', options: ['kasi', 'sijelo', 'suno', 'tenpo'], answer: 'sijelo' },
    { id: 'suno', type: 'multipleChoice', direction: 'tp-en', prompt: 'suno', options: ['tiempo / momento', 'planta / hoja / árbol', 'sol / luz / brillante'], answer: 'sol / luz / brillante' },
    { id: 'tenpo', type: 'multipleChoice', direction: 'en-tp', prompt: 'tiempo / momento', options: ['awen', 'suno', 'pi', 'tenpo'], answer: 'tenpo' },
    { id: 'awen', type: 'multipleChoice', direction: 'tp-en', prompt: 'awen', options: ['a / hacia / en movimiento', 'quedarse / esperar / seguro', 'saber / conocimiento'], answer: 'quedarse / esperar / seguro' },
    { id: 'soweli-li-tawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli li tawa', options: ['El animal se queda quieto.', 'El animal está en casa.', 'El animal se está moviendo.'], answer: 'El animal se está moviendo.' },
    { id: 'tomo-pi-kulupu-suli', type: 'wordBank', direction: 'en-tp', prompt: 'la casa del grupo grande', answer: ['tomo', 'pi', 'kulupu', 'suli'], distractors: ['li'], practisesGrammar: true, grammarNote: 'El grupo es grande, no la casa, así que pi une kulupu suli en un grupo que describe a tomo.' },
    { id: 'lipu-pi-jan-pona-li-sin', type: 'wordBank', direction: 'en-tp', prompt: 'El libro de la persona buena es nuevo.', answer: ['lipu', 'pi', 'jan', 'pona', 'li', 'sin'], distractors: ['e'], practisesGrammar: true, grammarNote: 'pi hace de jan pona un grupo que describe a lipu: el libro de la persona buena. Luego li sin dice que es nuevo.' },
    { id: 'tenpo-pi-moku-mute', type: 'wordBank', direction: 'tp-en', prompt: 'tenpo pi moku mute', answer: ['un', 'momento', 'de', 'mucha', 'comida'], distractors: ['cuerpo', 'quedarse'] },
    { id: 'sijelo-pi-jan-wawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'sijelo pi jan wawa', options: ['el cuerpo de la persona fuerte', 'el cuerpo fuerte de una persona', 'una persona con un cuerpo'], answer: 'el cuerpo de la persona fuerte' },
    { id: 'mi-awen-lon-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'Yo me quedo en casa.', answer: ['mi', 'awen', 'lon', 'tomo'], distractors: ['tawa'] },
    { id: 'kasi-li-tawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'La planta se está moviendo.', options: ['kasi li awen', 'kasi li lon', 'kasi li tawa'], answer: 'kasi li tawa' },
  ],
}

export default lesson
