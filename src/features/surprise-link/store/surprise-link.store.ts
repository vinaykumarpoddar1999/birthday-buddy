import { create } from 'zustand';

import { surpriseLinkService } from '@services/surprise-link/surprise-link.service';

import { generateQuestionsForOccasion } from '../data/questions';
import { getTheme } from '../data/themes';
import { createDefaultModule, createModulesFromTemplate, templateRegistry } from '../templates/template-registry';
import type {
  ExperienceModule,
  ExperiencePersonalization,
  ExperienceTemplate,
  ExperienceTheme,
  InteractiveFeature,
  InteractiveSettings,
  ModuleType,
  MusicSettings,
  Occasion,
  PreviewMode,
  RecipientType,
  StudioStep,
  SurpriseExperience,
  TemplateCategory,
  ThemeId,
  VisualEffect,
} from '../types';
import { buildShareLink, buildShortUrl, generateExperienceId, generateSlug } from '../utils/link-generator';

const DEFAULT_PERSONALIZATION: ExperiencePersonalization = {
  senderName: '',
  recipientName: '',
  nickname: '',
  relationship: '',
  occasionDate: '',
  location: '',
  specialDate: '',
  hero: {
    welcomeMessage: 'Someone created a surprise just for you ❤️',
    openingAnimation: 'gift_box',
  },
  questions: [],
};

const DEFAULT_MUSIC: MusicSettings = {
  autoPlay: false,
  volume: 0.7,
  loop: true,
};

const DEFAULT_INTERACTIVE: InteractiveSettings = {
  features: ['tap_reveal', 'swipe_stories'],
};

interface SurpriseLinkState {
  currentStep: StudioStep;
  occasion: Occasion | null;
  recipientType: RecipientType | null;
  selectedTemplate: ExperienceTemplate | null;
  personalization: ExperiencePersonalization;
  modules: ExperienceModule[];
  theme: ExperienceTheme;
  effects: VisualEffect[];
  music: MusicSettings;
  interactive: InteractiveSettings;
  previewMode: PreviewMode;
  searchQuery: string;
  selectedCategory: TemplateCategory | 'all';
  favoriteTemplateIds: string[];
  experienceId: string | null;
  slug: string | null;
  shareLink: string | null;
  shortUrl: string | null;
  personId: string | null;
  status: 'draft' | 'published';
  isGenerating: boolean;

  setStep: (step: StudioStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  setOccasion: (occasion: Occasion) => void;
  setRecipientType: (type: RecipientType) => void;
  selectTemplate: (template: ExperienceTemplate) => void;
  toggleFavoriteTemplate: (id: string) => void;

  updatePersonalization: (updates: Partial<ExperiencePersonalization>) => void;
  updateHero: (updates: Partial<ExperiencePersonalization['hero']>) => void;
  updateQuestion: (id: string, answer: string, imageUri?: string) => void;

  addModule: (type: ModuleType) => void;
  updateModule: (id: string, updates: Partial<ExperienceModule>) => void;
  removeModule: (id: string) => void;
  reorderModules: (fromIndex: number, toIndex: number) => void;

  setTheme: (themeId: ThemeId) => void;
  toggleEffect: (effect: VisualEffect) => void;
  setEffects: (effects: VisualEffect[]) => void;
  updateMusic: (updates: Partial<MusicSettings>) => void;
  toggleInteractiveFeature: (feature: InteractiveFeature) => void;
  setUnlockCode: (code: string) => void;

  setPreviewMode: (mode: PreviewMode) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: TemplateCategory | 'all') => void;
  setPersonId: (id: string | null) => void;

  generateLink: () => Promise<void>;
  prepareLinkAndSave: () => Promise<void>;
  publishExperience: () => Promise<SurpriseExperience>;
  loadFromExperience: (experience: SurpriseExperience) => void;
  toExperience: () => SurpriseExperience;
  reset: () => void;
}

export const useSurpriseLinkStore = create<SurpriseLinkState>((set, get) => ({
  currentStep: 1,
  occasion: null,
  recipientType: null,
  selectedTemplate: null,
  personalization: { ...DEFAULT_PERSONALIZATION },
  modules: [],
  theme: getTheme('birthday_celebration'),
  effects: ['confetti', 'sparkles'],
  music: { ...DEFAULT_MUSIC },
  interactive: { ...DEFAULT_INTERACTIVE },
  previewMode: 'mobile',
  searchQuery: '',
  selectedCategory: 'all',
  favoriteTemplateIds: [],
  experienceId: null,
  slug: null,
  shareLink: null,
  shortUrl: null,
  personId: null,
  status: 'draft',
  isGenerating: false,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(9, s.currentStep + 1) as StudioStep })),
  prevStep: () => set((s) => ({ currentStep: Math.max(1, s.currentStep - 1) as StudioStep })),

  setOccasion: (occasion) =>
    set({
      occasion,
      personalization: {
        ...get().personalization,
        questions: generateQuestionsForOccasion(occasion),
      },
    }),

  setRecipientType: (recipientType) => set({ recipientType }),

  selectTemplate: (template) => {
    set({
      selectedTemplate: template,
      modules: createModulesFromTemplate(template),
      theme: getTheme(template.defaultTheme),
      effects: [...template.defaultEffects],
    });
  },

  toggleFavoriteTemplate: (id) =>
    set((s) => ({
      favoriteTemplateIds: s.favoriteTemplateIds.includes(id)
        ? s.favoriteTemplateIds.filter((f) => f !== id)
        : [...s.favoriteTemplateIds, id],
    })),

  updatePersonalization: (updates) =>
    set((s) => ({ personalization: { ...s.personalization, ...updates } })),

  updateHero: (updates) =>
    set((s) => ({
      personalization: {
        ...s.personalization,
        hero: { ...s.personalization.hero, ...updates },
      },
    })),

  updateQuestion: (id, answer, imageUri) =>
    set((s) => ({
      personalization: {
        ...s.personalization,
        questions: s.personalization.questions.map((q) =>
          q.id === id ? { ...q, answer, imageUri: imageUri ?? q.imageUri } : q,
        ),
      },
    })),

  addModule: (type) => {
    const mod = createDefaultModule(type, get().modules.length);
    set((s) => ({ modules: [...s.modules, mod] }));
  },

  updateModule: (id, updates) =>
    set((s) => ({
      modules: s.modules.map((m) => (m.id === id ? { ...m, ...updates } as ExperienceModule : m)),
    })),

  removeModule: (id) => set((s) => ({ modules: s.modules.filter((m) => m.id !== id) })),

  reorderModules: (fromIndex, toIndex) =>
    set((s) => {
      const next = [...s.modules];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return { modules: next };
    }),

  setTheme: (themeId) => set({ theme: getTheme(themeId) }),
  toggleEffect: (effect) =>
    set((s) => ({
      effects: s.effects.includes(effect)
        ? s.effects.filter((e) => e !== effect)
        : [...s.effects, effect],
    })),
  setEffects: (effects) => set({ effects }),
  updateMusic: (updates) => set((s) => ({ music: { ...s.music, ...updates } })),
  toggleInteractiveFeature: (feature) =>
    set((s) => ({
      interactive: {
        ...s.interactive,
        features: s.interactive.features.includes(feature)
          ? s.interactive.features.filter((f) => f !== feature)
          : [...s.interactive.features, feature],
      },
    })),
  setUnlockCode: (code) =>
    set((s) => ({ interactive: { ...s.interactive, unlockCode: code } })),

  setPreviewMode: (mode) => set({ previewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setPersonId: (id) => set({ personId: id }),

  generateLink: async () => {
    set({ isGenerating: true });
    const slug = get().slug ?? (await generateSlug());
    const id = get().experienceId ?? (await generateExperienceId());
    set({
      experienceId: id,
      slug,
      shareLink: buildShareLink(slug),
      shortUrl: buildShortUrl(slug),
      isGenerating: false,
    });
  },

  prepareLinkAndSave: async () => {
    set({ isGenerating: true });
    try {
      const slug = get().slug ?? (await generateSlug());
      const id = get().experienceId ?? (await generateExperienceId());
      const shareLink = buildShareLink(slug);
      const shortUrl = buildShortUrl(slug);
      set({ experienceId: id, slug, shareLink, shortUrl });
      const draft = {
        ...get().toExperience(),
        id,
        slug,
        shareLink,
        shortUrl,
        status: 'draft' as const,
      };
      await surpriseLinkService.saveExperience(draft);
    } finally {
      set({ isGenerating: false });
    }
  },

  publishExperience: async () => {
    const state = get();
    if (!state.slug) await get().generateLink();
    const experience = get().toExperience();
    set({ status: 'published' });
    return { ...experience, status: 'published', publishedAt: new Date().toISOString() };
  },

  loadFromExperience: (experience) => {
    const template = templateRegistry.getById(experience.templateId) ?? null;
    set({
      experienceId: experience.id,
      slug: experience.slug,
      shareLink: experience.shareLink,
      shortUrl: experience.shortUrl,
      occasion: experience.occasion,
      recipientType: experience.recipientType,
      selectedTemplate: template,
      personalization: experience.personalization,
      modules: experience.modules,
      theme: experience.theme,
      effects: experience.effects,
      music: experience.music,
      interactive: experience.interactive,
      personId: experience.personId ?? null,
      status: experience.status,
    });
  },

  toExperience: () => {
    const s = get();
    const now = new Date().toISOString();
    const id = s.experienceId ?? '';
    return {
      id,
      slug: s.slug ?? '',
      shareLink: s.shareLink ?? '',
      shortUrl: s.shortUrl ?? '',
      occasion: s.occasion ?? 'birthday',
      recipientType: s.recipientType ?? 'anyone',
      templateId: s.selectedTemplate?.id ?? '',
      personalization: s.personalization,
      modules: s.modules,
      theme: s.theme,
      effects: s.effects,
      music: s.music,
      interactive: s.interactive,
      personId: s.personId ?? undefined,
      status: s.status,
      createdAt: now,
      updatedAt: now,
      publishedAt: s.status === 'published' ? now : undefined,
    };
  },

  reset: () =>
    set({
      currentStep: 1,
      occasion: null,
      recipientType: null,
      selectedTemplate: null,
      personalization: { ...DEFAULT_PERSONALIZATION, hero: { ...DEFAULT_PERSONALIZATION.hero } },
      modules: [],
      theme: getTheme('birthday_celebration'),
      effects: ['confetti', 'sparkles'],
      music: { ...DEFAULT_MUSIC },
      interactive: { ...DEFAULT_INTERACTIVE },
      previewMode: 'mobile',
      searchQuery: '',
      selectedCategory: 'all',
      experienceId: null,
      slug: null,
      shareLink: null,
      shortUrl: null,
      personId: null,
      status: 'draft',
      isGenerating: false,
    }),
}));
