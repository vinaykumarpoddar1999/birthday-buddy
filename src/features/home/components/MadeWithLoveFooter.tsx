import { Heart } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { scale } from '../constants/design-tokens';

export function MadeWithLoveFooter() {
  return (
    <View style={{ marginTop: scale(16), marginBottom: scale(8) }}>
      <LinearGradient
        colors={['#FAF5FF', '#FDF2F8', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: scale(20),
          borderWidth: 1,
          borderColor: 'rgba(124, 58, 237, 0.12)',
          paddingVertical: scale(18),
          paddingHorizontal: scale(20),
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
          <Heart size={scale(16)} color="#EC4899" fill="#F472B6" />
          <Text
            style={{
              fontSize: scale(13),
              fontWeight: '600',
              color: '#6B7280',
              textAlign: 'center',
            }}>
            Made with love by Birthday Buddy Team
          </Text>
          <Heart size={scale(16)} color="#7C3AED" fill="#A855F7" />
        </View>
      </LinearGradient>
    </View>
  );
}
