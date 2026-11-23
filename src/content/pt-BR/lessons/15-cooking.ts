import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'cooking',
  title: 'Cozinha',
  chapter: 'Lição 18',
  newWords: ['lape', 'olin', 'pan', 'pini', 'seli', 'supa', 'uta'],
  grammar: {
    title: 'Revisão: uma história na cozinha',
    explanation: [
      'Esta lição se passa numa cozinha e mistura a gramática que você aprendeu: pré-verbos com e, lon com palavras de lugar, e palavras que descrevem.',
      'seli quer dizer fogo ou calor, então seli e pan é “esquentar o pão”, que é como toki pona diz “cozinhar”.',
    ],
  },
  exercises: [
    { id: 'pan', type: 'multipleChoice', direction: 'tp-en', prompt: 'pan', options: ['grão / pão / arroz', 'fogo / calor / quente', 'mesa / superfície plana'], answer: 'grão / pão / arroz' },
    { id: 'seli', type: 'multipleChoice', direction: 'en-tp', prompt: 'fogo / calor / quente', options: ['lete', 'seli', 'pan', 'supa'], answer: 'seli' },
    { id: 'supa', type: 'multipleChoice', direction: 'tp-en', prompt: 'supa', options: ['boca / lábios', 'dormir / descansar', 'mesa / superfície plana'], answer: 'mesa / superfície plana' },
    { id: 'uta', type: 'multipleChoice', direction: 'en-tp', prompt: 'boca / lábios', options: ['lawa', 'noka', 'sinpin', 'uta'], answer: 'uta' },
    { id: 'pini', type: 'multipleChoice', direction: 'tp-en', prompt: 'pini', options: ['amar / amor', 'terminado / passado / terminar', 'dormir / descansar'], answer: 'terminado / passado / terminar' },
    { id: 'olin', type: 'multipleChoice', direction: 'en-tp', prompt: 'amar / amor', options: ['pilin', 'olin', 'wile', 'lape'], answer: 'olin' },
    { id: 'lape', type: 'multipleChoice', direction: 'tp-en', prompt: 'lape', options: ['dormir / descansar', 'amar / amor', 'boca / lábios'], answer: 'dormir / descansar' },
    { id: 'mi-wile-seli-e-pan', type: 'wordBank', direction: 'en-tp', prompt: 'Eu quero esquentar o pão.', answer: ['mi', 'wile', 'seli', 'e', 'pan'], distractors: ['li'], practisesGrammar: true, grammarNote: 'O pré-verbo wile vem antes de seli, e e pan vem depois do verbo principal seli.' },
    { id: 'pan-li-lon-anpa-supa', type: 'wordBank', direction: 'en-tp', prompt: 'O pão está debaixo da mesa.', answer: ['pan', 'li', 'lon', 'anpa', 'supa'], distractors: ['sewi'], practisesGrammar: true, grammarNote: '“Debaixo” é a parte de baixo da mesa: lon, depois anpa, depois supa.' },
    { id: 'mi-olin-e-pan-seli', type: 'wordBank', direction: 'tp-en', prompt: 'mi olin e pan seli', answer: ['eu', 'amo', 'pão', 'quente'], distractors: ['frio', 'mesa'] },
    { id: 'uta-mi-li-seli', type: 'multipleChoice', direction: 'tp-en', prompt: 'uta mi li seli', options: ['Minha boca está fria.', 'Minha boca está quente.', 'Minha cabeça está quente.'], answer: 'Minha boca está quente.' },
    { id: 'moku-li-pini', type: 'wordBank', direction: 'en-tp', prompt: 'A comida acabou.', answer: ['moku', 'li', 'pini'], distractors: ['open'] },
  ],
}

export default lesson
