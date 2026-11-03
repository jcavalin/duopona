import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'questions-and-answers',
  title: 'Questions and Answers',
  chapter: 'Lesson 7',
  newWords: ['ilo', 'kala', 'ona', 'anu', 'seme'],
  grammar: {
    title: 'Asking questions',
    explanation: [
      'To ask about something, put seme where the answer would go: sina moku e seme? means “what are you eating?”.',
      'For a yes/no question, say the verb, then ala, then the verb again: sina wawa ala wawa? means “are you strong?”. Answer with the verb (wawa) or ala.',
      'anu means “or”: kala anu kili? asks “fish or fruit?”.',
    ],
  },
  exercises: [
    { id: 'ilo', type: 'multipleChoice', direction: 'tp-en', prompt: 'ilo', options: ['tool / machine / device', 'fish / sea animal', 'what / which'], answer: 'tool / machine / device' },
    { id: 'kala', type: 'multipleChoice', direction: 'en-tp', prompt: 'fish / sea animal', options: ['kili', 'kala', 'soweli', 'ilo'], answer: 'kala' },
    { id: 'ona', type: 'multipleChoice', direction: 'tp-en', prompt: 'ona', options: ['I / me / we', 'you', 'he / she / it / they'], answer: 'he / she / it / they' },
    { id: 'anu', type: 'multipleChoice', direction: 'en-tp', prompt: 'or', options: ['seme', 'ala', 'e', 'anu'], answer: 'anu' },
    { id: 'seme', type: 'multipleChoice', direction: 'en-tp', prompt: 'what / which', options: ['seme', 'ona', 'anu', 'ni'], answer: 'seme' },
    { id: 'sina-moku-e-seme', type: 'wordBank', direction: 'en-tp', prompt: 'What are you eating?', answer: ['sina', 'moku', 'e', 'seme'], distractors: ['li'], practisesGrammar: true },
    { id: 'sina-wawa-ala-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'Are you strong?', answer: ['sina', 'wawa', 'ala', 'wawa'], distractors: ['seme'], practisesGrammar: true },
    { id: 'ilo-li-pona-ala-pona', type: 'wordBank', direction: 'en-tp', prompt: 'Is the tool good?', answer: ['ilo', 'li', 'pona', 'ala', 'pona'], distractors: ['seme'], practisesGrammar: true },
    { id: 'jan-seme-li-moku', type: 'wordBank', direction: 'tp-en', prompt: 'jan seme li moku?', answer: ['who', 'is', 'eating'], distractors: ['what', 'food'] },
    { id: 'kala-anu-kili', type: 'multipleChoice', direction: 'tp-en', prompt: 'ona li kala anu kili?', options: ['Is it a fish or a fruit?', 'It is a fish and a fruit.', 'Is it a fish?'], answer: 'Is it a fish or a fruit?' },
    { id: 'sina-sona-ala-sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sina sona ala sona?', options: ['You do not know.', 'Do you know?', 'What do you know?'], answer: 'Do you know?' },
    { id: 'ni-li-seme', type: 'multipleChoice', direction: 'en-tp', prompt: 'What is this?', options: ['ni li ala?', 'ni li ijo?', 'ni li seme?'], answer: 'ni li seme?' },
    { id: 'ona-li-jo-e-ilo', type: 'wordBank', direction: 'en-tp', prompt: 'She has a tool.', answer: ['ona', 'li', 'jo', 'e', 'ilo'], distractors: ['mi'] },
  ],
}

export default lesson
