import React, { useCallback, useRef, useState } from 'react';
import { Alert, Dimensions, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  ClipboardCopy,
  Download,
  MessageCircle,
  Plus,
} from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

import { useCardStudioStore } from '../store/card-studio.store';
import { CardRenderer } from '../components/preview/CardRenderer';

const SCREEN_W = Dimensions.get('window').width;
const CARD_SCALE = Math.min((SCREEN_W - 80) / 340, 0.72);

export function Step4ShareScreen() {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const personalization = useCardStudioStore((s) => s.personalization);
  const elements = useCardStudioStore((s) => s.elements);
  const saveDraft = useCardStudioStore((s) => s.saveDraft);
  const reset = useCardStudioStore((s) => s.reset);

  const cardRef = useRef<View>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  const capture = useCallback(async () => {
    if (!cardRef.current) return null;
    try {
      return await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' });
    } catch {
      Alert.alert('Error', 'Could not capture card.');
      return null;
    }
  }, []);

  const handleDownload = useCallback(async () => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow access to save images.');
        setSaving(false);
        return;
      }
      const uri = await capture();
      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Saved! 🎉', 'Your card has been saved to your gallery.');
      }
    } catch {
      Alert.alert('Error', 'Failed to save.');
    }
    setSaving(false);
  }, [capture]);

  const handleShare = useCallback(async () => {
    setSharing(true);
    try {
      const ok = await Sharing.isAvailableAsync();
      if (!ok) {
        Alert.alert('Not available', 'Sharing is not supported on this device.');
        setSharing(false);
        return;
      }
      const uri = await capture();
      if (uri) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Birthday card for ${personalization.recipientName}`,
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to share.');
    }
    setSharing(false);
  }, [capture, personalization.recipientName]);

  const handleCopy = useCallback(() => {
    const msg = [
      `🎂 Happy Birthday, ${personalization.recipientName}!`,
      personalization.message ? `\n${personalization.message}` : '',
      personalization.senderName ? `\n\n— ${personalization.senderName}` : '',
    ].join('');

    if (Platform.OS === 'web') {
      navigator.clipboard?.writeText(msg);
    }
    Alert.alert('Copied! 📋', 'Birthday message copied to clipboard.');
  }, [personalization]);

  if (!template) return null;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-12">
        {/* Success banner */}
        <View className="mx-5 mt-3 mb-4 overflow-hidden rounded-2xl">
          <LinearGradient colors={['#ECFDF5', '#D1FAE5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <View className="flex-row items-center px-4 py-3 gap-3">
              <View className="h-9 w-9 rounded-full bg-green-500 items-center justify-center">
                <Check size={18} color="#FFF" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-green-800">Card ready! 🎉</Text>
                <Text className="text-[11px] text-green-700 mt-0.5">Download or share with your loved ones</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Card preview */}
        <View className="items-center py-4">
          <View
            ref={cardRef}
            collapsable={false}
            style={{
              width: 340 * CARD_SCALE,
              height: 480 * CARD_SCALE,
              borderRadius: 16,
              overflow: 'hidden',
            }}
            className="shadow-lg">
            <CardRenderer
              template={template}
              personalization={personalization}
              elements={elements}
              scale={CARD_SCALE}
            />
          </View>
        </View>

        {/* Download */}
        <View className="px-5 mt-4">
          <Pressable
            onPress={handleDownload}
            disabled={saving}
            className="overflow-hidden rounded-2xl mb-3"
            accessibilityRole="button">
            <LinearGradient colors={['#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="flex-row items-center justify-center py-4 gap-2">
                <Download size={18} color="#FFF" />
                <Text className="text-[15px] font-bold text-white">
                  {saving ? 'Saving...' : 'Save to Gallery'}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Share actions */}
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={handleShare}
              disabled={sharing}
              className="flex-1 flex-row items-center justify-center bg-green-500 rounded-2xl py-3.5 gap-2"
              accessibilityRole="button">
              <MessageCircle size={16} color="#FFF" />
              <Text className="text-[13px] font-bold text-white">
                {sharing ? '...' : 'Share'}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCopy}
              className="flex-1 flex-row items-center justify-center bg-gray-800 rounded-2xl py-3.5 gap-2"
              accessibilityRole="button">
              <ClipboardCopy size={16} color="#FFF" />
              <Text className="text-[13px] font-bold text-white">Copy Text</Text>
            </Pressable>
          </View>

          {/* Secondary actions */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => {
                saveDraft();
                Alert.alert('Saved!', 'Draft has been saved.');
              }}
              className="flex-1 items-center bg-white border border-gray-200 rounded-2xl py-3.5"
              accessibilityRole="button">
              <Text className="text-[12px] font-semibold text-foreground">Save Draft</Text>
            </Pressable>
            <Pressable
              onPress={reset}
              className="flex-1 flex-row items-center justify-center bg-primary/10 rounded-2xl py-3.5 gap-1.5"
              accessibilityRole="button">
              <Plus size={14} color="#7C3AED" />
              <Text className="text-[12px] font-semibold text-primary">New Card</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
