import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'more-words-1',
  title: 'Encore des mots 1',
  chapter: 'Dictionnaire',
  newWords: ['ma', 'nasin', 'nena', 'nimi', 'utala', 'akesi', 'jaki', 'kalama', 'kiwen', 'ale', 'esun'],
  grammar: {
    title: 'Révision\u202f: encore des mots',
    explanation: [
      'Ces mots complètent le vocabulaire du dictionnaire du livre. Entraîne-toi avec toute la grammaire que tu connais.',
      'ale veut dire «\u202ftout\u202f» ou «\u202ftous\u202f» (tu le verras aussi écrit ali). nimi veut dire «\u202fmot\u202f» ou «\u202fnom\u202f».',
    ],
  },
  exercises: [
    { id: 'ma', type: 'multipleChoice', direction: 'tp-en', prompt: 'ma', options: ['terre / pays / lieu', 'chemin / route / méthode', 'colline / bosse / nez'], answer: 'terre / pays / lieu' },
    { id: 'nasin', type: 'multipleChoice', direction: 'en-tp', prompt: 'chemin / route / méthode', options: ['nena', 'nasin', 'ma', 'nimi'], answer: 'nasin' },
    { id: 'nena', type: 'multipleChoice', direction: 'tp-en', prompt: 'nena', options: ['pierre / roche / dur', 'son / bruit', 'colline / bosse / nez'], answer: 'colline / bosse / nez' },
    { id: 'nimi', type: 'multipleChoice', direction: 'en-tp', prompt: 'mot / nom', options: ['toki', 'kalama', 'lipu', 'nimi'], answer: 'nimi' },
    { id: 'utala', type: 'multipleChoice', direction: 'tp-en', prompt: 'utala', options: ['chasser / cueillir', 'se battre / combat', 'marché / boutique / commerce'], answer: 'se battre / combat' },
    { id: 'akesi', type: 'multipleChoice', direction: 'en-tp', prompt: 'reptile / amphibien', options: ['pipi', 'akesi', 'waso', 'kala'], answer: 'akesi' },
    { id: 'jaki', type: 'multipleChoice', direction: 'tp-en', prompt: 'jaki', options: ['sale / dégoûtant / toxique', 'pierre / roche / dur', 'tout / tous / vie'], answer: 'sale / dégoûtant / toxique' },
    { id: 'kalama', type: 'multipleChoice', direction: 'en-tp', prompt: 'son / bruit', options: ['kiwen', 'esun', 'ale', 'kalama'], answer: 'kalama' },
    { id: 'esun', type: 'multipleChoice', direction: 'tp-en', prompt: 'esun', options: ['pierre / roche / dur', 'terre / pays / lieu', 'marché / boutique / commerce'], answer: 'marché / boutique / commerce' },
    { id: 'utala-la-mi-kute-e-kalama-mute', type: 'wordBank', direction: 'en-tp', prompt: 'Pendant un combat, j’entends beaucoup de bruits.', answer: ['utala', 'la', 'mi', 'kute', 'e', 'kalama', 'mute'], distractors: ['li'], practisesGrammar: true, grammarNote: 'utala pose le décor avant la. Dans la phrase principale, e marque ce qui est entendu, et mute suit kalama.' },
    { id: 'akesi-li-lon-sewi-kiwen', type: 'wordBank', direction: 'en-tp', prompt: 'Le reptile est sur la pierre.', answer: ['akesi', 'li', 'lon', 'sewi', 'kiwen'], distractors: ['e'], practisesGrammar: true, grammarNote: '«\u202fSur\u202f» se dit lon sewi, suivi de la chose\u202f: lon sewi kiwen.' },
    { id: 'nimi-pi-ma-ni-li-seme', type: 'wordBank', direction: 'tp-en', prompt: 'nimi pi ma ni li seme?', answer: ['quel', 'est', 'le', 'nom', 'de', 'cette', 'terre'], distractors: ['route', 'colline'] },
    { id: 'soweli-ale-li-lon-ma', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli ale li lon ma', options: ['Tous les animaux sont sur la terre.', 'Un animal est sur la terre.', 'Les animaux sont dans l’eau.'], answer: 'Tous les animaux sont sur la terre.' },
  ],
}

export default lesson
