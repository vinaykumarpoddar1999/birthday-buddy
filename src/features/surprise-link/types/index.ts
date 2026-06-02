import { z } from 'zod';

export type ID = string;

export const occasionSchema = z.enum([
  'birthday',
  'anniversary',
  'valentines',
  'proposal',
  'love_confession',
  'miss_you',
  'sorry',
  'graduation',
  'congratulations',
  'baby_shower',
  'wedding',
  'christmas',
  'new_year',
  'custom',
]);
export type Occasion = z.infer<typeof occasionSchema>;

export const recipientTypeSchema = z.enum([
  'girlfriend',
  'boyfriend',
  'husband',
  'wife',
  'friend',
  'best_friend',
  'family',
  'parents',
  'grandparents',
  'teacher',
  'student',
  'colleague',
  'anyone',
]);
export type RecipientType = z.infer<typeof recipientTypeSchema>;

export const templateCategorySchema = z.enum([
  'romantic',
  'birthday',
  'family',
  'friends',
  'luxury',
  'minimal',
  'cute',
  'modern',
  'interactive',
  'trending',
  'premium',
  'favorites',
]);
export type TemplateCategory = z.infer<typeof templateCategorySchema>;

export const themeIdSchema = z.enum([
  'luxury_gold',
  'romantic_pink',
  'dark_elegant',
  'neon',
  'royal',
  'galaxy',
  'floral',
  'cute',
  'minimal',
  'modern',
  'glassmorphism',
  'birthday_celebration',
]);
export type ThemeId = z.infer<typeof themeIdSchema>;

export const visualEffectSchema = z.enum([
  'confetti',
  'fireworks',
  'hearts',
  'flowers',
  'snow',
  'sparkles',
  'balloons',
  'particles',
  'glow',
  'floating_objects',
]);
export type VisualEffect = z.infer<typeof visualEffectSchema>;

export const moduleTypeSchema = z.enum([
  'hero',
  'photo_gallery',
  'video_memory',
  'voice_message',
  'timeline',
  'countdown',
  'scratch_card',
  'quiz',
  'open_when',
  'reasons_love',
  'future_dreams',
  'message',
  'gift_box',
]);
export type ModuleType = z.infer<typeof moduleTypeSchema>;

export const interactiveFeatureSchema = z.enum([
  'unlock_code',
  'tap_reveal',
  'scratch_reveal',
  'swipe_stories',
  'shake_reveal',
  'spin_wheel',
  'memory_quiz',
  'guess_photo',
  'hidden_surprise',
  'reward_unlock',
]);
export type InteractiveFeature = z.infer<typeof interactiveFeatureSchema>;

export const reactionTypeSchema = z.enum([
  'loved_it',
  'emotional',
  'smile',
  'applause',
  'favorite',
]);
export type ReactionType = z.infer<typeof reactionTypeSchema>;

export const replyTypeSchema = z.enum(['text', 'voice', 'photo', 'video']);
export type ReplyType = z.infer<typeof replyTypeSchema>;

export const previewModeSchema = z.enum(['mobile', 'tablet', 'desktop']);
export type PreviewMode = z.infer<typeof previewModeSchema>;

export interface ExperienceTheme {
  id: ThemeId;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily?: string;
}

export interface MusicSettings {
  uri?: string;
  title?: string;
  autoPlay: boolean;
  volume: number;
  loop: boolean;
}

export interface HeroSection {
  heroImageUri?: string;
  heroVideoUri?: string;
  coverImageUri?: string;
  voiceMessageUri?: string;
  welcomeMessage: string;
  openingAnimation: 'gift_box' | 'envelope';
}

export interface PersonalQuestion {
  id: string;
  label: string;
  placeholder: string;
  answer: string;
  imageUri?: string;
}

export interface ExperiencePersonalization {
  senderName: string;
  recipientName: string;
  nickname: string;
  relationship: string;
  occasionDate: string;
  location: string;
  specialDate: string;
  hero: HeroSection;
  questions: PersonalQuestion[];
}

export interface PhotoGalleryItem {
  id: string;
  uri: string;
  caption: string;
}

export interface PhotoGalleryModule {
  id: string;
  type: 'photo_gallery';
  title: string;
  layout: 'grid' | 'carousel' | 'masonry';
  transition: 'fade' | 'slide' | 'zoom';
  items: PhotoGalleryItem[];
}

export interface VideoMemoryModule {
  id: string;
  type: 'video_memory';
  title: string;
  videoUri?: string;
  thumbnailUri?: string;
  caption: string;
  mode: 'single' | 'slideshow' | 'story';
}

export interface VoiceMessageModule {
  id: string;
  type: 'voice_message';
  title: string;
  audioUri?: string;
  duration?: number;
  transcript: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUri?: string;
}

export interface TimelineModule {
  id: string;
  type: 'timeline';
  title: string;
  events: TimelineEvent[];
}

export interface CountdownModule {
  id: string;
  type: 'countdown';
  title: string;
  targetDate: string;
  revealMessage: string;
}

export interface ScratchCardModule {
  id: string;
  type: 'scratch_card';
  title: string;
  hiddenMessage: string;
  hiddenImageUri?: string;
  hiddenReward: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface QuizModule {
  id: string;
  type: 'quiz';
  title: string;
  questions: QuizQuestion[];
  rewardMessage: string;
}

export interface OpenWhenLetter {
  id: string;
  mood: string;
  title: string;
  content: string;
}

export interface OpenWhenModule {
  id: string;
  type: 'open_when';
  title: string;
  letters: OpenWhenLetter[];
}

export interface ReasonCard {
  id: string;
  number: number;
  text: string;
}

export interface ReasonsLoveModule {
  id: string;
  type: 'reasons_love';
  title: string;
  cards: ReasonCard[];
}

export interface DreamItem {
  id: string;
  category: 'bucket_list' | 'travel' | 'life' | 'shared';
  text: string;
}

export interface FutureDreamsModule {
  id: string;
  type: 'future_dreams';
  title: string;
  dreams: DreamItem[];
}

export interface MessageModule {
  id: string;
  type: 'message';
  title: string;
  content: string;
  style: 'letter' | 'note' | 'poem';
}

export interface GiftBoxModule {
  id: string;
  type: 'gift_box';
  title: string;
  revealMessage: string;
  giftImageUri?: string;
}

export type ExperienceModule =
  | PhotoGalleryModule
  | VideoMemoryModule
  | VoiceMessageModule
  | TimelineModule
  | CountdownModule
  | ScratchCardModule
  | QuizModule
  | OpenWhenModule
  | ReasonsLoveModule
  | FutureDreamsModule
  | MessageModule
  | GiftBoxModule;

export interface InteractiveSettings {
  features: InteractiveFeature[];
  unlockCode?: string;
}

export interface ExperienceTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  occasion: Occasion[];
  recipientTypes: RecipientType[];
  isPremium: boolean;
  isTrending: boolean;
  previewColors: [string, string];
  icon: string;
  defaultModules: ModuleType[];
  defaultTheme: ThemeId;
  defaultEffects: VisualEffect[];
}

export interface SurpriseExperience {
  id: string;
  slug: string;
  shareLink: string;
  shortUrl: string;
  occasion: Occasion;
  recipientType: RecipientType;
  templateId: string;
  personalization: ExperiencePersonalization;
  modules: ExperienceModule[];
  theme: ExperienceTheme;
  effects: VisualEffect[];
  music: MusicSettings;
  interactive: InteractiveSettings;
  personId?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ExperienceReaction {
  id: string;
  experienceId: string;
  type: ReactionType;
  createdAt: string;
}

export interface ExperienceReply {
  id: string;
  experienceId: string;
  type: ReplyType;
  content: string;
  mediaUri?: string;
  createdAt: string;
}

export interface ExperienceAnalytics {
  experienceId: string;
  viewed: boolean;
  openCount: number;
  completionRate: number;
  reactions: ExperienceReaction[];
  replies: ExperienceReply[];
  sectionViews: Record<string, number>;
  lastViewedAt?: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export type StudioStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
