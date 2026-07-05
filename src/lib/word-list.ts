// TLJ pâtisserie-themed Mongolian 5-letter words
// All words are exactly 5 Cyrillic letters

export const WORD_LIST: readonly string[] = [
  'САХАР',
  'БЯЛАНЗ',
  'ГҮЛЭЭН',
  'БҮТЭЭЛ',
  'ШИРНЭ',
  'ТОСОН',
  'ХАЛУУН',
  'ЗУУСА',
  'МӨЧРӨН',
  'ХООРОН',
  'ДҮРСЭН',
  'ХӨРӨНГ',
  'ОЧИРН',
  'БҮЛЭЭН',
  'ХҮРЭНЦ',
  'НАМАРН',
  'БЭЛЭНН',
  'ТОМОРН',
  'БАГАНН',
  'ХАШААН',
  'СОНСОН',
  'ОРШОН',
  'ҮЛГЭРН',
  'ДООРД',
  'ХҮЧДҮҮ',
  'БЭРДЭН',
  'ЯВДАЛ',
  'НЭРДЭН',
  'ХОШУУН',
  'ОРДООН',
  'ДУЛДУУ',
] as const

export const MAX_ATTEMPTS = 6
export const WORD_LENGTH = 5

export function getRandomWord(): string {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
}

export function isValidWord(word: string): boolean {
  return word.length === WORD_LENGTH && WORD_LIST.includes(word.toUpperCase())
}
