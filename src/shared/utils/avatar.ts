import type { ImageSourcePropType } from 'react-native';

export type Gender = 'male' | 'female';

const BOY_ASSET: ImageSourcePropType = require('../../../assets/images/boy.png');
const GIRL_ASSET: ImageSourcePropType = require('../../../assets/images/girl.png');

export function getAvatarSource(gender: Gender): ImageSourcePropType {
  return gender === 'female' ? GIRL_ASSET : BOY_ASSET;
}
