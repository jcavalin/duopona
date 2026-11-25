import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'more-adjectives',
  title: 'Más adjetivos',
  chapter: 'Lección 6',
  newWords: ['ala', 'ike', 'mute', 'pu', 'sewi', 'wan', 'mama'],
  grammar: {
    title: 'Negar con ala y apilar palabras que describen',
    explanation: [
      'Para decir “no”, pon ala justo después de la palabra que quieres negar: mi moku ala quiere decir “yo no como”.',
      'Un sustantivo puede llevar varias palabras que describen, una tras otra. Cada una se suma a todo lo anterior: soweli lili mute es “muchos animales pequeños”.',
    ],
  },
  exercises: [
    { id: 'ala', type: 'multipleChoice', direction: 'tp-en', prompt: 'ala', options: ['no / ningún / nada', 'muchos / bastante / muy', 'uno / único / unido'], answer: 'no / ningún / nada' },
    { id: 'ike', type: 'multipleChoice', direction: 'en-tp', prompt: 'malo / negativo', options: ['pona', 'ike', 'sin', 'wawa'], answer: 'ike' },
    { id: 'mute', type: 'multipleChoice', direction: 'tp-en', prompt: 'mute', options: ['uno / único / unido', 'malo / negativo', 'muchos / bastante / muy'], answer: 'muchos / bastante / muy' },
    { id: 'wan', type: 'multipleChoice', direction: 'en-tp', prompt: 'uno / único / unido', options: ['mute', 'ala', 'lili', 'wan'], answer: 'wan' },
    { id: 'mama', type: 'multipleChoice', direction: 'tp-en', prompt: 'mama', options: ['hombre / masculino', 'padre o madre / quien cuida / origen', 'grupo / comunidad'], answer: 'padre o madre / quien cuida / origen' },
    { id: 'sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'sewi', options: ['pequeño / joven', 'nuevo / fresco / extra', 'alto / encima / divino'], answer: 'alto / encima / divino' },
    { id: 'lipu-pu', type: 'multipleChoice', direction: 'tp-en', prompt: 'lipu pu', options: ['el libro oficial de Toki Pona', 'un libro nuevo', 'un libro malo'], answer: 'el libro oficial de Toki Pona' },
    { id: 'mi-moku-ala', type: 'wordBank', direction: 'en-tp', prompt: 'Yo no como.', answer: ['mi', 'moku', 'ala'], distractors: ['ike'], practisesGrammar: true, grammarNote: 'ala va justo después de la palabra que niega, aquí el verbo: mi moku ala.' },
    { id: 'telo-li-pona-ala', type: 'wordBank', direction: 'en-tp', prompt: 'El agua no es buena.', answer: ['telo', 'li', 'pona', 'ala'], distractors: ['mute'], practisesGrammar: true, grammarNote: 'ala sigue a la palabra que niega, así que “no es buena” es pona ala, después de li.' },
    { id: 'soweli-lili-mute', type: 'wordBank', direction: 'tp-en', prompt: 'soweli lili mute', answer: ['muchos', 'animales', 'pequeños'], distractors: ['un', 'grandes'], practisesGrammar: true, grammarNote: 'Cada palabra que describe se suma a todo lo anterior: soweli lili es “animal pequeño”, y mute dice que son muchos.' },
    { id: 'mama-mi-li-wawa-mute', type: 'wordBank', direction: 'tp-en', prompt: 'mama mi li wawa mute', answer: ['mi', 'madre', 'es', 'muy', 'fuerte'], distractors: ['no', 'nueva'] },
    { id: 'lipu-ike', type: 'multipleChoice', direction: 'en-tp', prompt: 'un libro malo', options: ['ike lipu', 'lipu li ike', 'lipu ike'], answer: 'lipu ike' },
    { id: 'ijo-sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'ijo sewi', options: ['una cosa alta', 'una cosa nueva', 'una sola cosa'], answer: 'una cosa alta' },
  ],
}

export default lesson
