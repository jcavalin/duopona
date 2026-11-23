import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'pre-verbs',
  title: 'Pré-verbes',
  chapter: 'Leçon 13',
  newWords: ['kama', 'ken', 'wile', 'lukin', 'sona'],
  grammar: {
    title: 'Les pré-verbes\u202f: vouloir, pouvoir, essayer',
    explanation: [
      'Un pré-verbe se place juste avant le verbe principal et en change le sens\u202f: mi wile moku veut dire «\u202fje veux manger\u202f».',
      'Les plus courants sont wile (vouloir), ken (pouvoir), sona (savoir faire), lukin (essayer de) et kama (en venir à, devenir).',
      'La partie avec e suit toujours le verbe principal\u202f: mi lukin kute e soweli veut dire «\u202fj’essaie d’entendre l’animal\u202f».',
    ],
  },
  exercises: [
    { id: 'kama', type: 'multipleChoice', direction: 'tp-en', prompt: 'kama', options: ['venir / devenir / qui arrive', 'pouvoir / être capable / possible', 'vouloir / avoir besoin / devoir'], answer: 'venir / devenir / qui arrive' },
    { id: 'ken', type: 'multipleChoice', direction: 'en-tp', prompt: 'pouvoir / être capable / possible', options: ['wile', 'ken', 'kama', 'lukin'], answer: 'ken' },
    { id: 'wile', type: 'multipleChoice', direction: 'tp-en', prompt: 'wile', options: ['voir / regarder / essayer de', 'savoir / connaissance', 'vouloir / avoir besoin / devoir'], answer: 'vouloir / avoir besoin / devoir' },
    { id: 'lukin', type: 'multipleChoice', direction: 'en-tp', prompt: 'voir / regarder / essayer de', options: ['kute', 'sona', 'ken', 'lukin'], answer: 'lukin' },
    { id: 'mi-wile-moku', type: 'wordBank', direction: 'en-tp', prompt: 'Je veux manger.', answer: ['mi', 'wile', 'moku'], distractors: ['e'], practisesGrammar: true, grammarNote: 'Le pré-verbe wile se place juste avant le verbe principal moku\u202f: mi wile moku.' },
    { id: 'sina-ken-toki', type: 'wordBank', direction: 'en-tp', prompt: 'Tu peux parler.', answer: ['sina', 'ken', 'toki'], distractors: ['li'], practisesGrammar: true, grammarNote: 'ken vient juste avant le verbe qu’il modifie, et après sina il n’y a pas de li\u202f: sina ken toki.' },
    { id: 'ona-li-sona-pali', type: 'wordBank', direction: 'en-tp', prompt: 'Elle sait travailler.', answer: ['ona', 'li', 'sona', 'pali'], distractors: ['e'], practisesGrammar: true, grammarNote: 'ona a toujours besoin de li, puis le pré-verbe sona vient juste avant le verbe pali.' },
    { id: 'mi-lukin-kute-e-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'J’essaie d’entendre l’animal.', answer: ['mi', 'lukin', 'kute', 'e', 'soweli'], distractors: ['li'], practisesGrammar: true, grammarNote: 'lukin se place avant le verbe principal kute, et la partie avec e suit toujours ce verbe\u202f: kute e soweli.' },
    { id: 'jan-li-kama', type: 'multipleChoice', direction: 'tp-en', prompt: 'jan li kama', options: ['La personne peut venir.', 'La personne veut venir.', 'La personne arrive.'], answer: 'La personne arrive.' },
    { id: 'mi-kama-sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi kama sona', options: ['J’apprends.', 'Je sais.', 'Je veux savoir.'], answer: 'J’apprends.' },
    { id: 'mi-lukin-e-suno', type: 'multipleChoice', direction: 'en-tp', prompt: 'Je vois le soleil.', options: ['mi lukin suno', 'mi lukin e suno', 'suno li lukin e mi'], answer: 'mi lukin e suno' },
    { id: 'sina-wile-ala-moku', type: 'wordBank', direction: 'tp-en', prompt: 'sina wile ala moku', answer: ['tu', 'ne', 'veux', 'pas', 'manger'], distractors: ['peux'] },
  ],
}

export default lesson
