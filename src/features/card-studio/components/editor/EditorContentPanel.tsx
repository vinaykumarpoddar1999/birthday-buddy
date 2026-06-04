import React from 'react';
import { Platform, Text, View } from 'react-native';

import { Input } from '@shared/ui';

import { CardStudioSectionTitle } from '../common/CardStudioSectionTitle';
import { useCardStudioStore } from '../../store/card-studio.store';

const MAX_MESSAGE_LENGTH = 280;

export function EditorContentPanel() {
  const personalization = useCardStudioStore((s) => s.personalization);
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);

  return (
    <View className="px-4 pt-1 pb-2 gap-2.5">
      <CardStudioSectionTitle
        title="Card Content"
        subtitle="Personalize the message for your recipient"
      />

      <View className="rounded-xl bg-surface border border-border p-3 gap-3">
        <Input
          label="Recipient name"
          value={personalization.recipientName}
          onChangeText={(recipientName) => updatePersonalization({ recipientName })}
          placeholder="Who is this for?"
          className="py-2.5 text-[14px]"
          style={Platform.OS === 'android' ? { includeFontPadding: false } : undefined}
        />
        <Input
          label="From (optional)"
          value={personalization.senderName}
          onChangeText={(senderName) => updatePersonalization({ senderName })}
          placeholder="Your name"
          className="py-2.5 text-[14px]"
          style={Platform.OS === 'android' ? { includeFontPadding: false } : undefined}
        />
        <View>
          <Input
            label="Message"
            value={personalization.message}
            onChangeText={(message) =>
              updatePersonalization({ message: message.slice(0, MAX_MESSAGE_LENGTH) })
            }
            placeholder="Write your wish..."
            multiline
            numberOfLines={4}
            className="py-2.5 text-[14px] min-h-[72px]"
            textAlignVertical="top"
            style={
              Platform.OS === 'android'
                ? { includeFontPadding: false, textAlignVertical: 'top' }
                : { textAlignVertical: 'top' }
            }
          />
          <Text className="text-[10px] text-foreground-muted text-right mt-1">
            {personalization.message.length}/{MAX_MESSAGE_LENGTH}
          </Text>
        </View>
      </View>
    </View>
  );
}
