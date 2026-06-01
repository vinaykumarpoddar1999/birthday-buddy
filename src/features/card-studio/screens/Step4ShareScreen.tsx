import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { feedback } from '@/shared/feedback';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  ClipboardCopy,
  Download,
  MessageCircle,
  Plus,
  Save,
  PartyPopper,
} from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

import { cardService } from '@/services/card/card.service';

import { useCardStudioStore } from '../store/card-studio.store';
import { CardRenderer } from '../components/preview/CardRenderer';

const SCREEN_W = Dimensions.get('window').width;
const CARD_SCALE = Math.min((SCREEN_W - 80) / 340, 0.72);

export function Step4ShareScreen() {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const personalization = useCardStudioStore((s) => s.personalization);
  const elements = useCardStudioStore((s) => s.elements);
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const preFilledPersonId = useCardStudioStore((s) => s.preFilledPersonId);
  const saveDraft = useCardStudioStore((s) => s.saveDraft);
  const reset = useCardStudioStore((s) => s.reset);

  const cardRef = useRef<View>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);

  const capture = useCallback(async () => {
    if (!cardRef.current) return null;
    try {
      return await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' });
    } catch {
      feedback.error('Error', 'Could not capture card.');
      return null;
    }
  }, []);

  const persistCard = useCallback(
    async (exportUri?: string): Promise<string | undefined> => {
      if (!template) return undefined;
      return cardService.saveStudioCard({
        personUuid: preFilledPersonId,
        templateId: template.id,
        personalization,
        elements,
        exportUri,
      });
    },
    [template, preFilledPersonId, personalization, elements],
  );

  const handleDownload = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        feedback.error('Permission needed', 'Allow access to save images.');
        setSaving(false);
        return;
      }
      const uri = await capture();
      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        await persistCard(uri);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      feedback.error('Error', 'Failed to save.');
    }
    setSaving(false);
  }, [capture, persistCard]);

  const handleShare = useCallback(async () => {
    setSharing(true);
    try {
      const ok = await Sharing.isAvailableAsync();
      if (!ok) {
        feedback.error('Not available', 'Sharing is not supported on this device.');
        setSharing(false);
        return;
      }
      const uri = await capture();
      if (uri) {
        const cardUuid = await persistCard(uri);
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Birthday card for ${personalization.recipientName}`,
        });
        if (cardUuid) {
          await cardService.logShared(cardUuid, 'share_sheet');
        }
      }
    } catch {
      feedback.error('Error', 'Failed to share.');
    }
    setSharing(false);
  }, [capture, personalization.recipientName, persistCard]);

  const handleCopy = useCallback(() => {
    const msg = [
      `Happy Birthday, ${personalization.recipientName}!`,
      personalization.message ? `\n${personalization.message}` : '',
      personalization.senderName ? `\n\n— ${personalization.senderName}` : '',
    ].join('');

    if (Platform.OS === 'web') {
      navigator.clipboard?.writeText(msg);
    }
    feedback.success('Copied!', 'Birthday message copied to clipboard.');
  }, [personalization]);

  if (!template) return null;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-12">
        {/* Success Banner */}
        <View className="mx-5 mt-3 mb-5">
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              shadowColor: '#22C55E',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 4,
            }}>
            <LinearGradient
              colors={['#ECFDF5', '#D1FAE5', '#ECFDF5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <View className="flex-row items-center px-5 py-4 gap-4">
                <View className="h-12 w-12 rounded-2xl bg-green-500 items-center justify-center">
                  <PartyPopper size={22} color="#FFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-[16px] font-bold text-green-800">
                    Card Ready!
                  </Text>
                  <Text className="text-[12px] text-green-700 mt-0.5">
                    Save it or share with {personalization.recipientName || 'your loved one'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Card Preview */}
        <View className="items-center py-3">
          <View
            ref={cardRef}
            collapsable={false}
            className="rounded-2xl overflow-hidden"
            style={{
              width: 340 * CARD_SCALE,
              height: 480 * CARD_SCALE,
              shadowColor: '#7C3AED',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 6,
            }}>
            <CardRenderer
              template={template}
              personalization={personalization}
              elements={elements}
              scale={CARD_SCALE}
              customBackground={customBackground}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-5 mt-5">
          {/* Primary: Download */}
          <Pressable
            onPress={handleDownload}
            disabled={saving}
            className="overflow-hidden rounded-2xl mb-3"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: saved ? '#22C55E' : '#7C3AED',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            })}
            accessibilityRole="button">
            <LinearGradient
              colors={saved ? ['#22C55E', '#16A34A'] : ['#7C3AED', '#5B21B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <View className="flex-row items-center justify-center py-4 gap-2.5">
                {saved ? (
                  <Check size={20} color="#FFF" strokeWidth={3} />
                ) : (
                  <Download size={19} color="#FFF" />
                )}
                <Text className="text-[16px] font-bold text-white">
                  {saving ? 'Saving...' : saved ? 'Saved to Gallery!' : 'Save to Gallery'}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Share actions */}
          <View className="flex-row gap-3 mb-3">
            <Pressable
              onPress={handleShare}
              disabled={sharing}
              className="flex-1 flex-row items-center justify-center rounded-2xl py-3.5 gap-2"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
                backgroundColor: '#22C55E',
                shadowColor: '#22C55E',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 4,
              })}
              accessibilityRole="button">
              <MessageCircle size={17} color="#FFF" />
              <Text className="text-[14px] font-bold text-white">
                {sharing ? 'Sharing...' : 'Share'}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCopy}
              className="flex-1 flex-row items-center justify-center rounded-2xl py-3.5 gap-2"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
                backgroundColor: '#1F2937',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              })}
              accessibilityRole="button">
              <ClipboardCopy size={16} color="#FFF" />
              <Text className="text-[14px] font-bold text-white">Copy Text</Text>
            </Pressable>
          </View>

          {/* Secondary actions */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => {
                saveDraft();
                feedback.success('Saved!', 'Draft has been saved.');
              }}
              className="flex-1 flex-row items-center justify-center bg-white rounded-2xl py-3.5 gap-2 border border-gray-100"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              })}
              accessibilityRole="button">
              <Save size={15} color="#6B7280" />
              <Text className="text-[13px] font-semibold text-foreground">Save Draft</Text>
            </Pressable>
            <Pressable
              onPress={reset}
              className="flex-1 flex-row items-center justify-center rounded-2xl py-3.5 gap-2 bg-primary/8 border border-primary/15"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
              accessibilityRole="button">
              <Plus size={15} color="#7C3AED" />
              <Text className="text-[13px] font-semibold text-primary">New Card</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
