import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'nouns-and-adjectives',
  title: 'Noms et adjectifs',
  chapter: 'Leçon 3',
  newWords: ['telo', 'tomo', 'lili', 'pona', 'suli'],
  grammar: {
    title: 'Les mots qui décrivent viennent après le nom',
    explanation: [
      'En toki pona, un mot qui décrit suit le mot qu’il décrit\u202f: tomo suli veut dire «\u202fune grande maison\u202f», jamais suli tomo.',
      'Tu peux aussi placer un mot qui décrit après li pour dire comment est une chose\u202f: tomo li pona veut dire «\u202fla maison est bonne\u202f».',
    ],
  },
  exercises: [
    { id: 'telo', type: 'multipleChoice', direction: 'tp-en', prompt: 'telo', options: ['eau / liquide', 'maison / bâtiment / pièce', 'petit / jeune', 'bon / utile / simple'], answer: 'eau / liquide' },
    { id: 'tomo', type: 'multipleChoice', direction: 'en-tp', prompt: 'maison / bâtiment / pièce', options: ['telo', 'tomo', 'lipu', 'kili'], answer: 'tomo' },
    { id: 'lili', type: 'multipleChoice', direction: 'tp-en', prompt: 'lili', options: ['grand / important / long', 'bon / utile / simple', 'petit / jeune'], answer: 'petit / jeune' },
    { id: 'pona', type: 'multipleChoice', direction: 'en-tp', prompt: 'bon / utile / simple', options: ['suli', 'lili', 'ijo', 'pona'], answer: 'pona' },
    { id: 'suli', type: 'multipleChoice', direction: 'tp-en', prompt: 'suli', options: ['petit / jeune', 'grand / important / long', 'eau / liquide'], answer: 'grand / important / long' },
    { id: 'tomo-lili', type: 'wordBank', direction: 'en-tp', prompt: 'une petite maison', answer: ['tomo', 'lili'], distractors: ['suli'], practisesGrammar: true, grammarNote: 'Le mot qui décrit vient après son nom, même quand le français le met avant\u202f: tomo lili, jamais lili tomo.' },
    { id: 'tomo-li-pona', type: 'wordBank', direction: 'en-tp', prompt: 'La maison est bonne.', answer: ['tomo', 'li', 'pona'], distractors: ['telo'], practisesGrammar: true, grammarNote: 'Pour dire comment est la maison, mets le mot qui décrit après li\u202f: tomo li pona.' },
    { id: 'jan-suli', type: 'wordBank', direction: 'tp-en', prompt: 'jan suli', answer: ['une', 'grande', 'personne'], distractors: ['petite', 'maison'] },
    { id: 'kili-lili-li-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'kili lili li pona', options: ['Le bon fruit est petit.', 'Le fruit est une petite chose.', 'Le petit fruit est bon.'], answer: 'Le petit fruit est bon.' },
    { id: 'tomo-suli-li-ijo-pona', type: 'wordBank', direction: 'en-tp', prompt: 'La grande maison est une bonne chose.', answer: ['tomo', 'suli', 'li', 'ijo', 'pona'], distractors: ['lili'], practisesGrammar: true, grammarNote: 'Chaque mot qui décrit suit son propre nom\u202f: tomo suli avant li, ijo pona après.' },
    { id: 'telo-pona', type: 'multipleChoice', direction: 'en-tp', prompt: 'de la bonne eau', options: ['pona telo', 'telo pona', 'telo suli'], answer: 'telo pona' },
    { id: 'lipu-ni-li-lili', type: 'wordBank', direction: 'en-tp', prompt: 'Ce livre est petit.', answer: ['lipu', 'ni', 'li', 'lili'], distractors: ['suli'], practisesGrammar: true, grammarNote: 'ni décrit lipu, donc il vient après\u202f: lipu ni veut dire «\u202fce livre\u202f». Puis li lili dit qu’il est petit.' },
    { id: 'meli-li-suli', type: 'multipleChoice', direction: 'tp-en', prompt: 'meli li suli', options: ['La femme est grande.', 'La femme est petite.', 'une grande femme'], answer: 'La femme est grande.' },
  ],
}

export default lesson
