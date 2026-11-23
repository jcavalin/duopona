import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'greetings-and-feelings',
  title: 'Saudações e sentimentos',
  chapter: 'Lição 10',
  newWords: ['a', 'mu', 'o', 'pilin'],
  grammar: {
    title: 'Ordens, chamar alguém e sentimentos',
    explanation: [
      'Comece uma frase com o para dar uma ordem: o pali! quer dizer “trabalhe!”. Acrescente ala para proibir: o moku ala e kala!',
      'Ponha o depois de um nome ou de uma pessoa para chamá-la: jan pona o, kute e mi! quer dizer “amigo, me escute!”.',
      'toki! sozinho funciona como “olá!”. Use pilin para falar de sentimentos, e a para acrescentar emoção: a, sina wawa!',
    ],
  },
  exercises: [
    { id: 'pilin', type: 'multipleChoice', direction: 'tp-en', prompt: 'pilin', options: ['sentimento / coração / sentir', 'comida / comer / beber', 'ferramenta / máquina / aparelho'], answer: 'sentimento / coração / sentir' },
    { id: 'mu', type: 'multipleChoice', direction: 'en-tp', prompt: 'muu / au-au (qualquer som de animal)', options: ['a', 'mu', 'o', 'seme'], answer: 'mu' },
    { id: 'a', type: 'multipleChoice', direction: 'tp-en', prompt: 'a', options: ['ou', 'o quê / qual', 'ah! / oh! (emoção ou ênfase)'], answer: 'ah! / oh! (emoção ou ênfase)' },
    { id: 'o-moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'o moku!', options: ['Coma!', 'Eu como.', 'A comida é boa.'], answer: 'Coma!' },
    { id: 'o-pali', type: 'wordBank', direction: 'en-tp', prompt: 'Trabalhe!', answer: ['o', 'pali'], distractors: ['mi'], practisesGrammar: true, grammarNote: 'Uma ordem começa com o, seguido do verbo: o pali.' },
    { id: 'jan-pona-o-kute-e-mi', type: 'wordBank', direction: 'en-tp', prompt: 'Amigo, me escute!', answer: ['jan', 'pona', 'o', 'kute', 'e', 'mi'], distractors: ['li'], practisesGrammar: true, grammarNote: 'o depois de jan pona chama o amigo; depois vem a ordem, kute e mi.' },
    { id: 'toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'Olá!', options: ['toki!', 'moku!', 'pona!'], answer: 'toki!' },
    { id: 'mi-pilin-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi pilin pona', options: ['Você se sente bem.', 'Eu me sinto bem.', 'Eu me sinto mal.'], answer: 'Eu me sinto bem.' },
    { id: 'mi-pilin-ike', type: 'wordBank', direction: 'en-tp', prompt: 'Eu me sinto mal.', answer: ['mi', 'pilin', 'ike'], distractors: ['li'] },
    { id: 'soweli-li-mu', type: 'wordBank', direction: 'tp-en', prompt: 'soweli li mu', answer: ['o', 'animal', 'faz', 'um', 'som'], distractors: ['come', 'peixe'] },
    { id: 'a-sina-wawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'a, sina wawa!', options: ['Você é forte?', 'Nossa, você é forte!', 'Eu sou forte.'], answer: 'Nossa, você é forte!' },
    { id: 'o-moku-ala-e-kala', type: 'wordBank', direction: 'en-tp', prompt: 'Não coma o peixe!', answer: ['o', 'moku', 'ala', 'e', 'kala'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Uma ordem começa com o, e ala logo depois do verbo faz dela uma proibição: o moku ala e kala.' },
  ],
}

export default lesson
