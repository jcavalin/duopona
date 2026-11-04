import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'more-words-1',
  title: 'More Words 1',
  chapter: 'Dictionary',
  newWords: ['ma', 'nasin', 'nena', 'nimi', 'utala', 'akesi', 'jaki', 'kalama', 'kiwen', 'ale', 'esun'],
  grammar: {
    title: 'Review: more words',
    explanation: [
      'These words complete the vocabulary of the book’s dictionary. Practise them with all the grammar you know.',
      'ale means “all” or “everything” (you may also see it written ali). nimi means “word” or “name”.',
    ],
  },
  exercises: [
    { id: 'ma', type: 'multipleChoice', direction: 'tp-en', prompt: 'ma', options: ['land / country / place', 'way / road / method', 'hill / bump / nose'], answer: 'land / country / place' },
    { id: 'nasin', type: 'multipleChoice', direction: 'en-tp', prompt: 'way / road / method', options: ['nena', 'nasin', 'ma', 'nimi'], answer: 'nasin' },
    { id: 'nena', type: 'multipleChoice', direction: 'tp-en', prompt: 'nena', options: ['stone / rock / hard', 'sound / noise', 'hill / bump / nose'], answer: 'hill / bump / nose' },
    { id: 'nimi', type: 'multipleChoice', direction: 'en-tp', prompt: 'word / name', options: ['toki', 'kalama', 'lipu', 'nimi'], answer: 'nimi' },
    { id: 'utala', type: 'multipleChoice', direction: 'tp-en', prompt: 'utala', options: ['to hunt / to gather', 'to fight / battle', 'market / shop / trade'], answer: 'to fight / battle' },
    { id: 'akesi', type: 'multipleChoice', direction: 'en-tp', prompt: 'reptile / amphibian', options: ['pipi', 'akesi', 'waso', 'kala'], answer: 'akesi' },
    { id: 'jaki', type: 'multipleChoice', direction: 'tp-en', prompt: 'jaki', options: ['dirty / gross / toxic', 'stone / rock / hard', 'all / everything / life'], answer: 'dirty / gross / toxic' },
    { id: 'kalama', type: 'multipleChoice', direction: 'en-tp', prompt: 'sound / noise', options: ['kiwen', 'esun', 'ale', 'kalama'], answer: 'kalama' },
    { id: 'esun', type: 'multipleChoice', direction: 'tp-en', prompt: 'esun', options: ['stone / rock / hard', 'land / country / place', 'market / shop / trade'], answer: 'market / shop / trade' },
    { id: 'utala-la-mi-kute-e-kalama-mute', type: 'wordBank', direction: 'en-tp', prompt: 'In a fight, I hear many sounds.', answer: ['utala', 'la', 'mi', 'kute', 'e', 'kalama', 'mute'], distractors: ['li'], practisesGrammar: true, grammarNote: 'utala sets the scene before la. In the main sentence e marks what is heard, and mute follows kalama.' },
    { id: 'akesi-li-lon-sewi-kiwen', type: 'wordBank', direction: 'en-tp', prompt: 'The reptile is on top of the stone.', answer: ['akesi', 'li', 'lon', 'sewi', 'kiwen'], distractors: ['e'], practisesGrammar: true, grammarNote: '“On top of” is lon sewi, followed by the thing: lon sewi kiwen.' },
    { id: 'nimi-pi-ma-ni-li-seme', type: 'wordBank', direction: 'tp-en', prompt: 'nimi pi ma ni li seme?', answer: ['what', 'is', 'the', 'name', 'of', 'this', 'land'], distractors: ['road', 'hill'] },
    { id: 'soweli-ale-li-lon-ma', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli ale li lon ma', options: ['All the animals are on the land.', 'One animal is on the land.', 'The animals are in the water.'], answer: 'All the animals are on the land.' },
  ],
}

export default lesson
