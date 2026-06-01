import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  CardElement,
  CardTemplate,
  Draft,
  FilterState,
  PersonalizationData,
} from '../types';

const DEFAULT_PERSONALIZATION: PersonalizationData = {
  recipientName: 'Riya',
  senderName: '',
  relationship: '',
  age: '',
  message: '',
  quote: '',
  emoji: 'icon:cake',
  eventType: 'birthday',
  date: '',
  location: '',
  signature: '',
  additionalNote: '',
  photoUri: undefined,
};

const DEFAULT_FILTERS: FilterState = {
  occasion: [],
  style: [],
  isPremiumOnly: false,
  isFreeOnly: false,
};

interface CardStudioState {
  currentStep: 1 | 2 | 3 | 4;
  selectedTemplate: CardTemplate | null;
  personalization: PersonalizationData;
  elements: CardElement[];
  selectedElementId: string | null;
  searchQuery: string;
  selectedCategory: string;
  filters: FilterState;
  favoriteTemplateIds: string[];
  recentTemplateIds: string[];
  drafts: Draft[];
  history: CardElement[][];
  historyIndex: number;
  uploadedPhotoUri: string | null;
  preFilledPersonId: string | null;

  setStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  prevStep: () => void;

  selectTemplate: (template: CardTemplate) => void;
  clearTemplate: () => void;

  updatePersonalization: (updates: Partial<PersonalizationData>) => void;
  resetPersonalization: () => void;

  addElement: (element: CardElement) => void;
  updateElement: (id: string, updates: Partial<CardElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  toggleFavorite: (templateId: string) => void;
  addRecent: (templateId: string) => void;

  saveDraft: (name?: string) => string;
  loadDraft: (draftId: string) => void;
  deleteDraft: (draftId: string) => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  setUploadedPhoto: (uri: string | null) => void;
  setPreFilledPersonId: (id: string | null) => void;

  reset: () => void;
}

export const useCardStudioStore = create<CardStudioState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      selectedTemplate: null,
      personalization: { ...DEFAULT_PERSONALIZATION },
      elements: [],
      selectedElementId: null,
      searchQuery: '',
      selectedCategory: 'all',
      filters: { ...DEFAULT_FILTERS },
      favoriteTemplateIds: [],
      recentTemplateIds: [],
      drafts: [],
      history: [],
      historyIndex: -1,
      uploadedPhotoUri: null,
      preFilledPersonId: null,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 4) set({ currentStep: (currentStep + 1) as 1 | 2 | 3 | 4 });
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) set({ currentStep: (currentStep - 1) as 1 | 2 | 3 | 4 });
      },

      selectTemplate: (template) => {
        const elements = template.elements.map((el) => ({ ...el }));
        set({
          selectedTemplate: template,
          elements,
          currentStep: 2,
          history: [elements],
          historyIndex: 0,
        });
        get().addRecent(template.id);
      },

      clearTemplate: () =>
        set({ selectedTemplate: null, elements: [], history: [], historyIndex: -1 }),

      updatePersonalization: (updates) =>
        set((s) => ({ personalization: { ...s.personalization, ...updates } })),

      resetPersonalization: () =>
        set({ personalization: { ...DEFAULT_PERSONALIZATION } }),

      addElement: (element) => {
        set((s) => ({ elements: [...s.elements, element] }));
        get().pushHistory();
      },

      updateElement: (id, updates) => {
        set((s) => ({
          elements: s.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
        }));
      },

      deleteElement: (id) => {
        set((s) => ({
          elements: s.elements.filter((el) => el.id !== id),
          selectedElementId: s.selectedElementId === id ? null : s.selectedElementId,
        }));
        get().pushHistory();
      },

      selectElement: (id) => set({ selectedElementId: id }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setFilters: (updates) => set((s) => ({ filters: { ...s.filters, ...updates } })),
      resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

      toggleFavorite: (templateId) =>
        set((s) => {
          const ids = s.favoriteTemplateIds;
          return {
            favoriteTemplateIds: ids.includes(templateId)
              ? ids.filter((i) => i !== templateId)
              : [...ids, templateId],
          };
        }),

      addRecent: (templateId) =>
        set((s) => ({
          recentTemplateIds: [templateId, ...s.recentTemplateIds.filter((i) => i !== templateId)].slice(0, 20),
        })),

      saveDraft: (name) => {
        const s = get();
        const id = `draft-${Date.now()}`;
        const draft: Draft = {
          id,
          name: name || `Card for ${s.personalization.recipientName}`,
          templateId: s.selectedTemplate?.id || '',
          personalization: { ...s.personalization },
          elements: s.elements.map((el) => ({ ...el })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ drafts: [...s.drafts, draft] });
        return id;
      },

      loadDraft: (draftId) => {
        const draft = get().drafts.find((d) => d.id === draftId);
        if (!draft) return;
        set({
          personalization: { ...draft.personalization },
          elements: draft.elements.map((el) => ({ ...el })),
          history: [draft.elements.map((el) => ({ ...el }))],
          historyIndex: 0,
        });
      },

      deleteDraft: (draftId) =>
        set((s) => ({ drafts: s.drafts.filter((d) => d.id !== draftId) })),

      pushHistory: () =>
        set((s) => {
          const h = s.history.slice(0, s.historyIndex + 1);
          h.push(s.elements.map((el) => ({ ...el })));
          if (h.length > 30) h.shift();
          return { history: h, historyIndex: h.length - 1 };
        }),

      undo: () => {
        const s = get();
        if (s.historyIndex <= 0) return;
        const idx = s.historyIndex - 1;
        set({ elements: s.history[idx].map((el) => ({ ...el })), historyIndex: idx });
      },

      redo: () => {
        const s = get();
        if (s.historyIndex >= s.history.length - 1) return;
        const idx = s.historyIndex + 1;
        set({ elements: s.history[idx].map((el) => ({ ...el })), historyIndex: idx });
      },

      setUploadedPhoto: (uri) => set({ uploadedPhotoUri: uri }),
      setPreFilledPersonId: (id) => set({ preFilledPersonId: id }),

      reset: () =>
        set({
          currentStep: 1,
          selectedTemplate: null,
          personalization: { ...DEFAULT_PERSONALIZATION },
          elements: [],
          selectedElementId: null,
          searchQuery: '',
          selectedCategory: 'all',
          filters: { ...DEFAULT_FILTERS },
          history: [],
          historyIndex: -1,
          uploadedPhotoUri: null,
          preFilledPersonId: null,
        }),
    }),
    {
      name: 'card-studio-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        favoriteTemplateIds: s.favoriteTemplateIds,
        recentTemplateIds: s.recentTemplateIds,
        drafts: s.drafts,
      }),
    },
  ),
);
