import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'cooking',
  title: 'Cuisine',
  chapter: 'Leçon 18',
  newWords: ['lape', 'olin', 'pan', 'pini', 'seli', 'supa', 'uta'],
  grammar: {
    title: 'Révision\u202f: une histoire de cuisine',
    explanation: [
      'Cette leçon se passe dans une cuisine et mélange la grammaire que tu as apprise\u202f: les pré-verbes avec e, lon avec les mots de lieu, et les mots qui décrivent.',
      'seli veut dire feu ou chaleur, donc seli e pan veut dire «\u202fchauffer le pain\u202f»\u202f: c’est ainsi que le toki pona dit «\u202fcuisiner\u202f».',
    ],
  },
  exercises: [
    { id: 'pan', type: 'multipleChoice', direction: 'tp-en', prompt: 'pan', options: ['céréale / pain / riz', 'feu / chaleur / chaud', 'table / surface plane'], answer: 'céréale / pain / riz' },
    { id: 'seli', type: 'multipleChoice', direction: 'en-tp', prompt: 'feu / chaleur / chaud', options: ['lete', 'seli', 'pan', 'supa'], answer: 'seli' },
    { id: 'supa', type: 'multipleChoice', direction: 'tp-en', prompt: 'supa', options: ['bouche / lèvres', 'dormir / se reposer', 'table / surface plane'], answer: 'table / surface plane' },
    { id: 'uta', type: 'multipleChoice', direction: 'en-tp', prompt: 'bouche / lèvres', options: ['lawa', 'noka', 'sinpin', 'uta'], answer: 'uta' },
    { id: 'pini', type: 'multipleChoice', direction: 'tp-en', prompt: 'pini', options: ['aimer / amour', 'fini / passé / terminer', 'dormir / se reposer'], answer: 'fini / passé / terminer' },
    { id: 'olin', type: 'multipleChoice', direction: 'en-tp', prompt: 'aimer / amour', options: ['pilin', 'olin', 'wile', 'lape'], answer: 'olin' },
    { id: 'lape', type: 'multipleChoice', direction: 'tp-en', prompt: 'lape', options: ['dormir / se reposer', 'aimer / amour', 'bouche / lèvres'], answer: 'dormir / se reposer' },
    { id: 'mi-wile-seli-e-pan', type: 'wordBank', direction: 'en-tp', prompt: 'Je veux faire cuire le pain.', answer: ['mi', 'wile', 'seli', 'e', 'pan'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Le pré-verbe wile vient avant seli, et e pan suit le verbe principal seli.' },
    { id: 'pan-li-lon-anpa-supa', type: 'wordBank', direction: 'en-tp', prompt: 'Le pain est sous la table.', answer: ['pan', 'li', 'lon', 'anpa', 'supa'], distractors: ['sewi'], practisesGrammar: true, grammarNote: '«\u202fSous\u202f», c’est le bas de la table\u202f: lon, puis anpa, puis supa.' },
    { id: 'mi-olin-e-pan-seli', type: 'wordBank', direction: 'tp-en', prompt: 'mi olin e pan seli', answer: ['j’aime', 'le', 'pain', 'chaud'], distractors: ['froid', 'table'] },
    { id: 'uta-mi-li-seli', type: 'multipleChoice', direction: 'tp-en', prompt: 'uta mi li seli', options: ['Ma bouche est froide.', 'Ma bouche est chaude.', 'Ma tête est chaude.'], answer: 'Ma bouche est chaude.' },
    { id: 'moku-li-pini', type: 'wordBank', direction: 'en-tp', prompt: 'Le repas est fini.', answer: ['moku', 'li', 'pini'], distractors: ['open'] },
  ],
}

export default lesson
