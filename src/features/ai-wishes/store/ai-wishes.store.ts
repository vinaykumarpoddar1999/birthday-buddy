import { create } from 'zustand';

import type {
  GeneratedWish,
  WishLength,
  WishTone,
} from '../types';

interface AIWishesState {
  selectedPersonId: string | null;

  selectedTone: WishTone;
  selectedLength: WishLength;

  currentWish: GeneratedWish | null;
  generationCount: number;
  isGenerating: boolean;

  setSelectedPersonId: (id: string | null) => void;

  setTone: (tone: WishTone) => void;
  setLength: (length: WishLength) => void;

  setCurrentWish: (wish: GeneratedWish | null) => void;
  incrementGenerationCount: () => void;
  updateCurrentWishText: (text: string) => void;
  setIsGenerating: (v: boolean) => void;

  reset: () => void;
}

export const useAIWishesStore = create<AIWishesState>()((set) => ({
  selectedPersonId: null,

  selectedTone: 'heartfelt',
  selectedLength: 'medium',

  currentWish: null,
  generationCount: 0,
  isGenerating: false,

  setSelectedPersonId: (id) => set({ selectedPersonId: id }),

  setTone: (tone) => set({ selectedTone: tone }),
  setLength: (length) => set({ selectedLength: length }),

  setCurrentWish: (wish) => set({ currentWish: wish }),

  incrementGenerationCount: () =>
    set((s) => ({ generationCount: s.generationCount + 1 })),

  updateCurrentWishText: (text) =>
    set((s) => {
      if (!s.currentWish) return {};
      return {
        currentWish: { ...s.currentWish, text, isEdited: true },
      };
    }),

  setIsGenerating: (v) => set({ isGenerating: v }),

  reset: () =>
    set({
      selectedTone: 'heartfelt',
      selectedLength: 'medium',
      currentWish: null,
      generationCount: 0,
      isGenerating: false,
    }),
}));
