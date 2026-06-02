import type {
  ExperienceModule,
  ExperienceTemplate,
  ModuleType,
  Occasion,
  RecipientType,
  TemplateCategory,
  ThemeId,
  VisualEffect,
} from '../types';

interface TemplateSeed {
  name: string;
  description: string;
  category: TemplateCategory;
  occasions: Occasion[];
  recipients: RecipientType[];
  isPremium?: boolean;
  isTrending?: boolean;
  previewColors: [string, string];
  icon: string;
  modules: ModuleType[];
  theme: ThemeId;
  effects: VisualEffect[];
}

const ROMANTIC_TEMPLATES: TemplateSeed[] = [
  { name: 'Love Story Timeline', description: 'Your journey together, chapter by chapter', category: 'romantic', occasions: ['anniversary', 'valentines', 'love_confession'], recipients: ['girlfriend', 'boyfriend', 'husband', 'wife'], isTrending: true, previewColors: ['#FDF2F8', '#FBCFE8'], icon: '💕', modules: ['timeline', 'photo_gallery', 'message'], theme: 'romantic_pink', effects: ['hearts', 'sparkles'] },
  { name: 'Secret Love Letter', description: 'A heartfelt letter revealed with magic', category: 'romantic', occasions: ['valentines', 'love_confession', 'miss_you'], recipients: ['girlfriend', 'boyfriend'], previewColors: ['#FFF1F2', '#FECDD3'], icon: '💌', modules: ['message', 'scratch_card', 'voice_message'], theme: 'romantic_pink', effects: ['hearts'] },
  { name: 'Digital Gift Box', description: 'Unwrap layers of love and surprises', category: 'romantic', occasions: ['valentines', 'anniversary', 'birthday'], recipients: ['girlfriend', 'boyfriend', 'husband', 'wife'], isPremium: true, previewColors: ['#F5F3FF', '#EDE9FE'], icon: '🎁', modules: ['gift_box', 'photo_gallery', 'message'], theme: 'luxury_gold', effects: ['confetti', 'sparkles'] },
  { name: 'Treasure Hunt', description: 'Interactive clues leading to your love', category: 'interactive', occasions: ['proposal', 'anniversary'], recipients: ['girlfriend', 'boyfriend', 'wife', 'husband'], isPremium: true, previewColors: ['#EEF2FF', '#C7D2FE'], icon: '🗺️', modules: ['quiz', 'scratch_card', 'message'], theme: 'royal', effects: ['sparkles'] },
  { name: 'Memory Journey', description: 'Walk through your most precious moments', category: 'romantic', occasions: ['anniversary', 'valentines'], recipients: ['girlfriend', 'boyfriend', 'husband', 'wife'], previewColors: ['#FAF5FF', '#F3E8FF'], icon: '📸', modules: ['photo_gallery', 'timeline', 'video_memory'], theme: 'floral', effects: ['flowers', 'hearts'] },
  { name: 'Future Dreams', description: 'Dream together about tomorrow', category: 'romantic', occasions: ['anniversary', 'proposal'], recipients: ['girlfriend', 'boyfriend', 'husband', 'wife'], previewColors: ['#EFF6FF', '#DBEAFE'], icon: '🌟', modules: ['future_dreams', 'message', 'countdown'], theme: 'galaxy', effects: ['particles', 'glow'] },
  { name: 'Open When Letters', description: 'Letters for every mood and moment', category: 'romantic', occasions: ['miss_you', 'love_confession'], recipients: ['girlfriend', 'boyfriend', 'husband', 'wife'], isTrending: true, previewColors: ['#FFF7ED', '#FFEDD5'], icon: '✉️', modules: ['open_when', 'voice_message'], theme: 'cute', effects: ['hearts'] },
  { name: 'Reasons I Love You', description: 'Count the ways, one card at a time', category: 'romantic', occasions: ['valentines', 'anniversary'], recipients: ['girlfriend', 'boyfriend', 'wife', 'husband'], previewColors: ['#FDF2F8', '#F9A8D4'], icon: '💖', modules: ['reasons_love', 'photo_gallery'], theme: 'romantic_pink', effects: ['hearts', 'floating_objects'] },
];

const BIRTHDAY_TEMPLATES: TemplateSeed[] = [
  { name: 'Birthday Journey', description: 'Celebrate their life story so far', category: 'birthday', occasions: ['birthday'], recipients: ['friend', 'best_friend', 'family', 'anyone'], isTrending: true, previewColors: ['#FDF4FF', '#F5D0FE'], icon: '🎂', modules: ['timeline', 'photo_gallery', 'message'], theme: 'birthday_celebration', effects: ['confetti', 'balloons'] },
  { name: 'Memory Timeline', description: 'Year by year, moment by moment', category: 'birthday', occasions: ['birthday'], recipients: ['family', 'parents', 'grandparents'], previewColors: ['#FFFBEB', '#FEF3C7'], icon: '📅', modules: ['timeline', 'photo_gallery'], theme: 'floral', effects: ['sparkles'] },
  { name: 'Birthday Countdown', description: 'Build anticipation for the big day', category: 'birthday', occasions: ['birthday'], recipients: ['friend', 'best_friend', 'anyone'], previewColors: ['#EEF2FF', '#C7D2FE'], icon: '⏰', modules: ['countdown', 'message', 'gift_box'], theme: 'neon', effects: ['fireworks', 'confetti'] },
  { name: 'Surprise Room', description: 'A virtual room full of birthday magic', category: 'birthday', occasions: ['birthday'], recipients: ['friend', 'family', 'anyone'], isPremium: true, previewColors: ['#F0FDF4', '#BBF7D0'], icon: '🏠', modules: ['photo_gallery', 'video_memory', 'quiz'], theme: 'cute', effects: ['balloons', 'confetti'] },
  { name: 'Interactive Cake', description: 'Blow candles and make a wish', category: 'interactive', occasions: ['birthday'], recipients: ['friend', 'best_friend', 'family'], previewColors: ['#FFF1F2', '#FECDD3'], icon: '🎂', modules: ['scratch_card', 'message', 'voice_message'], theme: 'birthday_celebration', effects: ['confetti', 'sparkles'] },
  { name: 'Birthday Quiz', description: 'How well do they know themselves?', category: 'interactive', occasions: ['birthday'], recipients: ['friend', 'best_friend'], previewColors: ['#F5F3FF', '#DDD6FE'], icon: '❓', modules: ['quiz', 'message'], theme: 'modern', effects: ['confetti'] },
  { name: 'Gift Reveal', description: 'Dramatic unveiling of your surprise', category: 'birthday', occasions: ['birthday'], recipients: ['anyone'], previewColors: ['#FEFCE8', '#FEF08A'], icon: '🎁', modules: ['gift_box', 'scratch_card', 'message'], theme: 'luxury_gold', effects: ['fireworks', 'confetti'] },
  { name: 'Birthday Time Capsule', description: 'Memories sealed for the future', category: 'birthday', occasions: ['birthday'], recipients: ['family', 'friend'], previewColors: ['#F8FAFC', '#E2E8F0'], icon: '📦', modules: ['timeline', 'voice_message', 'future_dreams'], theme: 'minimal', effects: ['sparkles'] },
];

const FRIENDSHIP_TEMPLATES: TemplateSeed[] = [
  { name: 'Friendship Journey', description: 'The story of an epic friendship', category: 'friends', occasions: ['birthday', 'congratulations'], recipients: ['friend', 'best_friend'], isTrending: true, previewColors: ['#EFF6FF', '#BFDBFE'], icon: '🤝', modules: ['timeline', 'photo_gallery', 'message'], theme: 'modern', effects: ['confetti', 'sparkles'] },
  { name: 'Best Moments', description: 'Your greatest hits together', category: 'friends', occasions: ['birthday', 'congratulations'], recipients: ['friend', 'best_friend'], previewColors: ['#F0FDF4', '#BBF7D0'], icon: '📸', modules: ['photo_gallery', 'video_memory'], theme: 'cute', effects: ['balloons'] },
  { name: 'Funny Roast', description: 'Love them with playful humor', category: 'friends', occasions: ['birthday'], recipients: ['best_friend', 'friend'], previewColors: ['#FFFBEB', '#FDE68A'], icon: '😂', modules: ['quiz', 'message', 'scratch_card'], theme: 'neon', effects: ['confetti'] },
  { name: 'Friendship Quiz', description: 'Test your friendship knowledge', category: 'interactive', occasions: ['birthday'], recipients: ['friend', 'best_friend'], previewColors: ['#FAF5FF', '#E9D5FF'], icon: '🧠', modules: ['quiz', 'photo_gallery'], theme: 'modern', effects: ['sparkles'] },
  { name: 'Memory Book', description: 'A digital scrapbook of friendship', category: 'friends', occasions: ['birthday', 'graduation'], recipients: ['friend', 'best_friend'], previewColors: ['#FFF7ED', '#FED7AA'], icon: '📖', modules: ['photo_gallery', 'timeline', 'voice_message'], theme: 'floral', effects: ['flowers'] },
  { name: 'Adventure Timeline', description: 'Every adventure you shared', category: 'friends', occasions: ['birthday', 'congratulations'], recipients: ['friend', 'best_friend'], previewColors: ['#ECFEFF', '#A5F3FC'], icon: '🗺️', modules: ['timeline', 'photo_gallery', 'future_dreams'], theme: 'galaxy', effects: ['particles'] },
];

const FAMILY_TEMPLATES: TemplateSeed[] = [
  { name: 'Blessing Wall', description: 'Messages of love from the whole family', category: 'family', occasions: ['birthday', 'wedding', 'graduation'], recipients: ['family', 'parents', 'grandparents'], previewColors: ['#F0FDF4', '#86EFAC'], icon: '🙏', modules: ['message', 'photo_gallery', 'voice_message'], theme: 'floral', effects: ['flowers', 'sparkles'] },
  { name: 'Family Tree', description: 'Roots, branches, and beautiful bonds', category: 'family', occasions: ['birthday', 'custom'], recipients: ['family', 'parents', 'grandparents'], previewColors: ['#FFFBEB', '#FDE68A'], icon: '🌳', modules: ['timeline', 'photo_gallery'], theme: 'minimal', effects: ['flowers'] },
  { name: 'Memory Album', description: 'Precious family moments preserved', category: 'family', occasions: ['birthday', 'anniversary'], recipients: ['family', 'parents', 'grandparents'], isTrending: true, previewColors: ['#FDF4FF', '#E9D5FF'], icon: '📷', modules: ['photo_gallery', 'timeline', 'video_memory'], theme: 'cute', effects: ['sparkles'] },
  { name: 'Life Lessons', description: 'Wisdom passed through generations', category: 'family', occasions: ['graduation', 'birthday'], recipients: ['parents', 'grandparents', 'student'], previewColors: ['#F8FAFC', '#CBD5E1'], icon: '📚', modules: ['message', 'open_when', 'timeline'], theme: 'dark_elegant', effects: ['glow'] },
  { name: 'Family Legacy', description: 'Honor their place in your story', category: 'family', occasions: ['birthday', 'custom'], recipients: ['parents', 'grandparents', 'family'], isPremium: true, previewColors: ['#1E1B4B', '#312E81'], icon: '👑', modules: ['timeline', 'message', 'future_dreams'], theme: 'luxury_gold', effects: ['glow', 'particles'] },
];

const STYLE_TEMPLATES: TemplateSeed[] = [
  { name: 'Minimal Elegance', description: 'Less is more, beautifully said', category: 'minimal', occasions: ['birthday', 'anniversary', 'custom'], recipients: ['anyone', 'colleague'], previewColors: ['#FFFFFF', '#F1F5F9'], icon: '◻️', modules: ['message', 'photo_gallery'], theme: 'minimal', effects: [] },
  { name: 'Luxury Unveil', description: 'Premium experience with golden touches', category: 'luxury', occasions: ['anniversary', 'birthday', 'wedding'], recipients: ['husband', 'wife', 'anyone'], isPremium: true, previewColors: ['#1A1A2E', '#D4AF37'], icon: '✨', modules: ['gift_box', 'timeline', 'message'], theme: 'luxury_gold', effects: ['sparkles', 'glow'] },
  { name: 'Neon Nights', description: 'Bold, vibrant, unforgettable', category: 'modern', occasions: ['birthday', 'new_year'], recipients: ['friend', 'best_friend', 'anyone'], previewColors: ['#0C0A1D', '#22D3EE'], icon: '🌃', modules: ['countdown', 'photo_gallery', 'quiz'], theme: 'neon', effects: ['particles', 'fireworks'] },
  { name: 'Glass Dreams', description: 'Ethereal glassmorphism beauty', category: 'modern', occasions: ['birthday', 'valentines'], recipients: ['anyone'], isPremium: true, previewColors: ['#F5F3FF', '#DDD6FE'], icon: '🔮', modules: ['photo_gallery', 'message', 'voice_message'], theme: 'glassmorphism', effects: ['sparkles', 'floating_objects'] },
  { name: 'Royal Celebration', description: 'Treat them like royalty', category: 'premium', occasions: ['birthday', 'anniversary', 'wedding'], recipients: ['anyone'], isPremium: true, previewColors: ['#1E1B4B', '#7C3AED'], icon: '👑', modules: ['gift_box', 'timeline', 'reasons_love'], theme: 'royal', effects: ['confetti', 'glow'] },
  { name: 'Galaxy Wishes', description: 'Stars align for their special day', category: 'premium', occasions: ['birthday', 'new_year'], recipients: ['anyone'], previewColors: ['#030712', '#6366F1'], icon: '🌌', modules: ['countdown', 'future_dreams', 'message'], theme: 'galaxy', effects: ['particles', 'sparkles'] },
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function seedToTemplate(seed: TemplateSeed, index: number): ExperienceTemplate {
  const id = `tpl-${slugify(seed.name)}-${index}`;
  return {
    id,
    name: seed.name,
    description: seed.description,
    category: seed.category,
    occasion: seed.occasions,
    recipientTypes: seed.recipients,
    isPremium: seed.isPremium ?? false,
    isTrending: seed.isTrending ?? false,
    previewColors: seed.previewColors,
    icon: seed.icon,
    defaultModules: seed.modules,
    defaultTheme: seed.theme,
    defaultEffects: seed.effects,
  };
}

const ALL_SEEDS = [
  ...ROMANTIC_TEMPLATES,
  ...BIRTHDAY_TEMPLATES,
  ...FRIENDSHIP_TEMPLATES,
  ...FAMILY_TEMPLATES,
  ...STYLE_TEMPLATES,
];

function generateVariantTemplates(base: ExperienceTemplate[], targetCount: number): ExperienceTemplate[] {
  const variants: ExperienceTemplate[] = [...base];
  const moods = ['Classic', 'Deluxe', 'Dream', 'Epic', 'Signature', 'Premium', 'Ultimate'];
  const styles: TemplateCategory[] = ['cute', 'modern', 'minimal', 'interactive', 'trending'];

  let i = 0;
  while (variants.length < targetCount) {
    const source = base[i % base.length];
    const mood = moods[Math.floor(i / base.length) % moods.length];
    const style = styles[i % styles.length];
    variants.push({
      ...source,
      id: `${source.id}-v${i}`,
      name: `${source.name} ${mood}`,
      category: style,
      isPremium: i % 3 === 0,
      isTrending: i % 5 === 0,
    });
    i += 1;
  }
  return variants;
}

class TemplateRegistry {
  private templates: ExperienceTemplate[] = [];

  constructor() {
    const base = ALL_SEEDS.map((s, i) => seedToTemplate(s, i));
    this.templates = generateVariantTemplates(base, 1000);
  }

  getAll(): ExperienceTemplate[] {
    return this.templates;
  }

  getById(id: string): ExperienceTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  getByCategory(category: TemplateCategory | 'all'): ExperienceTemplate[] {
    if (category === 'all' || category === 'favorites') return this.templates;
    if (category === 'trending') return this.templates.filter((t) => t.isTrending);
    if (category === 'premium') return this.templates.filter((t) => t.isPremium);
    return this.templates.filter((t) => t.category === category);
  }

  search(query: string, category: TemplateCategory | 'all'): ExperienceTemplate[] {
    const q = query.toLowerCase().trim();
    let results = this.getByCategory(category);
    if (q) {
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.includes(q),
      );
    }
    return results;
  }

  getTrending(limit = 8): ExperienceTemplate[] {
    return this.templates.filter((t) => t.isTrending).slice(0, limit);
  }

  filterForContext(
    occasion: Occasion,
    recipient: RecipientType,
    category: TemplateCategory | 'all',
  ): ExperienceTemplate[] {
    let results = this.getByCategory(category);
    results = results.filter(
      (t) => t.occasion.includes(occasion) || t.occasion.includes('custom' as Occasion) || occasion === 'custom',
    );
    if (recipient !== 'anyone') {
      const matched = results.filter(
        (t) => t.recipientTypes.includes(recipient) || t.recipientTypes.includes('anyone'),
      );
      if (matched.length > 0) results = matched;
    }
    return results;
  }
}

export const templateRegistry = new TemplateRegistry();

export function createDefaultModule(type: ModuleType, index: number): ExperienceModule {
  const id = `mod-${type}-${Date.now()}-${index}`;
  switch (type) {
    case 'photo_gallery':
      return { id, type, title: 'Photo Gallery', layout: 'carousel', transition: 'fade', items: [] };
    case 'video_memory':
      return { id, type, title: 'Video Memory', caption: '', mode: 'single' };
    case 'voice_message':
      return { id, type, title: 'Voice Message', transcript: '' };
    case 'timeline':
      return { id, type, title: 'Our Timeline', events: [] };
    case 'countdown':
      return { id, type, title: 'Countdown', targetDate: '', revealMessage: 'Surprise!' };
    case 'scratch_card':
      return { id, type, title: 'Scratch to Reveal', hiddenMessage: '', hiddenReward: '' };
    case 'quiz':
      return { id, type, title: 'Fun Quiz', questions: [], rewardMessage: 'You did great!' };
    case 'open_when':
      return {
        id,
        type,
        title: 'Open When...',
        letters: [
          { id: 'sad', mood: 'sad', title: 'Open When Sad', content: '' },
          { id: 'happy', mood: 'happy', title: 'Open When Happy', content: '' },
          { id: 'missing', mood: 'missing', title: 'Open When Missing Me', content: '' },
        ],
      };
    case 'reasons_love':
      return {
        id,
        type,
        title: 'Reasons I Love You',
        cards: Array.from({ length: 5 }, (_, i) => ({ id: `r-${i}`, number: i + 1, text: '' })),
      };
    case 'future_dreams':
      return { id, type, title: 'Future Dreams', dreams: [] };
    case 'message':
      return { id, type, title: 'Personal Message', content: '', style: 'letter' };
    case 'gift_box':
      return { id, type, title: 'Gift Box', revealMessage: 'Open your surprise!' };
    default:
      return { id, type: 'message', title: 'Message', content: '', style: 'note' };
  }
}

export function createModulesFromTemplate(template: ExperienceTemplate): ExperienceModule[] {
  return template.defaultModules.map((type, i) => createDefaultModule(type, i));
}
