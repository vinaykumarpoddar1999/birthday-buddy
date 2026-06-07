export type TemplateCategory =
  | 'birthday'
  | 'anniversary'
  | 'romantic'
  | 'friend'
  | 'professional'
  | 'thank-you'
  | 'festival'
  | 'modern'
  | 'family'
  | 'minimal';

export type TemplateCategoryFilter =
  | 'all'
  | 'birthday'
  | 'anniversary'
  | 'love'
  | 'friendship'
  | 'other';

export type CanvasFormat = 'portrait' | 'landscape' | 'square';
export type GradientType = 'linear' | 'radial';

export type BackgroundEffectType = 'blur' | 'glass' | 'glow' | 'overlay';

export interface BackgroundEffect {
  type: BackgroundEffectType;
  intensity: number;
  color?: string;
}

export interface CardBackground {
  type: 'solid' | 'gradient' | 'image';
  value: string | string[];
  gradientType?: GradientType;
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  opacity?: number;
  imageScale?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
  imageRotation?: number;
  blur?: number;
  overlayColor?: string;
  overlayOpacity?: number;
  effects?: BackgroundEffect[];
}

export type CardElementType = 'text' | 'image' | 'sticker' | 'shape' | 'frame' | 'icon';

export type TextAlign = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold' | '300' | '400' | '500' | '600' | '700' | '800';
export type TextPreset = 'headline' | 'subheading' | 'body' | 'signature' | 'quote' | 'custom';
export type ShapeType = 'rectangle' | 'circle' | 'rounded';

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
  textPreset?: TextPreset;
  textShadowColor?: string;
  textShadowRadius?: number;
  strokeColor?: string;
  strokeWidth?: number;
  glowColor?: string;
  uri?: string;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shapeType?: ShapeType;
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
  layout: CanvasFormat;
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
  theme?: string;
}

export interface EditorSnapshot {
  elements: CardElement[];
  customBackground: CardBackground | null;
  personalization: PersonalizationData;
  canvasFormat: CanvasFormat;
}

export interface Draft {
  id: string;
  name: string;
  templateId: string;
  personalization: PersonalizationData;
  elements: CardElement[];
  customBackground?: CardBackground | null;
  canvasFormat?: CanvasFormat;
  createdAt: string;
  updatedAt: string;
}

export type EditorPanel =
  | 'none'
  | 'content'
  | 'background'
  | 'effects'
  | 'text'
  | 'media';

export const TEMPLATE_CATEGORIES: { id: TemplateCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'love', label: 'Love' },
  { id: 'friendship', label: 'Friendship' },
  { id: 'other', label: 'Other' },
];
