import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'colours-and-la',
  title: 'Cores e la',
  chapter: 'Lição 14',
  newWords: ['jelo', 'laso', 'loje', 'pimeja', 'walo', 'la'],
  grammar: {
    title: 'Cores, e situar a cena com la',
    explanation: [
      'As cores são palavras que descrevem como as outras: kili loje é “uma fruta vermelha”. laso cobre tanto o azul quanto o verde.',
      'la permite situar a cena primeiro. Ponha um contexto antes de la e, depois, a frase principal: tenpo suno la mi pali quer dizer “de dia, eu trabalho”.',
      'O contexto também pode ser uma frase inteira, como “se” ou “quando”: sina pali la mi moku quer dizer “se você trabalhar, eu como”.',
    ],
  },
  exercises: [
    { id: 'jelo', type: 'multipleChoice', direction: 'tp-en', prompt: 'jelo', options: ['amarelo', 'vermelho', 'branco / claro'], answer: 'amarelo' },
    { id: 'laso', type: 'multipleChoice', direction: 'en-tp', prompt: 'azul / verde', options: ['loje', 'laso', 'walo', 'pimeja'], answer: 'laso' },
    { id: 'loje', type: 'multipleChoice', direction: 'tp-en', prompt: 'loje', options: ['amarelo', 'preto / escuro', 'vermelho'], answer: 'vermelho' },
    { id: 'pimeja', type: 'multipleChoice', direction: 'en-tp', prompt: 'preto / escuro', options: ['walo', 'jelo', 'laso', 'pimeja'], answer: 'pimeja' },
    { id: 'walo', type: 'multipleChoice', direction: 'tp-en', prompt: 'walo', options: ['azul / verde', 'branco / claro', 'vermelho'], answer: 'branco / claro' },
    { id: 'tenpo-suno-la-mi-pali', type: 'wordBank', direction: 'en-tp', prompt: 'De dia, eu trabalho.', answer: ['tenpo', 'suno', 'la', 'mi', 'pali'], distractors: ['li'], practisesGrammar: true, grammarNote: 'tenpo suno situa a cena, então vem primeiro, depois la, depois a frase principal mi pali.' },
    { id: 'tenpo-pimeja-la-mi-awen', type: 'wordBank', direction: 'en-tp', prompt: 'À noite, eu fico em casa.', answer: ['tenpo', 'pimeja', 'la', 'mi', 'awen', 'lon', 'tomo'], distractors: ['li'], practisesGrammar: true, grammarNote: 'O tempo, tenpo pimeja, vem antes de la; a frase principal vem depois, com lon tomo no fim.' },
    { id: 'kili-loje', type: 'wordBank', direction: 'en-tp', prompt: 'uma fruta vermelha', answer: ['kili', 'loje'], distractors: ['laso'] },
    { id: 'tenpo-ni-la-mi-moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'tenpo ni la mi moku', options: ['Eu comi isto.', 'Eu quero comer isto.', 'Agora eu estou comendo.'], answer: 'Agora eu estou comendo.' },
    { id: 'telo-laso-li-suli', type: 'wordBank', direction: 'tp-en', prompt: 'telo laso li suli', answer: ['a', 'água', 'azul', 'é', 'grande'], distractors: ['vermelha', 'pequena'] },
    { id: 'tomo-li-walo', type: 'multipleChoice', direction: 'en-tp', prompt: 'A casa é branca.', options: ['tomo walo', 'tomo li walo', 'walo li tomo'], answer: 'tomo li walo' },
    { id: 'sina-pali-la-mi-moku', type: 'wordBank', direction: 'en-tp', prompt: 'Se você trabalhar, eu como.', answer: ['sina', 'pali', 'la', 'mi', 'moku'], distractors: ['e'], practisesGrammar: true, grammarNote: 'A parte do “se” é uma frase inteira antes de la; a frase principal mi moku vem depois.' },
  ],
}

export default lesson
