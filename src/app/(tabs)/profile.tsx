import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-heading text-foreground font-bold">Profile</Text>
      <Text className="text-body text-foreground-secondary mt-2 text-center">
        Static placeholder — profile settings coming soon.
      </Text>
    </SafeAreaView>
  );
}
