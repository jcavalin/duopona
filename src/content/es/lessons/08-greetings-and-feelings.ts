import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'greetings-and-feelings',
  title: 'Saludos y sentimientos',
  chapter: 'Lección 10',
  newWords: ['a', 'mu', 'o', 'pilin'],
  grammar: {
    title: 'Órdenes, llamar a alguien y sentimientos',
    explanation: [
      'Empieza una oración con o para dar una orden: o pali! quiere decir “¡trabaja!”. Añade ala para prohibir: o moku ala e kala!',
      'Pon o después de un nombre o de una persona para llamarla: jan pona o, kute e mi! quiere decir “¡amigo, escúchame!”.',
      'toki! por sí solo sirve como “¡hola!”. Usa pilin para hablar de sentimientos, y a para añadir emoción: a, sina wawa!',
    ],
  },
  exercises: [
    { id: 'pilin', type: 'multipleChoice', direction: 'tp-en', prompt: 'pilin', options: ['sentimiento / corazón / sentir', 'alimento / comer / beber', 'herramienta / máquina / aparato'], answer: 'sentimiento / corazón / sentir' },
    { id: 'mu', type: 'multipleChoice', direction: 'en-tp', prompt: 'muu / guau (cualquier sonido de animal)', options: ['a', 'mu', 'o', 'seme'], answer: 'mu' },
    { id: 'a', type: 'multipleChoice', direction: 'tp-en', prompt: 'a', options: ['o', 'qué / cuál', '¡ah! / ¡oh! (emoción o énfasis)'], answer: '¡ah! / ¡oh! (emoción o énfasis)' },
    { id: 'o-moku', type: 'multipleChoice', direction: 'tp-en', prompt: 'o moku!', options: ['¡Come!', 'Yo como.', 'La comida es buena.'], answer: '¡Come!' },
    { id: 'o-pali', type: 'wordBank', direction: 'en-tp', prompt: '¡Trabaja!', answer: ['o', 'pali'], distractors: ['mi'], practisesGrammar: true, grammarNote: 'Una orden empieza con o, seguida del verbo: o pali.' },
    { id: 'jan-pona-o-kute-e-mi', type: 'wordBank', direction: 'en-tp', prompt: '¡Amigo, escúchame!', answer: ['jan', 'pona', 'o', 'kute', 'e', 'mi'], distractors: ['li'], practisesGrammar: true, grammarNote: 'o después de jan pona llama al amigo; luego viene la orden, kute e mi.' },
    { id: 'toki', type: 'multipleChoice', direction: 'en-tp', prompt: '¡Hola!', options: ['toki!', 'moku!', 'pona!'], answer: 'toki!' },
    { id: 'mi-pilin-pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi pilin pona', options: ['Tú te sientes bien.', 'Yo me siento bien.', 'Yo me siento mal.'], answer: 'Yo me siento bien.' },
    { id: 'mi-pilin-ike', type: 'wordBank', direction: 'en-tp', prompt: 'Yo me siento mal.', answer: ['mi', 'pilin', 'ike'], distractors: ['li'] },
    { id: 'soweli-li-mu', type: 'wordBank', direction: 'tp-en', prompt: 'soweli li mu', answer: ['el', 'animal', 'hace', 'un', 'sonido'], distractors: ['come', 'pez'] },
    { id: 'a-sina-wawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'a, sina wawa!', options: ['¿Eres fuerte?', '¡Vaya, eres fuerte!', 'Yo soy fuerte.'], answer: '¡Vaya, eres fuerte!' },
    { id: 'o-moku-ala-e-kala', type: 'wordBank', direction: 'en-tp', prompt: '¡No comas el pez!', answer: ['o', 'moku', 'ala', 'e', 'kala'], distractors: ['li'], practisesGrammar: true, grammarNote: 'Una orden empieza con o, y ala justo después del verbo la vuelve una prohibición: o moku ala e kala.' },
  ],
}

export default lesson
