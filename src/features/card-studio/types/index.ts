export type TemplateCategory =
  | 'birthday'
  | 'anniversary'
  | 'romantic'
  | 'funny'
  | 'luxury'
  | 'minimal'
  | 'photo'
  | 'floral'
  | 'neon'
  | 'cute'
  | 'kids'
  | 'professional'
  | 'festival'
  | 'modern'
  | 'gradient'
  | 'illustration';

export type TemplateCategoryFilter =
  | 'all'
  | 'trending'
  | TemplateCategory
  | 'wedding-anniversary'
  | 'friend'
  | 'family'
  | 'partner';

export interface CardBackground {
  type: 'solid' | 'gradient' | 'image';
  value: string | string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
}

export type CardElementType = 'text' | 'image' | 'sticker' | 'shape';

export type TextAlign = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold' | '300' | '400' | '500' | '600' | '700' | '800';

export interface CardElement {
  id: string;
  type: CardElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
  locked?: boolean;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: FontWeight;
  color?: string;
  textAlign?: TextAlign;
  lineHeight?: number;
  letterSpacing?: number;
  uri?: string;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  isPlaceholder?: boolean;
  placeholderKey?: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  tags: string[];
  isPremium: boolean;
  isTrending: boolean;
  background: CardBackground;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  placeholders: Record<string, string>;
  elements: CardElement[];
  layout: 'portrait' | 'landscape' | 'square';
  decorations?: string[];
}

export interface PersonalizationData {
  recipientName: string;
  senderName: string;
  relationship: string;
  age: string;
  message: string;
  quote: string;
  eventType: string;
  date: string;
  location: string;
  signature: string;
  additionalNote: string;
  photoUri?: string;
}

export interface Draft {
  id: string;
  name: string;
  templateId: string;
  personalization: PersonalizationData;
  elements: CardElement[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  occasion: string[];
  style: string[];
  isPremiumOnly: boolean;
  isFreeOnly: boolean;
}

export type AITone =
  | 'funny'
  | 'emotional'
  | 'romantic'
  | 'formal'
  | 'luxury'
  | 'heartfelt';

export type AIRelationship =
  | 'friend'
  | 'family'
  | 'partner'
  | 'colleague';

export interface AIGeneratedContent {
  headline: string;
  wish: string;
  closing: string;
  signature: string;
}

export interface DecorationItem {
  id: string;
  iconKey: string;
  label: string;
  category: 'balloons' | 'cake' | 'flowers' | 'gifts' | 'confetti' | 'hearts' | 'stars' | 'party';
}
