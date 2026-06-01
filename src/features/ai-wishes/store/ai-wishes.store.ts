import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  GeneratedWish,
  SavedWishTemplate,
  WishHistoryEntry,
  WishLanguage,
  WishLength,
  WishTabId,
  WishTone,
} from '../types';

interface AIWishesState {
  activeTab: WishTabId;
  selectedPersonId: string | null;

  selectedTone: WishTone;
  selectedLength: WishLength;
  selectedLanguage: WishLanguage;
  personalContext: string;

  currentWish: GeneratedWish | null;
  generatedWishes: GeneratedWish[];
  generationCount: number;
  isGenerating: boolean;

  history: WishHistoryEntry[];
  favorites: WishHistoryEntry[];
  savedTemplates: SavedWishTemplate[];

  credits: number;

  setActiveTab: (tab: WishTabId) => void;
  setSelectedPersonId: (id: string | null) => void;

  setTone: (tone: WishTone) => void;
  setLength: (length: WishLength) => void;
  setLanguage: (language: WishLanguage) => void;
  setPersonalContext: (context: string) => void;

  setCurrentWish: (wish: GeneratedWish | null) => void;
  addGeneratedWish: (wish: GeneratedWish) => void;
  updateCurrentWishText: (text: string) => void;
  setIsGenerating: (v: boolean) => void;

  addToHistory: (wish: WishHistoryEntry) => void;
  toggleFavorite: (wishId: string) => void;
  deleteFromHistory: (wishId: string) => void;
  markShared: (wishId: string, via: string) => void;

  saveTemplate: (template: SavedWishTemplate) => void;
  deleteTemplate: (id: string) => void;

  useCredit: () => boolean;

  reset: () => void;
}

export const useAIWishesStore = create<AIWishesState>()(
  persist(
    (set, get) => ({
      activeTab: 'generate',
      selectedPersonId: null,

      selectedTone: 'heartfelt',
      selectedLength: 'medium',
      selectedLanguage: 'english',
      personalContext: '',

      currentWish: null,
      generatedWishes: [],
      generationCount: 0,
      isGenerating: false,

      history: [],
      favorites: [],
      savedTemplates: [],

      credits: 24,

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedPersonId: (id) => set({ selectedPersonId: id }),

      setTone: (tone) => set({ selectedTone: tone }),
      setLength: (length) => set({ selectedLength: length }),
      setLanguage: (language) => set({ selectedLanguage: language }),
      setPersonalContext: (context) => set({ personalContext: context }),

      setCurrentWish: (wish) => set({ currentWish: wish }),

      addGeneratedWish: (wish) =>
        set((s) => ({
          generatedWishes: [wish, ...s.generatedWishes].slice(0, 50),
          currentWish: wish,
          generationCount: s.generationCount + 1,
        })),

      updateCurrentWishText: (text) =>
        set((s) => {
          if (!s.currentWish) return {};
          const updated = { ...s.currentWish, text, isEdited: true };
          return {
            currentWish: updated,
            generatedWishes: s.generatedWishes.map((w) =>
              w.id === updated.id ? updated : w,
            ),
          };
        }),

      setIsGenerating: (v) => set({ isGenerating: v }),

      addToHistory: (wish) =>
        set((s) => ({
          history: [wish, ...s.history.filter((h) => h.id !== wish.id)].slice(0, 200),
        })),

      toggleFavorite: (wishId) =>
        set((s) => {
          const inHistory = s.history.find((h) => h.id === wishId);
          if (!inHistory) return {};

          const toggled = { ...inHistory, isFavorite: !inHistory.isFavorite };
          const updatedHistory = s.history.map((h) =>
            h.id === wishId ? toggled : h,
          );
          const updatedFavorites = toggled.isFavorite
            ? [toggled, ...s.favorites.filter((f) => f.id !== wishId)]
            : s.favorites.filter((f) => f.id !== wishId);
          const updatedCurrent =
            s.currentWish?.id === wishId
              ? { ...s.currentWish, isFavorite: toggled.isFavorite }
              : s.currentWish;

          return {
            history: updatedHistory,
            favorites: updatedFavorites,
            currentWish: updatedCurrent,
          };
        }),

      deleteFromHistory: (wishId) =>
        set((s) => ({
          history: s.history.filter((h) => h.id !== wishId),
          favorites: s.favorites.filter((f) => f.id !== wishId),
        })),

      markShared: (wishId, via) =>
        set((s) => ({
          history: s.history.map((h) =>
            h.id === wishId
              ? { ...h, sharedVia: [...(h.sharedVia || []), via] }
              : h,
          ),
        })),

      saveTemplate: (template) =>
        set((s) => ({
          savedTemplates: [template, ...s.savedTemplates].slice(0, 50),
        })),

      deleteTemplate: (id) =>
        set((s) => ({
          savedTemplates: s.savedTemplates.filter((t) => t.id !== id),
        })),

      useCredit: () => {
        const s = get();
        if (s.credits <= 0) return false;
        set({ credits: s.credits - 1 });
        return true;
      },

      reset: () =>
        set({
          selectedTone: 'heartfelt',
          selectedLength: 'medium',
          selectedLanguage: 'english',
          personalContext: '',
          currentWish: null,
          generatedWishes: [],
          generationCount: 0,
          isGenerating: false,
        }),
    }),
    {
      name: 'ai-wishes-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        history: s.history,
        favorites: s.favorites,
        savedTemplates: s.savedTemplates,
        credits: s.credits,
      }),
    },
  ),
);
