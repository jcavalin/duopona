import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'words-and-sentences',
  title: 'Mots et phrases',
  chapter: 'Leçon 2',
  newWords: ['ijo', 'jan', 'kili', 'lipu', 'meli', 'ni', 'soweli', 'li'],
  grammar: {
    title: 'Dire ce qu’est une chose\u202f: NOM li NOM',
    explanation: [
      'Une phrase simple en toki pona nomme une chose, puis dit ce qu’elle est. Le petit mot li se place entre les deux parties.',
      'ni li meli veut dire «\u202fceci est une femme\u202f». Il n’y a pas de mots pour «\u202fun\u202f», «\u202fle\u202f» ou «\u202fest\u202f»\u202f: li fait ce travail.',
    ],
  },
  exercises: [
    { id: 'jan', type: 'multipleChoice', direction: 'tp-en', prompt: 'jan', options: ['personne / quelqu’un', 'fruit / légume', 'chose / objet', 'animal / mammifère'], answer: 'personne / quelqu’un' },
    { id: 'kili', type: 'multipleChoice', direction: 'en-tp', prompt: 'fruit / légume', options: ['kili', 'lipu', 'meli', 'ijo'], answer: 'kili' },
    { id: 'soweli', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli', options: ['animal / mammifère', 'femme / féminin', 'papier / livre / document'], answer: 'animal / mammifère' },
    { id: 'lipu', type: 'multipleChoice', direction: 'en-tp', prompt: 'papier / livre / document', options: ['lipu', 'soweli', 'jan', 'ni'], answer: 'lipu' },
    { id: 'meli', type: 'multipleChoice', direction: 'tp-en', prompt: 'meli', options: ['femme / féminin', 'personne / quelqu’un', 'ceci / cela'], answer: 'femme / féminin' },
    { id: 'ijo', type: 'multipleChoice', direction: 'en-tp', prompt: 'chose / objet', options: ['ijo', 'kili', 'meli', 'soweli'], answer: 'ijo' },
    { id: 'ni', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni', options: ['ceci / cela', 'chose / objet', 'animal / mammifère', 'fruit / légume'], answer: 'ceci / cela' },
    { id: 'ni-li-meli', type: 'wordBank', direction: 'en-tp', prompt: 'Ceci est une femme.', answer: ['ni', 'li', 'meli'], distractors: ['lipu'], practisesGrammar: true, grammarNote: 'ni nomme la chose et meli dit ce qu’elle est, donc li va entre les deux. Aucun mot ne dit «\u202fest une\u202f»\u202f: li fait ce travail.' },
    { id: 'ijo-li-kili', type: 'wordBank', direction: 'tp-en', prompt: 'ijo li kili', answer: ['la', 'chose', 'est', 'un', 'fruit'], distractors: ['personne', 'livre'] },
    { id: 'ijo-li-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'La chose est un animal.', answer: ['ijo', 'li', 'soweli'], distractors: ['jan'], practisesGrammar: true, grammarNote: 'ijo est le sujet et soweli dit ce qu’elle est, donc li va entre les deux. Le toki pona n’a ni «\u202fle\u202f», ni «\u202fun\u202f», ni «\u202fest\u202f».' },
    { id: 'ni-li-ijo', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni li ijo', options: ['Ceci est une chose.', 'Ceci est un animal.', 'La chose est un livre.'], answer: 'Ceci est une chose.' },
    { id: 'ni-li-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'C’est un animal.', answer: ['ni', 'li', 'soweli'], distractors: ['jan'], practisesGrammar: true, grammarNote: '«\u202fCe\u202f» et «\u202fcela\u202f» se disent aussi ni, donc le schéma est le même\u202f: la chose, puis li, puis ce qu’elle est.' },
    { id: 'ijo-li-lipu', type: 'multipleChoice', direction: 'en-tp', prompt: 'La chose est un livre.', options: ['ijo li kili', 'ijo li lipu', 'meli li lipu'], answer: 'ijo li lipu' },
  ],
}

export default lesson
