import { create } from 'zustand';

import { cardStudioPrefsService } from '@/services/card/card-studio-prefs.service';
import { profileService } from '@/services/profile/profile.service';

import type {
  GeneratedWish,
  SavedWishTemplate,
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
  generationCount: number;
  isGenerating: boolean;

  savedTemplates: SavedWishTemplate[];
  credits: number;

  setActiveTab: (tab: WishTabId) => void;
  setSelectedPersonId: (id: string | null) => void;

  setTone: (tone: WishTone) => void;
  setLength: (length: WishLength) => void;
  setLanguage: (language: WishLanguage) => void;
  setPersonalContext: (context: string) => void;

  setCurrentWish: (wish: GeneratedWish | null) => void;
  incrementGenerationCount: () => void;
  updateCurrentWishText: (text: string) => void;
  setIsGenerating: (v: boolean) => void;

  saveTemplate: (template: SavedWishTemplate) => void;
  deleteTemplate: (id: string) => void;

  useCredit: () => boolean;

  reset: () => void;
}

export const useAIWishesStore = create<AIWishesState>()((set, get) => ({
  activeTab: 'generate',
  selectedPersonId: null,

  selectedTone: 'heartfelt',
  selectedLength: 'medium',
  selectedLanguage: 'english',
  personalContext: '',

  currentWish: null,
  generationCount: 0,
  isGenerating: false,

  savedTemplates: [],
  credits: 24,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedPersonId: (id) => set({ selectedPersonId: id }),

  setTone: (tone) => set({ selectedTone: tone }),
  setLength: (length) => set({ selectedLength: length }),
  setLanguage: (language) => set({ selectedLanguage: language }),
  setPersonalContext: (context) => set({ personalContext: context }),

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

  saveTemplate: (template) =>
    set((s) => {
      const savedTemplates = [template, ...s.savedTemplates].slice(0, 50);
      void cardStudioPrefsService.saveAiTemplates(savedTemplates);
      return { savedTemplates };
    }),

  deleteTemplate: (id) =>
    set((s) => {
      const savedTemplates = s.savedTemplates.filter((t) => t.id !== id);
      void cardStudioPrefsService.saveAiTemplates(savedTemplates);
      return { savedTemplates };
    }),

  useCredit: () => {
    const s = get();
    if (s.credits <= 0) return false;
    const credits = s.credits - 1;
    set({ credits });
    void profileService.saveBundle({ aiCredits: credits });
    return true;
  },

  reset: () =>
    set({
      selectedTone: 'heartfelt',
      selectedLength: 'medium',
      selectedLanguage: 'english',
      personalContext: '',
      currentWish: null,
      generationCount: 0,
      isGenerating: false,
    }),
}));
