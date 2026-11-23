import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'particles-and-perspective',
  title: 'Partículas e perspectiva',
  chapter: 'Lição 16',
  newWords: ['anpa', 'ante', 'en', 'lete', 'lupa', 'open', 'sama', 'suwi', 'taso', 'tawa'],
  grammar: {
    title: 'Juntar sujeitos com en, e taso',
    explanation: [
      'en junta dois sujeitos: mije en meli li moku quer dizer “o homem e a mulher comem”. Com en, li é sempre necessário, mesmo com mi ou sina.',
      'taso depois de uma palavra quer dizer “só”: mi moku e kili taso quer dizer “eu como só fruta”. No começo da frase, quer dizer “mas”: taso mi lete.',
      'tawa também pode querer dizer “para” ou “na opinião de”: kili suwi li pona tawa mi quer dizer “eu gosto de fruta doce” (fruta doce é boa para mim).',
    ],
  },
  exercises: [
    { id: 'anpa', type: 'multipleChoice', direction: 'tp-en', prompt: 'anpa', options: ['embaixo / para baixo / humilde', 'diferente / outro / mudado', 'doce / fofo'], answer: 'embaixo / para baixo / humilde' },
    { id: 'ante', type: 'multipleChoice', direction: 'en-tp', prompt: 'diferente / outro / mudado', options: ['sama', 'ante', 'suwi', 'lete'], answer: 'ante' },
    { id: 'lete', type: 'multipleChoice', direction: 'tp-en', prompt: 'lete', options: ['doce / fofo', 'abrir / começar', 'frio / cru'], answer: 'frio / cru' },
    { id: 'lupa', type: 'multipleChoice', direction: 'en-tp', prompt: 'buraco / porta / janela', options: ['open', 'anpa', 'taso', 'lupa'], answer: 'lupa' },
    { id: 'open', type: 'multipleChoice', direction: 'tp-en', prompt: 'open', options: ['só / mas', 'abrir / começar', 'igual / parecido / como'], answer: 'abrir / começar' },
    { id: 'sama', type: 'multipleChoice', direction: 'en-tp', prompt: 'igual / parecido / como', options: ['ante', 'sama', 'en', 'lete'], answer: 'sama' },
    { id: 'suwi', type: 'multipleChoice', direction: 'tp-en', prompt: 'suwi', options: ['doce / fofo', 'frio / cru', 'embaixo / para baixo / humilde'], answer: 'doce / fofo' },
    { id: 'mije-en-meli-li-moku', type: 'multipleChoice', direction: 'en-tp', prompt: 'O homem e a mulher estão comendo.', options: ['mije en meli moku', 'mije en meli li moku', 'mije li meli li moku'], answer: 'mije en meli li moku' },
    { id: 'mi-moku-e-kili-taso', type: 'wordBank', direction: 'en-tp', prompt: 'Eu como só fruta.', answer: ['mi', 'moku', 'e', 'kili', 'taso'], distractors: ['en'], practisesGrammar: true, grammarNote: 'taso depois de uma palavra quer dizer “só”, então kili taso é “só fruta”, no fim da parte com e.' },
    { id: 'taso-mi-lete', type: 'wordBank', direction: 'en-tp', prompt: 'Mas eu estou com frio.', answer: ['taso', 'mi', 'lete'], distractors: ['li'], practisesGrammar: true, grammarNote: 'No começo da frase, taso quer dizer “mas”; depois vem mi lete, sem li depois de mi.' },
    { id: 'kili-suwi-li-pona-tawa-mi', type: 'wordBank', direction: 'en-tp', prompt: 'Eu gosto de fruta doce.', answer: ['kili', 'suwi', 'li', 'pona', 'tawa', 'mi'], distractors: ['e'], practisesGrammar: true, grammarNote: 'Toki pona diz “fruta doce é boa para mim”: kili suwi li pona, depois tawa mi.' },
    { id: 'lupa-li-open', type: 'wordBank', direction: 'tp-en', prompt: 'lupa li open', answer: ['a', 'porta', 'está', 'aberta'], distractors: ['fria', 'doce'] },
    { id: 'ni-li-sama', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni li sama', options: ['Isto é igual.', 'Isto é diferente.', 'Isto está embaixo.'], answer: 'Isto é igual.' },
    { id: 'tomo-ante', type: 'multipleChoice', direction: 'tp-en', prompt: 'tomo ante', options: ['a mesma casa', 'uma casa diferente', 'uma casa fria'], answer: 'uma casa diferente' },
  ],
}

export default lesson
