import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, ImagePlus, Sparkles, Wand2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { feedback } from '@/shared/feedback';
import { useCardStudioStore } from '../../store/card-studio.store';

const THEMES = [
  { id: 'party', label: 'Party', colors: ['#8B5CF6', '#EC4899'] },
  { id: 'luxury', label: 'Luxury', colors: ['#F59E0B', '#92400E'] },
  { id: 'cute', label: 'Cute', colors: ['#FCE7F3', '#F472B6'] },
  { id: 'modern', label: 'Modern', colors: ['#1F2937', '#6366F1'] },
  { id: 'romantic', label: 'Romantic', colors: ['#FDA4AF', '#BE185D'] },
];

export function QuickDesignPanel() {
  const personalization = useCardStudioStore((s) => s.personalization);
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);
  const applyQuickDesign = useCardStudioStore((s) => s.applyQuickDesign);

  const pickPhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      feedback.error('Permission needed', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      updatePersonalization({ photoUri: result.assets[0].uri });
    }
  }, [updatePersonalization]);

  return (
    <ScrollView style={{ maxHeight: 256 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}>
      <View className="flex-row items-center gap-2 mb-3">
        <Wand2 size={16} color="#7C3AED" />
        <Text className="text-[14px] font-bold text-foreground">Quick Design</Text>
        <View className="bg-primary/10 px-2 py-0.5 rounded-full">
          <Text className="text-[9px] font-bold text-primary">60 sec</Text>
        </View>
      </View>

      <Text className="text-[11px] text-foreground-muted mb-1">Recipient Name</Text>
      <TextInput
        value={personalization.recipientName}
        onChangeText={(v) => updatePersonalization({ recipientName: v })}
        placeholder="Who is this for?"
        placeholderTextColor="#9CA3AF"
        className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-[14px] mb-3"
        accessibilityLabel="Recipient name"
      />

      <View className="flex-row gap-2 mb-3">
        <View className="flex-1">
          <Text className="text-[11px] text-foreground-muted mb-1">Relationship</Text>
          <TextInput
            value={personalization.relationship}
            onChangeText={(v) => updatePersonalization({ relationship: v })}
            placeholder="Friend, Mom..."
            placeholderTextColor="#9CA3AF"
            className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-[14px]"
            accessibilityLabel="Relationship"
          />
        </View>
        <View className="w-20">
          <Text className="text-[11px] text-foreground-muted mb-1">Age</Text>
          <TextInput
            value={personalization.age}
            onChangeText={(v) => updatePersonalization({ age: v })}
            placeholder="25"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-[14px]"
            accessibilityLabel="Age"
          />
        </View>
      </View>

      <Text className="text-[11px] text-foreground-muted mb-1">Birthday Wish</Text>
      <TextInput
        value={personalization.message}
        onChangeText={(v) => updatePersonalization({ message: v })}
        placeholder="Write a heartfelt message..."
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={3}
        className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-[14px] mb-3 min-h-[72px]"
        accessibilityLabel="Birthday wish"
      />

      <Text className="text-[11px] text-foreground-muted mb-2">Theme</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ gap: 8 }}>
        {THEMES.map((theme) => {
          const active = personalization.theme === theme.id;
          return (
            <Pressable
              key={theme.id}
              onPress={() => updatePersonalization({ theme: theme.id })}
              accessibilityRole="button"
              accessibilityLabel={`${theme.label} theme${active ? ', selected' : ''}`}>
              <LinearGradient
                colors={theme.colors as [string, string]}
                style={{
                  width: 64,
                  height: 44,
                  borderRadius: 12,
                  borderWidth: active ? 2 : 1,
                  borderColor: active ? '#7C3AED' : '#E5E7EB',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text className="text-[10px] font-bold text-white">{theme.label}</Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="flex-row gap-2 mb-3">
        <Pressable onPress={pickPhoto} className="flex-1 flex-row items-center justify-center py-3 rounded-xl bg-white border border-gray-100 gap-2" accessibilityRole="button">
          <ImagePlus size={15} color="#7C3AED" />
          <Text className="text-[12px] font-semibold">Add Photo</Text>
        </Pressable>
        <Pressable
          onPress={() => ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.85, aspect: [1, 1] }).then((r) => {
            if (!r.canceled && r.assets[0]) updatePersonalization({ photoUri: r.assets[0].uri });
          })}
          className="flex-1 flex-row items-center justify-center py-3 rounded-xl bg-white border border-gray-100 gap-2"
          accessibilityRole="button">
          <Camera size={15} color="#EC4899" />
          <Text className="text-[12px] font-semibold">Camera</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={applyQuickDesign}
        className="overflow-hidden rounded-2xl"
        accessibilityRole="button"
        accessibilityLabel="Generate card automatically">
        <LinearGradient colors={['#7C3AED', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <View className="flex-row items-center justify-center py-3.5 gap-2">
            <Sparkles size={16} color="#FFF" />
            <Text className="text-[14px] font-bold text-white">Generate Beautiful Card</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </ScrollView>
  );
}
