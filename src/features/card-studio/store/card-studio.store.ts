import { create } from 'zustand';

import type {
  CanvasFormat,
  CardBackground,
  CardElement,
  CardTemplate,
  EditorPanel,
  EditorSnapshot,
  PersonalizationData,
} from '../types';

const DEFAULT_PERSONALIZATION: PersonalizationData = {
  recipientName: '',
  senderName: '',
  relationship: '',
  age: '',
  message: '',
  quote: '',
  eventType: 'birthday',
  date: '',
  location: '',
  signature: '',
  additionalNote: '',
  photoUri: undefined,
  theme: undefined,
};

const MAX_HISTORY = 40;

function cloneSnapshot(s: EditorSnapshot): EditorSnapshot {
  return {
    elements: s.elements.map((el) => ({ ...el })),
    customBackground: s.customBackground
      ? { ...s.customBackground, effects: s.customBackground.effects?.map((e) => ({ ...e })) }
      : null,
    personalization: { ...s.personalization },
    canvasFormat: s.canvasFormat,
  };
}

function getSnapshot(
  state: Pick<CardStudioState, 'elements' | 'customBackground' | 'personalization' | 'canvasFormat'>,
): EditorSnapshot {
  return cloneSnapshot({
    elements: state.elements,
    customBackground: state.customBackground,
    personalization: state.personalization,
    canvasFormat: state.canvasFormat,
  });
}

interface CardStudioState {
  currentStep: 1 | 2 | 3 | 4;
  selectedTemplate: CardTemplate | null;
  personalization: PersonalizationData;
  elements: CardElement[];
  selectedElementId: string | null;
  searchQuery: string;
  selectedCategory: string;
  history: EditorSnapshot[];
  historyIndex: number;
  preFilledPersonId: string | null;
  personPrefillApplied: boolean;
  customBackground: CardBackground | null;
  canvasFormat: CanvasFormat;
  activePanel: EditorPanel;
  isDragging: boolean;
  recentColors: string[];
  recentBackgrounds: CardBackground[];
  selectedTemplatePreviewId: string | null;

  setStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  prevStep: () => void;

  selectTemplate: (template: CardTemplate) => void;
  setSelectedTemplatePreviewId: (id: string | null) => void;
  clearTemplate: () => void;

  updatePersonalization: (updates: Partial<PersonalizationData>, trackHistory?: boolean) => void;
  resetPersonalization: () => void;

  addElement: (element: CardElement) => void;
  updateElement: (id: string, updates: Partial<CardElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;

  setCustomBackground: (bg: CardBackground | null, trackHistory?: boolean) => void;
  setActivePanel: (panel: EditorPanel) => void;
  setIsDragging: (dragging: boolean) => void;

  addRecentColor: (color: string) => void;
  addRecentBackground: (bg: CardBackground) => void;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  setPreFilledPersonId: (id: string | null) => void;
  reset: () => void;
}

export const useCardStudioStore = create<CardStudioState>()((set, get) => ({
  currentStep: 1,
  selectedTemplate: null,
  personalization: { ...DEFAULT_PERSONALIZATION },
  elements: [],
  selectedElementId: null,
  searchQuery: '',
  selectedCategory: 'all',
  history: [],
  historyIndex: -1,
  preFilledPersonId: null,
  personPrefillApplied: false,
  customBackground: null,
  canvasFormat: 'portrait',
  activePanel: 'content',
  isDragging: false,
  recentColors: [],
  recentBackgrounds: [],
  selectedTemplatePreviewId: null,

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
    const preFilledPersonId = get().preFilledPersonId;
    const personalization = preFilledPersonId
      ? get().personalization
      : { ...DEFAULT_PERSONALIZATION };
    const snapshot = cloneSnapshot({
      elements,
      customBackground: null,
      personalization,
      canvasFormat: template.layout || 'portrait',
    });
    set({
      selectedTemplate: template,
      selectedTemplatePreviewId: template.id,
      personalization,
      elements,
      customBackground: null,
      canvasFormat: template.layout || 'portrait',
      currentStep: 2,
      activePanel: 'content',
      history: [snapshot],
      historyIndex: 0,
      selectedElementId: null,
    });
  },

  setSelectedTemplatePreviewId: (id) => set({ selectedTemplatePreviewId: id }),

  clearTemplate: () =>
    set({ selectedTemplate: null, elements: [], history: [], historyIndex: -1 }),

  updatePersonalization: (updates, trackHistory = false) => {
    set((s) => ({ personalization: { ...s.personalization, ...updates } }));
    if (trackHistory) get().pushHistory();
  },

  resetPersonalization: () => set({ personalization: { ...DEFAULT_PERSONALIZATION } }),

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

  setCustomBackground: (bg, trackHistory = true) => {
    set({ customBackground: bg });
    if (bg?.type === 'solid' && typeof bg.value === 'string') {
      get().addRecentColor(bg.value);
    }
    if (bg) get().addRecentBackground(bg);
    if (trackHistory) get().pushHistory();
  },

  setActivePanel: (panel) => set({ activePanel: panel }),

  setIsDragging: (dragging) => set({ isDragging: dragging }),

  addRecentColor: (color) =>
    set((s) => ({
      recentColors: [color, ...s.recentColors.filter((c) => c !== color)].slice(0, 12),
    })),

  addRecentBackground: (bg) =>
    set((s) => ({
      recentBackgrounds: [bg, ...s.recentBackgrounds].slice(0, 8),
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  pushHistory: () =>
    set((s) => {
      const snap = getSnapshot(s);
      const h = s.history.slice(0, s.historyIndex + 1);
      h.push(snap);
      if (h.length > MAX_HISTORY) h.shift();
      return { history: h, historyIndex: h.length - 1 };
    }),

  undo: () => {
    const s = get();
    if (s.historyIndex <= 0) return;
    const idx = s.historyIndex - 1;
    const snap = cloneSnapshot(s.history[idx]);
    set({
      elements: snap.elements,
      customBackground: snap.customBackground,
      personalization: snap.personalization,
      canvasFormat: snap.canvasFormat,
      historyIndex: idx,
    });
  },

  redo: () => {
    const s = get();
    if (s.historyIndex >= s.history.length - 1) return;
    const idx = s.historyIndex + 1;
    const snap = cloneSnapshot(s.history[idx]);
    set({
      elements: snap.elements,
      customBackground: snap.customBackground,
      personalization: snap.personalization,
      canvasFormat: snap.canvasFormat,
      historyIndex: idx,
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  setPreFilledPersonId: (id) =>
    set({ preFilledPersonId: id, personPrefillApplied: false }),

  reset: () =>
    set({
      currentStep: 1,
      selectedTemplate: null,
      selectedTemplatePreviewId: null,
      personalization: { ...DEFAULT_PERSONALIZATION },
      elements: [],
      selectedElementId: null,
      searchQuery: '',
      selectedCategory: 'all',
      history: [],
      historyIndex: -1,
      preFilledPersonId: null,
      personPrefillApplied: false,
      customBackground: null,
      canvasFormat: 'portrait',
      activePanel: 'content',
      isDragging: false,
    }),
}));
