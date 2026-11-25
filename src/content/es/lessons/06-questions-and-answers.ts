import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'questions-and-answers',
  title: 'Preguntas y respuestas',
  chapter: 'Lección 7',
  newWords: ['ilo', 'kala', 'ona', 'anu', 'seme'],
  grammar: {
    title: 'Hacer preguntas',
    explanation: [
      'Para preguntar por algo, pon seme donde iría la respuesta: sina moku e seme? quiere decir “¿qué estás comiendo?”.',
      'Para una pregunta de sí o no, di el verbo, luego ala y luego otra vez el verbo: sina wawa ala wawa? quiere decir “¿eres fuerte?”. Responde con el verbo (wawa) o con ala.',
      'anu quiere decir “o”: kala anu kili? pregunta “¿pez o fruta?”.',
    ],
  },
  exercises: [
    { id: 'ilo', type: 'multipleChoice', direction: 'tp-en', prompt: 'ilo', options: ['herramienta / máquina / aparato', 'pez / animal marino', 'qué / cuál'], answer: 'herramienta / máquina / aparato' },
    { id: 'kala', type: 'multipleChoice', direction: 'en-tp', prompt: 'pez / animal marino', options: ['kili', 'kala', 'soweli', 'ilo'], answer: 'kala' },
    { id: 'ona', type: 'multipleChoice', direction: 'tp-en', prompt: 'ona', options: ['yo / mí / nosotros', 'tú / usted / ustedes', 'él / ella / ellos'], answer: 'él / ella / ellos' },
    { id: 'anu', type: 'multipleChoice', direction: 'en-tp', prompt: 'o', options: ['seme', 'ala', 'e', 'anu'], answer: 'anu' },
    { id: 'seme', type: 'multipleChoice', direction: 'en-tp', prompt: 'qué / cuál', options: ['seme', 'ona', 'anu', 'ni'], answer: 'seme' },
    { id: 'sina-moku-e-seme', type: 'wordBank', direction: 'en-tp', prompt: '¿Qué estás comiendo?', answer: ['sina', 'moku', 'e', 'seme'], distractors: ['li'], practisesGrammar: true, grammarNote: 'seme va donde iría la respuesta: lo que se come va después de e, así que seme va ahí.' },
    { id: 'sina-wawa-ala-wawa', type: 'wordBank', direction: 'en-tp', prompt: '¿Eres fuerte?', answer: ['sina', 'wawa', 'ala', 'wawa'], distractors: ['seme'], practisesGrammar: true, grammarNote: 'Una pregunta de sí o no dice la palabra, luego ala y luego otra vez la palabra: wawa ala wawa. Con sina no hay li.' },
    { id: 'ilo-li-pona-ala-pona', type: 'wordBank', direction: 'en-tp', prompt: '¿La herramienta es buena?', answer: ['ilo', 'li', 'pona', 'ala', 'pona'], distractors: ['seme'], practisesGrammar: true, grammarNote: 'Una pregunta de sí o no repite la palabra alrededor de ala: pona ala pona. ilo no es mi ni sina, así que li se queda.' },
    { id: 'jan-seme-li-moku', type: 'wordBank', direction: 'tp-en', prompt: 'jan seme li moku?', answer: ['quién', 'está', 'comiendo'], distractors: ['qué', 'comida'] },
    { id: 'kala-anu-kili', type: 'multipleChoice', direction: 'tp-en', prompt: 'ona li kala anu kili?', options: ['¿Es un pez o una fruta?', 'Es un pez y una fruta.', '¿Es un pez?'], answer: '¿Es un pez o una fruta?' },
    { id: 'sina-sona-ala-sona', type: 'multipleChoice', direction: 'tp-en', prompt: 'sina sona ala sona?', options: ['Tú no sabes.', '¿Tú sabes?', '¿Qué sabes tú?'], answer: '¿Tú sabes?' },
    { id: 'ni-li-seme', type: 'multipleChoice', direction: 'en-tp', prompt: '¿Qué es esto?', options: ['ni li ala?', 'ni li ijo?', 'ni li seme?'], answer: 'ni li seme?' },
    { id: 'ona-li-jo-e-ilo', type: 'wordBank', direction: 'en-tp', prompt: 'Ella tiene una herramienta.', answer: ['ona', 'li', 'jo', 'e', 'ilo'], distractors: ['mi'] },
  ],
}

export default lesson
