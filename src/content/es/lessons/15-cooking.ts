import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'cooking',
  title: 'Cocina',
  chapter: 'Lección 18',
  newWords: ['lape', 'olin', 'pan', 'pini', 'seli', 'supa', 'uta'],
  grammar: {
    title: 'Repaso: una historia en la cocina',
    explanation: [
      'Esta lección transcurre en una cocina y mezcla la gramática que ya conoces: preverbos con e, lon con palabras de lugar, y palabras que describen.',
      'seli quiere decir fuego o calor, así que seli e pan es “calentar el pan”, que es como el toki pona dice “cocinar”.',
    ],
  },
  exercises: [
    { id: 'pan', type: 'multipleChoice', direction: 'tp-en', prompt: 'pan', options: ['grano / pan / arroz', 'fuego / calor / caliente', 'mesa / superficie plana'], answer: 'grano / pan / arroz' },
    { id: 'seli', type: 'multipleChoice', direction: 'en-tp', prompt: 'fuego / calor / caliente', options: ['lete', 'seli', 'pan', 'supa'], answer: 'seli' },
    { id: 'supa', type: 'multipleChoice', direction: 'tp-en', prompt: 'supa', options: ['boca / labios', 'dormir / reposar', 'mesa / superficie plana'], answer: 'mesa / superficie plana' },
    { id: 'uta', type: 'multipleChoice', direction: 'en-tp', prompt: 'boca / labios', options: ['lawa', 'noka', 'sinpin', 'uta'], answer: 'uta' },
    { id: 'pini', type: 'multipleChoice', direction: 'tp-en', prompt: 'pini', options: ['amar / amor', 'acabado / pasado / terminar', 'dormir / reposar'], answer: 'acabado / pasado / terminar' },
    { id: 'olin', type: 'multipleChoice', direction: 'en-tp', prompt: 'amar / amor', options: ['pilin', 'olin', 'wile', 'lape'], answer: 'olin' },
    { id: 'lape', type: 'multipleChoice', direction: 'tp-en', prompt: 'lape', options: ['dormir / reposar', 'amar / amor', 'boca / labios'], answer: 'dormir / reposar' },
    { id: 'mi-wile-seli-e-pan', type: 'wordBank', direction: 'en-tp', prompt: 'Yo quiero calentar el pan.', answer: ['mi', 'wile', 'seli', 'e', 'pan'], distractors: ['li'], practisesGrammar: true, grammarNote: 'El preverbo wile va antes de seli, y e pan va después del verbo principal seli.' },
    { id: 'pan-li-lon-anpa-supa', type: 'wordBank', direction: 'en-tp', prompt: 'El pan está debajo de la mesa.', answer: ['pan', 'li', 'lon', 'anpa', 'supa'], distractors: ['sewi'], practisesGrammar: true, grammarNote: '“Debajo” es la parte de abajo de la mesa: lon, luego anpa, luego supa.' },
    { id: 'mi-olin-e-pan-seli', type: 'wordBank', direction: 'tp-en', prompt: 'mi olin e pan seli', answer: ['yo', 'amo', 'el', 'pan', 'caliente'], distractors: ['frío', 'mesa'] },
    { id: 'uta-mi-li-seli', type: 'multipleChoice', direction: 'tp-en', prompt: 'uta mi li seli', options: ['Mi boca está fría.', 'Mi boca está caliente.', 'Mi cabeza está caliente.'], answer: 'Mi boca está caliente.' },
    { id: 'moku-li-pini', type: 'wordBank', direction: 'en-tp', prompt: 'La comida se terminó.', answer: ['moku', 'li', 'pini'], distractors: ['open'] },
  ],
}

export default lesson
