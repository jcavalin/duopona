/**
 * Every course word with a short English gloss (1–3 common senses).
 * Glosses are written for Duopona, consistent in meaning with the book's
 * Official Toki Pona Dictionary, not copied from it (FR-007).
 */
export const vocabulary: Record<string, string> = {
  // 1 Words and Sentences
  ijo: 'thing / object',
  jan: 'person / someone',
  kili: 'fruit / vegetable',
  lipu: 'paper / book / document',
  meli: 'woman / female',
  ni: 'this / that',
  soweli: 'animal / mammal',
  li: 'marks the predicate (after a subject other than mi / sina)',
  // 2 Nouns and Adjectives
  telo: 'water / liquid',
  tomo: 'house / building / room',
  lili: 'small / little / young',
  pona: 'good / simple / fix',
  suli: 'big / important / long',
  // 3 You and I
  mi: 'I / me / we',
  mije: 'man / male',
  sina: 'you',
  kulupu: 'group / community',
  sin: 'new / fresh / extra',
  wawa: 'strong / powerful / energy',
  // 4 Verbs
  jo: 'to have / to hold',
  kute: 'to hear / to listen / ear',
  moku: 'food / to eat / to drink',
  pali: 'to work / to make / to do',
  sona: 'to know / knowledge',
  toki: 'to talk / language / hello',
  e: 'marks the direct object',
  // 5 More Adjectives
  ala: 'not / no / none',
  ike: 'bad / wrong / complicated',
  mute: 'many / a lot / very',
  pu: 'using the official Toki Pona book',
  sewi: 'high / above / divine',
  wan: 'one / single / united',
  mama: 'parent / caretaker / origin',
  // 6 Questions and Answers
  ilo: 'tool / machine / device',
  kala: 'fish / sea animal',
  ona: 'he / she / it / they',
  anu: 'or',
  seme: 'what / which',
  // 7 Prepositions
  pana: 'to give / to send',
  tawa: 'to / toward / moving',
  lon: 'at / in / present',
  kepeken: 'using / with (a tool)',
  tan: 'from / because of',
  // 8 Greetings and Feelings
  a: 'ah! / oh! (emotion or emphasis)',
  mu: 'moo / woof (any animal sound)',
  o: 'marks a command or the person addressed',
  pilin: 'feeling / heart / to feel',
  // 9 pi
  kasi: 'plant / leaf / tree',
  sijelo: 'body / physical state',
  suno: 'sun / light / bright',
  tenpo: 'time / moment',
  awen: 'to stay / to wait / safe',
  pi: 'groups the following modifiers',
  // 10 Pre-Verbs
  kama: 'to come / to become / arriving',
  ken: 'can / to be able to / possible',
  wile: 'to want / to need / must',
  lukin: 'to see / to look / to try to',
  // 11 Colours and la
  jelo: 'yellow',
  laso: 'blue / green',
  loje: 'red',
  pimeja: 'black / dark',
  walo: 'white / pale',
  la: 'marks a context phrase',
  // 12 Spatial Nouns
  insa: 'inside / centre / stomach',
  monsi: 'back / behind',
  noka: 'leg / foot / bottom',
  poka: 'side / nearby / hip',
  sinpin: 'front / face / wall',
  // 13 Particles and Perspective
  anpa: 'below / down / humble',
  ante: 'different / other / changed',
  en: 'and (joins subjects)',
  lete: 'cold / raw',
  lupa: 'hole / door / window',
  open: 'to open / to start',
  sama: 'same / similar / like',
  suwi: 'sweet / cute',
  taso: 'only / but',
  // 14 Hunting
  alasa: 'to hunt / to gather',
  lawa: 'head / mind / to lead',
  len: 'cloth / clothing',
  linja: 'line / rope / string',
  pakala: 'broken / damaged / mistake',
  palisa: 'stick / rod / long hard thing',
  pipi: 'bug / insect',
  waso: 'bird / flying animal',
  weka: 'away / absent / to remove',
  // 15 Cooking
  lape: 'to sleep / to rest',
  olin: 'to love / love',
  pan: 'grain / bread / rice',
  pini: 'finished / past / to end',
  seli: 'fire / heat / warm',
  supa: 'table / flat surface',
  uta: 'mouth / lips',
  // 16 More Words 1
  ma: 'land / country / place',
  nasin: 'way / road / method',
  nena: 'hill / bump / nose',
  nimi: 'word / name',
  utala: 'to fight / battle',
  akesi: 'reptile / amphibian',
  jaki: 'dirty / gross / waste',
  kalama: 'sound / noise',
  kiwen: 'stone / rock / hard',
  ale: 'all / everything / life',
  esun: 'market / shop / trade',
  // 17 More Words 2
  kon: 'air / wind / spirit',
  kule: 'colour / colourful',
  mani: 'money / wealth',
  moli: 'dead / to die / death',
  mun: 'moon / night sky object',
  musi: 'fun / game / art',
  nasa: 'strange / silly / drunk',
  selo: 'skin / outer layer / shell',
  sike: 'circle / round / ball',
  sitelen: 'picture / writing / symbol',
  ko: 'paste / powder / dough',
  poki: 'box / container / bowl',
}

export function getMeaning(word: string): string | undefined {
  return Object.hasOwn(vocabulary, word) ? vocabulary[word] : undefined
}
