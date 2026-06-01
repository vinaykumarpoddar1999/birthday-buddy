import {
  BriefcaseBusiness,
  Heart,
  Layers,
  Sparkles,
  UsersRound,
} from 'lucide-react-native';

import type { Category } from '@features/people/types';

export const PEOPLE_CATEGORIES: Omit<Category, 'count'>[] = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'friend', label: 'Friends', icon: UsersRound },
  { id: 'family', label: 'Family', icon: Heart },
  { id: 'colleague', label: 'Colleague', icon: BriefcaseBusiness },
  { id: 'other', label: 'Others', icon: Sparkles },
];
