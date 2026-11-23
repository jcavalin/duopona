import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'questions-and-answers',
  title: 'Questions et réponses',
  chapter: 'Leçon 7',
  newWords: ['ilo', 'kala', 'ona', 'anu', 'seme'],
  grammar: {
    title: 'Poser des questions',
    explanation: [
      'Pour demander quelque chose, mets seme là où irait la réponse\u202f: sina moku e seme? veut dire «\u202fqu’est-ce que tu manges\u202f?\u202f».',
      'Pour une question fermée, dis le verbe, puis ala, puis encore le verbe\u202f: sina wawa ala wawa? veut dire «\u202fes-tu fort\u202f?\u202f». Réponds avec le verbe (wawa) ou avec ala.',
      'anu veut dire «\u202fou\u202f»\u202f: kala anu kili? demande «\u202fdu poisson ou des fruits\u202f?\u202f».',
    ],
  },
  exercises: [
    { id: 'ilo', type: 'multipleChoice', direction: 'tp-en', prompt: 'ilo', options: ['outil / machine / appareil', 'poisson / animal marin', 'quoi / quel'], answer: 'outil / machine / appareil' },
    { id: 'kala', type: 'multipleChoice', direction: 'en-tp', prompt: 'poisson / animal marin', options: ['kili', 'kala', 'soweli', 'ilo'], answer: 'kala' },
    { id: 'ona', type: 'multipleChoice', direction: 'tp-en', prompt: 'ona', options: ['je / moi / nous', 'tu / toi / vous', 'il / elle / ils / elles'], answer: 'il / elle / ils / elles' },
    { id: 'anu', type: 'multipleChoice', direction: 'en-tp', prompt: 'ou', options: ['seme', 'ala', 'e', 'anu'], answer: 'anu' },
    { id: 'seme', type: 'multipleChoice', direction: 'en-tp', prompt: 'quoi / quel', options: ['seme', 'ona', 'anu', 'ni'], answer: 'seme' },
    { id: 'sina-moku-e-seme', type: 'wordBank', direction: 'en-tp', prompt: 'Qu’est-ce que tu manges\u202f?', answer: ['sina', 'moku', 'e', 'seme'], distractors: ['li'], practisesGrammar: true, grammarNote: 'seme se place là où irait la réponse\u202f: ce qui est mangé vient après e, donc seme va là.' },
    { id: 'sina-wawa-ala-wawa', type: 'wordBank', direction: 'en-tp', prompt: 'Es-tu fort\u202f?', answer: ['sina', 'wawa', 'ala', 'wawa'], distractors: ['seme'], practisesGrammar: true, grammarNote: 'Une question fermée dit le mot, puis ala, puis encore le mot\u202f: wawa ala wawa. Avec sina, pas de li.' },
    { id: 'ilo-li-pona-ala-pona', type: 'wordBank', direction: 'en-tp', prompt: 'L’outil est-il bon\u202f?', answer: ['ilo', 'li', 'pona', 'ala', 'pona'], distractors: ['seme'], practisesGrammar: true, grammarNote: 'Une question fermée répète le mot autour de ala\u202f: pona ala pona. ilo n’est ni mi ni sina, donc li reste.' },
    { id: 'jan-seme-li-moku', type: 'wordBank', direction: 'tp-en', prompt: 'jan seme li moku?', answer: ['qui', 'mange'], distractors: ['quoi', 'nourriture'] },
    { id: 'kala-anu-kili', type: 'multipleChoice', direction: 'tp-en', prompt: 'ona li kala anu kili?', options: ['Est-ce un poisson ou un fruit\u202f?', 'C’est un poisson et un fruit.', 'Est-ce un poisson\u202f?'], answer: 'Est-ce un poisson ou un fruit\u202f?' },
    { id: 'sina-sona-ala-sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sina sona ala sona?', options: ['Tu ne sais pas.', 'Est-ce que tu sais\u202f?', 'Que sais-tu\u202f?'], answer: 'Est-ce que tu sais\u202f?' },
    { id: 'ni-li-seme', type: 'multipleChoice', direction: 'en-tp', prompt: 'Qu’est-ce que c’est\u202f?', options: ['ni li ala?', 'ni li ijo?', 'ni li seme?'], answer: 'ni li seme?' },
    { id: 'ona-li-jo-e-ilo', type: 'wordBank', direction: 'en-tp', prompt: 'Elle a un outil.', answer: ['ona', 'li', 'jo', 'e', 'ilo'], distractors: ['mi'] },
  ],
}

export default lesson
