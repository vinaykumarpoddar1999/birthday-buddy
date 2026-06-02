import type { LucideIcon } from 'lucide-react-native';
import {
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Smile,
  Star,
  User,
  Users,
} from 'lucide-react-native';

import type { RecipientType } from '../types';

export interface RecipientConfig {
  id: RecipientType;
  label: string;
  Icon: LucideIcon;
  color: string;
  suggestedCategories: string[];
}

export const RECIPIENT_TYPES: RecipientConfig[] = [
  { id: 'girlfriend', label: 'Girlfriend', Icon: Heart, color: '#EC4899', suggestedCategories: ['romantic', 'cute'] },
  { id: 'boyfriend', label: 'Boyfriend', Icon: Heart, color: '#F43F5E', suggestedCategories: ['romantic', 'modern'] },
  { id: 'husband', label: 'Husband', Icon: Heart, color: '#BE185D', suggestedCategories: ['romantic', 'luxury'] },
  { id: 'wife', label: 'Wife', Icon: Heart, color: '#DB2777', suggestedCategories: ['romantic', 'luxury'] },
  { id: 'friend', label: 'Friend', Icon: Smile, color: '#3B82F6', suggestedCategories: ['friends', 'fun'] },
  { id: 'best_friend', label: 'Best Friend', Icon: Star, color: '#8B5CF6', suggestedCategories: ['friends', 'interactive'] },
  { id: 'family', label: 'Family', Icon: Home, color: '#22C55E', suggestedCategories: ['family', 'cute'] },
  { id: 'parents', label: 'Parents', Icon: Users, color: '#16A34A', suggestedCategories: ['family', 'minimal'] },
  { id: 'grandparents', label: 'Grandparents', Icon: Users, color: '#059669', suggestedCategories: ['family', 'luxury'] },
  { id: 'teacher', label: 'Teacher', Icon: GraduationCap, color: '#D97706', suggestedCategories: ['minimal', 'modern'] },
  { id: 'student', label: 'Student', Icon: GraduationCap, color: '#2563EB', suggestedCategories: ['cute', 'interactive'] },
  { id: 'colleague', label: 'Colleague', Icon: Briefcase, color: '#64748B', suggestedCategories: ['minimal', 'modern'] },
  { id: 'anyone', label: 'Anyone', Icon: User, color: '#7C3AED', suggestedCategories: ['trending', 'modern'] },
];

export function getRecipientConfig(id: RecipientType): RecipientConfig {
  return RECIPIENT_TYPES.find((r) => r.id === id) ?? RECIPIENT_TYPES[12];
}
