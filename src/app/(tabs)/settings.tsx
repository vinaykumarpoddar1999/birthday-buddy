import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Button, Card } from '@shared/ui';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4 gap-4">
        <Text className="text-xl font-bold text-foreground">Settings</Text>
        <Card>
          <Text className="text-foreground">Theme: system</Text>
          <Text className="text-muted mt-2">
            Notifications: {notificationsEnabled ? 'On' : 'Off'}
          </Text>
          <Text className="text-muted mt-2">Language: en</Text>
        </Card>
        <Button
          label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
          variant="outline"
          onPress={() => setNotificationsEnabled((prev) => !prev)}
        />
        <Button label="Sign out (UI only)" variant="ghost" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
