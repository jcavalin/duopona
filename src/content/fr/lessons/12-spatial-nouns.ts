import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'spatial-nouns',
  title: 'Noms de lieu',
  chapter: 'Leçon 15',
  newWords: ['insa', 'monsi', 'noka', 'poka', 'sewi', 'sinpin'],
  grammar: {
    title: 'Dire où exactement\u202f: lon + mot de lieu',
    explanation: [
      'Certains noms désignent une partie de l’espace\u202f: insa (l’intérieur), monsi (l’arrière), sinpin (l’avant), poka (le côté), sewi (le haut) et noka (le bas).',
      'Utilise-les après lon, suivis de la chose à laquelle ils appartiennent\u202f: soweli li lon insa tomo veut dire «\u202fl’animal est dans la maison\u202f».',
    ],
  },
  exercises: [
    { id: 'insa', type: 'multipleChoice', direction: 'tp-en', prompt: 'insa', options: ['intérieur / centre / ventre', 'dos / derrière', 'devant / visage / mur'], answer: 'intérieur / centre / ventre' },
    { id: 'monsi', type: 'multipleChoice', direction: 'en-tp', prompt: 'dos / derrière', options: ['sinpin', 'monsi', 'noka', 'poka'], answer: 'monsi' },
    { id: 'noka', type: 'multipleChoice', direction: 'tp-en', prompt: 'noka', options: ['côté / à proximité / hanche', 'devant / visage / mur', 'jambe / pied / bas'], answer: 'jambe / pied / bas' },
    { id: 'poka', type: 'multipleChoice', direction: 'en-tp', prompt: 'côté / à proximité / hanche', options: ['insa', 'sewi', 'monsi', 'poka'], answer: 'poka' },
    { id: 'sinpin', type: 'multipleChoice', direction: 'tp-en', prompt: 'sinpin', options: ['intérieur / centre / ventre', 'devant / visage / mur', 'dos / derrière'], answer: 'devant / visage / mur' },
    { id: 'soweli-li-lon-insa-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'L’animal est à l’intérieur de la maison.', answer: ['soweli', 'li', 'lon', 'insa', 'tomo'], distractors: ['tawa'], practisesGrammar: true, grammarNote: 'Après lon vient le mot de lieu insa, puis la chose à laquelle il appartient\u202f: lon insa tomo.' },
    { id: 'sina-lon-poka-mi', type: 'wordBank', direction: 'en-tp', prompt: 'Tu es à côté de moi.', answer: ['sina', 'lon', 'poka', 'mi'], distractors: ['li'], practisesGrammar: true, grammarNote: 'lon poka mi veut dire «\u202fà mon côté\u202f»\u202f: le mot de lieu, puis à qui est le côté. Avec sina, pas de li.' },
    { id: 'suno-li-lon-sewi-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'Le soleil est au-dessus de la maison.', answer: ['suno', 'li', 'lon', 'sewi', 'tomo'], distractors: ['insa'], practisesGrammar: true, grammarNote: '«\u202fAu-dessus\u202f», c’est le haut de la maison\u202f: lon, puis sewi, puis tomo.' },
    { id: 'kili-li-lon-noka-kasi', type: 'multipleChoice', direction: 'tp-en', prompt: 'kili li lon noka kasi', options: ['Le fruit est en haut de la plante.', 'Le fruit est dans la plante.', 'Le fruit est au pied de la plante.'], answer: 'Le fruit est au pied de la plante.' },
    { id: 'jan-li-lon-monsi-tomo', type: 'wordBank', direction: 'tp-en', prompt: 'jan li lon monsi tomo', answer: ['la', 'personne', 'est', 'derrière', 'la', 'maison'], distractors: ['dans', 'devant'] },
    { id: 'lon-sinpin-tomo', type: 'multipleChoice', direction: 'en-tp', prompt: 'devant la maison', options: ['lon monsi tomo', 'lon sinpin tomo', 'lon insa tomo'], answer: 'lon sinpin tomo' },
    { id: 'lon-sewi', type: 'multipleChoice', direction: 'tp-en', prompt: 'lon sewi', options: ['derrière', 'dedans', 'au-dessus'], answer: 'au-dessus' },
  ],
}

export default lesson
