import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'greetings-and-feelings',
  title: 'Greetings and Feelings',
  chapter: 'Lesson 10',
  newWords: ['a', 'mu', 'o', 'pilin'],
  grammar: {
    title: 'Commands, calling someone, and feelings',
    explanation: [
      'Start a sentence with o to give a command: o pali! means “work!”. Add ala to say “don’t”: o moku ala e kala!',
      'Put o after a name or a person to call them: jan pona o, kute e mi! means “friend, listen to me!”.',
      'toki! on its own works as “hello!”. Use pilin to talk about feelings, and a to add emotion: a, sina wawa!',
    ],
  },
  exercises: [
    { id: 'pilin', type: 'multipleChoice', direction: 'tp-en', prompt: 'pilin', options: ['feeling / heart / to feel', 'food / to eat / to drink', 'tool / machine / device'], answer: 'feeling / heart / to feel' },
    { id: 'mu', type: 'multipleChoice', direction: 'en-tp', prompt: 'moo / woof (any animal sound)', options: ['a', 'mu', 'o', 'seme'], answer: 'mu' },
    { id: 'a', type: 'multipleChoice', direction: 'tp-en', prompt: 'a', options: ['or', 'what / which', 'ah! / oh! (emotion or emphasis)'], answer: 'ah! / oh! (emotion or emphasis)' },
    { id: 'o-moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'o moku!', options: ['Eat!', 'I eat.', 'Food is good.'], answer: 'Eat!' },
    { id: 'o-pali', type: 'wordBank', direction: 'en-tp', prompt: 'Work!', answer: ['o', 'pali'], distractors: ['mi'], practisesGrammar: true },
    { id: 'jan-pona-o-kute-e-mi', type: 'wordBank', direction: 'en-tp', prompt: 'Friend, listen to me!', answer: ['jan', 'pona', 'o', 'kute', 'e', 'mi'], distractors: ['li'], practisesGrammar: true },
    { id: 'toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'Hello!', options: ['toki!', 'moku!', 'pona!'], answer: 'toki!' },
    { id: 'mi-pilin-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi pilin pona', options: ['You feel good.', 'I feel good.', 'I feel bad.'], answer: 'I feel good.' },
    { id: 'mi-pilin-ike', type: 'wordBank', direction: 'en-tp', prompt: 'I feel bad.', answer: ['mi', 'pilin', 'ike'], distractors: ['li'] },
    { id: 'soweli-li-mu', type: 'wordBank', direction: 'tp-en', prompt: 'soweli li mu', answer: ['the', 'animal', 'makes', 'a', 'sound'], distractors: ['eats', 'fish'] },
    { id: 'a-sina-wawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'a, sina wawa!', options: ['Are you strong?', 'Oh, you are strong!', 'I am strong.'], answer: 'Oh, you are strong!' },
    { id: 'o-moku-ala-e-kala', type: 'wordBank', direction: 'en-tp', prompt: 'Don’t eat the fish!', answer: ['o', 'moku', 'ala', 'e', 'kala'], distractors: ['li'], practisesGrammar: true },
  ],
}

export default lesson
