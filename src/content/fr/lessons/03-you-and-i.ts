import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'you-and-i',
  title: 'Toi et moi',
  chapter: 'Leçon 4',
  newWords: ['mi', 'mije', 'sina', 'kulupu', 'sin', 'wawa'],
  grammar: {
    title: 'mi et sina se passent de li',
    explanation: [
      'Quand le sujet est seulement mi (je, nous) ou seulement sina (tu, vous), on enlève li\u202f: mi wawa veut dire «\u202fje suis fort\u202f».',
      'Tous les autres sujets gardent li\u202f: mije li wawa veut dire «\u202fl’homme est fort\u202f».',
      'Après un nom, mi et sina veulent dire «\u202fmon\u202f» et «\u202fton\u202f»\u202f: kulupu mi veut dire «\u202fmon groupe\u202f».',
    ],
  },
  exercises: [
    { id: 'mi', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi', options: ['je / moi / nous', 'tu / toi / vous', 'homme / masculin'], answer: 'je / moi / nous' },
    { id: 'sina', type: 'multipleChoice', direction: 'en-tp', prompt: 'tu / toi / vous', options: ['mi', 'sina', 'mije', 'meli'], answer: 'sina' },
    { id: 'mije', type: 'multipleChoice', direction: 'tp-en', prompt: 'mije', options: ['femme / féminin', 'groupe / communauté', 'homme / masculin'], answer: 'homme / masculin' },
    { id: 'kulupu', type: 'multipleChoice', direction: 'en-tp', prompt: 'groupe / communauté', options: ['kili', 'lipu', 'tomo', 'kulupu'], answer: 'kulupu' },
    { id: 'sin', type: 'multipleChoice', direction: 'tp-en', prompt: 'sin', options: ['fort / puissant / énergie', 'nouveau / frais / en plus', 'petit / jeune'], answer: 'nouveau / frais / en plus' },
    { id: 'wawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'fort / puissant / énergie', options: ['sin', 'wawa', 'suli', 'pona'], answer: 'wawa' },
    { id: 'mi-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'Je suis fort.', answer: ['mi', 'wawa'], distractors: ['li', 'sina'], practisesGrammar: true, grammarNote: 'Quand mi est le seul sujet, on enlève li\u202f: mi wawa.' },
    { id: 'sina-pona', type: 'wordBank', direction: 'en-tp', prompt: 'Tu es bon.', answer: ['sina', 'pona'], distractors: ['li', 'mi'], practisesGrammar: true, grammarNote: 'Quand sina est le seul sujet, on enlève li\u202f: sina pona.' },
    { id: 'mije-li-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'L’homme est fort.', answer: ['mije', 'li', 'wawa'], distractors: ['mi'], practisesGrammar: true, grammarNote: 'mije n’est ni mi ni sina, donc il garde li\u202f: mije li wawa.' },
    { id: 'sina-jan-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sina jan pona', options: ['Tu es une bonne personne.', 'Je suis une bonne personne.', 'La personne est bonne.'], answer: 'Tu es une bonne personne.' },
    { id: 'kulupu-sina-li-wawa', type: 'wordBank', direction: 'tp-en', prompt: 'kulupu sina li wawa', answer: ['ton', 'groupe', 'est', 'fort'], distractors: ['mon', 'nouveau'] },
    { id: 'lipu-sin', type: 'multipleChoice', direction: 'en-tp', prompt: 'un nouveau livre', options: ['sin lipu', 'lipu li sin', 'lipu sin'], answer: 'lipu sin' },
    { id: 'mi-meli', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi meli', options: ['Je suis une femme.', 'Tu es une femme.', 'ma maison'], answer: 'Je suis une femme.' },
  ],
}

export default lesson
