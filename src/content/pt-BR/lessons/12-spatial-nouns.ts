import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'spatial-nouns',
  title: 'Substantivos de lugar',
  chapter: 'Lição 15',
  newWords: ['insa', 'monsi', 'noka', 'poka', 'sewi', 'sinpin'],
  grammar: {
    title: 'Dizer exatamente onde: lon + palavra de lugar',
    explanation: [
      'Alguns substantivos nomeiam uma parte do espaço: insa (dentro), monsi (atrás), sinpin (frente), poka (lado), sewi (em cima) e noka (embaixo).',
      'Use-os depois de lon, seguidos da coisa a que pertencem: soweli li lon insa tomo quer dizer “o animal está dentro da casa”.',
    ],
  },
  exercises: [
    { id: 'insa', type: 'multipleChoice', direction: 'tp-en', prompt: 'insa', options: ['dentro / centro / barriga', 'costas / atrás', 'frente / rosto / parede'], answer: 'dentro / centro / barriga' },
    { id: 'monsi', type: 'multipleChoice', direction: 'en-tp', prompt: 'costas / atrás', options: ['sinpin', 'monsi', 'noka', 'poka'], answer: 'monsi' },
    { id: 'noka', type: 'multipleChoice', direction: 'tp-en', prompt: 'noka', options: ['lado / perto / quadril', 'frente / rosto / parede', 'perna / pé / parte de baixo'], answer: 'perna / pé / parte de baixo' },
    { id: 'poka', type: 'multipleChoice', direction: 'en-tp', prompt: 'lado / perto / quadril', options: ['insa', 'sewi', 'monsi', 'poka'], answer: 'poka' },
    { id: 'sinpin', type: 'multipleChoice', direction: 'tp-en', prompt: 'sinpin', options: ['dentro / centro / barriga', 'frente / rosto / parede', 'costas / atrás'], answer: 'frente / rosto / parede' },
    { id: 'soweli-li-lon-insa-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'O animal está dentro da casa.', answer: ['soweli', 'li', 'lon', 'insa', 'tomo'], distractors: ['tawa'], practisesGrammar: true, grammarNote: 'Depois de lon vem a palavra de lugar insa, e depois a coisa a que ela pertence: lon insa tomo.' },
    { id: 'sina-lon-poka-mi', type: 'wordBank', direction: 'en-tp', prompt: 'Você está do meu lado.', answer: ['sina', 'lon', 'poka', 'mi'], distractors: ['li'], practisesGrammar: true, grammarNote: 'lon poka mi é “ao meu lado”: a palavra de lugar, depois de quem é o lado. Com sina, sem li.' },
    { id: 'suno-li-lon-sewi-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'O sol está acima da casa.', answer: ['suno', 'li', 'lon', 'sewi', 'tomo'], distractors: ['insa'], practisesGrammar: true, grammarNote: '“Acima” é a parte de cima da casa: lon, depois sewi, depois tomo.' },
    { id: 'kili-li-lon-noka-kasi', type: 'multipleChoice', direction: 'tp-en', prompt: 'kili li lon noka kasi', options: ['A fruta está no alto da planta.', 'A fruta está dentro da planta.', 'A fruta está na parte de baixo da planta.'], answer: 'A fruta está na parte de baixo da planta.' },
    { id: 'jan-li-lon-monsi-tomo', type: 'wordBank', direction: 'tp-en', prompt: 'jan li lon monsi tomo', answer: ['a', 'pessoa', 'está', 'atrás', 'da', 'casa'], distractors: ['dentro', 'frente'] },
    { id: 'lon-sinpin-tomo', type: 'multipleChoice', direction: 'en-tp', prompt: 'na frente da casa', options: ['lon monsi tomo', 'lon sinpin tomo', 'lon insa tomo'], answer: 'lon sinpin tomo' },
    { id: 'lon-sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'lon sewi', options: ['atrás', 'dentro', 'acima'], answer: 'acima' },
  ],
}

export default lesson
