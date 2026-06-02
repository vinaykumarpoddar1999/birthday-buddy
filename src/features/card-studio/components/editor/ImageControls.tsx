import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Camera, ImagePlus, RotateCw, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { feedback } from '@/shared/feedback';
import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardElement } from '../../types';

type Props = { element: CardElement };

export function ImageControls({ element }: Props) {
  const updateElement = useCardStudioStore((s) => s.updateElement);
  const deleteElement = useCardStudioStore((s) => s.deleteElement);
  const pushHistory = useCardStudioStore((s) => s.pushHistory);

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
      updateElement(element.id, { uri: result.assets[0].uri });
      pushHistory();
    }
  }, [element.id, updateElement, pushHistory]);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      feedback.error('Permission needed', 'Please allow camera access.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.85,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      updateElement(element.id, { uri: result.assets[0].uri });
      pushHistory();
    }
  }, [element.id, updateElement, pushHistory]);

  const adjust = (updates: Partial<CardElement>) => {
    updateElement(element.id, updates);
    pushHistory();
  };

  return (
    <View className="px-4 pb-2">
      <Text className="text-[11px] font-bold text-foreground-muted mb-3 uppercase tracking-wide">Photo</Text>
      <View className="flex-row gap-2 mb-3">
        <Pressable onPress={pickPhoto} className="flex-1 flex-row items-center justify-center py-3 rounded-xl bg-white border border-gray-100 gap-2" accessibilityRole="button">
          <ImagePlus size={15} color="#7C3AED" />
          <Text className="text-[12px] font-semibold">Replace</Text>
        </Pressable>
        <Pressable onPress={takePhoto} className="flex-1 flex-row items-center justify-center py-3 rounded-xl bg-white border border-gray-100 gap-2" accessibilityRole="button">
          <Camera size={15} color="#EC4899" />
          <Text className="text-[12px] font-semibold">Camera</Text>
        </Pressable>
      </View>
      <View className="flex-row gap-2 mb-2">
        <Pressable
          onPress={() => adjust({ rotation: (element.rotation + 90) % 360 })}
          className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-gray-50 gap-1"
          accessibilityRole="button">
          <RotateCw size={14} color="#7C3AED" />
          <Text className="text-[11px] font-semibold">Rotate</Text>
        </Pressable>
        <Pressable
          onPress={() => adjust({ borderRadius: element.borderRadius === 999 ? 0 : 999 })}
          className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-gray-50"
          accessibilityRole="button">
          <Text className="text-[11px] font-semibold">{element.borderRadius === 999 ? 'Square' : 'Circle'}</Text>
        </Pressable>
        <Pressable
          onPress={() => deleteElement(element.id)}
          className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-red-50 gap-1"
          accessibilityRole="button">
          <Trash2 size={14} color="#DC2626" />
          <Text className="text-[11px] font-semibold text-red-600">Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}
