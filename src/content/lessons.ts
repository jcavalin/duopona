import type { Lesson } from './types'

const basicWords: Lesson = {
  id: 'basics-1',
  title: 'Basic Words',
  exercises: [
    { id: 'jan', type: 'multipleChoice', direction: 'tp-en', prompt: 'jan', options: ['person', 'water', 'food', 'bad'], answer: 'person' },
    { id: 'pona', type: 'multipleChoice', direction: 'tp-en', prompt: 'pona', options: ['good', 'bad', 'you', 'water'], answer: 'good' },
    { id: 'telo', type: 'multipleChoice', direction: 'en-tp', prompt: 'water', options: ['telo', 'moku', 'jan', 'ike'], answer: 'telo' },
    { id: 'sina', type: 'multipleChoice', direction: 'tp-en', prompt: 'sina', options: ['you', 'I / me', 'person', 'food'], answer: 'you' },
    { id: 'mi-pona', type: 'wordBank', direction: 'en-tp', prompt: 'I am good', answer: ['mi', 'pona'], distractors: ['sina', 'ike'] },
    { id: 'moku', type: 'multipleChoice', direction: 'en-tp', prompt: 'food / to eat', options: ['moku', 'telo', 'toki', 'ona'], answer: 'moku' },
    { id: 'ike', type: 'multipleChoice', direction: 'tp-en', prompt: 'ike', options: ['bad', 'good', 'language', 'person'], answer: 'bad' },
    { id: 'toki', type: 'multipleChoice', direction: 'en-tp', prompt: 'hello / language', options: ['toki', 'pona', 'sina', 'telo'], answer: 'toki' },
    { id: 'ona', type: 'multipleChoice', direction: 'tp-en', prompt: 'ona', options: ['he / she / it', 'you', 'I / me', 'water'], answer: 'he / she / it' },
    { id: 'sina-pona', type: 'wordBank', direction: 'tp-en', prompt: 'sina pona', answer: ['you', 'are', 'good'], distractors: ['bad', 'I'] },
    { id: 'jan-li-pona', type: 'wordBank', direction: 'en-tp', prompt: 'The person is good', answer: ['jan', 'li', 'pona'], distractors: ['mi', 'telo'] },
  ],
}

export const lessons: Lesson[] = [basicWords]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id)
}
