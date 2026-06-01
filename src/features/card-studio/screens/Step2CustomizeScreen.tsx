import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { feedback } from '@/shared/feedback';
import { Camera, ChevronRight, ImagePlus, Layers, Palette, Shapes, Type } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { useCardStudioStore } from '../store/card-studio.store';
import { useCardEditor } from '../hooks/useCardEditor';
import { CardCanvas } from '../components/editor/CardCanvas';
import { PersonalizationForm } from '../components/editor/PersonalizationForm';
import { DecorationPicker } from '../components/editor/DecorationPicker';
import { AIGeneratorPanel } from '../components/editor/AIGeneratorPanel';
import { BackgroundPicker } from '../components/editor/BackgroundPicker';
import { EditorToolbar } from '../components/editor/EditorToolbar';

type EditorTab = 'design' | 'content' | 'photos' | 'background' | 'elements';

const TABS: { id: EditorTab; label: string; icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: 'design', label: 'Design', icon: Layers },
  { id: 'content', label: 'Content', icon: Type },
  { id: 'photos', label: 'Photos', icon: ImagePlus },
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'elements', label: 'Elements', icon: Shapes },
];

function TabBar({ active, onChange }: { active: EditorTab; onChange: (t: EditorTab) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-b border-border mb-2"
      contentContainerClassName="px-4 gap-1">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <Pressable
            key={id}
            onPress={() => onChange(id)}
            className={`flex-row items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl ${isActive ? 'bg-primary/10 border-b-2 border-primary' : ''}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}>
            <Icon size={14} color={isActive ? '#7C3AED' : '#9CA3AF'} />
            <Text className={`text-[12px] font-semibold ${isActive ? 'text-primary' : 'text-foreground-muted'}`}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function Step2CustomizeScreen() {
  const [activeTab, setActiveTab] = useState<EditorTab>('design');
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);
  const addElement = useCardStudioStore((s) => s.addElement);
  const elements = useCardStudioStore((s) => s.elements);
  const nextStep = useCardStudioStore((s) => s.nextStep);
  const { addTextElement } = useCardEditor();

  const pickPhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      feedback.error('Permission needed', 'Please allow photo library access.');
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
      feedback.error('Permission needed', 'Please allow camera access.');
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <>
            <PersonalizationForm />
            <AIGeneratorPanel />
          </>
        );
      case 'photos':
        return (
          <View className="px-5 mb-6">
            <View className="flex-row gap-3">
              <Pressable
                onPress={pickPhoto}
                className="flex-1 flex-row items-center justify-center bg-white rounded-2xl py-4 gap-2 border border-gray-100"
                accessibilityRole="button">
                <ImagePlus size={16} color="#7C3AED" />
                <Text className="text-[13px] font-semibold text-foreground">Gallery</Text>
              </Pressable>
              <Pressable
                onPress={takePhoto}
                className="flex-1 flex-row items-center justify-center bg-white rounded-2xl py-4 gap-2 border border-gray-100"
                accessibilityRole="button">
                <Camera size={16} color="#EC4899" />
                <Text className="text-[13px] font-semibold text-foreground">Camera</Text>
              </Pressable>
            </View>
          </View>
        );
      case 'background':
        return <BackgroundPicker />;
      case 'elements':
        return (
          <View className="mb-4">
            <Pressable
              onPress={() => addTextElement('Your text here')}
              className="mx-5 mb-4 py-3.5 rounded-2xl bg-primary/10 border border-primary/20 items-center"
              accessibilityRole="button">
              <Text className="text-[13px] font-bold text-primary">+ Add Text Block</Text>
            </Pressable>
            <DecorationPicker />
          </View>
        );
      case 'design':
      default:
        return <EditorToolbar />;
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-28"
        keyboardShouldPersistTaps="handled">
        <CardCanvas editable />
        <TabBar active={activeTab} onChange={setActiveTab} />
        {renderTabContent()}
      </ScrollView>

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
          <LinearGradient colors={['#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
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
