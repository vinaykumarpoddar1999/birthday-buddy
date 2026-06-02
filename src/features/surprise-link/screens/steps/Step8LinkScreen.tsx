import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { Check, Copy, Eye, ExternalLink, Link2, RefreshCw, Sparkles, Zap } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { feedback } from '@/shared/feedback';

import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import { QrCodeDisplay } from '../../utils/qrcode';
import { buildDeepLink } from '../../utils/link-generator';
import { ContinueButton } from '../../components/common/StudioHeader';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';
import { StudioEmptyState } from '../../components/common/StudioEmptyState';
import { SURPRISE_STUDIO } from '../../constants/surprise-studio.tokens';

function LinkCard({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
  delay?: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    feedback.success('Copied', `${label} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()}>
      <View
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
        style={{
          shadowColor: SURPRISE_STUDIO.color.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] font-bold text-foreground-muted tracking-widest">{label}</Text>
          <Pressable
            onPress={handleCopy}
            accessibilityRole="button"
            accessibilityLabel={`Copy ${label}`}
            className="flex-row items-center rounded-lg px-3 py-2 bg-primary/5"
            style={{ minHeight: 36 }}>
            {copied ? <Check size={14} color={SURPRISE_STUDIO.color.success} /> : <Copy size={14} color={SURPRISE_STUDIO.color.primary} />}
            <Text className={`text-[11px] font-bold ml-1.5 ${copied ? 'text-green-600' : 'text-primary'}`}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </Pressable>
        </View>
        <Text className="text-[14px] font-semibold text-primary mt-2" selectable numberOfLines={2}>
          {value}
        </Text>
      </View>
    </Animated.View>
  );
}

export function Step8LinkScreen() {
  const prepareLinkAndSave = useSurpriseLinkStore((s) => s.prepareLinkAndSave);
  const isGenerating = useSurpriseLinkStore((s) => s.isGenerating);
  const shareLink = useSurpriseLinkStore((s) => s.shareLink);
  const shortUrl = useSurpriseLinkStore((s) => s.shortUrl);
  const slug = useSurpriseLinkStore((s) => s.slug);
  const recipientName = useSurpriseLinkStore((s) => s.personalization.recipientName);
  const nextStep = useSurpriseLinkStore((s) => s.nextStep);

  const [linkError, setLinkError] = useState<string | null>(null);
  const pulseScale = useSharedValue(1);

  const generateLink = useCallback(async () => {
    setLinkError(null);
    try {
      await prepareLinkAndSave();
    } catch {
      setLinkError('We could not save your surprise. Check storage and try again.');
      feedback.error('Link failed', 'Could not generate your surprise link');
    }
  }, [prepareLinkAndSave]);

  useEffect(() => {
    if (!shareLink && !isGenerating && !linkError) {
      void generateLink();
    }
  }, [shareLink, isGenerating, linkError, generateLink]);

  useEffect(() => {
    if (isGenerating) {
      pulseScale.value = withRepeat(
        withSequence(withTiming(1.06, { duration: 600 }), withTiming(1, { duration: 600 })),
        -1,
        true,
      );
    } else {
      pulseScale.value = withTiming(1);
    }
  }, [isGenerating, pulseScale]);

  const loadingPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <StudioStepLayout
      footer={
        <ContinueButton
          onPress={nextStep}
          disabled={!shareLink || isGenerating || !!linkError}
          loading={isGenerating}
          label="Share Experience"
        />
      }>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <StudioScreenIntro
          title="Your Surprise Link"
          subtitle={`A unique, shareable experience crafted for ${recipientName || 'someone special'}`}
          Icon={Link2}
        />

        <View className="px-5">
          {linkError ? (
            <StudioEmptyState
              Icon={RefreshCw}
              title="Link generation failed"
              subtitle={linkError}
              actionLabel="Try again"
              onAction={() => void generateLink()}
            />
          ) : isGenerating ? (
            <Animated.View style={loadingPulse}>
              <LinearGradient
                colors={['#F5F3FF', '#EDE9FE', '#FDF2F8']}
                className="rounded-3xl p-10 items-center"
                style={{
                  shadowColor: SURPRISE_STUDIO.color.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 24,
                  elevation: 8,
                }}>
                <View className="h-20 w-20 rounded-3xl bg-primary/10 items-center justify-center mb-5">
                  <Zap size={36} color={SURPRISE_STUDIO.color.primary} />
                </View>
                <Text className="text-[16px] font-bold text-foreground mt-2">Creating your magic link...</Text>
                <Text className="text-[13px] text-foreground-secondary mt-2 text-center">
                  Saving your experience and generating a unique URL
                </Text>
              </LinearGradient>
            </Animated.View>
          ) : (
            <>
              <Animated.View entering={ZoomIn.springify().damping(12)} className="items-center mb-6">
                <LinearGradient
                  colors={['#F5F3FF', '#EDE9FE', '#FDF2F8']}
                  className="w-full rounded-3xl p-6 items-center"
                  style={{
                    shadowColor: SURPRISE_STUDIO.color.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.12,
                    shadowRadius: 24,
                    elevation: 6,
                  }}>
                  <Animated.View
                    entering={ZoomIn.delay(200).springify()}
                    className="h-16 w-16 rounded-2xl bg-primary items-center justify-center mb-4"
                    style={{
                      shadowColor: SURPRISE_STUDIO.color.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 12,
                      elevation: 6,
                    }}>
                    <Link2 size={28} color="#FFF" strokeWidth={2.5} />
                  </Animated.View>

                  <Animated.View entering={FadeInUp.delay(400).duration(400)}>
                    <Text className="text-[18px] font-black text-foreground text-center">
                      Link Generated!
                    </Text>
                    <Text className="text-[13px] text-foreground-secondary text-center mt-1">
                      Your surprise is ready to share
                    </Text>
                  </Animated.View>

                  <Animated.View
                    entering={FadeIn.delay(600).duration(500)}
                    className="bg-white rounded-2xl p-5 mt-5 items-center w-full"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 10,
                      elevation: 2,
                    }}>
                    <QrCodeDisplay
                      value={slug ? buildDeepLink(slug) : shareLink ?? ''}
                      size={180}
                      color="#5B21B6"
                    />
                    <Text className="text-[11px] text-foreground-muted mt-3">
                      Scan to open in Birthday Buddy
                    </Text>
                  </Animated.View>
                </LinearGradient>
              </Animated.View>

              {shareLink ? <LinkCard label="SHARE LINK" value={shareLink} delay={200} /> : null}
              {slug ? <LinkCard label="IN-APP DEEP LINK" value={buildDeepLink(slug)} delay={300} /> : null}
              {shortUrl ? <LinkCard label="SHORT URL" value={shortUrl} delay={400} /> : null}

              <Animated.View entering={FadeIn.delay(500).duration(400)} className="flex-row items-center justify-center mt-1 mb-4">
                <Sparkles size={12} color={SURPRISE_STUDIO.color.primary} />
                <Text className="text-[11px] text-foreground-secondary ml-1.5 font-medium">
                  Unique Slug: <Text className="font-bold text-primary">{slug}</Text>
                </Text>
              </Animated.View>

              {slug ? (
                <Animated.View entering={FadeInDown.delay(600).duration(400)}>
                  <Pressable
                    onPress={() => router.push({ pathname: '/surprise-experience/[slug]', params: { slug } })}
                    accessibilityRole="button"
                    accessibilityLabel="Preview recipient experience"
                    className="rounded-2xl overflow-hidden"
                    style={{
                      minHeight: SURPRISE_STUDIO.touch.min,
                      shadowColor: SURPRISE_STUDIO.color.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 12,
                      elevation: 4,
                    }}>
                    <LinearGradient
                      colors={['#F5F3FF', '#EDE9FE']}
                      className="py-4 flex-row items-center justify-center">
                      <Eye size={18} color={SURPRISE_STUDIO.color.primary} />
                      <Text className="text-[14px] font-bold text-primary ml-2">Preview Recipient View</Text>
                      <View className="ml-2">
                        <ExternalLink size={14} color={SURPRISE_STUDIO.color.primary} />
                      </View>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </StudioStepLayout>
  );
}
