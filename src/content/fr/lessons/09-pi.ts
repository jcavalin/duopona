import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'pi',
  title: 'pi',
  chapter: 'Leçon 11',
  newWords: ['kasi', 'sijelo', 'suno', 'tenpo', 'awen', 'tawa', 'pi'],
  grammar: {
    title: 'Regrouper les mots qui décrivent avec pi',
    explanation: [
      'D’habitude, chaque mot qui décrit s’ajoute à tout ce qui précède. pi change cela\u202f: les mots après pi forment un groupe qui décrit le nom ensemble.',
      'tomo kulupu suli veut dire «\u202fune grande maison de groupe\u202f» (la maison est grande). tomo pi kulupu suli veut dire «\u202fla maison du grand groupe\u202f» (le groupe est grand).',
      'tawa peut aussi être un verbe ou un mot qui décrit, au sens de «\u202faller\u202f» ou «\u202fen mouvement\u202f»\u202f: soweli li tawa veut dire «\u202fl’animal bouge\u202f».',
    ],
  },
  exercises: [
    { id: 'kasi', type: 'multipleChoice', direction: 'tp-en', prompt: 'kasi', options: ['plante / feuille / arbre', 'corps / état physique', 'soleil / lumière / brillant'], answer: 'plante / feuille / arbre' },
    { id: 'sijelo', type: 'multipleChoice', direction: 'en-tp', prompt: 'corps / état physique', options: ['kasi', 'sijelo', 'suno', 'tenpo'], answer: 'sijelo' },
    { id: 'suno', type: 'multipleChoice', direction: 'tp-en', prompt: 'suno', options: ['temps / moment', 'plante / feuille / arbre', 'soleil / lumière / brillant'], answer: 'soleil / lumière / brillant' },
    { id: 'tenpo', type: 'multipleChoice', direction: 'en-tp', prompt: 'temps / moment', options: ['awen', 'suno', 'pi', 'tenpo'], answer: 'tenpo' },
    { id: 'awen', type: 'multipleChoice', direction: 'tp-en', prompt: 'awen', options: ['vers / à / en mouvement', 'rester / attendre / en sécurité', 'savoir / connaissance'], answer: 'rester / attendre / en sécurité' },
    { id: 'soweli-li-tawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli li tawa', options: ['L’animal reste.', 'L’animal est à la maison.', 'L’animal bouge.'], answer: 'L’animal bouge.' },
    { id: 'tomo-pi-kulupu-suli', type: 'wordBank', direction: 'en-tp', prompt: 'la maison du grand groupe', answer: ['tomo', 'pi', 'kulupu', 'suli'], distractors: ['li'], practisesGrammar: true, grammarNote: 'C’est le groupe qui est grand, pas la maison, donc pi réunit kulupu suli en un groupe qui décrit tomo.' },
    { id: 'lipu-pi-jan-pona-li-sin', type: 'wordBank', direction: 'en-tp', prompt: 'Le livre de la bonne personne est nouveau.', answer: ['lipu', 'pi', 'jan', 'pona', 'li', 'sin'], distractors: ['e'], practisesGrammar: true, grammarNote: 'pi fait de jan pona un groupe qui décrit lipu\u202f: le livre de la bonne personne. Puis li sin dit qu’il est nouveau.' },
    { id: 'tenpo-pi-moku-mute', type: 'wordBank', direction: 'tp-en', prompt: 'tenpo pi moku mute', answer: ['un', 'moment', 'avec', 'beaucoup', 'de', 'nourriture'], distractors: ['corps', 'rester'] },
    { id: 'sijelo-pi-jan-wawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'sijelo pi jan wawa', options: ['le corps de la personne forte', 'le corps fort d’une personne', 'une personne avec un corps'], answer: 'le corps de la personne forte' },
    { id: 'mi-awen-lon-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'Je reste dans la maison.', answer: ['mi', 'awen', 'lon', 'tomo'], distractors: ['tawa'] },
    { id: 'kasi-li-tawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'La plante bouge.', options: ['kasi li awen', 'kasi li lon', 'kasi li tawa'], answer: 'kasi li tawa' },
  ],
}

export default lesson
