import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'more-adjectives',
  title: 'Encore des adjectifs',
  chapter: 'Leçon 6',
  newWords: ['ala', 'ike', 'mute', 'pu', 'sewi', 'wan', 'mama'],
  grammar: {
    title: 'Dire non avec ala, et enchaîner les mots qui décrivent',
    explanation: [
      'Pour dire «\u202fne… pas\u202f», mets ala juste après le mot que tu nies\u202f: mi moku ala veut dire «\u202fje ne mange pas\u202f».',
      'Un nom peut prendre plusieurs mots qui décrivent à la suite. Chacun s’ajoute à tout ce qui précède\u202f: soweli lili mute veut dire «\u202fbeaucoup de petits animaux\u202f».',
    ],
  },
  exercises: [
    { id: 'ala', type: 'multipleChoice', direction: 'tp-en', prompt: 'ala', options: ['ne… pas / non / aucun', 'beaucoup / nombreux / très', 'un / seul / uni'], answer: 'ne… pas / non / aucun' },
    { id: 'ike', type: 'multipleChoice', direction: 'en-tp', prompt: 'mauvais / négatif', options: ['pona', 'ike', 'sin', 'wawa'], answer: 'ike' },
    { id: 'mute', type: 'multipleChoice', direction: 'tp-en', prompt: 'mute', options: ['un / seul / uni', 'mauvais / négatif', 'beaucoup / nombreux / très'], answer: 'beaucoup / nombreux / très' },
    { id: 'wan', type: 'multipleChoice', direction: 'en-tp', prompt: 'un / seul / uni', options: ['mute', 'ala', 'lili', 'wan'], answer: 'wan' },
    { id: 'mama', type: 'multipleChoice', direction: 'tp-en', prompt: 'mama', options: ['homme / masculin', 'parent / protecteur / origine', 'groupe / communauté'], answer: 'parent / protecteur / origine' },
    { id: 'sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'sewi', options: ['petit / jeune', 'nouveau / frais / en plus', 'haut / au-dessus / divin'], answer: 'haut / au-dessus / divin' },
    { id: 'lipu-pu', type: 'multipleChoice', direction: 'tp-en', prompt: 'lipu pu', options: ['le livre officiel de toki pona', 'un nouveau livre', 'un mauvais livre'], answer: 'le livre officiel de toki pona' },
    { id: 'mi-moku-ala', type: 'wordBank', direction: 'en-tp', prompt: 'Je ne mange pas.', answer: ['mi', 'moku', 'ala'], distractors: ['ike'], practisesGrammar: true, grammarNote: 'ala se place juste après le mot qu’il nie, ici le verbe\u202f: mi moku ala.' },
    { id: 'telo-li-pona-ala', type: 'wordBank', direction: 'en-tp', prompt: 'L’eau n’est pas bonne.', answer: ['telo', 'li', 'pona', 'ala'], distractors: ['mute'], practisesGrammar: true, grammarNote: 'ala suit le mot qu’il nie, donc «\u202fpas bon\u202f» se dit pona ala, après li.' },
    { id: 'soweli-lili-mute', type: 'wordBank', direction: 'tp-en', prompt: 'soweli lili mute', answer: ['beaucoup', 'de', 'petits', 'animaux'], distractors: ['un', 'grands'], practisesGrammar: true, grammarNote: 'Chaque mot qui décrit s’ajoute à ce qui précède\u202f: soweli lili est «\u202fpetit animal\u202f», et mute en fait beaucoup.' },
    { id: 'mama-mi-li-wawa-mute', type: 'wordBank', direction: 'tp-en', prompt: 'mama mi li wawa mute', answer: ['mon', 'parent', 'est', 'très', 'fort'], distractors: ['pas', 'nouveau'] },
    { id: 'lipu-ike', type: 'multipleChoice', direction: 'en-tp', prompt: 'un mauvais livre', options: ['ike lipu', 'lipu li ike', 'lipu ike'], answer: 'lipu ike' },
    { id: 'ijo-sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'ijo sewi', options: ['une chose haute', 'une nouvelle chose', 'une seule chose'], answer: 'une chose haute' },
  ],
}

export default lesson
