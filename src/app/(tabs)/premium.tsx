import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card } from '@shared/ui';

const staticPlans = [
  { id: 'free', name: 'Free', price: 0, interval: 'month' },
  { id: 'monthly', name: 'Premium Monthly', price: 9.99, interval: 'month' },
  { id: 'yearly', name: 'Premium Yearly', price: 79.99, interval: 'year' },
];

export default function PremiumScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4 gap-4">
        <Text className="text-xl font-bold text-foreground">Premium</Text>
        <Badge label="Demo Plans" variant="premium" />
        {staticPlans.map((plan) => (
          <Card key={plan.id}>
            <Text className="text-foreground font-semibold">{plan.name}</Text>
            <Text className="text-muted">
              ${plan.price} / {plan.interval}
            </Text>
            <Button
              className="mt-3"
              label="Subscribe (UI only)"
              onPress={() => {}}
            />
          </Card>
        ))}
      </View>
    </SafeAreaView>
  );
}
