import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'you-and-i',
  title: 'Você e eu',
  chapter: 'Lição 4',
  newWords: ['mi', 'mije', 'sina', 'kulupu', 'sin', 'wawa'],
  grammar: {
    title: 'mi e sina dispensam li',
    explanation: [
      'Quando o sujeito é só mi (eu, nós) ou só sina (você), deixe li de fora: mi wawa quer dizer “eu sou forte”.',
      'Qualquer outro sujeito continua levando li: mije li wawa quer dizer “o homem é forte”.',
      'Depois de um substantivo, mi e sina querem dizer “meu” e “seu”: kulupu mi é “meu grupo”.',
    ],
  },
  exercises: [
    { id: 'mi', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi', options: ['eu / mim / nós', 'você / vocês', 'homem / masculino'], answer: 'eu / mim / nós' },
    { id: 'sina', type: 'multipleChoice', direction: 'en-tp', prompt: 'você / vocês', options: ['mi', 'sina', 'mije', 'meli'], answer: 'sina' },
    { id: 'mije', type: 'multipleChoice', direction: 'tp-en', prompt: 'mije', options: ['mulher / feminino', 'grupo / comunidade', 'homem / masculino'], answer: 'homem / masculino' },
    { id: 'kulupu', type: 'multipleChoice', direction: 'en-tp', prompt: 'grupo / comunidade', options: ['kili', 'lipu', 'tomo', 'kulupu'], answer: 'kulupu' },
    { id: 'sin', type: 'multipleChoice', direction: 'tp-en', prompt: 'sin', options: ['forte / poderoso / energia', 'novo / fresco / extra', 'pequeno / jovem'], answer: 'novo / fresco / extra' },
    { id: 'wawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'forte / poderoso / energia', options: ['sin', 'wawa', 'suli', 'pona'], answer: 'wawa' },
    { id: 'mi-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'Eu sou forte.', answer: ['mi', 'wawa'], distractors: ['li', 'sina'], practisesGrammar: true, grammarNote: 'Com só mi como sujeito, li fica de fora: mi wawa.' },
    { id: 'sina-pona', type: 'wordBank', direction: 'en-tp', prompt: 'Você é bom.', answer: ['sina', 'pona'], distractors: ['li', 'mi'], practisesGrammar: true, grammarNote: 'Com só sina como sujeito, li fica de fora: sina pona.' },
    { id: 'mije-li-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'O homem é forte.', answer: ['mije', 'li', 'wawa'], distractors: ['mi'], practisesGrammar: true, grammarNote: 'mije não é mi nem sina, então ainda precisa de li: mije li wawa.' },
    { id: 'sina-jan-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sina jan pona', options: ['Você é uma boa pessoa.', 'Eu sou uma boa pessoa.', 'A pessoa é boa.'], answer: 'Você é uma boa pessoa.' },
    { id: 'kulupu-sina-li-wawa', type: 'wordBank', direction: 'tp-en', prompt: 'kulupu sina li wawa', answer: ['seu', 'grupo', 'é', 'forte'], distractors: ['meu', 'novo'] },
    { id: 'lipu-sin', type: 'multipleChoice', direction: 'en-tp', prompt: 'um livro novo', options: ['sin lipu', 'lipu li sin', 'lipu sin'], answer: 'lipu sin' },
    { id: 'mi-meli', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi meli', options: ['Eu sou uma mulher.', 'Você é uma mulher.', 'minha casa'], answer: 'Eu sou uma mulher.' },
  ],
}

export default lesson
