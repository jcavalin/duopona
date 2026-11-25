import type { Language } from './language'

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** French uses the singular for 0 and 1 (015 research R5) */
const pluralFr = (n: number, one: string, many: string) => `${n} ${n <= 1 ? one : many}`

/** Interface text in English; its shape is the contract every other language must fill (014 research R1). */
const en = {
  // Home
  wordmark: 'duopona',
  streakLabel: (streak: number, metToday: boolean) =>
    `${streak} day streak, ${metToday ? 'practised today' : 'not practised today'}`,
  lessonsDoneLabel: (done: number, total: number) => `${done} of ${total} lessons done`,
  courseProgress: (done: number, total: number) => `Course · ${done} of ${total} done`,
  bannerTitle: 'Learn Toki Pona',
  bannerFollowing: 'Following',
  bookTitle: 'Toki Pona: The Language of Good',
  dailyGoal: 'Daily goal',
  sessionsToday: (done: number, goal: number) => `${done} / ${goal} session today`,
  bestStreak: (n: number) => `Best streak: ${plural(n, 'day', 'days')}`,
  practice: 'Practice',
  reviewWeakWords: 'Review weak words',
  hintFinishLesson: 'Finish a lesson to unlock practice.',
  hintNoWeakWords: 'No weak words yet.',
  startPill: 'Start',
  lessonLocked: (title: string) => `${title}, locked`,
  lessonStart: (title: string) => `${title}, start`,
  lessonCompleted: (title: string, correct: number, total: number) => `${title}, completed, ${correct} of ${total}`,
  footerBasedOn: 'Course based on',
  footerBy: 'by Sonja Lang',
  // Settings (014 contract ui-settings.md)
  settings: 'Settings',
  closeSettings: 'Close settings',
  language: 'Language',
  // Lesson introduction
  backToLessons: 'Back to lessons',
  /** Where a lesson comes from: a book chapter, or the extra dictionary lessons */
  sourceLabel: (chapter: string) => (chapter === 'Dictionary' ? 'Extra: dictionary words' : `Book: ${chapter}`),
  exerciseCount: (n: number) => plural(n, 'exercise', 'exercises'),
  newWords: 'New words',
  start: 'Start',
  // Exercises
  quitLesson: 'Quit lesson',
  lessonProgress: 'Lesson progress',
  quitPractice: 'Quit practice',
  practiceProgress: 'Practice progress',
  chooseMeaning: 'Choose the meaning',
  chooseTokiPona: 'Choose the Toki Pona',
  writeInStudyLanguage: 'Write this in English',
  writeInTokiPona: 'Write this in Toki Pona',
  options: 'Options',
  yourAnswer: 'Your answer',
  wordBank: 'Word bank',
  tileHint: 'Press to remove. Drag or use the left and right arrow keys to move.',
  grammarTag: 'Grammar',
  check: 'Check',
  // Feedback and explanations
  correct: 'Correct.',
  notQuite: 'Not quite',
  correctAnswer: 'Correct answer:',
  why: 'Why?',
  hide: 'Hide',
  means: 'means',
  /** Between a word and its meaning in the "Why?" list */
  wordMeaningSeparator: ': ',
  fromLesson: (lesson: string) => `From ${lesson}`,
  continue: 'Continue',
  // Leave dialog (013)
  leaveLessonTitle: 'Leave this lesson?',
  leaveLessonMessage: 'Your progress in this lesson will be lost.',
  leavePracticeTitle: 'Leave this practice?',
  leavePracticeMessage: 'Your progress in this practice will be lost.',
  keepLearning: 'Keep learning',
  leave: 'Leave',
  // Summary
  lessonComplete: 'Lesson complete!',
  replayLesson: 'Replay lesson',
  practiceComplete: 'Practice complete!',
  practiseAgain: 'Practise again',
  dailyGoalMet: 'Daily goal met',
  statCorrect: 'Correct',
  statUnlocked: 'Unlocked',
  statStreak: 'Streak',
  dayCount: (n: number) => plural(n, 'day', 'days'),
  subtitlePractice: 'Practice',
  subtitleWeakWords: 'Weak words',
}

export type Strings = typeof en

/** Interface text in Brazilian Portuguese (014). */
const ptBR: Strings = {
  // Home
  wordmark: 'duopona',
  streakLabel: (streak, metToday) =>
    `Sequência de ${plural(streak, 'dia', 'dias')}, ${metToday ? 'praticou hoje' : 'ainda não praticou hoje'}`,
  lessonsDoneLabel: (done, total) => `${done} de ${total} lições concluídas`,
  courseProgress: (done, total) => `Curso · ${done} de ${total} concluídas`,
  bannerTitle: 'Aprenda Toki Pona',
  bannerFollowing: 'Seguindo',
  bookTitle: 'Toki Pona: The Language of Good',
  dailyGoal: 'Meta diária',
  sessionsToday: (done, goal) => `${done} / ${goal} sessão hoje`,
  bestStreak: (n) => `Melhor sequência: ${plural(n, 'dia', 'dias')}`,
  practice: 'Praticar',
  reviewWeakWords: 'Revisar palavras fracas',
  hintFinishLesson: 'Conclua uma lição para liberar a prática.',
  hintNoWeakWords: 'Ainda não há palavras fracas.',
  startPill: 'Começar',
  lessonLocked: (title) => `${title}, bloqueada`,
  lessonStart: (title) => `${title}, começar`,
  lessonCompleted: (title, correct, total) => `${title}, concluída, ${correct} de ${total}`,
  footerBasedOn: 'Curso baseado em',
  footerBy: 'de Sonja Lang',
  // Settings
  settings: 'Configurações',
  closeSettings: 'Fechar configurações',
  language: 'Idioma',
  // Lesson introduction
  backToLessons: 'Voltar às lições',
  sourceLabel: (chapter) => (chapter === 'Dicionário' ? 'Extra: palavras do dicionário' : `Livro: ${chapter}`),
  exerciseCount: (n) => plural(n, 'exercício', 'exercícios'),
  newWords: 'Palavras novas',
  start: 'Começar',
  // Exercises
  quitLesson: 'Sair da lição',
  lessonProgress: 'Progresso da lição',
  quitPractice: 'Sair da prática',
  practiceProgress: 'Progresso da prática',
  chooseMeaning: 'Escolha o significado',
  chooseTokiPona: 'Escolha em toki pona',
  writeInStudyLanguage: 'Escreva em português',
  writeInTokiPona: 'Escreva em toki pona',
  options: 'Opções',
  yourAnswer: 'Sua resposta',
  wordBank: 'Banco de palavras',
  tileHint: 'Toque para remover. Arraste ou use as setas para a esquerda e para a direita para mover.',
  grammarTag: 'Gramática',
  check: 'Verificar',
  // Feedback and explanations
  correct: 'Correto.',
  notQuite: 'Não é bem isso',
  correctAnswer: 'Resposta correta:',
  why: 'Por quê?',
  hide: 'Ocultar',
  means: 'significa',
  wordMeaningSeparator: ': ',
  fromLesson: (lesson) => `Fonte: ${lesson}`,
  continue: 'Continuar',
  // Leave dialog
  leaveLessonTitle: 'Sair desta lição?',
  leaveLessonMessage: 'Seu progresso nesta lição será perdido.',
  leavePracticeTitle: 'Sair desta prática?',
  leavePracticeMessage: 'Seu progresso nesta prática será perdido.',
  keepLearning: 'Continuar aprendendo',
  leave: 'Sair',
  // Summary
  lessonComplete: 'Lição concluída!',
  replayLesson: 'Refazer lição',
  practiceComplete: 'Prática concluída!',
  practiseAgain: 'Praticar de novo',
  dailyGoalMet: 'Meta diária cumprida',
  statCorrect: 'Acertos',
  statUnlocked: 'Liberada',
  statStreak: 'Sequência',
  dayCount: (n) => plural(n, 'dia', 'dias'),
  subtitlePractice: 'Prática',
  subtitleWeakWords: 'Palavras fracas',
}

/**
 * Interface text in French (015), addressing the learner as "tu". A narrow no-break space (\u202f)
 * goes before ? ! ; : so the mark never starts a line (research R5).
 */
const fr: Strings = {
  // Home
  wordmark: 'duopona',
  streakLabel: (streak, metToday) =>
    `Série de ${pluralFr(streak, 'jour', 'jours')}, ${metToday ? 'entraînement fait aujourd’hui' : 'pas encore d’entraînement aujourd’hui'}`,
  lessonsDoneLabel: (done, total) => `${done} leçons terminées sur ${total}`,
  courseProgress: (done, total) => `Cours · ${done} sur ${total} terminées`,
  bannerTitle: 'Apprends le toki pona',
  bannerFollowing: 'D’après',
  bookTitle: 'Toki Pona: The Language of Good',
  dailyGoal: 'Objectif du jour',
  sessionsToday: (done, goal) => `${done} / ${goal} séance aujourd’hui`,
  bestStreak: (n) => `Meilleure série\u202f: ${pluralFr(n, 'jour', 'jours')}`,
  practice: 'S’entraîner',
  reviewWeakWords: 'Revoir les mots difficiles',
  hintFinishLesson: 'Termine une leçon pour débloquer l’entraînement.',
  hintNoWeakWords: 'Aucun mot difficile pour l’instant.',
  startPill: 'Commencer',
  lessonLocked: (title) => `${title}, verrouillée`,
  lessonStart: (title) => `${title}, commencer`,
  lessonCompleted: (title, correct, total) => `${title}, terminée, ${correct} sur ${total}`,
  footerBasedOn: 'Cours basé sur',
  footerBy: 'de Sonja Lang',
  // Settings
  settings: 'Paramètres',
  closeSettings: 'Fermer les paramètres',
  language: 'Langue',
  // Lesson introduction
  backToLessons: 'Retour aux leçons',
  sourceLabel: (chapter) =>
    chapter === 'Dictionnaire' ? 'Extra\u202f: mots du dictionnaire' : `Livre\u202f: ${chapter}`,
  exerciseCount: (n) => pluralFr(n, 'exercice', 'exercices'),
  newWords: 'Nouveaux mots',
  start: 'Commencer',
  // Exercises
  quitLesson: 'Quitter la leçon',
  lessonProgress: 'Progression de la leçon',
  quitPractice: 'Quitter l’entraînement',
  practiceProgress: 'Progression de l’entraînement',
  chooseMeaning: 'Choisis le sens',
  chooseTokiPona: 'Choisis en toki pona',
  writeInStudyLanguage: 'Écris ceci en français',
  writeInTokiPona: 'Écris ceci en toki pona',
  options: 'Choix',
  yourAnswer: 'Ta réponse',
  wordBank: 'Banque de mots',
  tileHint: 'Appuie pour retirer. Fais glisser ou utilise les flèches gauche et droite pour déplacer.',
  grammarTag: 'Grammaire',
  check: 'Vérifier',
  // Feedback and explanations
  correct: 'Correct.',
  notQuite: 'Pas tout à fait',
  correctAnswer: 'Bonne réponse\u202f:',
  why: 'Pourquoi\u202f?',
  hide: 'Masquer',
  means: 'veut dire',
  wordMeaningSeparator: '\u202f: ',
  fromLesson: (lesson) => `Source\u202f: ${lesson}`,
  continue: 'Continuer',
  // Leave dialog
  leaveLessonTitle: 'Quitter cette leçon\u202f?',
  leaveLessonMessage: 'Ta progression dans cette leçon sera perdue.',
  leavePracticeTitle: 'Quitter cet entraînement\u202f?',
  leavePracticeMessage: 'Ta progression dans cet entraînement sera perdue.',
  keepLearning: 'Continuer à apprendre',
  leave: 'Quitter',
  // Summary
  lessonComplete: 'Leçon terminée\u202f!',
  replayLesson: 'Refaire la leçon',
  practiceComplete: 'Entraînement terminé\u202f!',
  practiseAgain: 'Recommencer',
  dailyGoalMet: 'Objectif du jour atteint',
  statCorrect: 'Réussies',
  statUnlocked: 'Débloquée',
  statStreak: 'Série',
  dayCount: (n) => pluralFr(n, 'jour', 'jours'),
  subtitlePractice: 'Entraînement',
  subtitleWeakWords: 'Mots difficiles',
}

/**
 * Interface text in neutral Spanish (017), addressing the learner as "tú". Questions and
 * exclamations open with ¿ and ¡ (research R5).
 */
const es: Strings = {
  // Home
  wordmark: 'duopona',
  streakLabel: (streak, metToday) =>
    `Racha de ${plural(streak, 'día', 'días')}, ${metToday ? 'con práctica hoy' : 'sin práctica hoy'}`,
  lessonsDoneLabel: (done, total) => `${done} de ${total} lecciones terminadas`,
  courseProgress: (done, total) => `Curso · ${done} de ${total} terminadas`,
  bannerTitle: 'Aprende toki pona',
  bannerFollowing: 'Según',
  bookTitle: 'Toki Pona: The Language of Good',
  dailyGoal: 'Meta diaria',
  sessionsToday: (done, goal) => `${done} / ${goal} sesión hoy`,
  bestStreak: (n) => `Mejor racha: ${plural(n, 'día', 'días')}`,
  practice: 'Practicar',
  reviewWeakWords: 'Repasar palabras difíciles',
  hintFinishLesson: 'Termina una lección para desbloquear la práctica.',
  hintNoWeakWords: 'Todavía no hay palabras difíciles.',
  startPill: 'Empezar',
  lessonLocked: (title) => `${title}, aún bloqueada`,
  lessonStart: (title) => `${title}, empezar`,
  lessonCompleted: (title, correct, total) => `${title}, completada, ${correct} de ${total}`,
  footerBasedOn: 'Curso basado en',
  footerBy: 'de Sonja Lang',
  // Settings
  settings: 'Configuración',
  closeSettings: 'Cerrar configuración',
  language: 'Idioma',
  // Lesson introduction
  backToLessons: 'Volver a las lecciones',
  sourceLabel: (chapter) => (chapter === 'Diccionario' ? 'Extra: palabras del diccionario' : `Libro: ${chapter}`),
  exerciseCount: (n) => plural(n, 'ejercicio', 'ejercicios'),
  newWords: 'Palabras nuevas',
  start: 'Empezar',
  // Exercises
  quitLesson: 'Salir de la lección',
  lessonProgress: 'Progreso de la lección',
  quitPractice: 'Salir de la práctica',
  practiceProgress: 'Progreso de la práctica',
  chooseMeaning: 'Elige el significado',
  chooseTokiPona: 'Elige en toki pona',
  writeInStudyLanguage: 'Escribe esto en español',
  writeInTokiPona: 'Escribe esto en toki pona',
  options: 'Opciones',
  yourAnswer: 'Tu respuesta',
  wordBank: 'Banco de palabras',
  tileHint: 'Toca para quitar. Arrastra o usa las flechas izquierda y derecha para mover.',
  grammarTag: 'Gramática',
  check: 'Comprobar',
  // Feedback and explanations
  correct: 'Correcto.',
  notQuite: 'No del todo',
  correctAnswer: 'Solución correcta:',
  why: '¿Por qué?',
  hide: 'Ocultar',
  means: 'quiere decir',
  wordMeaningSeparator: ': ',
  fromLesson: (lesson) => `Fuente: ${lesson}`,
  continue: 'Continuar',
  // Leave dialog
  leaveLessonTitle: '¿Salir de esta lección?',
  leaveLessonMessage: 'Tu progreso en esta lección se perderá.',
  leavePracticeTitle: '¿Salir de esta práctica?',
  leavePracticeMessage: 'Tu progreso en esta práctica se perderá.',
  keepLearning: 'Seguir aprendiendo',
  leave: 'Salir',
  // Summary
  lessonComplete: '¡Lección completada!',
  replayLesson: 'Repetir lección',
  practiceComplete: '¡Práctica completada!',
  practiseAgain: 'Practicar otra vez',
  dailyGoalMet: 'Meta diaria cumplida',
  statCorrect: 'Aciertos',
  statUnlocked: 'Desbloqueada',
  statStreak: 'Racha',
  dayCount: (n) => plural(n, 'día', 'días'),
  subtitlePractice: 'Práctica',
  subtitleWeakWords: 'Palabras difíciles',
}

export const strings: Record<Language, Strings> = { en, 'pt-BR': ptBR, fr, es }
