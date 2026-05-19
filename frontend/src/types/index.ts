export interface User {
  id: number;
  email: string;
  nickname: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CardSummary {
  id: number;
  name_ko: string;
  name_en: string;
  arcana: "major" | "minor";
  suit?: string;
  image_url?: string;
}

export interface CardInput {
  card_id: number;
  position: 1 | 2 | 3;
  is_reversed: boolean;
}

export interface CardInterpretation {
  position: number;
  position_label: string;
  card_name_ko: string;
  card_name_en: string;
  is_reversed: boolean;
  interpretation: string;
}

export interface ReadingResult {
  cards: CardInterpretation[];
  summary: string;
  advice: string;
}

export interface ReadingDetail {
  id: number;
  concern: string;
  result: ReadingResult;
  created_at: string;
}

export interface SelectedCardSummary {
  card_id: number;
  name_ko: string;
  image_url?: string;
  is_reversed: boolean;
}

export interface ReadingListItem {
  id: number;
  concern: string;
  cards: SelectedCardSummary[];
  created_at: string;
}

export interface ReadingListResponse {
  total: number;
  page: number;
  limit: number;
  items: ReadingListItem[];
}
