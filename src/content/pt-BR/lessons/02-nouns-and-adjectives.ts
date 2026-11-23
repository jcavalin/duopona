import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'nouns-and-adjectives',
  title: 'Substantivos e adjetivos',
  chapter: 'Lição 3',
  newWords: ['telo', 'tomo', 'lili', 'pona', 'suli'],
  grammar: {
    title: 'A palavra que descreve vem depois do substantivo',
    explanation: [
      'Em toki pona, a palavra que descreve vem depois da palavra descrita: tomo suli é “uma casa grande”, nunca suli tomo.',
      'Também dá para pôr uma palavra que descreve depois de li, para dizer como algo é: tomo li pona quer dizer “a casa é boa”.',
    ],
  },
  exercises: [
    { id: 'telo', type: 'multipleChoice', direction: 'tp-en', prompt: 'telo', options: ['água / líquido', 'casa / prédio / quarto', 'pequeno / jovem', 'bom / útil / simples'], answer: 'água / líquido' },
    { id: 'tomo', type: 'multipleChoice', direction: 'en-tp', prompt: 'casa / prédio / quarto', options: ['telo', 'tomo', 'lipu', 'kili'], answer: 'tomo' },
    { id: 'lili', type: 'multipleChoice', direction: 'tp-en', prompt: 'lili', options: ['grande / importante / comprido', 'bom / útil / simples', 'pequeno / jovem'], answer: 'pequeno / jovem' },
    { id: 'pona', type: 'multipleChoice', direction: 'en-tp', prompt: 'bom / útil / simples', options: ['suli', 'lili', 'ijo', 'pona'], answer: 'pona' },
    { id: 'suli', type: 'multipleChoice', direction: 'tp-en', prompt: 'suli', options: ['pequeno / jovem', 'grande / importante / comprido', 'água / líquido'], answer: 'grande / importante / comprido' },
    { id: 'tomo-lili', type: 'wordBank', direction: 'en-tp', prompt: 'uma casa pequena', answer: ['tomo', 'lili'], distractors: ['suli'], practisesGrammar: true, grammarNote: 'A palavra que descreve vem depois do substantivo: tomo lili, nunca lili tomo.' },
    { id: 'tomo-li-pona', type: 'wordBank', direction: 'en-tp', prompt: 'A casa é boa.', answer: ['tomo', 'li', 'pona'], distractors: ['telo'], practisesGrammar: true, grammarNote: 'Para dizer como a casa é, ponha a palavra que descreve depois de li: tomo li pona.' },
    { id: 'jan-suli', type: 'wordBank', direction: 'tp-en', prompt: 'jan suli', answer: ['uma', 'pessoa', 'grande'], distractors: ['pequena', 'casa'] },
    { id: 'kili-lili-li-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'kili lili li pona', options: ['A fruta boa é pequena.', 'A fruta é uma coisa pequena.', 'A fruta pequena é boa.'], answer: 'A fruta pequena é boa.' },
    { id: 'tomo-suli-li-ijo-pona', type: 'wordBank', direction: 'en-tp', prompt: 'A casa grande é uma coisa boa.', answer: ['tomo', 'suli', 'li', 'ijo', 'pona'], distractors: ['lili'], practisesGrammar: true, grammarNote: 'Cada palavra que descreve vem depois do seu substantivo: tomo suli antes de li, ijo pona depois.' },
    { id: 'telo-pona', type: 'multipleChoice', direction: 'en-tp', prompt: 'água boa', options: ['pona telo', 'telo pona', 'telo suli'], answer: 'telo pona' },
    { id: 'lipu-ni-li-lili', type: 'wordBank', direction: 'en-tp', prompt: 'Este livro é pequeno.', answer: ['lipu', 'ni', 'li', 'lili'], distractors: ['suli'], practisesGrammar: true, grammarNote: 'ni descreve lipu, então vem depois: lipu ni é “este livro”. Depois, li lili diz que ele é pequeno.' },
    { id: 'meli-li-suli', type: 'multipleChoice', direction: 'tp-en', prompt: 'meli li suli', options: ['A mulher é grande.', 'A mulher é pequena.', 'uma mulher grande'], answer: 'A mulher é grande.' },
  ],
}

export default lesson
