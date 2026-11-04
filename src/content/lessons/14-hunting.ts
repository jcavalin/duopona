import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'hunting',
  title: 'Hunting',
  chapter: 'Lesson 17',
  newWords: ['alasa', 'lawa', 'len', 'linja', 'pakala', 'palisa', 'pipi', 'waso', 'weka'],
  grammar: {
    title: 'Review: a hunting story',
    explanation: [
      'This lesson follows a hunter through one day and mixes the grammar you have learned: la to set the time, e for what is hunted, kepeken for tools and pi to group describing words.',
      'jan alasa (hunting person) is simply “hunter”: Toki Pona builds new ideas by putting simple words together.',
    ],
  },
  exercises: [
    { id: 'alasa', type: 'multipleChoice', direction: 'tp-en', prompt: 'alasa', options: ['to hunt / to gather', 'bird / flying animal', 'line / rope / string'], answer: 'to hunt / to gather' },
    { id: 'waso', type: 'multipleChoice', direction: 'en-tp', prompt: 'bird / flying animal', options: ['pipi', 'waso', 'kala', 'soweli'], answer: 'waso' },
    { id: 'pipi', type: 'multipleChoice', direction: 'tp-en', prompt: 'pipi', options: ['bird / flying animal', 'stick / rod / branch', 'bug / insect'], answer: 'bug / insect' },
    { id: 'palisa', type: 'multipleChoice', direction: 'en-tp', prompt: 'stick / rod / branch', options: ['linja', 'len', 'lawa', 'palisa'], answer: 'palisa' },
    { id: 'len', type: 'multipleChoice', direction: 'tp-en', prompt: 'len', options: ['line / rope / string', 'cloth / clothing', 'head / mind / to lead'], answer: 'cloth / clothing' },
    { id: 'linja', type: 'multipleChoice', direction: 'en-tp', prompt: 'line / rope / string', options: ['len', 'linja', 'palisa', 'weka'], answer: 'linja' },
    { id: 'lawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'lawa', options: ['head / mind / to lead', 'broken / damaged / mistake', 'away / absent'], answer: 'head / mind / to lead' },
    { id: 'tenpo-suno-la-jan-alasa-li-tawa-kasi', type: 'wordBank', direction: 'en-tp', prompt: 'In the daytime, the hunter goes to the plants.', answer: ['tenpo', 'suno', 'la', 'jan', 'alasa', 'li', 'tawa', 'kasi'], distractors: ['e'], practisesGrammar: true, grammarNote: 'The time goes first, before la. jan alasa is not mi or sina, so li comes before tawa kasi.' },
    { id: 'ona-li-alasa-e-waso-kepeken-palisa', type: 'wordBank', direction: 'en-tp', prompt: 'She hunts birds using a stick.', answer: ['ona', 'li', 'alasa', 'e', 'waso', 'kepeken', 'palisa'], distractors: ['lon'], practisesGrammar: true, grammarNote: 'e marks what is hunted, waso, and kepeken palisa adds the tool at the end.' },
    { id: 'linja-ona-li-pakala', type: 'wordBank', direction: 'tp-en', prompt: 'linja ona li pakala', answer: ['her', 'rope', 'is', 'broken'], distractors: ['head', 'away'] },
    { id: 'waso-li-tawa-weka', type: 'multipleChoice', direction: 'tp-en', prompt: 'waso li tawa weka', options: ['The bird comes back.', 'The bird goes away.', 'The bird is broken.'], answer: 'The bird goes away.' },
    { id: 'len-pi-jan-alasa-li-loje', type: 'wordBank', direction: 'en-tp', prompt: 'The clothing of the hunter is red.', answer: ['len', 'pi', 'jan', 'alasa', 'li', 'loje'], distractors: ['e'], practisesGrammar: true, grammarNote: 'pi groups jan alasa as one idea describing len: the clothing of the hunter. Then li loje.' },
  ],
}

export default lesson
