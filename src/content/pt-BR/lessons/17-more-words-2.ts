import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'more-words-2',
  title: 'Mais palavras 2',
  chapter: 'Dicionário',
  newWords: ['kon', 'kule', 'mani', 'moli', 'mun', 'musi', 'nasa', 'selo', 'sike', 'sitelen', 'ko', 'poki'],
  grammar: {
    title: 'Revisão: as últimas palavras',
    explanation: [
      'Estas são as últimas palavras do curso. Com elas, você conhece todas as palavras do dicionário do livro, menos os números.',
      'Use tudo o que você aprendeu: la para o contexto, e para os objetos e lon com palavras de lugar.',
    ],
  },
  exercises: [
    { id: 'kon', type: 'multipleChoice', direction: 'tp-en', prompt: 'kon', options: ['ar / vento / espírito', 'lua / estrela', 'dinheiro / riqueza'], answer: 'ar / vento / espírito' },
    { id: 'kule', type: 'multipleChoice', direction: 'en-tp', prompt: 'cor / colorido', options: ['kon', 'kule', 'selo', 'sike'], answer: 'kule' },
    { id: 'mani', type: 'multipleChoice', direction: 'tp-en', prompt: 'mani', options: ['diversão / jogo / arte', 'caixa / recipiente / tigela', 'dinheiro / riqueza'], answer: 'dinheiro / riqueza' },
    { id: 'moli', type: 'multipleChoice', direction: 'en-tp', prompt: 'morto / morrer / morte', options: ['musi', 'mun', 'mani', 'moli'], answer: 'moli' },
    { id: 'mun', type: 'multipleChoice', direction: 'tp-en', prompt: 'mun', options: ['pele / camada externa / casca', 'lua / estrela', 'círculo / redondo / bola'], answer: 'lua / estrela' },
    { id: 'musi', type: 'multipleChoice', direction: 'en-tp', prompt: 'diversão / jogo / arte', options: ['nasa', 'musi', 'moli', 'poki'], answer: 'musi' },
    { id: 'nasa', type: 'multipleChoice', direction: 'tp-en', prompt: 'nasa', options: ['estranho / bobo / bêbado', 'círculo / redondo / bola', 'morto / morrer / morte'], answer: 'estranho / bobo / bêbado' },
    { id: 'selo', type: 'multipleChoice', direction: 'en-tp', prompt: 'pele / camada externa / casca', options: ['sike', 'ko', 'kon', 'selo'], answer: 'selo' },
    { id: 'sike', type: 'multipleChoice', direction: 'tp-en', prompt: 'sike', options: ['imagem / escrita / símbolo', 'caixa / recipiente / tigela', 'círculo / redondo / bola'], answer: 'círculo / redondo / bola' },
    { id: 'sitelen', type: 'multipleChoice', direction: 'en-tp', prompt: 'imagem / escrita / símbolo', options: ['lipu', 'sitelen', 'kule', 'mani'], answer: 'sitelen' },
    { id: 'ko', type: 'multipleChoice', direction: 'tp-en', prompt: 'ko', options: ['dinheiro / riqueza', 'pasta / pó / massa', 'ar / vento / espírito'], answer: 'pasta / pó / massa' },
    { id: 'tenpo-pimeja-la-mi-lukin-e-mun', type: 'wordBank', direction: 'en-tp', prompt: 'À noite, eu vejo a lua.', answer: ['tenpo', 'pimeja', 'la', 'mi', 'lukin', 'e', 'mun'], distractors: ['li'], practisesGrammar: true, grammarNote: 'O tempo vem antes de la; depois, mi lukin e mun, com e antes do que é visto.' },
    { id: 'mani-li-lon-insa-poki', type: 'wordBank', direction: 'en-tp', prompt: 'O dinheiro está dentro da caixa.', answer: ['mani', 'li', 'lon', 'insa', 'poki'], distractors: ['sewi'], practisesGrammar: true, grammarNote: '“Dentro da caixa” é lon insa poki: lon, a palavra de lugar, e depois a coisa a que ela pertence.' },
    { id: 'musi-ni-li-nasa', type: 'wordBank', direction: 'tp-en', prompt: 'musi ni li nasa', answer: ['este', 'jogo', 'é', 'estranho'], distractors: ['redondo', 'morto'] },
  ],
}

export default lesson
