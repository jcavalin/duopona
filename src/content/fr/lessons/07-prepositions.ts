import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'prepositions',
  title: 'Prépositions',
  chapter: 'Leçon 8',
  newWords: ['pana', 'tawa', 'lon', 'kepeken', 'tan'],
  grammar: {
    title: 'Où, vers où, d’où, avec quoi',
    explanation: [
      'lon, tawa, tan et kepeken ajoutent un détail à la fin d’une phrase\u202f: où se trouve une chose (lon), où elle va (tawa), d’où elle vient (tan) et quel outil sert (kepeken).',
      'Ils viennent après le verbe et sa partie avec e\u202f: mi pana e kili tawa meli veut dire «\u202fje donne des fruits à la femme\u202f».',
      'Ils peuvent aussi être le verbe à eux seuls\u202f: sina lon tomo veut dire «\u202ftu es dans la maison\u202f».',
    ],
  },
  exercises: [
    { id: 'pana', type: 'multipleChoice', direction: 'tp-en', prompt: 'pana', options: ['donner / envoyer', 'avoir / tenir', 'entendre / écouter / oreille'], answer: 'donner / envoyer' },
    { id: 'tawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'vers / à / en mouvement', options: ['tan', 'tawa', 'lon', 'pana'], answer: 'tawa' },
    { id: 'lon', type: 'multipleChoice', direction: 'tp-en', prompt: 'lon', options: ['de / à cause de', 'en utilisant / avec (un outil)', 'à / dans / présent'], answer: 'à / dans / présent' },
    { id: 'kepeken', type: 'multipleChoice', direction: 'en-tp', prompt: 'en utilisant / avec (un outil)', options: ['tawa', 'jo', 'pali', 'kepeken'], answer: 'kepeken' },
    { id: 'tan', type: 'multipleChoice', direction: 'tp-en', prompt: 'tan', options: ['vers / à / en mouvement', 'de / à cause de', 'à / dans / présent'], answer: 'de / à cause de' },
    { id: 'sina-lon-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'Tu es dans la maison.', answer: ['sina', 'lon', 'tomo'], distractors: ['tawa'], practisesGrammar: true, grammarNote: 'lon peut être le verbe lui-même\u202f: sina lon tomo veut dire «\u202ftu es dans la maison\u202f», sans li après sina.' },
    { id: 'mi-pana-e-kili-tawa-meli', type: 'wordBank', direction: 'en-tp', prompt: 'Je donne des fruits à la femme.', answer: ['mi', 'pana', 'e', 'kili', 'tawa', 'meli'], distractors: ['lon'], practisesGrammar: true, grammarNote: 'tawa meli dit où vont les fruits, donc il vient après le verbe et sa partie avec e.' },
    { id: 'ona-li-pali-kepeken-ilo', type: 'wordBank', direction: 'en-tp', prompt: 'Elle travaille avec un outil.', answer: ['ona', 'li', 'pali', 'kepeken', 'ilo'], distractors: ['tan'], practisesGrammar: true, grammarNote: 'kepeken ilo dit ce qui sert, donc il va à la fin, après le verbe pali.' },
    { id: 'kala-li-tan-telo', type: 'wordBank', direction: 'tp-en', prompt: 'kala li tan telo', answer: ['le', 'poisson', 'vient', 'de', 'l’eau'], distractors: ['va', 'dans'] },
    { id: 'mi-tawa-tomo', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi tawa tomo', options: ['Je vais à la maison.', 'Je suis dans la maison.', 'Je viens de la maison.'], answer: 'Je vais à la maison.' },
    { id: 'soweli-li-lon-telo', type: 'multipleChoice', direction: 'en-tp', prompt: 'L’animal est dans l’eau.', options: ['soweli li tan telo', 'soweli li lon telo', 'soweli li tawa telo'], answer: 'soweli li lon telo' },
    { id: 'mi-toki-tawa-sina', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi toki tawa sina', options: ['Tu me parles.', 'Je viens de toi.', 'Je te parle.'], answer: 'Je te parle.' },
  ],
}

export default lesson
