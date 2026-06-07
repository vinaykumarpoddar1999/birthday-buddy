import React, { useCallback, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { feedback } from '@/shared/feedback';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  ClipboardCopy,
  Download,
  Plus,
  Share2,
} from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { cardService } from '@/services/card/card.service';

import { CardStudioPrimaryButton } from '../components/common/CardStudioPrimaryButton';
import { CardStudioSecondaryButton } from '../components/common/CardStudioSecondaryButton';
import { CardExportHost } from '../components/preview/CardExportHost';
import { studioTokens } from '../constants/studio-tokens';
import { useCardStudioStore } from '../store/card-studio.store';
import { CardRenderer } from '../components/preview/CardRenderer';
import {
  captureCardImage,
  getExportUnavailableMessage,
  isCardExportAvailable,
  type ViewShotCaptureHandle,
} from '../utils/card-export';
import { getCanvasDimensions } from '../utils/canvas-dimensions';

export function Step4ShareScreen() {
  const { width: screenW } = useWindowDimensions();
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const personalization = useCardStudioStore((s) => s.personalization);
  const elements = useCardStudioStore((s) => s.elements);
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const canvasFormat = useCardStudioStore((s) => s.canvasFormat);
  const preFilledPersonId = useCardStudioStore((s) => s.preFilledPersonId);
  const reset = useCardStudioStore((s) => s.reset);

  const exportRef = useRef<ViewShotCaptureHandle>(null);
  const fallbackRef = useRef<View>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);

  const capture = useCallback(async () => {
    if (!isCardExportAvailable()) {
      feedback.error('Development build required', getExportUnavailableMessage());
      return null;
    }
    const uri = await captureCardImage({
      cardRef: fallbackRef,
      viewShotRef: exportRef,
      canvasFormat,
    });
    if (!uri) {
      feedback.error('Export failed', 'Could not capture your card. Try again after the preview loads.');
    }
    return uri;
  }, [canvasFormat]);

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
        feedback.error('Permission needed', 'Allow photo library access to save your card.');
        setSaving(false);
        return;
      }
      const uri = await capture();
      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        const cardUuid = await persistCard(uri);
        if (cardUuid) {
          await cardService.logDownloaded(cardUuid);
        }
        setSaved(true);
        feedback.success('Saved!', 'Your HD card was saved to your gallery.');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      if (__DEV__) console.warn('[Step4Share] download failed:', error);
      feedback.error('Error', 'Failed to save. Please try again.');
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
    } catch (error) {
      if (__DEV__) console.warn('[Step4Share] share failed:', error);
      feedback.error('Error', 'Failed to share. Please try again.');
    }
    setSharing(false);
  }, [capture, personalization.recipientName, persistCard]);

  const handleShareMessage = useCallback(async () => {
    const eventLabel =
      personalization.eventType === 'anniversary' ? 'Happy Anniversary' : 'Happy Birthday';
    const msg = [
      `${eventLabel}, ${personalization.recipientName}!`,
      personalization.message ? `\n${personalization.message}` : '',
      personalization.senderName ? `\n\n— ${personalization.senderName}` : '',
    ].join('');

    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard?.writeText(msg);
        feedback.success('Copied!', 'Message copied to clipboard.');
      } else {
        const { Share } = await import('react-native');
        await Share.share({ message: msg });
      }
    } catch {
      feedback.error('Error', 'Could not share message.');
    }
  }, [personalization]);

  if (!template) return null;

  const { w: cardW, h: cardH } = getCanvasDimensions(canvasFormat);
  const cardScale = Math.min((screenW - 72) / cardW, 0.8);

  return (
    <View className="flex-1 bg-background">
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: -2000,
          top: 0,
          opacity: 1,
        }}>
        <View ref={fallbackRef} collapsable={false}>
          <CardExportHost
            ref={exportRef}
            template={template}
            personalization={personalization}
            elements={elements}
            customBackground={customBackground}
            canvasFormat={canvasFormat}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.View entering={FadeInDown.duration(400)} className="mx-5 mt-3 mb-3">
          <View className="rounded-2xl overflow-hidden border border-primary/15">
            <LinearGradient
              colors={['#EDE9FE', '#FDF2F8', '#EDE9FE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <View className="flex-row items-center px-5 py-4 gap-4">
                <Animated.View
                  entering={ZoomIn.duration(500)}
                  className="h-12 w-12 rounded-2xl bg-primary items-center justify-center">
                  <Check size={22} color="#FFF" strokeWidth={3} />
                </Animated.View>
                <View className="flex-1">
                  <Text className="text-[17px] font-bold text-foreground">Your card is ready</Text>
                  <Text className="text-[12px] text-foreground-muted mt-0.5">
                    Save in HD or share with {personalization.recipientName || 'someone special'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        <View className="items-center py-1 px-5">
          <View
            className="rounded-3xl items-center justify-center w-full"
            style={{
              padding: 8,
              backgroundColor: studioTokens.colors.frameTint,
              shadowColor: studioTokens.colors.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.14,
              shadowRadius: 22,
              elevation: 8,
            }}>
            <View
              collapsable={false}
              className="rounded-2xl overflow-hidden"
              style={{
                width: cardW * cardScale,
                height: cardH * cardScale,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
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
          <Text className="text-[11px] text-foreground-muted mt-2 text-center">
            {isCardExportAvailable()
              ? 'Exports at full resolution (2× pixel density)'
              : 'HD save requires a dev build — use Expo Go for editing only'}
          </Text>
        </View>

        <View className="px-5 mt-4 gap-3">
          <CardStudioPrimaryButton
            label={saving ? 'Saving…' : saved ? 'Saved to Gallery' : 'Save to Gallery (HD)'}
            onPress={handleDownload}
            loading={saving}
            disabled={saving}
            icon={
              saved ? (
                <Check size={18} color="#FFF" strokeWidth={3} />
              ) : (
                <Download size={18} color="#FFF" />
              )
            }
          />

          <View className="flex-row gap-3">
            <CardStudioSecondaryButton
              label={sharing ? 'Sharing…' : 'Share Image'}
              onPress={handleShare}
              disabled={sharing}
              loading={sharing}
              className="flex-1"
              icon={<Share2 size={16} color="#374151" />}
            />
            <CardStudioSecondaryButton
              label="Copy Message"
              onPress={handleShareMessage}
              className="flex-1"
              icon={<ClipboardCopy size={16} color="#374151" />}
              accessibilityLabel="Share birthday message"
            />
          </View>

          <Pressable
            onPress={() => reset()}
            className="flex-row items-center justify-center rounded-2xl gap-2 bg-primary/10 border border-primary/20"
            style={({ pressed }) => ({
              minHeight: studioTokens.touchMin,
              paddingVertical: 12,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
            accessibilityRole="button"
            accessibilityLabel="Create new card">
            <Plus size={15} color={studioTokens.colors.primary} />
            <Text className="text-[13px] font-semibold text-primary">Create New Card</Text>
          </Pressable>

        </View>
      </ScrollView>
    </View>
  );
}
