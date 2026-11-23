import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'words-and-sentences',
  title: 'Palavras e frases',
  chapter: 'Lição 2',
  newWords: ['ijo', 'jan', 'kili', 'lipu', 'meli', 'ni', 'soweli', 'li'],
  grammar: {
    title: 'Dizer o que algo é: SUBSTANTIVO li SUBSTANTIVO',
    explanation: [
      'Uma frase básica em toki pona nomeia algo e depois diz o que ele é. A palavrinha li fica entre as duas partes.',
      'ni li meli quer dizer “isto é uma mulher”. Não há palavras para “o”, “um” ou “é”: li faz esse papel.',
    ],
  },
  exercises: [
    { id: 'jan', type: 'multipleChoice', direction: 'tp-en', prompt: 'jan', options: ['pessoa / alguém', 'fruta / legume', 'coisa / objeto', 'animal / mamífero'], answer: 'pessoa / alguém' },
    { id: 'kili', type: 'multipleChoice', direction: 'en-tp', prompt: 'fruta / legume', options: ['kili', 'lipu', 'meli', 'ijo'], answer: 'kili' },
    { id: 'soweli', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli', options: ['animal / mamífero', 'mulher / feminino', 'papel / livro / documento'], answer: 'animal / mamífero' },
    { id: 'lipu', type: 'multipleChoice', direction: 'en-tp', prompt: 'papel / livro / documento', options: ['lipu', 'soweli', 'jan', 'ni'], answer: 'lipu' },
    { id: 'meli', type: 'multipleChoice', direction: 'tp-en', prompt: 'meli', options: ['mulher / feminino', 'pessoa / alguém', 'isto / isso'], answer: 'mulher / feminino' },
    { id: 'ijo', type: 'multipleChoice', direction: 'en-tp', prompt: 'coisa / objeto', options: ['ijo', 'kili', 'meli', 'soweli'], answer: 'ijo' },
    { id: 'ni', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni', options: ['isto / isso', 'coisa / objeto', 'animal / mamífero', 'fruta / legume'], answer: 'isto / isso' },
    { id: 'ni-li-meli', type: 'wordBank', direction: 'en-tp', prompt: 'Isto é uma mulher.', answer: ['ni', 'li', 'meli'], distractors: ['lipu'], practisesGrammar: true, grammarNote: 'ni nomeia a coisa e meli diz o que ela é, então li fica entre elas. Não há palavra para “é uma”: li faz esse papel.' },
    { id: 'ijo-li-kili', type: 'wordBank', direction: 'tp-en', prompt: 'ijo li kili', answer: ['a', 'coisa', 'é', 'uma', 'fruta'], distractors: ['pessoa', 'livro'] },
    { id: 'ijo-li-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'A coisa é um animal.', answer: ['ijo', 'li', 'soweli'], distractors: ['jan'], practisesGrammar: true, grammarNote: 'ijo é o sujeito e soweli diz o que ela é, então li fica entre eles. Toki pona não tem “o”, “um” nem “é”.' },
    { id: 'ni-li-ijo', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni li ijo', options: ['Isto é uma coisa.', 'Isto é um animal.', 'A coisa é um livro.'], answer: 'Isto é uma coisa.' },
    { id: 'ni-li-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'Aquilo é um animal.', answer: ['ni', 'li', 'soweli'], distractors: ['jan'], practisesGrammar: true, grammarNote: '“Aquilo” também é ni, então o padrão é o mesmo: a coisa, depois li, depois o que ela é.' },
    { id: 'ijo-li-lipu', type: 'multipleChoice', direction: 'en-tp', prompt: 'A coisa é um livro.', options: ['ijo li kili', 'ijo li lipu', 'meli li lipu'], answer: 'ijo li lipu' },
  ],
}

export default lesson
