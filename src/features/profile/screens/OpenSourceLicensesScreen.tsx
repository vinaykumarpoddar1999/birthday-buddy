import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OpenSourcePackage {
  name: string;
  license: string;
  description: string;
}

const OPEN_SOURCE_PACKAGES: OpenSourcePackage[] = [
  { name: 'React & React Native', license: 'MIT', description: 'UI framework and native mobile runtime.' },
  { name: 'Expo SDK', license: 'MIT', description: 'Development platform, modules, and tooling.' },
  { name: 'Expo Router', license: 'MIT', description: 'File-based navigation for the app.' },
  { name: 'NativeWind', license: 'MIT', description: 'Tailwind CSS styling for React Native.' },
  { name: 'Zustand', license: 'MIT', description: 'Lightweight state management.' },
  { name: 'TanStack Query', license: 'MIT', description: 'Server state and data fetching.' },
  { name: 'Axios', license: 'MIT', description: 'HTTP client for API requests.' },
  { name: 'React Hook Form', license: 'MIT', description: 'Form state and validation helpers.' },
  { name: 'Zod', license: 'MIT', description: 'Schema validation library.' },
  { name: 'date-fns', license: 'MIT', description: 'Date formatting and manipulation.' },
  { name: 'Lucide React Native', license: 'ISC', description: 'Icon set used across the app.' },
  { name: 'React Native Reanimated', license: 'MIT', description: 'Animations and gestures.' },
  { name: 'React Native SVG', license: 'MIT', description: 'SVG rendering support.' },
  { name: 'React Native Safe Area Context', license: 'MIT', description: 'Safe area insets for layouts.' },
  { name: 'React Native Gesture Handler', license: 'MIT', description: 'Native-driven gesture system.' },
  { name: 'Expo SQLite', license: 'MIT', description: 'Local database storage.' },
  { name: 'Expo Notifications', license: 'MIT', description: 'Push and local notifications.' },
  { name: 'Expo Secure Store', license: 'MIT', description: 'Encrypted credential storage.' },
];

export const OpenSourceLicensesScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Open Source Licenses</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4 leading-5">
          BirthdayBuddy is built with open source software. We are grateful to the communities behind these projects.
        </Text>

        <View className="bg-surface rounded-2xl border border-border/60 px-4 mb-4">
          {OPEN_SOURCE_PACKAGES.map((pkg, index) => (
            <View key={pkg.name}>
              <View className="py-3.5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[15px] font-medium text-foreground flex-1 pr-2">{pkg.name}</Text>
                  <View className="bg-primary/10 rounded-lg px-2.5 py-1">
                    <Text className="text-[11px] font-bold text-primary">{pkg.license}</Text>
                  </View>
                </View>
                <Text className="text-[12px] text-foreground-secondary mt-1 leading-4">{pkg.description}</Text>
              </View>
              {index < OPEN_SOURCE_PACKAGES.length - 1 ? <View className="h-[0.5px] bg-border/60" /> : null}
            </View>
          ))}
        </View>

        <View className="bg-surface rounded-2xl p-4 border border-border/60 mt-4 mb-2">
          <Text className="text-[13px] text-foreground-secondary leading-5">
            Full license texts are available in each package&apos;s repository. MIT and ISC licenses permit use,
            modification, and distribution with attribution.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
