import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'hunting',
  title: 'Caza',
  chapter: 'Lección 17',
  newWords: ['alasa', 'lawa', 'len', 'linja', 'pakala', 'palisa', 'pipi', 'waso', 'weka'],
  grammar: {
    title: 'Repaso: una historia de caza',
    explanation: [
      'Esta lección sigue a un cazador durante un día y mezcla la gramática que ya conoces: la para situar el tiempo, e para lo que se caza, kepeken para las herramientas y pi para agrupar palabras que describen.',
      'jan alasa (persona que caza) es simplemente “cazador”: el toki pona crea ideas nuevas juntando palabras simples.',
    ],
  },
  exercises: [
    { id: 'alasa', type: 'multipleChoice', direction: 'tp-en', prompt: 'alasa', options: ['cazar / recolectar', 'pájaro / animal que vuela', 'línea / cuerda / hilo'], answer: 'cazar / recolectar' },
    { id: 'waso', type: 'multipleChoice', direction: 'en-tp', prompt: 'pájaro / animal que vuela', options: ['pipi', 'waso', 'kala', 'soweli'], answer: 'waso' },
    { id: 'pipi', type: 'multipleChoice', direction: 'tp-en', prompt: 'pipi', options: ['pájaro / animal que vuela', 'palo / vara / rama', 'bicho / insecto'], answer: 'bicho / insecto' },
    { id: 'palisa', type: 'multipleChoice', direction: 'en-tp', prompt: 'palo / vara / rama', options: ['linja', 'len', 'lawa', 'palisa'], answer: 'palisa' },
    { id: 'len', type: 'multipleChoice', direction: 'tp-en', prompt: 'len', options: ['línea / cuerda / hilo', 'tela / ropa', 'cabeza / mente / dirigir'], answer: 'tela / ropa' },
    { id: 'linja', type: 'multipleChoice', direction: 'en-tp', prompt: 'línea / cuerda / hilo', options: ['len', 'linja', 'palisa', 'weka'], answer: 'linja' },
    { id: 'lawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'lawa', options: ['cabeza / mente / dirigir', 'roto / dañado / error', 'lejos / ausente'], answer: 'cabeza / mente / dirigir' },
    { id: 'tenpo-suno-la-jan-alasa-li-tawa-kasi', type: 'wordBank', direction: 'en-tp', prompt: 'De día, el cazador va hacia las plantas.', answer: ['tenpo', 'suno', 'la', 'jan', 'alasa', 'li', 'tawa', 'kasi'], distractors: ['e'], practisesGrammar: true, grammarNote: 'El tiempo va primero, antes de la. jan alasa no es mi ni sina, así que li va antes de tawa kasi.' },
    { id: 'ona-li-alasa-e-waso-kepeken-palisa', type: 'wordBank', direction: 'en-tp', prompt: 'Ella caza pájaros usando un palo.', answer: ['ona', 'li', 'alasa', 'e', 'waso', 'kepeken', 'palisa'], distractors: ['lon'], practisesGrammar: true, grammarNote: 'e marca lo que se caza, waso, y kepeken palisa añade la herramienta al final.' },
    { id: 'linja-ona-li-pakala', type: 'wordBank', direction: 'tp-en', prompt: 'linja ona li pakala', answer: ['su', 'cuerda', 'está', 'rota'], distractors: ['cabeza', 'lejos'] },
    { id: 'waso-li-tawa-weka', type: 'multipleChoice', direction: 'tp-en', prompt: 'waso li tawa weka', options: ['El pájaro vuelve.', 'El pájaro se va.', 'El pájaro está roto.'], answer: 'El pájaro se va.' },
    { id: 'len-pi-jan-alasa-li-loje', type: 'wordBank', direction: 'en-tp', prompt: 'La ropa del cazador es roja.', answer: ['len', 'pi', 'jan', 'alasa', 'li', 'loje'], distractors: ['e'], practisesGrammar: true, grammarNote: 'pi agrupa jan alasa en una sola idea que describe a len: la ropa del cazador. Luego, li loje.' },
  ],
}

export default lesson
