import { create } from "zustand";

interface SelectedCard {
  cardId: number;
  position: 1 | 2 | 3;
  isReversed: boolean;
}

interface ReadingState {
  concern: string;
  selectedCards: SelectedCard[];
  setConcern: (concern: string) => void;
  addCard: (cardId: number) => void;
  removeCard: (cardId: number) => void;
  reset: () => void;
}

export const useReadingStore = create<ReadingState>((set, get) => ({
  concern: "",
  selectedCards: [],
  setConcern: (concern) => set({ concern }),
  addCard: (cardId) => {
    const { selectedCards } = get();
    if (selectedCards.length >= 3) return;
    if (selectedCards.find((c) => c.cardId === cardId)) return;
    const position = (selectedCards.length + 1) as 1 | 2 | 3;
    const isReversed = Math.random() < 0.3;
    set({ selectedCards: [...selectedCards, { cardId, position, isReversed }] });
  },
  removeCard: (cardId) =>
    set((state) => {
      const filtered = state.selectedCards.filter((c) => c.cardId !== cardId);
      return {
        selectedCards: filtered.map((c, i) => ({
          ...c,
          position: (i + 1) as 1 | 2 | 3,
        })),
      };
    }),
  reset: () => set({ concern: "", selectedCards: [] }),
}));
