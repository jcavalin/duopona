import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'pre-verbs',
  title: 'Pre-Verbs',
  chapter: 'Lesson 13',
  newWords: ['kama', 'ken', 'wile', 'lukin', 'sona'],
  grammar: {
    title: 'Pre-verbs: want to, can, try to',
    explanation: [
      'A pre-verb goes right before the main verb and changes its meaning: mi wile moku means “I want to eat”.',
      'The common ones are wile (want to), ken (can), sona (know how to), lukin (try to) and kama (come to, become).',
      'The e part still follows the main verb: mi lukin kute e soweli means “I try to hear the animal”.',
    ],
  },
  exercises: [
    { id: 'kama', type: 'multipleChoice', direction: 'tp-en', prompt: 'kama', options: ['to come / to become / arriving', 'can / to be able to / possible', 'to want / to need / must'], answer: 'to come / to become / arriving' },
    { id: 'ken', type: 'multipleChoice', direction: 'en-tp', prompt: 'can / to be able to / possible', options: ['wile', 'ken', 'kama', 'lukin'], answer: 'ken' },
    { id: 'wile', type: 'multipleChoice', direction: 'tp-en', prompt: 'wile', options: ['to see / to look / to try to', 'to know / knowledge', 'to want / to need / must'], answer: 'to want / to need / must' },
    { id: 'lukin', type: 'multipleChoice', direction: 'en-tp', prompt: 'to see / to look / to try to', options: ['kute', 'sona', 'ken', 'lukin'], answer: 'lukin' },
    { id: 'mi-wile-moku', type: 'wordBank', direction: 'en-tp', prompt: 'I want to eat.', answer: ['mi', 'wile', 'moku'], distractors: ['e'], practisesGrammar: true },
    { id: 'sina-ken-toki', type: 'wordBank', direction: 'en-tp', prompt: 'You can talk.', answer: ['sina', 'ken', 'toki'], distractors: ['li'], practisesGrammar: true },
    { id: 'ona-li-sona-pali', type: 'wordBank', direction: 'en-tp', prompt: 'She knows how to work.', answer: ['ona', 'li', 'sona', 'pali'], distractors: ['e'], practisesGrammar: true },
    { id: 'mi-lukin-kute-e-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'I try to hear the animal.', answer: ['mi', 'lukin', 'kute', 'e', 'soweli'], distractors: ['li'], practisesGrammar: true },
    { id: 'jan-li-kama', type: 'multipleChoice', direction: 'tp-en', prompt: 'jan li kama', options: ['The person can come.', 'The person wants to come.', 'The person is coming.'], answer: 'The person is coming.' },
    { id: 'mi-kama-sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi kama sona', options: ['I am learning.', 'I know.', 'I want to know.'], answer: 'I am learning.' },
    { id: 'mi-lukin-e-suno', type: 'multipleChoice', direction: 'en-tp', prompt: 'I see the sun.', options: ['mi lukin suno', 'mi lukin e suno', 'suno li lukin e mi'], answer: 'mi lukin e suno' },
    { id: 'sina-wile-ala-moku', type: 'wordBank', direction: 'tp-en', prompt: 'sina wile ala moku', answer: ['you', 'do', 'not', 'want', 'to', 'eat'], distractors: ['can'] },
  ],
}

export default lesson
