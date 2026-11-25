import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'prepositions',
  title: 'Preposiciones',
  chapter: 'Lección 8',
  newWords: ['pana', 'tawa', 'lon', 'kepeken', 'tan'],
  grammar: {
    title: 'Dónde, hacia dónde, de dónde, con qué',
    explanation: [
      'lon, tawa, tan y kepeken añaden detalles al final de la oración: dónde está algo (lon), adónde va (tawa), de dónde viene (tan) y qué herramienta se usa (kepeken).',
      'Van después del verbo y de su parte con e: mi pana e kili tawa meli quiere decir “yo le doy fruta a la mujer”.',
      'También pueden ser el verbo por sí solos: sina lon tomo quiere decir “tú estás en la casa”.',
    ],
  },
  exercises: [
    { id: 'pana', type: 'multipleChoice', direction: 'tp-en', prompt: 'pana', options: ['dar / mandar', 'tener / sostener', 'oír / escuchar / oreja'], answer: 'dar / mandar' },
    { id: 'tawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'a / hacia / en movimiento', options: ['tan', 'tawa', 'lon', 'pana'], answer: 'tawa' },
    { id: 'lon', type: 'multipleChoice', direction: 'tp-en', prompt: 'lon', options: ['desde / a causa de', 'usando / con (una herramienta)', 'en / dentro de / presente'], answer: 'en / dentro de / presente' },
    { id: 'kepeken', type: 'multipleChoice', direction: 'en-tp', prompt: 'usando / con (una herramienta)', options: ['tawa', 'jo', 'pali', 'kepeken'], answer: 'kepeken' },
    { id: 'tan', type: 'multipleChoice', direction: 'tp-en', prompt: 'tan', options: ['a / hacia / en movimiento', 'desde / a causa de', 'en / dentro de / presente'], answer: 'desde / a causa de' },
    { id: 'sina-lon-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'Tú estás en la casa.', answer: ['sina', 'lon', 'tomo'], distractors: ['tawa'], practisesGrammar: true, grammarNote: 'lon puede ser el propio verbo: sina lon tomo es “tú estás en la casa”, sin li después de sina.' },
    { id: 'mi-pana-e-kili-tawa-meli', type: 'wordBank', direction: 'en-tp', prompt: 'Yo le doy fruta a la mujer.', answer: ['mi', 'pana', 'e', 'kili', 'tawa', 'meli'], distractors: ['lon'], practisesGrammar: true, grammarNote: 'tawa meli dice adónde va la fruta, así que va después del verbo y de su parte con e.' },
    { id: 'ona-li-pali-kepeken-ilo', type: 'wordBank', direction: 'en-tp', prompt: 'Ella trabaja usando una herramienta.', answer: ['ona', 'li', 'pali', 'kepeken', 'ilo'], distractors: ['tan'], practisesGrammar: true, grammarNote: 'kepeken ilo dice qué se usa, así que va al final, después del verbo pali.' },
    { id: 'kala-li-tan-telo', type: 'wordBank', direction: 'tp-en', prompt: 'kala li tan telo', answer: ['el', 'pez', 'viene', 'del', 'agua'], distractors: ['va', 'en'] },
    { id: 'mi-tawa-tomo', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi tawa tomo', options: ['Yo voy a la casa.', 'Yo estoy en la casa.', 'Yo vengo de la casa.'], answer: 'Yo voy a la casa.' },
    { id: 'soweli-li-lon-telo', type: 'multipleChoice', direction: 'en-tp', prompt: 'El animal está en el agua.', options: ['soweli li tan telo', 'soweli li lon telo', 'soweli li tawa telo'], answer: 'soweli li lon telo' },
    { id: 'mi-toki-tawa-sina', type: 'multipleChoice', direction: 'tp-en', prompt: 'mi toki tawa sina', options: ['Tú me hablas.', 'Yo vengo de ti.', 'Yo te hablo.'], answer: 'Yo te hablo.' },
  ],
}

export default lesson
