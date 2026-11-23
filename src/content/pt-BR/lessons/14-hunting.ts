import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'hunting',
  title: 'Caça',
  chapter: 'Lição 17',
  newWords: ['alasa', 'lawa', 'len', 'linja', 'pakala', 'palisa', 'pipi', 'waso', 'weka'],
  grammar: {
    title: 'Revisão: uma história de caça',
    explanation: [
      'Esta lição acompanha um caçador ao longo de um dia e mistura a gramática que você aprendeu: la para situar o tempo, e para o que é caçado, kepeken para as ferramentas e pi para agrupar palavras que descrevem.',
      'jan alasa (pessoa que caça) é simplesmente “caçador”: toki pona cria ideias novas juntando palavras simples.',
    ],
  },
  exercises: [
    { id: 'alasa', type: 'multipleChoice', direction: 'tp-en', prompt: 'alasa', options: ['caçar / coletar', 'pássaro / animal que voa', 'linha / corda / fio'], answer: 'caçar / coletar' },
    { id: 'waso', type: 'multipleChoice', direction: 'en-tp', prompt: 'pássaro / animal que voa', options: ['pipi', 'waso', 'kala', 'soweli'], answer: 'waso' },
    { id: 'pipi', type: 'multipleChoice', direction: 'tp-en', prompt: 'pipi', options: ['pássaro / animal que voa', 'vara / bastão / galho', 'bicho / inseto'], answer: 'bicho / inseto' },
    { id: 'palisa', type: 'multipleChoice', direction: 'en-tp', prompt: 'vara / bastão / galho', options: ['linja', 'len', 'lawa', 'palisa'], answer: 'palisa' },
    { id: 'len', type: 'multipleChoice', direction: 'tp-en', prompt: 'len', options: ['linha / corda / fio', 'pano / roupa', 'cabeça / mente / liderar'], answer: 'pano / roupa' },
    { id: 'linja', type: 'multipleChoice', direction: 'en-tp', prompt: 'linha / corda / fio', options: ['len', 'linja', 'palisa', 'weka'], answer: 'linja' },
    { id: 'lawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'lawa', options: ['cabeça / mente / liderar', 'quebrado / estragado / erro', 'longe / ausente'], answer: 'cabeça / mente / liderar' },
    { id: 'tenpo-suno-la-jan-alasa-li-tawa-kasi', type: 'wordBank', direction: 'en-tp', prompt: 'De dia, o caçador vai até as plantas.', answer: ['tenpo', 'suno', 'la', 'jan', 'alasa', 'li', 'tawa', 'kasi'], distractors: ['e'], practisesGrammar: true, grammarNote: 'O tempo vem primeiro, antes de la. jan alasa não é mi nem sina, então li vem antes de tawa kasi.' },
    { id: 'ona-li-alasa-e-waso-kepeken-palisa', type: 'wordBank', direction: 'en-tp', prompt: 'Ela caça pássaros usando uma vara.', answer: ['ona', 'li', 'alasa', 'e', 'waso', 'kepeken', 'palisa'], distractors: ['lon'], practisesGrammar: true, grammarNote: 'e marca o que é caçado, waso, e kepeken palisa acrescenta a ferramenta no fim.' },
    { id: 'linja-ona-li-pakala', type: 'wordBank', direction: 'tp-en', prompt: 'linja ona li pakala', answer: ['a', 'corda', 'dela', 'está', 'quebrada'], distractors: ['cabeça', 'longe'] },
    { id: 'waso-li-tawa-weka', type: 'multipleChoice', direction: 'tp-en', prompt: 'waso li tawa weka', options: ['O pássaro volta.', 'O pássaro vai embora.', 'O pássaro está quebrado.'], answer: 'O pássaro vai embora.' },
    { id: 'len-pi-jan-alasa-li-loje', type: 'wordBank', direction: 'en-tp', prompt: 'A roupa do caçador é vermelha.', answer: ['len', 'pi', 'jan', 'alasa', 'li', 'loje'], distractors: ['e'], practisesGrammar: true, grammarNote: 'pi agrupa jan alasa numa só ideia que descreve len: a roupa do caçador. Depois, li loje.' },
  ],
}

export default lesson
