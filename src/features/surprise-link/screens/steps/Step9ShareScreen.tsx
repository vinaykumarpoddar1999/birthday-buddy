import React, { useCallback, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, Share, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { feedback } from '@/shared/feedback';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import {
  ChartBar,
  Copy,
  Eye,
  ExternalLink,
  Globe,
  Image,
  Mail,
  MessageCircle,
  PartyPopper,
  Plus,
  Send,
  Share2,
} from 'lucide-react-native';
import { router } from 'expo-router';

import { ConfettiOverlay } from '@shared/ui/ConfettiOverlay';

import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import { usePublishSurprise } from '../../hooks/useSurpriseLinks';
import { buildDeepLink } from '../../utils/link-generator';
import { QrCodeDisplay } from '../../utils/qrcode';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';

const SHARE_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle, color: '#25D366', bg: '#25D36610' },
  { id: 'instagram', label: 'Instagram', Icon: Image, color: '#E4405F', bg: '#E4405F10' },
  { id: 'messages', label: 'Messages', Icon: Send, color: '#3B82F6', bg: '#3B82F610' },
  { id: 'email', label: 'Email', Icon: Mail, color: '#6366F1', bg: '#6366F110' },
  { id: 'copy', label: 'Copy Link', Icon: Copy, color: '#7C3AED', bg: '#7C3AED10' },
  { id: 'more', label: 'More', Icon: ExternalLink, color: '#6B7280', bg: '#6B728010' },
] as const;

export function Step9ShareScreen() {
  const shareLink = useSurpriseLinkStore((s) => s.shareLink);
  const shortUrl = useSurpriseLinkStore((s) => s.shortUrl);
  const recipientName = useSurpriseLinkStore((s) => s.personalization.recipientName);
  const toExperience = useSurpriseLinkStore((s) => s.toExperience);
  const slug = useSurpriseLinkStore((s) => s.slug);
  const experienceId = useSurpriseLinkStore((s) => s.experienceId);
  const reset = useSurpriseLinkStore((s) => s.reset);
  const theme = useSurpriseLinkStore((s) => s.theme);

  const publishMutation = usePublishSurprise();
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePublishAndShare = useCallback(async () => {
    try {
      const exp = toExperience();
      const publishedExp = await publishMutation.mutateAsync(exp);
      useSurpriseLinkStore.setState({ experienceId: publishedExp.id, status: 'published' });
      setPublished(true);
      setShowConfetti(true);

      const deepLink = buildDeepLink(publishedExp.slug);
      await Share.share({
        message: `I created a special surprise for you, ${recipientName}! ✨\n\nOpen in Birthday Buddy: ${deepLink}\n\nOr visit: ${publishedExp.shareLink}`,
        url: Platform.OS === 'ios' ? deepLink : undefined,
        title: 'A Surprise For You',
      });
    } catch {
      feedback.error('Error', 'Could not share experience');
    }
  }, [recipientName, toExperience, publishMutation]);

  const handleCopy = useCallback(async () => {
    if (!shareLink) return;
    try {
      await Clipboard.setStringAsync(shareLink);
      setCopied(true);
      feedback.success('Copied!', 'Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      feedback.error('Error', 'Could not copy link');
    }
  }, [shareLink]);

  const handleShareOption = useCallback(async (id: string) => {
    const message = `I created a special surprise for you! ✨\n\n${shortUrl ?? shareLink ?? ''}`;
    switch (id) {
      case 'whatsapp':
        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`).catch(() =>
          feedback.error('Error', 'WhatsApp is not installed'),
        );
        break;
      case 'instagram':
        await Clipboard.setStringAsync(shortUrl ?? shareLink ?? '');
        feedback.success('Copied!', 'Link copied — paste it in Instagram');
        break;
      case 'messages':
        Linking.openURL(`sms:?body=${encodeURIComponent(message)}`).catch(() =>
          Share.share({ message }),
        );
        break;
      case 'email':
        Linking.openURL(
          `mailto:?subject=${encodeURIComponent('A Surprise For You! 🎁')}&body=${encodeURIComponent(message)}`,
        ).catch(() => Share.share({ message }));
        break;
      case 'copy':
        handleCopy();
        break;
      case 'more':
        Share.share({ message, title: 'A Surprise For You' });
        break;
    }
  }, [shareLink, shortUrl, handleCopy]);

  const handleDone = useCallback(() => {
    reset();
    router.back();
  }, [reset]);

  return (
    <>
      {showConfetti && <ConfettiOverlay />}
      <StudioStepLayout>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <StudioScreenIntro
          title={published ? 'Surprise Published! 🎉' : 'Ready to Share'}
          subtitle={`Send this magical experience to ${recipientName || 'someone special'}`}
          Icon={PartyPopper}
        />

        <View className="px-5">
          {/* Main Share Button */}
          <Animated.View entering={FadeInDown.duration(500).springify()}>
            <Pressable
              onPress={handlePublishAndShare}
              disabled={publishMutation.isPending}
              accessibilityRole="button"
              accessibilityLabel="Share surprise link"
              accessibilityState={{ busy: publishMutation.isPending }}
              className="rounded-2xl overflow-hidden mb-5"
              style={({ pressed }) => ({
                opacity: publishMutation.isPending ? 0.7 : 1,
                transform: [{ scale: pressed && !publishMutation.isPending ? 0.98 : 1 }],
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              })}>
              <LinearGradient
                colors={['#7C3AED', '#9333EA', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-5 flex-row items-center justify-center">
                <Share2 size={22} color="#FFF" />
                <Text className="text-white text-[17px] font-black ml-3">
                  {publishMutation.isPending ? 'Publishing...' : 'Share Surprise Link'}
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* QR Code Section */}
          {slug && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-5">
              <View
                className="bg-white rounded-3xl p-6 items-center border border-gray-100"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                  elevation: 3,
                }}>
                <QrCodeDisplay value={buildDeepLink(slug)} size={160} color={theme.primaryColor} />
                <Text className="text-[12px] text-foreground-secondary mt-3 font-medium">
                  Scan to open the surprise
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Share Via Grid */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text className="text-[14px] font-black text-foreground mb-3">Share Via</Text>
            <View className="flex-row flex-wrap gap-3 mb-5">
              {SHARE_OPTIONS.map((opt, idx) => (
                <Animated.View
                  key={opt.id}
                  entering={ZoomIn.delay(250 + idx * 60).springify()}
                  className="items-center"
                  style={{ width: '29%' }}>
                  <Pressable
                    onPress={() => handleShareOption(opt.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Share via ${opt.label}`}
                    className="w-full items-center rounded-2xl py-4 border"
                    style={{
                      backgroundColor: opt.bg,
                      borderColor: `${opt.color}20`,
                    }}>
                    <View
                      className="h-12 w-12 rounded-2xl items-center justify-center mb-2"
                      style={{ backgroundColor: `${opt.color}15` }}>
                      <opt.Icon size={22} color={opt.color} />
                    </View>
                    <Text className="text-[11px] font-bold" style={{ color: opt.color }}>
                      {opt.label}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Social Preview Card */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} className="mb-5">
            <Text className="text-[14px] font-black text-foreground mb-3">Preview Card</Text>
            <View
              className="rounded-2xl overflow-hidden border border-gray-100"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 2,
              }}>
              <LinearGradient
                colors={[theme.primaryColor, theme.secondaryColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5 items-center">
                <Text style={{ fontSize: 32 }}>🎁</Text>
                <Text className="text-white text-[16px] font-bold mt-2 text-center">
                  A Surprise For {recipientName || 'You'}!
                </Text>
                <Text className="text-white/70 text-[12px] mt-1">
                  Open to see your special surprise ✨
                </Text>
              </LinearGradient>
              <View className="bg-white px-4 py-3 flex-row items-center">
                <Globe size={12} color="#9CA3AF" />
                <Text className="text-[11px] text-foreground-muted ml-1.5" numberOfLines={1}>
                  {shortUrl ?? shareLink ?? 'birthdaybuddy.app'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            {slug && (
              <Pressable
                onPress={() => router.push({ pathname: '/surprise-experience/[slug]', params: { slug } })}
                accessibilityRole="button"
                className="bg-white rounded-2xl py-4 flex-row items-center justify-center mb-3 border border-primary/15"
                style={{
                  shadowColor: '#7C3AED',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                <Eye size={20} color="#7C3AED" />
                <Text className="text-[15px] font-bold text-primary ml-2">Preview Experience</Text>
              </Pressable>
            )}

            {experienceId && (
              <Pressable
                onPress={() => router.push({ pathname: '/surprise-analytics', params: { experienceId } })}
                accessibilityRole="button"
                className="bg-white rounded-2xl py-4 flex-row items-center justify-center mb-3 border border-primary/15">
                <ChartBar size={20} color="#7C3AED" />
                <Text className="text-[15px] font-bold text-primary ml-2">View Analytics</Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleDone}
              accessibilityRole="button"
              className="rounded-2xl overflow-hidden mt-2">
              <LinearGradient
                colors={['#F5F3FF', '#EDE9FE']}
                className="py-4 flex-row items-center justify-center">
                <Plus size={18} color="#7C3AED" />
                <Text className="text-[15px] font-bold text-primary ml-2">Create Another</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
        </ScrollView>
      </StudioStepLayout>
    </>
  );
}
