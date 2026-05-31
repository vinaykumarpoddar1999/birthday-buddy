import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { useCardStudioStore } from '../../store/card-studio.store';

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <View className="mb-4">
      <Text className="text-[12px] font-semibold text-foreground-secondary mb-1.5 ml-1">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C4B5FD"
        multiline={multiline}
        className={`bg-white border border-gray-200 rounded-xl px-4 text-body text-foreground ${
          multiline ? 'py-3 min-h-[90px]' : 'py-3'
        }`}
        style={multiline ? { textAlignVertical: 'top' } : undefined}
      />
    </View>
  );
}

export function PersonalizationForm() {
  const p = useCardStudioStore((s) => s.personalization);
  const update = useCardStudioStore((s) => s.updatePersonalization);

  return (
    <View className="px-5">
      <Field
        label="Recipient Name"
        value={p.recipientName}
        onChangeText={(t) => update({ recipientName: t })}
        placeholder="Who is this card for?"
      />
      <Field
        label="Your Message"
        value={p.message}
        onChangeText={(t) => update({ message: t })}
        placeholder="Write a heartfelt message..."
        multiline
      />
      <Field
        label="From"
        value={p.senderName}
        onChangeText={(t) => update({ senderName: t })}
        placeholder="Your name or signature"
      />
    </View>
  );
}
