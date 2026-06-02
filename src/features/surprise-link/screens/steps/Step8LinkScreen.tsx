import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { Check, Copy, Eye, ExternalLink, Link2, Sparkles, Zap } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';

import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import { QrCodeDisplay } from '../../utils/qrcode';
import { buildDeepLink } from '../../utils/link-generator';
import { ContinueButton } from '../../components/common/StudioHeader';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';

function LinkCard({
  label,
  value,
  delay = 0,
  onCopy,
}: {
  label: string;
  value: string;
  delay?: number;
  onCopy: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()}>
      <View
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
        style={{
          shadowColor: '#7C3AED',
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
            className="flex-row items-center rounded-lg px-2.5 py-1.5 bg-primary/5">
            {copied ? <Check size={12} color="#16A34A" /> : <Copy size={12} color="#7C3AED" />}
            <Text className={`text-[10px] font-bold ml-1 ${copied ? 'text-green-600' : 'text-primary'}`}>
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

  const [generated, setGenerated] = useState(!!shareLink);
  const pulseScale = useSharedValue(1);
  const spinRotate = useSharedValue(0);

  useEffect(() => {
    if (!shareLink) {
      prepareLinkAndSave().then(() => setGenerated(true));
    }
  }, [shareLink, prepareLinkAndSave]);

  useEffect(() => {
    if (isGenerating) {
      spinRotate.value = withRepeat(
        withTiming(360, { duration: 1200 }),
        -1,
      );
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        true,
      );
    }
  }, [isGenerating, pulseScale, spinRotate]);

  const loadingPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleCopyNotify = () => {};

  return (
    <StudioStepLayout
      footer={
        <ContinueButton
          onPress={nextStep}
          disabled={!shareLink || isGenerating}
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
          {isGenerating ? (
            <Animated.View style={loadingPulse}>
              <LinearGradient
                colors={['#F5F3FF', '#EDE9FE', '#FDF2F8']}
                className="rounded-3xl p-10 items-center"
                style={{
                  shadowColor: '#7C3AED',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 24,
                  elevation: 8,
                }}>
                <View className="h-20 w-20 rounded-3xl bg-primary/10 items-center justify-center mb-5">
                  <Zap size={36} color="#7C3AED" />
                </View>
                <ActivityIndicator size="large" color="#7C3AED" />
                <Text className="text-[16px] font-bold text-foreground mt-5">Creating your magic link...</Text>
                <Text className="text-[13px] text-foreground-secondary mt-2 text-center">
                  Generating a unique experience URL
                </Text>
              </LinearGradient>
            </Animated.View>
          ) : (
            <>
              {/* Success Header */}
              <Animated.View entering={ZoomIn.springify().damping(12)} className="items-center mb-6">
                <LinearGradient
                  colors={['#F5F3FF', '#EDE9FE', '#FDF2F8']}
                  className="w-full rounded-3xl p-6 items-center"
                  style={{
                    shadowColor: '#7C3AED',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.12,
                    shadowRadius: 24,
                    elevation: 6,
                  }}>
                  <Animated.View
                    entering={ZoomIn.delay(200).springify()}
                    className="h-16 w-16 rounded-2xl bg-primary items-center justify-center mb-4"
                    style={{
                      shadowColor: '#7C3AED',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 12,
                      elevation: 6,
                    }}>
                    <Link2 size={28} color="#FFF" strokeWidth={2.5} />
                  </Animated.View>

                  <Animated.View entering={FadeInUp.delay(400).duration(400)}>
                    <Text className="text-[18px] font-black text-foreground text-center">
                      Link Generated! ✨
                    </Text>
                    <Text className="text-[13px] text-foreground-secondary text-center mt-1">
                      Your surprise is ready to share
                    </Text>
                  </Animated.View>

                  {/* QR Code */}
                  <Animated.View
                    entering={FadeIn.delay(600).duration(500)}
                    className="bg-white rounded-2xl p-5 mt-5 items-center"
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

              {/* Link Cards */}
              {shareLink && (
                <LinkCard label="SHARE LINK" value={shareLink} delay={200} onCopy={handleCopyNotify} />
              )}

              {slug && (
                <LinkCard
                  label="IN-APP DEEP LINK"
                  value={buildDeepLink(slug)}
                  delay={300}
                  onCopy={handleCopyNotify}
                />
              )}

              {shortUrl && (
                <LinkCard label="SHORT URL" value={shortUrl} delay={400} onCopy={handleCopyNotify} />
              )}

              {/* Slug Badge */}
              <Animated.View entering={FadeIn.delay(500).duration(400)} className="flex-row items-center justify-center mt-1 mb-4">
                <Sparkles size={12} color="#7C3AED" />
                <Text className="text-[11px] text-foreground-secondary ml-1.5 font-medium">
                  Unique Slug: <Text className="font-bold text-primary">{slug}</Text>
                </Text>
              </Animated.View>

              {/* Preview Button */}
              {slug && (
                <Animated.View entering={FadeInDown.delay(600).duration(400)}>
                  <Pressable
                    onPress={() => router.push({ pathname: '/surprise-experience/[slug]', params: { slug } })}
                    accessibilityRole="button"
                    accessibilityLabel="Preview recipient experience"
                    className="rounded-2xl overflow-hidden"
                    style={{
                      shadowColor: '#7C3AED',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 12,
                      elevation: 4,
                    }}>
                    <LinearGradient
                      colors={['#F5F3FF', '#EDE9FE']}
                      className="py-4 flex-row items-center justify-center">
                      <Eye size={18} color="#7C3AED" />
                      <Text className="text-[14px] font-bold text-primary ml-2">Preview Recipient View</Text>
                      <ExternalLink size={14} color="#7C3AED" className="ml-2" />
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </StudioStepLayout>
  );
}
