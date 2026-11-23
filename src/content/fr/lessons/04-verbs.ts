import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'verbs',
  title: 'Verbes',
  chapter: 'Leçon 5',
  newWords: ['jo', 'kute', 'moku', 'pali', 'sona', 'toki', 'e'],
  grammar: {
    title: 'Agir sur quelque chose\u202f: e',
    explanation: [
      'Un verbe peut venir juste après li, ou juste après mi ou sina\u202f: mi moku veut dire «\u202fje mange\u202f».',
      'Pour dire sur quoi porte l’action, mets e devant\u202f: mi moku e kili veut dire «\u202fje mange des fruits\u202f».',
      'Avec les autres sujets, il faut les deux petits mots\u202f: meli li jo e lipu veut dire «\u202fla femme a un livre\u202f».',
    ],
  },
  exercises: [
    { id: 'jo', type: 'multipleChoice', direction: 'tp-en', prompt: 'jo', options: ['avoir / tenir', 'entendre / écouter / oreille', 'nourriture / manger / boire'], answer: 'avoir / tenir' },
    { id: 'kute', type: 'multipleChoice', direction: 'en-tp', prompt: 'entendre / écouter / oreille', options: ['moku', 'kute', 'toki', 'jo'], answer: 'kute' },
    { id: 'moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'moku', options: ['travailler / fabriquer / faire', 'savoir / connaissance', 'nourriture / manger / boire'], answer: 'nourriture / manger / boire' },
    { id: 'pali', type: 'multipleChoice', direction: 'en-tp', prompt: 'travailler / fabriquer / faire', options: ['sona', 'jo', 'kute', 'pali'], answer: 'pali' },
    { id: 'sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sona', options: ['parler / langue / bonjour', 'savoir / connaissance', 'avoir / tenir'], answer: 'savoir / connaissance' },
    { id: 'toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'parler / langue / bonjour', options: ['moku', 'toki', 'pali', 'sona'], answer: 'toki' },
    { id: 'mi-moku-e-kili', type: 'wordBank', direction: 'en-tp', prompt: 'Je mange des fruits.', answer: ['mi', 'moku', 'e', 'kili'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Après mi, le verbe vient tout de suite, sans li, et e marque ce qui est mangé\u202f: mi moku e kili.' },
    { id: 'meli-li-jo-e-lipu', type: 'wordBank', direction: 'en-tp', prompt: 'La femme a un livre.', answer: ['meli', 'li', 'jo', 'e', 'lipu'], distractors: ['mi'], practisesGrammar: true, grammarNote: 'meli n’est ni mi ni sina, donc li vient avant le verbe, et e avant ce qu’elle a.' },
    { id: 'sina-kute-e-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'Tu entends l’animal.', answer: ['sina', 'kute', 'e', 'soweli'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Après sina, pas de li, et e marque ce qui est entendu\u202f: sina kute e soweli.' },
    { id: 'jan-li-pali-e-tomo', type: 'wordBank', direction: 'tp-en', prompt: 'jan li pali e tomo', answer: ['la', 'personne', 'fait', 'la', 'maison'], distractors: ['mange', 'eau'] },
    { id: 'mi-sona-e-ni', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi sona e ni', options: ['Ceci me connaît.', 'Je sais cela.', 'Tu sais cela.'], answer: 'Je sais cela.' },
    { id: 'mi-toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'Je parle.', options: ['mi li toki', 'sina toki', 'mi toki'], answer: 'mi toki' },
  ],
}

export default lesson
