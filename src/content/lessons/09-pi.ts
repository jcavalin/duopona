import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'pi',
  title: 'pi',
  chapter: 'Lesson 11',
  newWords: ['kasi', 'sijelo', 'suno', 'tenpo', 'awen', 'tawa', 'pi'],
  grammar: {
    title: 'Grouping describing words with pi',
    explanation: [
      'Normally each describing word adds to everything before it. pi changes that: the words after pi form one group that describes the noun together.',
      'tomo kulupu suli is “a big group house” (the house is big). tomo pi kulupu suli is “the house of the big group” (the group is big).',
      'tawa can also be a verb or a describing word, meaning “to go” or “moving”: soweli li tawa means “the animal is moving”.',
    ],
  },
  exercises: [
    { id: 'kasi', type: 'multipleChoice', direction: 'tp-en', prompt: 'kasi', options: ['plant / leaf / tree', 'body / physical state', 'sun / light / bright'], answer: 'plant / leaf / tree' },
    { id: 'sijelo', type: 'multipleChoice', direction: 'en-tp', prompt: 'body / physical state', options: ['kasi', 'sijelo', 'suno', 'tenpo'], answer: 'sijelo' },
    { id: 'suno', type: 'multipleChoice', direction: 'tp-en', prompt: 'suno', options: ['time / moment', 'plant / leaf / tree', 'sun / light / bright'], answer: 'sun / light / bright' },
    { id: 'tenpo', type: 'multipleChoice', direction: 'en-tp', prompt: 'time / moment', options: ['awen', 'suno', 'pi', 'tenpo'], answer: 'tenpo' },
    { id: 'awen', type: 'multipleChoice', direction: 'tp-en', prompt: 'awen', options: ['to / toward / moving', 'to stay / to wait / safe', 'to know / knowledge'], answer: 'to stay / to wait / safe' },
    { id: 'soweli-li-tawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli li tawa', options: ['The animal is staying.', 'The animal is at home.', 'The animal is moving.'], answer: 'The animal is moving.' },
    { id: 'tomo-pi-kulupu-suli', type: 'wordBank', direction: 'en-tp', prompt: 'the house of the big group', answer: ['tomo', 'pi', 'kulupu', 'suli'], distractors: ['li'], practisesGrammar: true },
    { id: 'lipu-pi-jan-pona-li-sin', type: 'wordBank', direction: 'en-tp', prompt: 'The book of the good person is new.', answer: ['lipu', 'pi', 'jan', 'pona', 'li', 'sin'], distractors: ['e'], practisesGrammar: true },
    { id: 'tenpo-pi-moku-mute', type: 'wordBank', direction: 'tp-en', prompt: 'tenpo pi moku mute', answer: ['a', 'time', 'of', 'much', 'food'], distractors: ['body', 'stay'] },
    { id: 'sijelo-pi-jan-wawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'sijelo pi jan wawa', options: ['the body of the strong person', 'the strong body of a person', 'a person with a body'], answer: 'the body of the strong person' },
    { id: 'mi-awen-lon-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'I stay in the house.', answer: ['mi', 'awen', 'lon', 'tomo'], distractors: ['tawa'] },
    { id: 'kasi-li-tawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'The plant is moving.', options: ['kasi li awen', 'kasi li lon', 'kasi li tawa'], answer: 'kasi li tawa' },
  ],
}

export default lesson
