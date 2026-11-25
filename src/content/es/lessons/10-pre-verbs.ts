import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'pre-verbs',
  title: 'Preverbos',
  chapter: 'Lección 13',
  newWords: ['kama', 'ken', 'wile', 'lukin', 'sona'],
  grammar: {
    title: 'Preverbos: querer, poder, intentar',
    explanation: [
      'Un preverbo va justo antes del verbo principal y cambia su sentido: mi wile moku quiere decir “yo quiero comer”.',
      'Los más comunes son wile (querer), ken (poder), sona (saber), lukin (intentar) y kama (llegar a, volverse).',
      'La parte con e sigue yendo después del verbo principal: mi lukin kute e soweli quiere decir “yo intento oír al animal”.',
    ],
  },
  exercises: [
    { id: 'kama', type: 'multipleChoice', direction: 'tp-en', prompt: 'kama', options: ['venir / volverse / que llega', 'poder / ser capaz de / posible', 'querer / necesitar / deber'], answer: 'venir / volverse / que llega' },
    { id: 'ken', type: 'multipleChoice', direction: 'en-tp', prompt: 'poder / ser capaz de / posible', options: ['wile', 'ken', 'kama', 'lukin'], answer: 'ken' },
    { id: 'wile', type: 'multipleChoice', direction: 'tp-en', prompt: 'wile', options: ['ver / mirar / intentar', 'saber / conocimiento', 'querer / necesitar / deber'], answer: 'querer / necesitar / deber' },
    { id: 'lukin', type: 'multipleChoice', direction: 'en-tp', prompt: 'ver / mirar / intentar', options: ['kute', 'sona', 'ken', 'lukin'], answer: 'lukin' },
    { id: 'mi-wile-moku', type: 'wordBank', direction: 'en-tp', prompt: 'Yo quiero comer.', answer: ['mi', 'wile', 'moku'], distractors: ['e'], practisesGrammar: true, grammarNote: 'El preverbo wile va justo antes del verbo principal moku: mi wile moku.' },
    { id: 'sina-ken-toki', type: 'wordBank', direction: 'en-tp', prompt: 'Tú puedes hablar.', answer: ['sina', 'ken', 'toki'], distractors: ['li'], practisesGrammar: true, grammarNote: 'ken va justo antes del verbo que cambia, y después de sina no hay li: sina ken toki.' },
    { id: 'ona-li-sona-pali', type: 'wordBank', direction: 'en-tp', prompt: 'Ella sabe trabajar.', answer: ['ona', 'li', 'sona', 'pali'], distractors: ['e'], practisesGrammar: true, grammarNote: 'ona sigue necesitando li, y luego el preverbo sona va justo antes del verbo pali.' },
    { id: 'mi-lukin-kute-e-soweli', type: 'wordBank', direction: 'en-tp', prompt: 'Yo intento oír al animal.', answer: ['mi', 'lukin', 'kute', 'e', 'soweli'], distractors: ['li'], practisesGrammar: true, grammarNote: 'lukin va antes del verbo principal kute, y la parte con e sigue después de él: kute e soweli.' },
    { id: 'jan-li-kama', type: 'multipleChoice', direction: 'tp-en', prompt: 'jan li kama', options: ['La persona puede venir.', 'La persona quiere venir.', 'La persona está viniendo.'], answer: 'La persona está viniendo.' },
    { id: 'mi-kama-sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi kama sona', options: ['Yo estoy aprendiendo.', 'Yo sé.', 'Yo quiero saber.'], answer: 'Yo estoy aprendiendo.' },
    { id: 'mi-lukin-e-suno', type: 'multipleChoice', direction: 'en-tp', prompt: 'Yo veo el sol.', options: ['mi lukin suno', 'mi lukin e suno', 'suno li lukin e mi'], answer: 'mi lukin e suno' },
    { id: 'sina-wile-ala-moku', type: 'wordBank', direction: 'tp-en', prompt: 'sina wile ala moku', answer: ['tú', 'no', 'quieres', 'comer'], distractors: ['puedes'] },
  ],
}

export default lesson
