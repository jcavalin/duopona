import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'pre-verbs',
  title: 'Pré-verbos',
  chapter: 'Lição 13',
  newWords: ['kama', 'ken', 'wile', 'lukin', 'sona'],
  grammar: {
    title: 'Pré-verbos: querer, poder, tentar',
    explanation: [
      'Um pré-verbo vem logo antes do verbo principal e muda o sentido dele: mi wile moku quer dizer “eu quero comer”.',
      'Os mais comuns são wile (querer), ken (poder), sona (saber), lukin (tentar) e kama (passar a, tornar-se).',
      'A parte com e continua vindo depois do verbo principal: mi lukin kute e soweli quer dizer “eu tento ouvir o animal”.',
    ],
  },
  exercises: [
    { id: 'kama', type: 'multipleChoice', direction: 'tp-en', prompt: 'kama', options: ['vir / tornar-se / chegando', 'poder / ser capaz de / possível', 'querer / precisar / dever'], answer: 'vir / tornar-se / chegando' },
    { id: 'ken', type: 'multipleChoice', direction: 'en-tp', prompt: 'poder / ser capaz de / possível', options: ['wile', 'ken', 'kama', 'lukin'], answer: 'ken' },
    { id: 'wile', type: 'multipleChoice', direction: 'tp-en', prompt: 'wile', options: ['ver / olhar / tentar', 'saber / conhecimento', 'querer / precisar / dever'], answer: 'querer / precisar / dever' },
    { id: 'lukin', type: 'multipleChoice', direction: 'en-tp', prompt: 'ver / olhar / tentar', options: ['kute', 'sona', 'ken', 'lukin'], answer: 'lukin' },
    { id: 'mi-wile-moku', type: 'wordBank', direction: 'en-tp', prompt: 'Eu quero comer.', answer: ['mi', 'wile', 'moku'], distractors: ['e'], practisesGrammar: true, grammarNote: 'O pré-verbo wile vem logo antes do verbo principal moku: mi wile moku.' },
    { id: 'sina-ken-toki', type: 'wordBank', direction: 'en-tp', prompt: 'Você pode falar.', answer: ['sina', 'ken', 'toki'], distractors: ['li'], practisesGrammar: true, grammarNote: 'ken vem logo antes do verbo que ele muda, e depois de sina não há li: sina ken toki.' },
    { id: 'ona-li-sona-pali', type: 'wordBank', direction: 'en-tp', prompt: 'Ela sabe trabalhar.', answer: ['ona', 'li', 'sona', 'pali'], distractors: ['e'], practisesGrammar: true, grammarNote: 'ona ainda precisa de li, e então o pré-verbo sona vem logo antes do verbo pali.' },
    { id: 'mi-lukin-kute-e-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'Eu tento ouvir o animal.', answer: ['mi', 'lukin', 'kute', 'e', 'soweli'], distractors: ['li'], practisesGrammar: true, grammarNote: 'lukin vem antes do verbo principal kute, e a parte com e continua depois dele: kute e soweli.' },
    { id: 'jan-li-kama', type: 'multipleChoice', direction: 'tp-en', prompt: 'jan li kama', options: ['A pessoa pode vir.', 'A pessoa quer vir.', 'A pessoa está vindo.'], answer: 'A pessoa está vindo.' },
    { id: 'mi-kama-sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi kama sona', options: ['Eu estou aprendendo.', 'Eu sei.', 'Eu quero saber.'], answer: 'Eu estou aprendendo.' },
    { id: 'mi-lukin-e-suno', type: 'multipleChoice', direction: 'en-tp', prompt: 'Eu vejo o sol.', options: ['mi lukin suno', 'mi lukin e suno', 'suno li lukin e mi'], answer: 'mi lukin e suno' },
    { id: 'sina-wile-ala-moku', type: 'wordBank', direction: 'tp-en', prompt: 'sina wile ala moku', answer: ['você', 'não', 'quer', 'comer'], distractors: ['pode'] },
  ],
}

export default lesson
