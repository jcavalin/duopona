import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'more-adjectives',
  title: 'Mais adjetivos',
  chapter: 'Lição 6',
  newWords: ['ala', 'ike', 'mute', 'pu', 'sewi', 'wan', 'mama'],
  grammar: {
    title: 'Negar com ala e empilhar palavras que descrevem',
    explanation: [
      'Para dizer “não”, ponha ala logo depois da palavra que você quer negar: mi moku ala quer dizer “eu não como”.',
      'Um substantivo pode levar várias palavras que descrevem, uma após a outra. Cada uma se soma a tudo o que vem antes: soweli lili mute é “muitos animais pequenos”.',
    ],
  },
  exercises: [
    { id: 'ala', type: 'multipleChoice', direction: 'tp-en', prompt: 'ala', options: ['não / nenhum / nada', 'muitos / bastante / muito', 'um / único / unido'], answer: 'não / nenhum / nada' },
    { id: 'ike', type: 'multipleChoice', direction: 'en-tp', prompt: 'ruim / negativo', options: ['pona', 'ike', 'sin', 'wawa'], answer: 'ike' },
    { id: 'mute', type: 'multipleChoice', direction: 'tp-en', prompt: 'mute', options: ['um / único / unido', 'ruim / negativo', 'muitos / bastante / muito'], answer: 'muitos / bastante / muito' },
    { id: 'wan', type: 'multipleChoice', direction: 'en-tp', prompt: 'um / único / unido', options: ['mute', 'ala', 'lili', 'wan'], answer: 'wan' },
    { id: 'mama', type: 'multipleChoice', direction: 'tp-en', prompt: 'mama', options: ['homem / masculino', 'pai ou mãe / quem cuida / origem', 'grupo / comunidade'], answer: 'pai ou mãe / quem cuida / origem' },
    { id: 'sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'sewi', options: ['pequeno / jovem', 'novo / fresco / extra', 'alto / acima / divino'], answer: 'alto / acima / divino' },
    { id: 'lipu-pu', type: 'multipleChoice', direction: 'tp-en', prompt: 'lipu pu', options: ['o livro oficial de Toki Pona', 'um livro novo', 'um livro ruim'], answer: 'o livro oficial de Toki Pona' },
    { id: 'mi-moku-ala', type: 'wordBank', direction: 'en-tp', prompt: 'Eu não como.', answer: ['mi', 'moku', 'ala'], distractors: ['ike'], practisesGrammar: true, grammarNote: 'ala vem logo depois da palavra que nega, aqui o verbo: mi moku ala.' },
    { id: 'telo-li-pona-ala', type: 'wordBank', direction: 'en-tp', prompt: 'A água não é boa.', answer: ['telo', 'li', 'pona', 'ala'], distractors: ['mute'], practisesGrammar: true, grammarNote: 'ala vem depois da palavra que nega, então “não é boa” é pona ala, depois de li.' },
    { id: 'soweli-lili-mute', type: 'wordBank', direction: 'tp-en', prompt: 'soweli lili mute', answer: ['muitos', 'animais', 'pequenos'], distractors: ['um', 'grandes'], practisesGrammar: true, grammarNote: 'Cada palavra que descreve se soma a tudo antes dela: soweli lili é “animal pequeno”, e mute diz que são muitos.' },
    { id: 'mama-mi-li-wawa-mute', type: 'wordBank', direction: 'tp-en', prompt: 'mama mi li wawa mute', answer: ['minha', 'mãe', 'é', 'muito', 'forte'], distractors: ['não', 'nova'] },
    { id: 'lipu-ike', type: 'multipleChoice', direction: 'en-tp', prompt: 'um livro ruim', options: ['ike lipu', 'lipu li ike', 'lipu ike'], answer: 'lipu ike' },
    { id: 'ijo-sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'ijo sewi', options: ['uma coisa alta', 'uma coisa nova', 'uma única coisa'], answer: 'uma coisa alta' },
  ],
}

export default lesson
