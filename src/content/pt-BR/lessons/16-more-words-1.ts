import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'more-words-1',
  title: 'Mais palavras 1',
  chapter: 'Dicionário',
  newWords: ['ma', 'nasin', 'nena', 'nimi', 'utala', 'akesi', 'jaki', 'kalama', 'kiwen', 'ale', 'esun'],
  grammar: {
    title: 'Revisão: mais palavras',
    explanation: [
      'Estas palavras completam o vocabulário do dicionário do livro. Pratique-as com toda a gramática que você conhece.',
      'ale quer dizer “tudo” ou “todos” (você também pode encontrar a forma ali). nimi quer dizer “palavra” ou “nome”.',
    ],
  },
  exercises: [
    { id: 'ma', type: 'multipleChoice', direction: 'tp-en', prompt: 'ma', options: ['terra / país / lugar', 'caminho / estrada / método', 'morro / calombo / nariz'], answer: 'terra / país / lugar' },
    { id: 'nasin', type: 'multipleChoice', direction: 'en-tp', prompt: 'caminho / estrada / método', options: ['nena', 'nasin', 'ma', 'nimi'], answer: 'nasin' },
    { id: 'nena', type: 'multipleChoice', direction: 'tp-en', prompt: 'nena', options: ['pedra / rocha / duro', 'som / barulho', 'morro / calombo / nariz'], answer: 'morro / calombo / nariz' },
    { id: 'nimi', type: 'multipleChoice', direction: 'en-tp', prompt: 'palavra / nome', options: ['toki', 'kalama', 'lipu', 'nimi'], answer: 'nimi' },
    { id: 'utala', type: 'multipleChoice', direction: 'tp-en', prompt: 'utala', options: ['caçar / coletar', 'lutar / batalha', 'mercado / loja / comércio'], answer: 'lutar / batalha' },
    { id: 'akesi', type: 'multipleChoice', direction: 'en-tp', prompt: 'réptil / anfíbio', options: ['pipi', 'akesi', 'waso', 'kala'], answer: 'akesi' },
    { id: 'jaki', type: 'multipleChoice', direction: 'tp-en', prompt: 'jaki', options: ['sujo / nojento / tóxico', 'pedra / rocha / duro', 'tudo / todos / vida'], answer: 'sujo / nojento / tóxico' },
    { id: 'kalama', type: 'multipleChoice', direction: 'en-tp', prompt: 'som / barulho', options: ['kiwen', 'esun', 'ale', 'kalama'], answer: 'kalama' },
    { id: 'esun', type: 'multipleChoice', direction: 'tp-en', prompt: 'esun', options: ['pedra / rocha / duro', 'terra / país / lugar', 'mercado / loja / comércio'], answer: 'mercado / loja / comércio' },
    { id: 'utala-la-mi-kute-e-kalama-mute', type: 'wordBank', direction: 'en-tp', prompt: 'Numa luta, eu ouço muitos sons.', answer: ['utala', 'la', 'mi', 'kute', 'e', 'kalama', 'mute'], distractors: ['li'], practisesGrammar: true, grammarNote: 'utala situa a cena antes de la. Na frase principal, e marca o que é ouvido, e mute vem depois de kalama.' },
    { id: 'akesi-li-lon-sewi-kiwen', type: 'wordBank', direction: 'en-tp', prompt: 'O réptil está em cima da pedra.', answer: ['akesi', 'li', 'lon', 'sewi', 'kiwen'], distractors: ['e'], practisesGrammar: true, grammarNote: '“Em cima de” é lon sewi, seguido da coisa: lon sewi kiwen.' },
    { id: 'nimi-pi-ma-ni-li-seme', type: 'wordBank', direction: 'tp-en', prompt: 'nimi pi ma ni li seme?', answer: ['qual', 'é', 'o', 'nome', 'desta', 'terra'], distractors: ['estrada', 'morro'] },
    { id: 'soweli-ale-li-lon-ma', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli ale li lon ma', options: ['Todos os animais estão na terra.', 'Um animal está na terra.', 'Os animais estão na água.'], answer: 'Todos os animais estão na terra.' },
  ],
}

export default lesson
