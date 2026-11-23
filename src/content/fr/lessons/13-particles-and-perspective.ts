import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'particles-and-perspective',
  title: 'Particules et point de vue',
  chapter: 'Leçon 16',
  newWords: ['anpa', 'ante', 'en', 'lete', 'lupa', 'open', 'sama', 'suwi', 'taso', 'tawa'],
  grammar: {
    title: 'Relier des sujets avec en, et taso',
    explanation: [
      'en relie deux sujets\u202f: mije en meli li moku veut dire «\u202fl’homme et la femme mangent\u202f». Avec en, li est toujours nécessaire, même avec mi ou sina.',
      'taso après un mot veut dire «\u202fseulement\u202f»\u202f: mi moku e kili taso veut dire «\u202fje mange seulement des fruits\u202f». En début de phrase, il veut dire «\u202fmais\u202f»\u202f: taso mi lete.',
      'tawa peut aussi vouloir dire «\u202fpour\u202f» ou «\u202fselon\u202f»\u202f: kili suwi li pona tawa mi veut dire «\u202fj’aime les fruits sucrés\u202f» (les fruits sucrés sont bons pour moi).',
    ],
  },
  exercises: [
    { id: 'anpa', type: 'multipleChoice', direction: 'tp-en', prompt: 'anpa', options: ['en bas / dessous / humble', 'différent / autre / changé', 'sucré / mignon'], answer: 'en bas / dessous / humble' },
    { id: 'ante', type: 'multipleChoice', direction: 'en-tp', prompt: 'différent / autre / changé', options: ['sama', 'ante', 'suwi', 'lete'], answer: 'ante' },
    { id: 'lete', type: 'multipleChoice', direction: 'tp-en', prompt: 'lete', options: ['sucré / mignon', 'ouvrir / commencer', 'froid / cru'], answer: 'froid / cru' },
    { id: 'lupa', type: 'multipleChoice', direction: 'en-tp', prompt: 'trou / porte / fenêtre', options: ['open', 'anpa', 'taso', 'lupa'], answer: 'lupa' },
    { id: 'open', type: 'multipleChoice', direction: 'tp-en', prompt: 'open', options: ['seulement / mais', 'ouvrir / commencer', 'même / semblable / comme'], answer: 'ouvrir / commencer' },
    { id: 'sama', type: 'multipleChoice', direction: 'en-tp', prompt: 'même / semblable / comme', options: ['ante', 'sama', 'en', 'lete'], answer: 'sama' },
    { id: 'suwi', type: 'multipleChoice', direction: 'tp-en', prompt: 'suwi', options: ['sucré / mignon', 'froid / cru', 'en bas / dessous / humble'], answer: 'sucré / mignon' },
    { id: 'mije-en-meli-li-moku', type: 'multipleChoice', direction: 'en-tp', prompt: 'L’homme et la femme mangent.', options: ['mije en meli moku', 'mije en meli li moku', 'mije li meli li moku'], answer: 'mije en meli li moku' },
    { id: 'mi-moku-e-kili-taso', type: 'wordBank', direction: 'en-tp', prompt: 'Je mange seulement des fruits.', answer: ['mi', 'moku', 'e', 'kili', 'taso'], distractors: ['en'], practisesGrammar: true, grammarNote: 'taso après un mot veut dire «\u202fseulement\u202f»\u202f: kili taso, c’est «\u202fseulement des fruits\u202f», à la fin de la partie avec e.' },
    { id: 'taso-mi-lete', type: 'wordBank', direction: 'en-tp', prompt: 'Mais j’ai froid.', answer: ['taso', 'mi', 'lete'], distractors: ['li'], practisesGrammar: true, grammarNote: 'En début de phrase, taso veut dire «\u202fmais\u202f». Vient ensuite mi lete, sans li après mi.' },
    { id: 'kili-suwi-li-pona-tawa-mi', type: 'wordBank', direction: 'en-tp', prompt: 'J’aime les fruits sucrés.', answer: ['kili', 'suwi', 'li', 'pona', 'tawa', 'mi'], distractors: ['e'], practisesGrammar: true, grammarNote: 'Le toki pona dit «\u202fles fruits sucrés sont bons pour moi\u202f»\u202f: kili suwi li pona, puis tawa mi.' },
    { id: 'lupa-li-open', type: 'wordBank', direction: 'tp-en', prompt: 'lupa li open', answer: ['la', 'porte', 'est', 'ouverte'], distractors: ['froide', 'sucrée'] },
    { id: 'ni-li-sama', type: 'multipleChoice', direction: 'tp-en', prompt: 'ni li sama', options: ['C’est pareil.', 'C’est différent.', 'C’est en dessous.'], answer: 'C’est pareil.' },
    { id: 'tomo-ante', type: 'multipleChoice', direction: 'tp-en', prompt: 'tomo ante', options: ['la même maison', 'une autre maison', 'une maison froide'], answer: 'une autre maison' },
  ],
}

export default lesson
