import React, { useCallback } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Camera, ImagePlus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { useCardStudioStore } from '../store/card-studio.store';
import { CardCanvas } from '../components/editor/CardCanvas';
import { PersonalizationForm } from '../components/editor/PersonalizationForm';
import { DecorationPicker } from '../components/editor/DecorationPicker';
import { AIGeneratorPanel } from '../components/editor/AIGeneratorPanel';

export function Step2CustomizeScreen() {
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);
  const addElement = useCardStudioStore((s) => s.addElement);
  const elements = useCardStudioStore((s) => s.elements);
  const nextStep = useCardStudioStore((s) => s.nextStep);

  const pickPhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      updatePersonalization({ photoUri: uri });
      const maxZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex)) : 0;
      addElement({
        id: `img-${Date.now()}`,
        type: 'image',
        uri,
        x: 70,
        y: 100,
        width: 200,
        height: 200,
        rotation: 0,
        opacity: 1,
        zIndex: maxZ + 1,
        visible: true,
        borderRadius: 12,
      });
    }
  }, [updatePersonalization, addElement, elements]);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      updatePersonalization({ photoUri: uri });
    }
  }, [updatePersonalization]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-28"
        keyboardShouldPersistTaps="handled">
        {/* Live card preview */}
        <CardCanvas />

        {/* Photo actions */}
        <View className="flex-row gap-3 px-5 mb-5">
          <Pressable
            onPress={pickPhoto}
            className="flex-1 flex-row items-center justify-center bg-white border border-gray-200 rounded-xl py-3 gap-2"
            accessibilityRole="button">
            <ImagePlus size={16} color="#7C3AED" />
            <Text className="text-[12px] font-semibold text-primary">Add Photo</Text>
          </Pressable>
          <Pressable
            onPress={takePhoto}
            className="flex-1 flex-row items-center justify-center bg-white border border-gray-200 rounded-xl py-3 gap-2"
            accessibilityRole="button">
            <Camera size={16} color="#7C3AED" />
            <Text className="text-[12px] font-semibold text-primary">Take Photo</Text>
          </Pressable>
        </View>

        {/* Personalization form */}
        <View className="mb-2">
          <View className="px-5 mb-3">
            <Text className="text-body font-bold text-foreground">Personalize Your Card</Text>
            <Text className="text-[11px] text-foreground-muted mt-0.5">
              Changes update the card in real time
            </Text>
          </View>
          <PersonalizationForm />
        </View>

        {/* AI Generator */}
        <AIGeneratorPanel />

        {/* Stickers */}
        <DecorationPicker />
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4">
        <Pressable
          onPress={nextStep}
          className="bg-primary rounded-2xl py-4 items-center shadow-md"
          accessibilityRole="button">
          <Text className="text-[15px] font-bold text-white">Preview Card →</Text>
        </Pressable>
      </View>
    </View>
  );
}
