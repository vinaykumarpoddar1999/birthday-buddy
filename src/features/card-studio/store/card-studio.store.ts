import { create } from 'zustand';

import { cardStudioPrefsService } from '@/services/card/card-studio-prefs.service';

import { templateRegistry } from '../templates/registry/template-registry';
import { applyQuickDesign as runQuickDesign } from '../utils/quick-design';
import type {
  CanvasFormat,
  CardBackground,
  CardElement,
  CardTemplate,
  Draft,
  EditorMode,
  EditorPanel,
  EditorSnapshot,
  FilterState,
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
  theme: 'party',
};

const DEFAULT_FILTERS: FilterState = {
  occasion: [],
  style: [],
  isPremiumOnly: false,
  isFreeOnly: false,
};

const MAX_HISTORY = 40;

function cloneSnapshot(s: EditorSnapshot): EditorSnapshot {
  return {
    elements: s.elements.map((el) => ({ ...el })),
    customBackground: s.customBackground ? { ...s.customBackground, effects: s.customBackground.effects?.map((e) => ({ ...e })) } : null,
    personalization: { ...s.personalization },
    canvasFormat: s.canvasFormat,
  };
}

function getSnapshot(state: Pick<CardStudioState, 'elements' | 'customBackground' | 'personalization' | 'canvasFormat'>): EditorSnapshot {
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
  filters: FilterState;
  favoriteTemplateIds: string[];
  recentTemplateIds: string[];
  drafts: Draft[];
  history: EditorSnapshot[];
  historyIndex: number;
  uploadedPhotoUri: string | null;
  preFilledPersonId: string | null;
  customBackground: CardBackground | null;
  canvasFormat: CanvasFormat;
  editorMode: EditorMode;
  activePanel: EditorPanel;
  isDragging: boolean;
  recentColors: string[];
  recentBackgrounds: CardBackground[];
  autoSaveDraftId: string | null;
  creationCount: number;
  lastSavedAt: string | null;

  setStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  prevStep: () => void;

  selectTemplate: (template: CardTemplate) => void;
  clearTemplate: () => void;

  updatePersonalization: (updates: Partial<PersonalizationData>, trackHistory?: boolean) => void;
  resetPersonalization: () => void;

  addElement: (element: CardElement) => void;
  updateElement: (id: string, updates: Partial<CardElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  duplicateElement: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  toggleElementLock: (id: string) => void;
  toggleElementVisibility: (id: string) => void;

  setCustomBackground: (bg: CardBackground | null, trackHistory?: boolean) => void;
  setCanvasFormat: (format: CanvasFormat) => void;
  setEditorMode: (mode: EditorMode) => void;
  setActivePanel: (panel: EditorPanel) => void;
  setIsDragging: (dragging: boolean) => void;

  addRecentColor: (color: string) => void;
  addRecentBackground: (bg: CardBackground) => void;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  toggleFavorite: (templateId: string) => void;
  addRecent: (templateId: string) => void;

  saveDraft: (name?: string) => string;
  autoSave: () => void;
  loadDraft: (draftId: string) => void;
  deleteDraft: (draftId: string) => void;

  applyQuickDesign: () => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  setUploadedPhoto: (uri: string | null) => void;
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
  filters: { ...DEFAULT_FILTERS },
  favoriteTemplateIds: [],
  recentTemplateIds: [],
  drafts: [],
  history: [],
  historyIndex: -1,
  uploadedPhotoUri: null,
  preFilledPersonId: null,
  customBackground: null,
  canvasFormat: 'portrait',
  editorMode: 'quick',
  activePanel: 'quick',
  isDragging: false,
  recentColors: [],
  recentBackgrounds: [],
  autoSaveDraftId: null,
  creationCount: 0,
  lastSavedAt: null,

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
    const snapshot = cloneSnapshot({
      elements,
      customBackground: null,
      personalization: get().personalization,
      canvasFormat: template.layout || 'portrait',
    });
    set({
      selectedTemplate: template,
      elements,
      customBackground: null,
      canvasFormat: template.layout || 'portrait',
      currentStep: 2,
      editorMode: 'quick',
      activePanel: 'quick',
      history: [snapshot],
      historyIndex: 0,
      selectedElementId: null,
    });
    get().addRecent(template.id);
  },

  clearTemplate: () =>
    set({ selectedTemplate: null, elements: [], history: [], historyIndex: -1 }),

  updatePersonalization: (updates, trackHistory = false) => {
    set((s) => ({ personalization: { ...s.personalization, ...updates } }));
    if (trackHistory) get().pushHistory();
  },

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

  selectElement: (id) => {
    set({ selectedElementId: id, activePanel: id ? get().activePanel : get().activePanel });
  },

  duplicateElement: (id) => {
    const el = get().elements.find((e) => e.id === id);
    if (!el) return;
    const maxZ = Math.max(...get().elements.map((e) => e.zIndex), 0);
    const copy: CardElement = {
      ...el,
      id: `el-${Date.now()}`,
      x: el.x + 12,
      y: el.y + 12,
      zIndex: maxZ + 1,
    };
    set((s) => ({ elements: [...s.elements, copy], selectedElementId: copy.id }));
    get().pushHistory();
  },

  bringForward: (id) => {
    const els = [...get().elements];
    const idx = els.findIndex((e) => e.id === id);
    if (idx < 0) return;
    const maxZ = Math.max(...els.map((e) => e.zIndex));
    els[idx] = { ...els[idx], zIndex: maxZ + 1 };
    set({ elements: els });
    get().pushHistory();
  },

  sendBackward: (id) => {
    const els = [...get().elements];
    const idx = els.findIndex((e) => e.id === id);
    if (idx < 0) return;
    const minZ = Math.min(...els.map((e) => e.zIndex));
    els[idx] = { ...els[idx], zIndex: Math.max(0, minZ - 1) };
    set({ elements: els });
    get().pushHistory();
  },

  toggleElementLock: (id) => {
    set((s) => ({
      elements: s.elements.map((el) =>
        el.id === id ? { ...el, locked: !el.locked } : el,
      ),
    }));
    get().pushHistory();
  },

  toggleElementVisibility: (id) => {
    set((s) => ({
      elements: s.elements.map((el) =>
        el.id === id ? { ...el, visible: !el.visible } : el,
      ),
    }));
    get().pushHistory();
  },

  setCustomBackground: (bg, trackHistory = true) => {
    set({ customBackground: bg });
    if (bg?.type === 'solid' && typeof bg.value === 'string') {
      get().addRecentColor(bg.value);
    }
    if (bg) get().addRecentBackground(bg);
    if (trackHistory) get().pushHistory();
  },

  setCanvasFormat: (format) => {
    set({ canvasFormat: format });
    get().pushHistory();
  },

  setEditorMode: (mode) =>
    set({
      editorMode: mode,
      activePanel: mode === 'quick' ? 'quick' : 'elements',
      selectedElementId: null,
    }),

  setActivePanel: (panel) =>
    set((s) => {
      if (s.editorMode === 'quick' && panel !== 'quick' && panel !== 'none') {
        return { editorMode: 'advanced', activePanel: panel };
      }
      return { activePanel: panel };
    }),

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
  setFilters: (updates) => set((s) => ({ filters: { ...s.filters, ...updates } })),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

  toggleFavorite: (templateId) =>
    set((s) => {
      const favoriteTemplateIds = s.favoriteTemplateIds.includes(templateId)
        ? s.favoriteTemplateIds.filter((i) => i !== templateId)
        : [...s.favoriteTemplateIds, templateId];
      void cardStudioPrefsService.saveFavorites(favoriteTemplateIds);
      return { favoriteTemplateIds };
    }),

  addRecent: (templateId) =>
    set((s) => {
      const recentTemplateIds = [templateId, ...s.recentTemplateIds.filter((i) => i !== templateId)].slice(0, 20);
      void cardStudioPrefsService.saveRecents(recentTemplateIds);
      return { recentTemplateIds };
    }),

  saveDraft: (name) => {
    const s = get();
    const id = s.autoSaveDraftId || `draft-${Date.now()}`;
    const now = new Date().toISOString();
    const draft: Draft = {
      id,
      name: name || `Card for ${s.personalization.recipientName || 'Someone special'}`,
      templateId: s.selectedTemplate?.id || '',
      personalization: { ...s.personalization },
      elements: s.elements.map((el) => ({ ...el })),
      customBackground: s.customBackground ? { ...s.customBackground } : null,
      canvasFormat: s.canvasFormat,
      editorMode: s.editorMode,
      createdAt: s.drafts.find((d) => d.id === id)?.createdAt || now,
      updatedAt: now,
    };
    const drafts = s.autoSaveDraftId
      ? s.drafts.map((d) => (d.id === id ? draft : d))
      : [...s.drafts, draft];
    void cardStudioPrefsService.saveDrafts(drafts);
    set({ drafts, autoSaveDraftId: id, lastSavedAt: now });
    return id;
  },

  autoSave: () => {
    const s = get();
    if (!s.selectedTemplate || s.currentStep !== 2) return;
    get().saveDraft();
  },

  loadDraft: (draftId) => {
    const draft = get().drafts.find((d) => d.id === draftId);
    if (!draft) return;
    const template = templateRegistry.getTemplate(draft.templateId);
    if (!template) return;
    const snapshot = cloneSnapshot({
      elements: draft.elements.map((el) => ({ ...el })),
      customBackground: draft.customBackground ?? null,
      personalization: { ...draft.personalization },
      canvasFormat: draft.canvasFormat || template.layout || 'portrait',
    });
    set({
      selectedTemplate: template,
      personalization: { ...draft.personalization },
      elements: draft.elements.map((el) => ({ ...el })),
      customBackground: draft.customBackground ?? null,
      canvasFormat: draft.canvasFormat || template.layout || 'portrait',
      editorMode: draft.editorMode || 'quick',
      currentStep: 2,
      history: [snapshot],
      historyIndex: 0,
      autoSaveDraftId: draft.id,
      selectedElementId: null,
      activePanel: draft.editorMode === 'advanced' ? 'background' : 'quick',
    });
  },

  deleteDraft: (draftId) =>
    set((s) => {
      const drafts = s.drafts.filter((d) => d.id !== draftId);
      void cardStudioPrefsService.saveDrafts(drafts);
      return {
        drafts,
        autoSaveDraftId: s.autoSaveDraftId === draftId ? null : s.autoSaveDraftId,
      };
    }),

  applyQuickDesign: () => {
    const s = get();
    if (!s.selectedTemplate) return;
    const theme = s.personalization.theme || 'party';
    const result = runQuickDesign(s.selectedTemplate, s.personalization, theme);
    set({
      elements: result.elements,
      customBackground: result.background,
      editorMode: 'quick',
      activePanel: 'quick',
      selectedElementId: null,
    });
    get().pushHistory();
  },

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

  setUploadedPhoto: (uri) => {
    set({ uploadedPhotoUri: uri });
    if (uri) {
      set((s) => ({
        personalization: { ...s.personalization, photoUri: uri },
      }));
    }
  },
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
      preFilledPersonId: get().preFilledPersonId,
      customBackground: null,
      canvasFormat: 'portrait',
      editorMode: 'quick',
      activePanel: 'quick',
      isDragging: false,
      autoSaveDraftId: null,
      lastSavedAt: null,
    }),
}));
