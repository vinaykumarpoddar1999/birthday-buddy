import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeFab() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 10) + 76;

  return (
    <View className="absolute right-5 z-50" style={{ bottom }} pointerEvents="box-none">
      <Pressable
        onPress={() => router.push('/add-person')}
        accessibilityRole="button"
        accessibilityLabel="Add person"
        style={{
          height: 56,
          width: 56,
          borderRadius: 28,
          backgroundColor: '#7C3AED',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 4,
          borderColor: '#F9FAFB',
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.45,
          shadowRadius: 14,
          elevation: 12,
        }}>
        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}
