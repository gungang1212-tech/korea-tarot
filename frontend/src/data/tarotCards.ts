export interface TarotCardData {
  id: number;
  name_ko: string;
  name_en: string;
  arcana: "major" | "minor";
  suit?: string;
  number: number;
  symbol: string;
}

const MAJOR_ARCANA: TarotCardData[] = [
  { id: 1,  name_ko: "바보",          name_en: "The Fool",            arcana: "major", number: 0,  symbol: "☆" },
  { id: 2,  name_ko: "마법사",        name_en: "The Magician",        arcana: "major", number: 1,  symbol: "✦" },
  { id: 3,  name_ko: "여사제",        name_en: "The High Priestess",  arcana: "major", number: 2,  symbol: "☽" },
  { id: 4,  name_ko: "여황제",        name_en: "The Empress",         arcana: "major", number: 3,  symbol: "♀" },
  { id: 5,  name_ko: "황제",          name_en: "The Emperor",         arcana: "major", number: 4,  symbol: "♂" },
  { id: 6,  name_ko: "교황",          name_en: "The Hierophant",      arcana: "major", number: 5,  symbol: "⛪" },
  { id: 7,  name_ko: "연인",          name_en: "The Lovers",          arcana: "major", number: 6,  symbol: "♡" },
  { id: 8,  name_ko: "전차",          name_en: "The Chariot",         arcana: "major", number: 7,  symbol: "⚔" },
  { id: 9,  name_ko: "힘",            name_en: "Strength",            arcana: "major", number: 8,  symbol: "∞" },
  { id: 10, name_ko: "은둔자",        name_en: "The Hermit",          arcana: "major", number: 9,  symbol: "🕯" },
  { id: 11, name_ko: "운명의 수레바퀴", name_en: "Wheel of Fortune",  arcana: "major", number: 10, symbol: "⊕" },
  { id: 12, name_ko: "정의",          name_en: "Justice",             arcana: "major", number: 11, symbol: "⚖" },
  { id: 13, name_ko: "매달린 남자",   name_en: "The Hanged Man",      arcana: "major", number: 12, symbol: "☿" },
  { id: 14, name_ko: "죽음",          name_en: "Death",               arcana: "major", number: 13, symbol: "⚸" },
  { id: 15, name_ko: "절제",          name_en: "Temperance",          arcana: "major", number: 14, symbol: "⧖" },
  { id: 16, name_ko: "악마",          name_en: "The Devil",           arcana: "major", number: 15, symbol: "♰" },
  { id: 17, name_ko: "탑",            name_en: "The Tower",           arcana: "major", number: 16, symbol: "⚡" },
  { id: 18, name_ko: "별",            name_en: "The Star",            arcana: "major", number: 17, symbol: "★" },
  { id: 19, name_ko: "달",            name_en: "The Moon",            arcana: "major", number: 18, symbol: "☾" },
  { id: 20, name_ko: "태양",          name_en: "The Sun",             arcana: "major", number: 19, symbol: "☀" },
  { id: 21, name_ko: "심판",          name_en: "Judgement",           arcana: "major", number: 20, symbol: "☗" },
  { id: 22, name_ko: "세계",          name_en: "The World",           arcana: "major", number: 21, symbol: "◎" },
];

function minorCards(suit: string, suitKo: string, startId: number): TarotCardData[] {
  const names = ["에이스","2","3","4","5","6","7","8","9","10","시종","기사","여왕","왕"];
  const namesEn = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Page","Knight","Queen","King"];
  const symbols: Record<string, string> = {
    Wands: "🔥", Cups: "💧", Swords: "⚡", Pentacles: "⭐",
  };
  return names.map((n, i) => ({
    id: startId + i,
    name_ko: `${suitKo}의 ${n}`,
    name_en: `${namesEn[i]} of ${suit}`,
    arcana: "minor" as const,
    suit,
    number: i + 1,
    symbol: symbols[suit] ?? "◆",
  }));
}

export const ALL_TAROT_CARDS: TarotCardData[] = [
  ...MAJOR_ARCANA,
  ...minorCards("Wands",    "완드",   23),
  ...minorCards("Cups",     "컵",     37),
  ...minorCards("Swords",   "소드",   51),
  ...minorCards("Pentacles","펜타클", 65),
];

export const SUIT_COLORS: Record<string, string> = {
  Wands:     "from-orange-900 to-red-900",
  Cups:      "from-blue-900 to-cyan-900",
  Swords:    "from-slate-800 to-gray-900",
  Pentacles: "from-emerald-900 to-green-900",
};
