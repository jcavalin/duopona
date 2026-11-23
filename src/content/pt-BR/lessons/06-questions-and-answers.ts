import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'questions-and-answers',
  title: 'Perguntas e respostas',
  chapter: 'Lição 7',
  newWords: ['ilo', 'kala', 'ona', 'anu', 'seme'],
  grammar: {
    title: 'Fazer perguntas',
    explanation: [
      'Para perguntar sobre algo, ponha seme onde a resposta ficaria: sina moku e seme? quer dizer “o que você está comendo?”.',
      'Para uma pergunta de sim ou não, diga o verbo, depois ala, depois o verbo de novo: sina wawa ala wawa? quer dizer “você é forte?”. Responda com o verbo (wawa) ou com ala.',
      'anu quer dizer “ou”: kala anu kili? pergunta “peixe ou fruta?”.',
    ],
  },
  exercises: [
    { id: 'ilo', type: 'multipleChoice', direction: 'tp-en', prompt: 'ilo', options: ['ferramenta / máquina / aparelho', 'peixe / animal marinho', 'o quê / qual'], answer: 'ferramenta / máquina / aparelho' },
    { id: 'kala', type: 'multipleChoice', direction: 'en-tp', prompt: 'peixe / animal marinho', options: ['kili', 'kala', 'soweli', 'ilo'], answer: 'kala' },
    { id: 'ona', type: 'multipleChoice', direction: 'tp-en', prompt: 'ona', options: ['eu / mim / nós', 'você / vocês', 'ele / ela / eles'], answer: 'ele / ela / eles' },
    { id: 'anu', type: 'multipleChoice', direction: 'en-tp', prompt: 'ou', options: ['seme', 'ala', 'e', 'anu'], answer: 'anu' },
    { id: 'seme', type: 'multipleChoice', direction: 'en-tp', prompt: 'o quê / qual', options: ['seme', 'ona', 'anu', 'ni'], answer: 'seme' },
    { id: 'sina-moku-e-seme', type: 'wordBank', direction: 'en-tp', prompt: 'O que você está comendo?', answer: ['sina', 'moku', 'e', 'seme'], distractors: ['li'], practisesGrammar: true, grammarNote: 'seme fica onde a resposta ficaria: o que é comido vem depois de e, então seme vai ali.' },
    { id: 'sina-wawa-ala-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'Você é forte?', answer: ['sina', 'wawa', 'ala', 'wawa'], distractors: ['seme'], practisesGrammar: true, grammarNote: 'Uma pergunta de sim ou não diz a palavra, depois ala, depois a palavra de novo: wawa ala wawa. Com sina não há li.' },
    { id: 'ilo-li-pona-ala-pona', type: 'wordBank', direction: 'en-tp', prompt: 'A ferramenta é boa?', answer: ['ilo', 'li', 'pona', 'ala', 'pona'], distractors: ['seme'], practisesGrammar: true, grammarNote: 'Uma pergunta de sim ou não repete a palavra em volta de ala: pona ala pona. ilo não é mi nem sina, então li fica.' },
    { id: 'jan-seme-li-moku', type: 'wordBank', direction: 'tp-en', prompt: 'jan seme li moku?', answer: ['quem', 'está', 'comendo'], distractors: ['que', 'comida'] },
    { id: 'kala-anu-kili', type: 'multipleChoice', direction: 'tp-en', prompt: 'ona li kala anu kili?', options: ['É um peixe ou uma fruta?', 'É um peixe e uma fruta.', 'É um peixe?'], answer: 'É um peixe ou uma fruta?' },
    { id: 'sina-sona-ala-sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sina sona ala sona?', options: ['Você não sabe.', 'Você sabe?', 'O que você sabe?'], answer: 'Você sabe?' },
    { id: 'ni-li-seme', type: 'multipleChoice', direction: 'en-tp', prompt: 'O que é isto?', options: ['ni li ala?', 'ni li ijo?', 'ni li seme?'], answer: 'ni li seme?' },
    { id: 'ona-li-jo-e-ilo', type: 'wordBank', direction: 'en-tp', prompt: 'Ela tem uma ferramenta.', answer: ['ona', 'li', 'jo', 'e', 'ilo'], distractors: ['mi'] },
  ],
}

export default lesson
