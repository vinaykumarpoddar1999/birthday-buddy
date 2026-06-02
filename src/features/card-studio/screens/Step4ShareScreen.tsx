import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { feedback } from '@/shared/feedback';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  ClipboardCopy,
  Download,
  Link2,
  MessageCircle,
  Plus,
  Save,
  PartyPopper,
} from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';

import { cardService } from '@/services/card/card.service';
import { useSurpriseLinkStore } from '@features/surprise-link/store/surprise-link.store';

import { useCardStudioStore } from '../store/card-studio.store';
import { CardRenderer } from '../components/preview/CardRenderer';
import { getCanvasDimensions } from '../utils/canvas-dimensions';

const SCREEN_W = Dimensions.get('window').width;

export function Step4ShareScreen() {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const personalization = useCardStudioStore((s) => s.personalization);
  const elements = useCardStudioStore((s) => s.elements);
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const canvasFormat = useCardStudioStore((s) => s.canvasFormat);
  const preFilledPersonId = useCardStudioStore((s) => s.preFilledPersonId);
  const uploadedPhotoUri = useCardStudioStore((s) => s.uploadedPhotoUri);
  const saveDraft = useCardStudioStore((s) => s.saveDraft);
  const reset = useCardStudioStore((s) => s.reset);
  const updateSurprisePersonalization = useSurpriseLinkStore((s) => s.updatePersonalization);
  const updateSurpriseHero = useSurpriseLinkStore((s) => s.updateHero);
  const setSurpriseStep = useSurpriseLinkStore((s) => s.setStep);
  const setSurpriseOccasion = useSurpriseLinkStore((s) => s.setOccasion);

  const handleTurnIntoSurprise = useCallback(() => {
    updateSurprisePersonalization({
      recipientName: personalization.recipientName,
      senderName: personalization.senderName,
      relationship: personalization.relationship,
    });
    updateSurpriseHero({
      welcomeMessage: `A surprise card for ${personalization.recipientName || 'you'} ❤️`,
      heroImageUri: personalization.photoUri,
      coverImageUri: uploadedPhotoUri ?? undefined,
    });
    setSurpriseOccasion(personalization.eventType === 'anniversary' ? 'anniversary' : 'birthday');
    setSurpriseStep(4);
    router.push({
      pathname: '/surprise-link-studio',
      params: preFilledPersonId ? { personId: preFilledPersonId, fromCard: '1' } : { fromCard: '1' },
    });
  }, [
    personalization,
    uploadedPhotoUri,
    preFilledPersonId,
    updateSurprisePersonalization,
    updateSurpriseHero,
    setSurpriseStep,
    setSurpriseOccasion,
  ]);

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
        customBackground,
        canvasFormat,
        exportUri,
      });
    },
    [template, preFilledPersonId, personalization, elements, customBackground, canvasFormat],
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

  const handleCopy = useCallback(async () => {
    const msg = [
      `Happy Birthday, ${personalization.recipientName}!`,
      personalization.message ? `\n${personalization.message}` : '',
      personalization.senderName ? `\n\n— ${personalization.senderName}` : '',
    ].join('');

    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard?.writeText(msg);
      } else {
        const { Share } = await import('react-native');
        await Share.share({ message: msg });
        return;
      }
      feedback.success('Copied!', 'Birthday message copied to clipboard.');
    } catch {
      feedback.error('Error', 'Could not copy message.');
    }
  }, [personalization]);

  if (!template) return null;

  const { w: cardW, h: cardH } = getCanvasDimensions(canvasFormat);
  const cardScale = Math.min((SCREEN_W - 80) / cardW, 0.72);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}>
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

        {/* Hidden full-resolution capture target */}
        <View
          style={{ position: 'absolute', left: -9999, top: 0, opacity: 0 }}
          pointerEvents="none">
          <View ref={cardRef} collapsable={false}>
            <CardRenderer
              template={template}
              personalization={personalization}
              elements={elements}
              scale={1}
              customBackground={customBackground}
              canvasFormat={canvasFormat}
            />
          </View>
        </View>

        {/* Card Preview */}
        <View className="items-center py-3">
          <View
            collapsable={false}
            className="rounded-2xl overflow-hidden"
            style={{
              width: cardW * cardScale,
              height: cardH * cardScale,
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
              scale={cardScale}
              customBackground={customBackground}
              canvasFormat={canvasFormat}
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
              className="flex-1 flex-row items-center justify-center rounded-2xl py-3.5 gap-2 bg-primary/10 border border-primary/20"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
              accessibilityRole="button">
              <Plus size={15} color="#7C3AED" />
              <Text className="text-[13px] font-semibold text-primary">New Card</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleTurnIntoSurprise}
            className="overflow-hidden rounded-2xl mt-3"
            accessibilityRole="button"
            accessibilityLabel="Turn card into surprise experience">
            <LinearGradient
              colors={['#EC4899', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 }}>
              <Link2 size={17} color="#FFF" />
              <Text className="text-[14px] font-bold text-white">Turn Card Into Surprise</Text>
            </View>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
