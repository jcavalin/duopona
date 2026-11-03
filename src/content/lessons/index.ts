import type { Lesson } from '../types'
import wordsAndSentences from './01-words-and-sentences'
import nounsAndAdjectives from './02-nouns-and-adjectives'
import youAndI from './03-you-and-i'
import verbs from './04-verbs'
import moreAdjectives from './05-more-adjectives'
import questionsAndAnswers from './06-questions-and-answers'
import prepositions from './07-prepositions'
import greetingsAndFeelings from './08-greetings-and-feelings'
import pi from './09-pi'
import preVerbs from './10-pre-verbs'
import coloursAndLa from './11-colours-and-la'
import spatialNouns from './12-spatial-nouns'
import particlesAndPerspective from './13-particles-and-perspective'
import hunting from './14-hunting'
import cooking from './15-cooking'
import moreWords1 from './16-more-words-1'
import moreWords2 from './17-more-words-2'

/** The course, in teaching order (FR-001). Position defines unlocking. */
export const lessons: Lesson[] = [
  wordsAndSentences,
  nounsAndAdjectives,
  youAndI,
  verbs,
  moreAdjectives,
  questionsAndAnswers,
  prepositions,
  greetingsAndFeelings,
  pi,
  preVerbs,
  coloursAndLa,
  spatialNouns,
  particlesAndPerspective,
  hunting,
  cooking,
  moreWords1,
  moreWords2,
]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id)
}
