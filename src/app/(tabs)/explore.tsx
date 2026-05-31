import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Badge } from '@shared/ui';

const features = [
  { title: 'AI Wishes', description: 'Generate personalized messages via Supabase Edge Functions.' },
  { title: 'Greeting Cards', description: 'Build and share custom celebration cards.' },
  { title: 'Gift Ideas', description: 'AI-powered gift recommendations per contact.' },
  { title: 'Memory Timeline', description: 'Photos and captions for every celebration.' },
  { title: 'Referrals', description: 'Invite friends and earn rewards.' },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-6 py-8" contentContainerClassName="gap-4">
        <Text className="text-2xl font-bold text-foreground">Celebrate</Text>
        <Text className="text-muted">Platform modules ready for implementation.</Text>

        {features.map((feature) => (
          <Card key={feature.title}>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-foreground font-semibold">{feature.title}</Text>
              <Badge label="Soon" variant="premium" />
            </View>
            <Text className="text-muted text-sm">{feature.description}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
