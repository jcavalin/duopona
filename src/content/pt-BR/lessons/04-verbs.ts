import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'verbs',
  title: 'Verbos',
  chapter: 'Lição 5',
  newWords: ['jo', 'kute', 'moku', 'pali', 'sona', 'toki', 'e'],
  grammar: {
    title: 'Fazer algo com alguma coisa: e',
    explanation: [
      'Um verbo pode vir logo depois de li, ou logo depois de mi ou sina: mi moku quer dizer “eu como”.',
      'Para dizer sobre o que a ação recai, ponha e antes disso: mi moku e kili quer dizer “eu como fruta”.',
      'Com outros sujeitos, são necessárias as duas palavrinhas: meli li jo e lipu quer dizer “a mulher tem um livro”.',
    ],
  },
  exercises: [
    { id: 'jo', type: 'multipleChoice', direction: 'tp-en', prompt: 'jo', options: ['ter / segurar', 'ouvir / escutar / orelha', 'comida / comer / beber'], answer: 'ter / segurar' },
    { id: 'kute', type: 'multipleChoice', direction: 'en-tp', prompt: 'ouvir / escutar / orelha', options: ['moku', 'kute', 'toki', 'jo'], answer: 'kute' },
    { id: 'moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'moku', options: ['trabalhar / fazer / criar', 'saber / conhecimento', 'comida / comer / beber'], answer: 'comida / comer / beber' },
    { id: 'pali', type: 'multipleChoice', direction: 'en-tp', prompt: 'trabalhar / fazer / criar', options: ['sona', 'jo', 'kute', 'pali'], answer: 'pali' },
    { id: 'sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sona', options: ['falar / língua / olá', 'saber / conhecimento', 'ter / segurar'], answer: 'saber / conhecimento' },
    { id: 'toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'falar / língua / olá', options: ['moku', 'toki', 'pali', 'sona'], answer: 'toki' },
    { id: 'mi-moku-e-kili', type: 'wordBank', direction: 'en-tp', prompt: 'Eu como fruta.', answer: ['mi', 'moku', 'e', 'kili'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Depois de mi, o verbo vem direto, sem li, e e marca o que é comido: mi moku e kili.' },
    { id: 'meli-li-jo-e-lipu', type: 'wordBank', direction: 'en-tp', prompt: 'A mulher tem um livro.', answer: ['meli', 'li', 'jo', 'e', 'lipu'], distractors: ['mi'], practisesGrammar: true, grammarNote: 'meli não é mi nem sina, então li vem antes do verbo, e e vem antes do que ela tem.' },
    { id: 'sina-kute-e-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'Você ouve o animal.', answer: ['sina', 'kute', 'e', 'soweli'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Depois de sina não há li, e e marca o que é ouvido: sina kute e soweli.' },
    { id: 'jan-li-pali-e-tomo', type: 'wordBank', direction: 'tp-en', prompt: 'jan li pali e tomo', answer: ['a', 'pessoa', 'faz', 'a', 'casa'], distractors: ['come', 'água'] },
    { id: 'mi-sona-e-ni', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi sona e ni', options: ['Isto me conhece.', 'Eu sei disso.', 'Você sabe disso.'], answer: 'Eu sei disso.' },
    { id: 'mi-toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'Eu estou falando.', options: ['mi li toki', 'sina toki', 'mi toki'], answer: 'mi toki' },
  ],
}

export default lesson
