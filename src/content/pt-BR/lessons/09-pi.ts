import type { Lesson } from '../../types'

const lesson: Lesson = {
  id: 'pi',
  title: 'pi',
  chapter: 'Lição 11',
  newWords: ['kasi', 'sijelo', 'suno', 'tenpo', 'awen', 'tawa', 'pi'],
  grammar: {
    title: 'Agrupar palavras que descrevem com pi',
    explanation: [
      'Normalmente, cada palavra que descreve se soma a tudo o que vem antes. pi muda isso: as palavras depois de pi formam um grupo que descreve o substantivo junto.',
      'tomo kulupu suli é “uma casa comunitária grande” (a casa é grande). tomo pi kulupu suli é “a casa do grupo grande” (o grupo é grande).',
      'tawa também pode ser verbo ou palavra que descreve, com o sentido de “ir” ou “em movimento”: soweli li tawa quer dizer “o animal está se movendo”.',
    ],
  },
  exercises: [
    { id: 'kasi', type: 'multipleChoice', direction: 'tp-en', prompt: 'kasi', options: ['planta / folha / árvore', 'corpo / estado físico', 'sol / luz / brilhante'], answer: 'planta / folha / árvore' },
    { id: 'sijelo', type: 'multipleChoice', direction: 'en-tp', prompt: 'corpo / estado físico', options: ['kasi', 'sijelo', 'suno', 'tenpo'], answer: 'sijelo' },
    { id: 'suno', type: 'multipleChoice', direction: 'tp-en', prompt: 'suno', options: ['tempo / momento', 'planta / folha / árvore', 'sol / luz / brilhante'], answer: 'sol / luz / brilhante' },
    { id: 'tenpo', type: 'multipleChoice', direction: 'en-tp', prompt: 'tempo / momento', options: ['awen', 'suno', 'pi', 'tenpo'], answer: 'tenpo' },
    { id: 'awen', type: 'multipleChoice', direction: 'tp-en', prompt: 'awen', options: ['para / em direção a / em movimento', 'ficar / esperar / seguro', 'saber / conhecimento'], answer: 'ficar / esperar / seguro' },
    { id: 'soweli-li-tawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'soweli li tawa', options: ['O animal fica parado.', 'O animal está em casa.', 'O animal está se movendo.'], answer: 'O animal está se movendo.' },
    { id: 'tomo-pi-kulupu-suli', type: 'wordBank', direction: 'en-tp', prompt: 'a casa do grupo grande', answer: ['tomo', 'pi', 'kulupu', 'suli'], distractors: ['li'], practisesGrammar: true, grammarNote: 'O grupo é grande, não a casa, então pi junta kulupu suli num grupo que descreve tomo.' },
    { id: 'lipu-pi-jan-pona-li-sin', type: 'wordBank', direction: 'en-tp', prompt: 'O livro da pessoa boa é novo.', answer: ['lipu', 'pi', 'jan', 'pona', 'li', 'sin'], distractors: ['e'], practisesGrammar: true, grammarNote: 'pi faz de jan pona um grupo que descreve lipu: o livro da pessoa boa. Depois, li sin diz que ele é novo.' },
    { id: 'tenpo-pi-moku-mute', type: 'wordBank', direction: 'tp-en', prompt: 'tenpo pi moku mute', answer: ['um', 'momento', 'de', 'muita', 'comida'], distractors: ['corpo', 'ficar'] },
    { id: 'sijelo-pi-jan-wawa', type: 'multipleChoice', direction: 'tp-en', prompt: 'sijelo pi jan wawa', options: ['o corpo da pessoa forte', 'o corpo forte de uma pessoa', 'uma pessoa com um corpo'], answer: 'o corpo da pessoa forte' },
    { id: 'mi-awen-lon-tomo', type: 'wordBank', direction: 'en-tp', prompt: 'Eu fico em casa.', answer: ['mi', 'awen', 'lon', 'tomo'], distractors: ['tawa'] },
    { id: 'kasi-li-tawa', type: 'multipleChoice', direction: 'en-tp', prompt: 'A planta está se movendo.', options: ['kasi li awen', 'kasi li lon', 'kasi li tawa'], answer: 'kasi li tawa' },
  ],
}

export default lesson
