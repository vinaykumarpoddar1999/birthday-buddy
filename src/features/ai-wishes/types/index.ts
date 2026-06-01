export type WishTone =
  | 'heartfelt'
  | 'funny'
  | 'romantic'
  | 'motivational'
  | 'cute'
  | 'professional'
  | 'short-sweet';

export type WishLength = 'short' | 'medium' | 'long';

export type WishLanguage =
  | 'english'
  | 'hindi'
  | 'bengali'
  | 'spanish'
  | 'french'
  | 'german';

export type WishRelationship =
  | 'friend'
  | 'family'
  | 'partner'
  | 'colleague'
  | 'relative'
  | 'general';

export interface WishTemplate {
  id: string;
  text: string;
  relationship: WishRelationship;
  lengthCategory: WishLength;
}

export interface WishToneData {
  tone: WishTone;
  wishes: WishTemplate[];
}

export interface GeneratedWish {
  id: string;
  text: string;
  tone: WishTone;
  length: WishLength;
  language: WishLanguage;
  personId: string;
  personName: string;
  relationship: WishRelationship;
  personalContext: string;
  createdAt: string;
  isFavorite: boolean;
  isEdited: boolean;
  originalText: string;
}

export interface WishHistoryEntry extends GeneratedWish {
  sharedVia?: string[];
  usedInCard?: boolean;
}

export interface SavedWishTemplate {
  id: string;
  name: string;
  text: string;
  tone: WishTone;
  createdAt: string;
}

export type WishTabId = 'generate' | 'history' | 'templates';

export interface ToneOption {
  id: WishTone;
  label: string;
  description: string;
  color: string;
}

export interface LengthOption {
  id: WishLength;
  label: string;
  description: string;
}

export interface LanguageOption {
  id: WishLanguage;
  label: string;
  nativeLabel: string;
}
