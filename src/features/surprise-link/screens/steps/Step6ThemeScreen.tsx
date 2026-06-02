import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Lock,
  Music,
  Palette,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

import { THEMES, VISUAL_EFFECTS } from '../../data/themes';
import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import type { InteractiveFeature, ThemeId } from '../../types';
import { ContinueButton } from '../../components/common/StudioHeader';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';

const THEME_LABELS: Record<ThemeId, string> = {
  luxury_gold: 'Luxury Gold',
  romantic_pink: 'Romantic Pink',
  dark_elegant: 'Dark Elegant',
  neon: 'Neon Glow',
  royal: 'Royal Purple',
  galaxy: 'Galaxy',
  floral: 'Floral',
  cute: 'Cute & Playful',
  minimal: 'Minimal',
  modern: 'Modern',
  glassmorphism: 'Glassmorphism',
  birthday_celebration: 'Birthday 🎂',
};

const INTERACTIVE_FEATURES: { id: InteractiveFeature; label: string; emoji: string }[] = [
  { id: 'unlock_code', label: 'Unlock Code', emoji: '🔐' },
  { id: 'tap_reveal', label: 'Tap Reveal', emoji: '👆' },
  { id: 'scratch_reveal', label: 'Scratch Reveal', emoji: '✨' },
  { id: 'swipe_stories', label: 'Swipe Stories', emoji: '📖' },
  { id: 'shake_reveal', label: 'Shake Reveal', emoji: '📱' },
  { id: 'spin_wheel', label: 'Spin Wheel', emoji: '🎡' },
  { id: 'memory_quiz', label: 'Memory Quiz', emoji: '🧠' },
  { id: 'guess_photo', label: 'Guess Photo', emoji: '📸' },
  { id: 'hidden_surprise', label: 'Hidden Surprise', emoji: '🎁' },
  { id: 'reward_unlock', label: 'Reward Unlock', emoji: '🏆' },
];

function SectionHeader({
  title,
  Icon,
  color = '#7C3AED',
}: {
  title: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  color?: string;
}) {
  return (
    <View className="flex-row items-center px-5 mb-3 mt-2">
      <View
        className="h-8 w-8 rounded-xl items-center justify-center mr-2.5"
        style={{ backgroundColor: `${color}15` }}>
        <Icon size={16} color={color} />
      </View>
      <Text className="text-[15px] font-black text-foreground">{title}</Text>
    </View>
  );
}

export function Step6ThemeScreen() {
  const theme = useSurpriseLinkStore((s) => s.theme);
  const effects = useSurpriseLinkStore((s) => s.effects);
  const music = useSurpriseLinkStore((s) => s.music);
  const interactive = useSurpriseLinkStore((s) => s.interactive);
  const setTheme = useSurpriseLinkStore((s) => s.setTheme);
  const toggleEffect = useSurpriseLinkStore((s) => s.toggleEffect);
  const updateMusic = useSurpriseLinkStore((s) => s.updateMusic);
  const toggleInteractiveFeature = useSurpriseLinkStore((s) => s.toggleInteractiveFeature);
  const setUnlockCode = useSurpriseLinkStore((s) => s.setUnlockCode);
  const nextStep = useSurpriseLinkStore((s) => s.nextStep);

  const [musicExpanded, setMusicExpanded] = useState(false);
  const [interactiveExpanded, setInteractiveExpanded] = useState(false);
  const [volumeTrackWidth, setVolumeTrackWidth] = useState(0);

  const handleVolumeTrackLayout = (e: LayoutChangeEvent) => {
    setVolumeTrackWidth(e.nativeEvent.layout.width);
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
    if (!result.canceled && result.assets[0]) {
      updateMusic({ uri: result.assets[0].uri, title: result.assets[0].name });
    }
  };

  return (
    <StudioStepLayout footer={<ContinueButton onPress={nextStep} />}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <StudioScreenIntro
          title="Theme & Effects"
          subtitle="Choose premium themes, visual effects, music & interactive features to make your surprise unforgettable."
          Icon={Palette}
        />

        {/* ─── Theme Selection ─── */}
        <SectionHeader title="Premium Themes" Icon={Palette} />
        <View className="flex-row flex-wrap px-4 mb-6">
          {(Object.keys(THEMES) as ThemeId[]).map((id, idx) => {
            const t = THEMES[id];
            const selected = theme.id === id;
            return (
              <Animated.View
                key={id}
                entering={FadeIn.delay(idx * 40).duration(300)}
                className="w-1/3 p-1.5">
                <Pressable
                  onPress={() => setTheme(id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${THEME_LABELS[id]} theme`}
                  className="rounded-2xl overflow-hidden"
                  style={selected ? {
                    borderWidth: 2.5,
                    borderColor: t.primaryColor,
                    shadowColor: t.primaryColor,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    elevation: 6,
                  } : {
                    borderWidth: 1.5,
                    borderColor: 'rgba(0,0,0,0.06)',
                  }}>
                  <LinearGradient
                    colors={[t.primaryColor, t.secondaryColor, t.backgroundColor]}
                    locations={[0, 0.6, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ height: 80, justifyContent: 'flex-end', padding: 10 }}>
                    {selected && (
                      <Animated.View
                        entering={ZoomIn.springify()}
                        className="absolute top-2 right-2 h-5 w-5 rounded-full bg-white items-center justify-center">
                        <Check size={12} color={t.primaryColor} strokeWidth={3} />
                      </Animated.View>
                    )}
                    <Text
                      className="font-bold"
                      style={{ color: '#FFF', fontSize: 10, textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 4 }}>
                      {THEME_LABELS[id]}
                    </Text>
                  </LinearGradient>
                  <View
                    className="flex-row h-1.5"
                    style={{ backgroundColor: t.backgroundColor }}>
                    <View className="flex-1" style={{ backgroundColor: t.primaryColor }} />
                    <View className="flex-1" style={{ backgroundColor: t.secondaryColor }} />
                    <View className="flex-1" style={{ backgroundColor: t.accentColor }} />
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* ─── Visual Effects ─── */}
        <SectionHeader title="Visual Effects" Icon={Sparkles} color="#EC4899" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {VISUAL_EFFECTS.map((eff, idx) => {
            const active = effects.includes(eff.id);
            return (
              <Animated.View key={eff.id} entering={FadeIn.delay(idx * 50).duration(300)}>
                <Pressable
                  onPress={() => toggleEffect(eff.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle ${eff.label} effect`}
                  className="items-center rounded-2xl px-4 py-3"
                  style={active ? {
                    backgroundColor: '#7C3AED',
                    shadowColor: '#7C3AED',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  } : {
                    backgroundColor: '#FFF',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                  }}>
                  <Text className="text-[20px] mb-1">{eff.emoji}</Text>
                  <Text
                    className={`text-[10px] font-bold ${active ? 'text-white' : 'text-foreground-secondary'}`}>
                    {eff.label}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* ─── Music Settings ─── */}
        <View className="px-5 mb-5">
          <Pressable
            onPress={() => setMusicExpanded(!musicExpanded)}
            accessibilityRole="button"
            className="flex-row items-center justify-between bg-white rounded-2xl p-4 border border-gray-100"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}>
            <View className="flex-row items-center">
              <View className="h-10 w-10 rounded-xl bg-amber-50 items-center justify-center mr-3">
                <Music size={18} color="#F59E0B" />
              </View>
              <View>
                <Text className="text-[14px] font-bold text-foreground">Music & Audio</Text>
                <Text className="text-[11px] text-foreground-secondary mt-0.5">
                  {music.uri ? `🎵 ${music.title ?? 'Audio loaded'}` : 'Add background music'}
                </Text>
              </View>
            </View>
            {musicExpanded ? (
              <ChevronUp size={20} color="#9CA3AF" />
            ) : (
              <ChevronDown size={20} color="#9CA3AF" />
            )}
          </Pressable>

          {musicExpanded && (
            <Animated.View entering={FadeInDown.duration(300)} className="bg-white rounded-2xl p-4 mt-2 border border-gray-100">
              <Pressable
                onPress={pickAudio}
                className="rounded-xl overflow-hidden mb-4"
                accessibilityRole="button">
                <LinearGradient
                  colors={['#F59E0B', '#F97316']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-3 items-center flex-row justify-center">
                  <Music size={16} color="#FFF" />
                  <Text className="text-white text-[13px] font-bold ml-2">
                    {music.uri ? 'Change Audio File' : 'Upload Audio / MP3'}
                  </Text>
                </LinearGradient>
              </Pressable>

              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Text className="text-[14px] text-foreground font-semibold">Auto Play</Text>
                </View>
                <Switch
                  value={music.autoPlay}
                  onValueChange={(v) => updateMusic({ autoPlay: v })}
                  trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                  thumbColor="#FFF"
                />
              </View>

              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Volume2 size={14} color="#6B7280" />
                    <Text className="text-[14px] text-foreground font-semibold ml-2">Volume</Text>
                  </View>
                  <Text className="text-[12px] font-bold text-primary">
                    {Math.round(music.volume * 100)}%
                  </Text>
                </View>
                <View
                  className="h-3 rounded-full bg-gray-100 overflow-hidden"
                  onLayout={handleVolumeTrackLayout}
                  accessibilityRole="adjustable"
                  accessibilityLabel="Music volume"
                  accessibilityValue={{
                    min: 0,
                    max: 100,
                    now: Math.round(music.volume * 100),
                    text: `${Math.round(music.volume * 100)} percent`,
                  }}>
                  <Pressable
                    onPress={(e) => {
                      if (volumeTrackWidth <= 0) return;
                      const { locationX } = e.nativeEvent;
                      const vol = Math.min(1, Math.max(0, locationX / volumeTrackWidth));
                      updateMusic({ volume: Math.round(vol * 100) / 100 });
                    }}
                    className="flex-1 h-full justify-center">
                    <LinearGradient
                      colors={['#7C3AED', '#EC4899']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        width: `${music.volume * 100}%`,
                        height: '100%',
                        borderRadius: 99,
                        minWidth: music.volume > 0 ? 8 : 0,
                      }}
                    />
                  </Pressable>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[14px] text-foreground font-semibold">Loop</Text>
                <Switch
                  value={music.loop}
                  onValueChange={(v) => updateMusic({ loop: v })}
                  trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                  thumbColor="#FFF"
                />
              </View>
            </Animated.View>
          )}
        </View>

        {/* ─── Interactive Features ─── */}
        <View className="px-5 mb-4">
          <Pressable
            onPress={() => setInteractiveExpanded(!interactiveExpanded)}
            accessibilityRole="button"
            className="flex-row items-center justify-between bg-white rounded-2xl p-4 border border-gray-100"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}>
            <View className="flex-row items-center">
              <View className="h-10 w-10 rounded-xl bg-violet-50 items-center justify-center mr-3">
                <Fingerprint size={18} color="#7C3AED" />
              </View>
              <View>
                <Text className="text-[14px] font-bold text-foreground">Interactive Features</Text>
                <Text className="text-[11px] text-foreground-secondary mt-0.5">
                  {interactive.features.length} feature{interactive.features.length !== 1 ? 's' : ''} enabled
                </Text>
              </View>
            </View>
            {interactiveExpanded ? (
              <ChevronUp size={20} color="#9CA3AF" />
            ) : (
              <ChevronDown size={20} color="#9CA3AF" />
            )}
          </Pressable>

          {interactiveExpanded && (
            <Animated.View entering={FadeInDown.duration(300)} className="mt-2">
              {interactive.features.includes('unlock_code') && (
                <Animated.View entering={FadeInDown.duration(200)} className="bg-primary/5 rounded-2xl p-4 mb-3 border border-primary/15">
                  <View className="flex-row items-center mb-3">
                    <Lock size={16} color="#7C3AED" />
                    <Text className="text-[13px] font-bold text-primary ml-2">Secret Unlock Code</Text>
                  </View>
                  <TextInput
                    value={interactive.unlockCode ?? ''}
                    onChangeText={setUnlockCode}
                    placeholder="Enter secret code..."
                    placeholderTextColor="#9CA3AF"
                    className="text-[15px] text-foreground bg-white rounded-xl px-4 py-3 border border-primary/10 font-semibold tracking-widest"
                    accessibilityLabel="Unlock code"
                    autoCapitalize="characters"
                  />
                </Animated.View>
              )}

              <View className="flex-row flex-wrap gap-2">
                {INTERACTIVE_FEATURES.map((f, idx) => {
                  const active = interactive.features.includes(f.id);
                  return (
                    <Animated.View key={f.id} entering={FadeIn.delay(idx * 40).duration(200)}>
                      <Pressable
                        onPress={() => toggleInteractiveFeature(f.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Toggle ${f.label}`}
                        className="flex-row items-center rounded-2xl px-3.5 py-3 border"
                        style={active ? {
                          backgroundColor: '#7C3AED10',
                          borderColor: '#7C3AED',
                        } : {
                          backgroundColor: '#FFF',
                          borderColor: '#E5E7EB',
                        }}>
                        <Text className="text-[14px] mr-2">{f.emoji}</Text>
                        <Text
                          className={`text-[12px] font-bold ${active ? 'text-primary' : 'text-foreground-secondary'}`}>
                          {f.label}
                        </Text>
                        {active && (
                          <View className="ml-2 h-4 w-4 rounded-full bg-primary items-center justify-center">
                            <Check size={10} color="#FFF" strokeWidth={3} />
                          </View>
                        )}
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </StudioStepLayout>
  );
}
