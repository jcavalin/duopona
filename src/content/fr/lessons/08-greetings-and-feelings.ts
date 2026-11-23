import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'greetings-and-feelings',
  title: 'Salutations et sentiments',
  chapter: 'Leçon 10',
  newWords: ['a', 'mu', 'o', 'pilin'],
  grammar: {
    title: 'Ordres, appels et sentiments',
    explanation: [
      'Commence une phrase par o pour donner un ordre\u202f: o pali! veut dire «\u202ftravaille\u202f!\u202f». Ajoute ala pour dire «\u202fne… pas\u202f»\u202f: o moku ala e kala!',
      'Mets o après un nom ou une personne pour l’appeler\u202f: jan pona o, kute e mi! veut dire «\u202fami, écoute-moi\u202f!\u202f».',
      'toki! tout seul sert de «\u202fbonjour\u202f!\u202f». Utilise pilin pour parler des sentiments, et a pour ajouter de l’émotion\u202f: a, sina wawa!',
    ],
  },
  exercises: [
    { id: 'pilin', type: 'multipleChoice', direction: 'tp-en', prompt: 'pilin', options: ['sentiment / cœur / ressentir', 'nourriture / manger / boire', 'outil / machine / appareil'], answer: 'sentiment / cœur / ressentir' },
    { id: 'mu', type: 'multipleChoice', direction: 'en-tp', prompt: 'meuh / ouaf (tout cri d’animal)', options: ['a', 'mu', 'o', 'seme'], answer: 'mu' },
    { id: 'a', type: 'multipleChoice', direction: 'tp-en', prompt: 'a', options: ['ou', 'quoi / quel', 'ah\u202f! / oh\u202f! (émotion ou insistance)'], answer: 'ah\u202f! / oh\u202f! (émotion ou insistance)' },
    { id: 'o-moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'o moku!', options: ['Mange\u202f!', 'Je mange.', 'La nourriture est bonne.'], answer: 'Mange\u202f!' },
    { id: 'o-pali', type: 'wordBank', direction: 'en-tp', prompt: 'Travaille\u202f!', answer: ['o', 'pali'], distractors: ['mi'], practisesGrammar: true, grammarNote: 'Un ordre commence par o, suivi du verbe\u202f: o pali.' },
    { id: 'jan-pona-o-kute-e-mi', type: 'wordBank', direction: 'en-tp', prompt: 'Ami, écoute-moi\u202f!', answer: ['jan', 'pona', 'o', 'kute', 'e', 'mi'], distractors: ['li'], practisesGrammar: true, grammarNote: 'o après jan pona appelle l’ami. Vient ensuite l’ordre, kute e mi.' },
    { id: 'toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'Bonjour\u202f!', options: ['toki!', 'moku!', 'pona!'], answer: 'toki!' },
    { id: 'mi-pilin-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi pilin pona', options: ['Tu te sens bien.', 'Je me sens bien.', 'Je me sens mal.'], answer: 'Je me sens bien.' },
    { id: 'mi-pilin-ike', type: 'wordBank', direction: 'en-tp', prompt: 'Je me sens mal.', answer: ['mi', 'pilin', 'ike'], distractors: ['li'] },
    { id: 'soweli-li-mu', type: 'wordBank', direction: 'tp-en', prompt: 'soweli li mu', answer: ['l’animal', 'fait', 'un', 'bruit'], distractors: ['mange', 'poisson'] },
    { id: 'a-sina-wawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'a, sina wawa!', options: ['Es-tu fort\u202f?', 'Oh, tu es fort\u202f!', 'Je suis fort.'], answer: 'Oh, tu es fort\u202f!' },
    { id: 'o-moku-ala-e-kala', type: 'wordBank', direction: 'en-tp', prompt: 'Ne mange pas le poisson\u202f!', answer: ['o', 'moku', 'ala', 'e', 'kala'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Un ordre commence par o, et ala juste après le verbe en fait une défense\u202f: o moku ala e kala.' },
  ],
}

export default lesson
