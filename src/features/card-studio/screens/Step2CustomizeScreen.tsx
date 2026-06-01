import React, { useCallback } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Camera, ChevronRight, ImagePlus, Layers } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { useCardStudioStore } from '../store/card-studio.store';
import { CardCanvas } from '../components/editor/CardCanvas';
import { PersonalizationForm } from '../components/editor/PersonalizationForm';
import { DecorationPicker } from '../components/editor/DecorationPicker';
import { AIGeneratorPanel } from '../components/editor/AIGeneratorPanel';

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <View className="flex-row items-center px-5 mb-3">
      <View className="h-8 w-8 rounded-xl bg-primary/8 items-center justify-center mr-2.5">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-foreground">{title}</Text>
        <Text className="text-[10px] text-foreground-muted mt-0.5">{subtitle}</Text>
      </View>
    </View>
  );
}

export function Step2CustomizeScreen() {
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);
  const addElement = useCardStudioStore((s) => s.addElement);
  const elements = useCardStudioStore((s) => s.elements);
  const nextStep = useCardStudioStore((s) => s.nextStep);
  const template = useCardStudioStore((s) => s.selectedTemplate);

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

        {/* Live Card Preview */}
        <CardCanvas />

        {/* Photo Actions */}
        <View className="flex-row gap-3 px-5 mb-6">
          <Pressable
            onPress={pickPhoto}
            className="flex-1 flex-row items-center justify-center bg-white rounded-2xl py-3.5 gap-2.5 border border-gray-100"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.97 : 1 }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            })}
            accessibilityRole="button">
            <View className="h-7 w-7 rounded-lg bg-primary/8 items-center justify-center">
              <ImagePlus size={14} color="#7C3AED" />
            </View>
            <Text className="text-[13px] font-semibold text-foreground">Gallery</Text>
          </Pressable>
          <Pressable
            onPress={takePhoto}
            className="flex-1 flex-row items-center justify-center bg-white rounded-2xl py-3.5 gap-2.5 border border-gray-100"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.97 : 1 }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            })}
            accessibilityRole="button">
            <View className="h-7 w-7 rounded-lg bg-secondary/8 items-center justify-center">
              <Camera size={14} color="#EC4899" />
            </View>
            <Text className="text-[13px] font-semibold text-foreground">Camera</Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-gray-100 mx-5 mb-5" />

        {/* Personalization Section */}
        <View className="mb-5">
          <SectionHeader
            icon={<Layers size={15} color="#7C3AED" />}
            title="Personalize Your Card"
            subtitle="Changes update the card in real time"
          />
          <PersonalizationForm />
        </View>

        {/* AI Generator */}
        <AIGeneratorPanel />

        {/* Stickers */}
        <DecorationPicker />
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3 bg-background/95">
        <Pressable
          onPress={nextStep}
          className="overflow-hidden rounded-2xl"
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          })}
          accessibilityRole="button">
          <LinearGradient
            colors={['#7C3AED', '#5B21B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <View className="flex-row items-center justify-center py-4 gap-2">
              <Text className="text-[15px] font-bold text-white">Preview Card</Text>
              <ChevronRight size={18} color="#FFF" />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
