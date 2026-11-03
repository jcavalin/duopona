import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'spatial-nouns',
  title: 'Spatial Nouns',
  chapter: 'Lesson 15',
  newWords: ['insa', 'monsi', 'noka', 'poka', 'sewi', 'sinpin'],
  grammar: {
    title: 'Saying exactly where: lon + place word',
    explanation: [
      'Some nouns name a part of space: insa (inside), monsi (back), sinpin (front), poka (side), sewi (top) and noka (bottom).',
      'Use them after lon, followed by the thing they belong to: soweli li lon insa tomo means “the animal is inside the house”.',
    ],
  },
  exercises: [
    { id: 'insa', type: 'multipleChoice', direction: 'tp-en', prompt: 'insa', options: ['inside / centre / stomach', 'back / behind', 'front / face / wall'], answer: 'inside / centre / stomach' },
    { id: 'monsi', type: 'multipleChoice', direction: 'en-tp', prompt: 'back / behind', options: ['sinpin', 'monsi', 'noka', 'poka'], answer: 'monsi' },
    { id: 'noka', type: 'multipleChoice', direction: 'tp-en', prompt: 'noka', options: ['side / nearby / hip', 'front / face / wall', 'leg / foot / bottom'], answer: 'leg / foot / bottom' },
    { id: 'poka', type: 'multipleChoice', direction: 'en-tp', prompt: 'side / nearby / hip', options: ['insa', 'sewi', 'monsi', 'poka'], answer: 'poka' },
    { id: 'sinpin', type: 'multipleChoice', direction: 'tp-en', prompt: 'sinpin', options: ['inside / centre / stomach', 'front / face / wall', 'back / behind'], answer: 'front / face / wall' },
    { id: 'soweli-li-lon-insa-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'The animal is inside the house.', answer: ['soweli', 'li', 'lon', 'insa', 'tomo'], distractors: ['tawa'], practisesGrammar: true },
    { id: 'sina-lon-poka-mi', type: 'wordBank', direction: 'en-tp', prompt: 'You are next to me.', answer: ['sina', 'lon', 'poka', 'mi'], distractors: ['li'], practisesGrammar: true },
    { id: 'suno-li-lon-sewi-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'The sun is above the house.', answer: ['suno', 'li', 'lon', 'sewi', 'tomo'], distractors: ['insa'], practisesGrammar: true },
    { id: 'kili-li-lon-noka-kasi', type: 'multipleChoice', direction: 'tp-en', prompt: 'kili li lon noka kasi', options: ['The fruit is on top of the plant.', 'The fruit is inside the plant.', 'The fruit is at the bottom of the plant.'], answer: 'The fruit is at the bottom of the plant.' },
    { id: 'jan-li-lon-monsi-tomo', type: 'wordBank', direction: 'tp-en', prompt: 'jan li lon monsi tomo', answer: ['the', 'person', 'is', 'behind', 'the', 'house'], distractors: ['inside', 'front'] },
    { id: 'lon-sinpin-tomo', type: 'multipleChoice', direction: 'en-tp', prompt: 'in front of the house', options: ['lon monsi tomo', 'lon sinpin tomo', 'lon insa tomo'], answer: 'lon sinpin tomo' },
    { id: 'lon-sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'lon sewi', options: ['behind', 'inside', 'above'], answer: 'above' },
  ],
}

export default lesson
