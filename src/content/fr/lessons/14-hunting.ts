import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'hunting',
  title: 'Chasse',
  chapter: 'Leçon 17',
  newWords: ['alasa', 'lawa', 'len', 'linja', 'pakala', 'palisa', 'pipi', 'waso', 'weka'],
  grammar: {
    title: 'Révision\u202f: une histoire de chasse',
    explanation: [
      'Cette leçon suit un chasseur pendant une journée et mélange la grammaire que tu as apprise\u202f: la pour situer le moment, e pour ce qui est chassé, kepeken pour les outils et pi pour regrouper les mots qui décrivent.',
      'jan alasa (personne qui chasse) veut simplement dire «\u202fchasseur\u202f»\u202f: le toki pona crée des idées nouvelles en assemblant des mots simples.',
    ],
  },
  exercises: [
    { id: 'alasa', type: 'multipleChoice', direction: 'tp-en', prompt: 'alasa', options: ['chasser / cueillir', 'oiseau / animal volant', 'ligne / corde / fil'], answer: 'chasser / cueillir' },
    { id: 'waso', type: 'multipleChoice', direction: 'en-tp', prompt: 'oiseau / animal volant', options: ['pipi', 'waso', 'kala', 'soweli'], answer: 'waso' },
    { id: 'pipi', type: 'multipleChoice', direction: 'tp-en', prompt: 'pipi', options: ['oiseau / animal volant', 'bâton / tige / branche', 'bestiole / insecte'], answer: 'bestiole / insecte' },
    { id: 'palisa', type: 'multipleChoice', direction: 'en-tp', prompt: 'bâton / tige / branche', options: ['linja', 'len', 'lawa', 'palisa'], answer: 'palisa' },
    { id: 'len', type: 'multipleChoice', direction: 'tp-en', prompt: 'len', options: ['ligne / corde / fil', 'tissu / vêtement', 'tête / esprit / diriger'], answer: 'tissu / vêtement' },
    { id: 'linja', type: 'multipleChoice', direction: 'en-tp', prompt: 'ligne / corde / fil', options: ['len', 'linja', 'palisa', 'weka'], answer: 'linja' },
    { id: 'lawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'lawa', options: ['tête / esprit / diriger', 'cassé / abîmé / erreur', 'loin / absent'], answer: 'tête / esprit / diriger' },
    { id: 'tenpo-suno-la-jan-alasa-li-tawa-kasi', type: 'wordBank', direction: 'en-tp', prompt: 'Le jour, le chasseur va vers les plantes.', answer: ['tenpo', 'suno', 'la', 'jan', 'alasa', 'li', 'tawa', 'kasi'], distractors: ['e'], practisesGrammar: true, grammarNote: 'Le moment vient d’abord, avant la. jan alasa n’est ni mi ni sina, donc li vient avant tawa kasi.' },
    { id: 'ona-li-alasa-e-waso-kepeken-palisa', type: 'wordBank', direction: 'en-tp', prompt: 'Elle chasse les oiseaux avec un bâton.', answer: ['ona', 'li', 'alasa', 'e', 'waso', 'kepeken', 'palisa'], distractors: ['lon'], practisesGrammar: true, grammarNote: 'e marque ce qui est chassé, waso, et kepeken palisa ajoute l’outil à la fin.' },
    { id: 'linja-ona-li-pakala', type: 'wordBank', direction: 'tp-en', prompt: 'linja ona li pakala', answer: ['sa', 'corde', 'est', 'cassée'], distractors: ['tête', 'loin'] },
    { id: 'waso-li-tawa-weka', type: 'multipleChoice', direction: 'tp-en', prompt: 'waso li tawa weka', options: ['L’oiseau revient.', 'L’oiseau s’en va.', 'L’oiseau est cassé.'], answer: 'L’oiseau s’en va.' },
    { id: 'len-pi-jan-alasa-li-loje', type: 'wordBank', direction: 'en-tp', prompt: 'Le vêtement du chasseur est rouge.', answer: ['len', 'pi', 'jan', 'alasa', 'li', 'loje'], distractors: ['e'], practisesGrammar: true, grammarNote: 'pi regroupe jan alasa en une seule idée qui décrit len\u202f: le vêtement du chasseur. Puis li loje.' },
  ],
}

export default lesson
