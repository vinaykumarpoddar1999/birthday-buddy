import React from 'react';
import { View } from 'react-native';

import { Input } from '@shared/ui';

import { useCardStudioStore } from '../../store/card-studio.store';

export function EditorContentPanel() {
  const personalization = useCardStudioStore((s) => s.personalization);
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);

  return (
    <View className="px-4 pb-3 gap-3">
      <Input
        label="Name"
        value={personalization.recipientName}
        onChangeText={(recipientName) => updatePersonalization({ recipientName })}
        placeholder="Who is this for?"
      />
      <Input
        label="Message"
        value={personalization.message}
        onChangeText={(message) => updatePersonalization({ message })}
        placeholder="Write your wish..."
      />
    </View>
  );
}
