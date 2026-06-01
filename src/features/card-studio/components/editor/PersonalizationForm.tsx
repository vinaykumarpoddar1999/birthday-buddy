import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { User, MessageSquare, PenLine } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  multiline?: boolean;
  icon: React.ReactNode;
  maxLength?: number;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  icon,
  maxLength,
}: FieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2 ml-1">
        {icon}
        <Text className="text-[12px] font-semibold text-foreground-secondary ml-1.5">
          {label}
        </Text>
        {maxLength && value.length > 0 && (
          <Text className="text-[10px] text-foreground-muted ml-auto mr-1">
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
      <View
        className={`rounded-2xl overflow-hidden border ${
          isFocused ? 'border-primary' : 'border-gray-100'
        }`}
        style={isFocused ? {
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 3,
        } : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C4B5FD"
          multiline={multiline}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`bg-white px-4 text-[14px] text-foreground ${
            multiline ? 'py-3.5 min-h-[100px]' : 'py-3.5'
          }`}
          style={multiline ? { textAlignVertical: 'top' } : undefined}
        />
      </View>
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
        icon={<User size={13} color="#7C3AED" />}
        maxLength={30}
      />
      <Field
        label="Your Message"
        value={p.message}
        onChangeText={(t) => update({ message: t })}
        placeholder="Write a heartfelt message..."
        multiline
        icon={<MessageSquare size={13} color="#7C3AED" />}
        maxLength={200}
      />
      <Field
        label="From"
        value={p.senderName}
        onChangeText={(t) => update({ senderName: t })}
        placeholder="Your name or signature"
        icon={<PenLine size={13} color="#7C3AED" />}
        maxLength={30}
      />
    </View>
  );
}
