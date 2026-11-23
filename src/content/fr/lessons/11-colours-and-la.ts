import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'colours-and-la',
  title: 'Couleurs et la',
  chapter: 'Leçon 14',
  newWords: ['jelo', 'laso', 'loje', 'pimeja', 'walo', 'la'],
  grammar: {
    title: 'Les couleurs, et poser le décor avec la',
    explanation: [
      'Les couleurs sont des mots qui décrivent comme les autres\u202f: kili loje veut dire «\u202fun fruit rouge\u202f». laso couvre à la fois le bleu et le vert.',
      'la permet de poser le décor d’abord. Mets un contexte avant la, puis la phrase principale\u202f: tenpo suno la mi pali veut dire «\u202fle jour, je travaille\u202f».',
      'Le contexte peut aussi être une phrase entière, comme «\u202fsi\u202f» ou «\u202fquand\u202f»\u202f: sina pali la mi moku veut dire «\u202fsi tu travailles, je mange\u202f».',
    ],
  },
  exercises: [
    { id: 'jelo', type: 'multipleChoice', direction: 'tp-en', prompt: 'jelo', options: ['jaune', 'rouge', 'blanc / pâle'], answer: 'jaune' },
    { id: 'laso', type: 'multipleChoice', direction: 'en-tp', prompt: 'bleu / vert', options: ['loje', 'laso', 'walo', 'pimeja'], answer: 'laso' },
    { id: 'loje', type: 'multipleChoice', direction: 'tp-en', prompt: 'loje', options: ['jaune', 'noir / sombre', 'rouge'], answer: 'rouge' },
    { id: 'pimeja', type: 'multipleChoice', direction: 'en-tp', prompt: 'noir / sombre', options: ['walo', 'jelo', 'laso', 'pimeja'], answer: 'pimeja' },
    { id: 'walo', type: 'multipleChoice', direction: 'tp-en', prompt: 'walo', options: ['bleu / vert', 'blanc / pâle', 'rouge'], answer: 'blanc / pâle' },
    { id: 'tenpo-suno-la-mi-pali', type: 'wordBank', direction: 'en-tp', prompt: 'Le jour, je travaille.', answer: ['tenpo', 'suno', 'la', 'mi', 'pali'], distractors: ['li'], practisesGrammar: true, grammarNote: 'tenpo suno pose le décor, donc il vient en premier, puis la, puis la phrase principale mi pali.' },
    { id: 'tenpo-pimeja-la-mi-awen', type: 'wordBank', direction: 'en-tp', prompt: 'La nuit, je reste dans la maison.', answer: ['tenpo', 'pimeja', 'la', 'mi', 'awen', 'lon', 'tomo'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Le moment, tenpo pimeja, vient avant la. La phrase principale suit, avec lon tomo à la fin.' },
    { id: 'kili-loje', type: 'wordBank', direction: 'en-tp', prompt: 'un fruit rouge', answer: ['kili', 'loje'], distractors: ['laso'] },
    { id: 'tenpo-ni-la-mi-moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'tenpo ni la mi moku', options: ['J’ai mangé ceci.', 'Je veux manger ceci.', 'Maintenant, je mange.'], answer: 'Maintenant, je mange.' },
    { id: 'telo-laso-li-suli', type: 'wordBank', direction: 'tp-en', prompt: 'telo laso li suli', answer: ['l’eau', 'bleue', 'est', 'grande'], distractors: ['rouge', 'petite'] },
    { id: 'tomo-li-walo', type: 'multipleChoice', direction: 'en-tp', prompt: 'La maison est blanche.', options: ['tomo walo', 'tomo li walo', 'walo li tomo'], answer: 'tomo li walo' },
    { id: 'sina-pali-la-mi-moku', type: 'wordBank', direction: 'en-tp', prompt: 'Si tu travailles, je mange.', answer: ['sina', 'pali', 'la', 'mi', 'moku'], distractors: ['e'], practisesGrammar: true, grammarNote: 'La partie «\u202fsi\u202f» est une phrase entière avant la. La phrase principale mi moku vient après.' },
  ],
}

export default lesson
