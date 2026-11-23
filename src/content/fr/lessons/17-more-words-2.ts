import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'more-words-2',
  title: 'Encore des mots 2',
  chapter: 'Dictionnaire',
  newWords: ['kon', 'kule', 'mani', 'moli', 'mun', 'musi', 'nasa', 'selo', 'sike', 'sitelen', 'ko', 'poki'],
  grammar: {
    title: 'Révision\u202f: les derniers mots',
    explanation: [
      'Voici les derniers mots du cours. Avec eux, tu connais tous les mots du dictionnaire du livre, sauf les nombres.',
      'Utilise tout ce que tu as appris\u202f: la pour le contexte, e pour les objets, et lon avec les mots de lieu.',
    ],
  },
  exercises: [
    { id: 'kon', type: 'multipleChoice', direction: 'tp-en', prompt: 'kon', options: ['air / vent / esprit', 'lune / étoile', 'argent / richesse'], answer: 'air / vent / esprit' },
    { id: 'kule', type: 'multipleChoice', direction: 'en-tp', prompt: 'couleur / coloré', options: ['kon', 'kule', 'selo', 'sike'], answer: 'kule' },
    { id: 'mani', type: 'multipleChoice', direction: 'tp-en', prompt: 'mani', options: ['amusant / jeu / art', 'boîte / récipient / bol', 'argent / richesse'], answer: 'argent / richesse' },
    { id: 'moli', type: 'multipleChoice', direction: 'en-tp', prompt: 'mort / mourir / décès', options: ['musi', 'mun', 'mani', 'moli'], answer: 'moli' },
    { id: 'mun', type: 'multipleChoice', direction: 'tp-en', prompt: 'mun', options: ['peau / couche extérieure / coquille', 'lune / étoile', 'cercle / rond / balle'], answer: 'lune / étoile' },
    { id: 'musi', type: 'multipleChoice', direction: 'en-tp', prompt: 'amusant / jeu / art', options: ['nasa', 'musi', 'moli', 'poki'], answer: 'musi' },
    { id: 'nasa', type: 'multipleChoice', direction: 'tp-en', prompt: 'nasa', options: ['étrange / bête / ivre', 'cercle / rond / balle', 'mort / mourir / décès'], answer: 'étrange / bête / ivre' },
    { id: 'selo', type: 'multipleChoice', direction: 'en-tp', prompt: 'peau / couche extérieure / coquille', options: ['sike', 'ko', 'kon', 'selo'], answer: 'selo' },
    { id: 'sike', type: 'multipleChoice', direction: 'tp-en', prompt: 'sike', options: ['image / écriture / symbole', 'boîte / récipient / bol', 'cercle / rond / balle'], answer: 'cercle / rond / balle' },
    { id: 'sitelen', type: 'multipleChoice', direction: 'en-tp', prompt: 'image / écriture / symbole', options: ['lipu', 'sitelen', 'kule', 'mani'], answer: 'sitelen' },
    { id: 'ko', type: 'multipleChoice', direction: 'tp-en', prompt: 'ko', options: ['argent / richesse', 'pâte / poudre / argile', 'air / vent / esprit'], answer: 'pâte / poudre / argile' },
    { id: 'tenpo-pimeja-la-mi-lukin-e-mun', type: 'wordBank', direction: 'en-tp', prompt: 'La nuit, je vois la lune.', answer: ['tenpo', 'pimeja', 'la', 'mi', 'lukin', 'e', 'mun'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Le moment vient avant la, puis mi lukin e mun, avec e devant ce qui est vu.' },
    { id: 'mani-li-lon-insa-poki', type: 'wordBank', direction: 'en-tp', prompt: 'L’argent est dans la boîte.', answer: ['mani', 'li', 'lon', 'insa', 'poki'], distractors: ['sewi'], practisesGrammar: true, grammarNote: '«\u202fDans la boîte\u202f» se dit lon insa poki\u202f: lon, le mot de lieu, puis la chose à laquelle il appartient.' },
    { id: 'musi-ni-li-nasa', type: 'wordBank', direction: 'tp-en', prompt: 'musi ni li nasa', answer: ['ce', 'jeu', 'est', 'étrange'], distractors: ['rond', 'mort'] },
  ],
}

export default lesson
