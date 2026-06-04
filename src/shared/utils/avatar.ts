import type { ImageSourcePropType } from 'react-native';

export type Gender = 'male' | 'female' | 'other';

const BOY_ASSET: ImageSourcePropType = require('../../../assets/images/boy.png');
const GIRL_ASSET: ImageSourcePropType = require('../../../assets/images/girl.png');

export function getAvatarSource(gender?: Gender | null): ImageSourcePropType {
  return gender === 'female' ? GIRL_ASSET : BOY_ASSET;
}

export function hasGenderAvatar(gender?: Gender | null): boolean {
  return gender === 'male' || gender === 'female' || gender === 'other';
}
