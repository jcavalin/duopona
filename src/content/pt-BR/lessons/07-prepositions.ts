import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'prepositions',
  title: 'Preposições',
  chapter: 'Lição 8',
  newWords: ['pana', 'tawa', 'lon', 'kepeken', 'tan'],
  grammar: {
    title: 'Onde, para onde, de onde, com o quê',
    explanation: [
      'lon, tawa, tan e kepeken acrescentam detalhes no fim da frase: onde algo está (lon), para onde vai (tawa), de onde vem (tan) e que ferramenta é usada (kepeken).',
      'Eles vêm depois do verbo e da parte com e: mi pana e kili tawa meli quer dizer “eu dou fruta para a mulher”.',
      'Eles também podem ser o próprio verbo: sina lon tomo quer dizer “você está na casa”.',
    ],
  },
  exercises: [
    { id: 'pana', type: 'multipleChoice', direction: 'tp-en', prompt: 'pana', options: ['dar / enviar', 'ter / segurar', 'ouvir / escutar / orelha'], answer: 'dar / enviar' },
    { id: 'tawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'para / em direção a / em movimento', options: ['tan', 'tawa', 'lon', 'pana'], answer: 'tawa' },
    { id: 'lon', type: 'multipleChoice', direction: 'tp-en', prompt: 'lon', options: ['de / por causa de', 'usando / com (uma ferramenta)', 'em / dentro de / presente'], answer: 'em / dentro de / presente' },
    { id: 'kepeken', type: 'multipleChoice', direction: 'en-tp', prompt: 'usando / com (uma ferramenta)', options: ['tawa', 'jo', 'pali', 'kepeken'], answer: 'kepeken' },
    { id: 'tan', type: 'multipleChoice', direction: 'tp-en', prompt: 'tan', options: ['para / em direção a / em movimento', 'de / por causa de', 'em / dentro de / presente'], answer: 'de / por causa de' },
    { id: 'sina-lon-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'Você está na casa.', answer: ['sina', 'lon', 'tomo'], distractors: ['tawa'], practisesGrammar: true, grammarNote: 'lon pode ser o próprio verbo: sina lon tomo é “você está na casa”, sem li depois de sina.' },
    { id: 'mi-pana-e-kili-tawa-meli', type: 'wordBank', direction: 'en-tp', prompt: 'Eu dou fruta para a mulher.', answer: ['mi', 'pana', 'e', 'kili', 'tawa', 'meli'], distractors: ['lon'], practisesGrammar: true, grammarNote: 'tawa meli diz para onde a fruta vai, então vem depois do verbo e da parte com e.' },
    { id: 'ona-li-pali-kepeken-ilo', type: 'wordBank', direction: 'en-tp', prompt: 'Ela trabalha usando uma ferramenta.', answer: ['ona', 'li', 'pali', 'kepeken', 'ilo'], distractors: ['tan'], practisesGrammar: true, grammarNote: 'kepeken ilo diz o que é usado, então vai no fim, depois do verbo pali.' },
    { id: 'kala-li-tan-telo', type: 'wordBank', direction: 'tp-en', prompt: 'kala li tan telo', answer: ['o', 'peixe', 'vem', 'da', 'água'], distractors: ['vai', 'na'] },
    { id: 'mi-tawa-tomo', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi tawa tomo', options: ['Eu vou para a casa.', 'Eu estou na casa.', 'Eu venho da casa.'], answer: 'Eu vou para a casa.' },
    { id: 'soweli-li-lon-telo', type: 'multipleChoice', direction: 'en-tp', prompt: 'O animal está na água.', options: ['soweli li tan telo', 'soweli li lon telo', 'soweli li tawa telo'], answer: 'soweli li lon telo' },
    { id: 'mi-toki-tawa-sina', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi toki tawa sina', options: ['Você fala comigo.', 'Eu venho de você.', 'Eu falo com você.'], answer: 'Eu falo com você.' },
  ],
}

export default lesson
