import React, { memo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Camera,
  Clock,
  Gift,
  Heart,
  Mail,
  MessageSquare,
  Mic,
  Play,
  Rocket,
  Video,
} from 'lucide-react-native';

import type { ExperienceModule, ExperienceTheme } from '../../types';
import { QuizModule } from './QuizModule';

interface ModuleRendererProps {
  module: ExperienceModule;
  theme: ExperienceTheme;
  interactive?: boolean;
  onView?: () => void;
  index?: number;
}

const MODULE_ICONS: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  photo_gallery: Camera,
  video_memory: Video,
  voice_message: Mic,
  timeline: Clock,
  countdown: Clock,
  scratch_card: Gift,
  quiz: Rocket,
  open_when: Mail,
  reasons_love: Heart,
  future_dreams: Rocket,
  message: MessageSquare,
  gift_box: Gift,
};

export const ModuleRenderer = memo(function ModuleRenderer({
  module,
  theme,
  interactive = false,
  onView,
  index = 0,
}: ModuleRendererProps) {
  const [revealed, setRevealed] = useState(!interactive);
  const safeItems = module.type === 'photo_gallery' ? module.items ?? [] : [];
  const safeEvents = module.type === 'timeline' ? module.events ?? [] : [];
  const safeLetters = module.type === 'open_when' ? module.letters ?? [] : [];
  const safeCards = module.type === 'reasons_love' ? module.cards ?? [] : [];
  const safeDreams = module.type === 'future_dreams' ? module.dreams ?? [] : [];

  const handleReveal = () => {
    if (!revealed) {
      setRevealed(true);
      onView?.();
    }
  };

  const Icon = MODULE_ICONS[module.type] ?? MessageSquare;

  return (
    <Animated.View entering={FadeInDown.delay(index * 120).duration(500).springify()} className="mb-4">
      <View
        className="rounded-3xl border overflow-hidden"
        style={{
          backgroundColor: `${theme.primaryColor}06`,
          borderColor: `${theme.primaryColor}18`,
        }}>
        <View className="flex-row items-center px-4 pt-4 pb-2">
          <View
            className="h-8 w-8 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: `${theme.primaryColor}15` }}>
            <Icon size={16} color={theme.primaryColor} />
          </View>
          <Text style={{ color: theme.primaryColor, fontSize: 15, fontWeight: '800', flex: 1 }}>
            {module.title}
          </Text>
        </View>

        <View className="px-4 pb-4">
          {module.type === 'message' && (
            <View className="mt-2 p-4 rounded-2xl" style={{ backgroundColor: `${theme.primaryColor}08` }}>
              <Text style={{ color: theme.textColor, fontSize: 15, lineHeight: 24, fontStyle: module.style === 'poem' ? 'italic' : 'normal' }}>
                {module.content || 'Your heartfelt message will appear here...'}
              </Text>
              {module.style && (
                <View className="flex-row justify-end mt-3">
                  <View className="rounded-full px-3 py-1" style={{ backgroundColor: `${theme.primaryColor}15` }}>
                    <Text style={{ color: theme.primaryColor, fontSize: 10, fontWeight: '700' }}>
                      {module.style.toUpperCase()}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {module.type === 'photo_gallery' && (
            <View className="mt-2">
              {safeItems.length === 0 ? (
                <View className="p-6 rounded-2xl items-center" style={{ backgroundColor: `${theme.primaryColor}08` }}>
                  <Camera size={28} color={`${theme.primaryColor}60`} />
                  <Text style={{ color: theme.textColor, opacity: 0.4, fontSize: 13, marginTop: 8 }}>
                    No photos added yet
                  </Text>
                </View>
              ) : (
                <View className="flex-row flex-wrap gap-2">
                  {safeItems.map((item, idx) => (
                    <Animated.View key={item.id} entering={FadeIn.delay(idx * 100)} className="w-[47%]">
                      <Image
                        source={{ uri: item.uri }}
                        style={{ width: '100%', height: 110, borderRadius: 16 }}
                        contentFit="cover"
                      />
                      {item.caption ? (
                        <Text style={{ color: theme.textColor, fontSize: 11, marginTop: 4, opacity: 0.7 }}>
                          {item.caption}
                        </Text>
                      ) : null}
                    </Animated.View>
                  ))}
                </View>
              )}
            </View>
          )}

          {module.type === 'timeline' && (
            <View className="mt-3">
              {safeEvents.length === 0 ? (
                <View className="p-6 rounded-2xl items-center" style={{ backgroundColor: `${theme.primaryColor}08` }}>
                  <Clock size={28} color={`${theme.primaryColor}60`} />
                  <Text style={{ color: theme.textColor, opacity: 0.4, fontSize: 13, marginTop: 8 }}>
                    No timeline events yet
                  </Text>
                </View>
              ) : (
                safeEvents.map((ev, idx) => (
                  <Animated.View key={ev.id} entering={FadeInDown.delay(idx * 100)} className="flex-row mb-3">
                    <View className="items-center mr-3">
                      <View
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      {idx < safeEvents.length - 1 && (
                        <View
                          className="w-0.5 flex-1 mt-1"
                          style={{ backgroundColor: `${theme.primaryColor}30` }}
                        />
                      )}
                    </View>
                    <View className="flex-1 pb-2">
                      <Text style={{ color: theme.primaryColor, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>
                        {ev.date}
                      </Text>
                      <Text style={{ color: theme.textColor, fontSize: 14, fontWeight: '800', marginTop: 2 }}>
                        {ev.title}
                      </Text>
                      <Text style={{ color: theme.textColor, fontSize: 13, opacity: 0.7, marginTop: 2, lineHeight: 20 }}>
                        {ev.description}
                      </Text>
                      {ev.imageUri && (
                        <Image
                          source={{ uri: ev.imageUri }}
                          style={{ width: '100%', height: 100, borderRadius: 12, marginTop: 8 }}
                          contentFit="cover"
                        />
                      )}
                    </View>
                  </Animated.View>
                ))
              )}
            </View>
          )}

          {module.type === 'countdown' && (
            <Animated.View entering={ZoomIn.springify()} className="mt-3">
              <LinearGradient
                colors={[`${theme.accentColor}25`, `${theme.primaryColor}15`]}
                className="p-6 rounded-2xl items-center">
                <Text style={{ color: theme.textColor, fontSize: 32, fontWeight: '900', letterSpacing: -1 }}>
                  {module.targetDate || 'Set a date'}
                </Text>
                <Text style={{ color: theme.textColor, fontSize: 13, marginTop: 8, opacity: 0.7, textAlign: 'center' }}>
                  {module.revealMessage || 'Something special is coming...'}
                </Text>
              </LinearGradient>
            </Animated.View>
          )}

          {module.type === 'scratch_card' && (
            <Pressable onPress={handleReveal} accessibilityRole="button" className="mt-2">
              {revealed ? (
                <Animated.View entering={ZoomIn.springify()}>
                  <View className="p-5 rounded-2xl" style={{ backgroundColor: `${theme.accentColor}15` }}>
                    <Text style={{ color: theme.textColor, fontSize: 15, lineHeight: 24, textAlign: 'center' }}>
                      {module.hiddenMessage || 'A hidden surprise!'}
                    </Text>
                  </View>
                </Animated.View>
              ) : (
                <LinearGradient
                  colors={[theme.secondaryColor, theme.primaryColor]}
                  className="p-8 rounded-2xl items-center">
                  <Text style={{ fontSize: 32 }}>✨</Text>
                  <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14, marginTop: 8 }}>
                    Tap to Scratch & Reveal
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 }}>
                    A hidden message awaits
                  </Text>
                </LinearGradient>
              )}
            </Pressable>
          )}

          {module.type === 'gift_box' && (
            <Pressable onPress={handleReveal} accessibilityRole="button" className="items-center mt-3">
              {revealed ? (
                <Animated.View entering={ZoomIn.springify()} className="items-center p-5 rounded-2xl w-full"
                  style={{ backgroundColor: `${theme.accentColor}12` }}>
                  <Text style={{ fontSize: 56 }}>🎉</Text>
                  <Text style={{ color: theme.textColor, fontSize: 15, marginTop: 12, textAlign: 'center', lineHeight: 22 }}>
                    {module.revealMessage || 'Surprise!'}
                  </Text>
                </Animated.View>
              ) : (
                <LinearGradient
                  colors={[theme.primaryColor, theme.secondaryColor]}
                  className="p-8 rounded-2xl items-center w-full">
                  <Text style={{ fontSize: 56 }}>🎁</Text>
                  <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13, marginTop: 8 }}>
                    Tap to open your gift
                  </Text>
                </LinearGradient>
              )}
            </Pressable>
          )}

          {module.type === 'open_when' && (
            <View className="mt-2 gap-2">
              {safeLetters.length === 0 ? (
                <View className="p-6 rounded-2xl items-center" style={{ backgroundColor: `${theme.primaryColor}08` }}>
                  <Mail size={28} color={`${theme.primaryColor}60`} />
                  <Text style={{ color: theme.textColor, opacity: 0.4, fontSize: 13, marginTop: 8 }}>
                    Add some letters
                  </Text>
                </View>
              ) : (
                safeLetters.map((letter, idx) => (
                  <Animated.View key={letter.id} entering={FadeInDown.delay(idx * 80)}>
                    <Pressable
                      onPress={handleReveal}
                      className="p-4 rounded-2xl border"
                      style={{
                        backgroundColor: `${theme.secondaryColor}10`,
                        borderColor: `${theme.secondaryColor}25`,
                      }}>
                      <View className="flex-row items-center">
                        <View className="h-8 w-8 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: `${theme.primaryColor}20` }}>
                          <Mail size={14} color={theme.primaryColor} />
                        </View>
                        <Text style={{ color: theme.primaryColor, fontSize: 13, fontWeight: '800', flex: 1 }}>
                          {letter.title}
                        </Text>
                      </View>
                      {(revealed || !interactive) && letter.content ? (
                        <Text style={{ color: theme.textColor, fontSize: 13, marginTop: 8, lineHeight: 20, paddingLeft: 44 }}>
                          {letter.content}
                        </Text>
                      ) : null}
                    </Pressable>
                  </Animated.View>
                ))
              )}
            </View>
          )}

          {module.type === 'reasons_love' && (
            <View className="flex-row flex-wrap mt-3 gap-2 justify-center">
              {safeCards.length === 0 ? (
                <View className="p-6 rounded-2xl items-center w-full" style={{ backgroundColor: `${theme.primaryColor}08` }}>
                  <Heart size={28} color={`${theme.primaryColor}60`} />
                  <Text style={{ color: theme.textColor, opacity: 0.4, fontSize: 13, marginTop: 8 }}>
                    Add your reasons
                  </Text>
                </View>
              ) : (
                safeCards.map((card, idx) => (
                  <Animated.View key={card.id} entering={ZoomIn.delay(idx * 60).springify()}>
                    <Pressable
                      onPress={handleReveal}
                      className="aspect-square rounded-2xl items-center justify-center"
                      style={{
                        width: 90,
                        backgroundColor: theme.primaryColor,
                      }}>
                      <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '900' }}>
                        {card.number}
                      </Text>
                      {(revealed || !interactive) && card.text ? (
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 9, textAlign: 'center', padding: 6, marginTop: 2 }}>
                          {card.text}
                        </Text>
                      ) : null}
                    </Pressable>
                  </Animated.View>
                ))
              )}
            </View>
          )}

          {module.type === 'quiz' && (
            <QuizModule
              module={module}
              theme={theme}
              interactive={interactive}
              onComplete={onView}
            />
          )}

          {module.type === 'future_dreams' && (
            <View className="mt-3">
              {safeDreams.length === 0 ? (
                <View className="p-6 rounded-2xl items-center" style={{ backgroundColor: `${theme.primaryColor}08` }}>
                  <Rocket size={28} color={`${theme.primaryColor}60`} />
                  <Text style={{ color: theme.textColor, opacity: 0.4, fontSize: 13, marginTop: 8 }}>
                    Share your dreams together
                  </Text>
                </View>
              ) : (
                safeDreams.map((d, idx) => (
                  <Animated.View
                    key={d.id}
                    entering={FadeInDown.delay(idx * 80)}
                    className="flex-row items-start mb-3">
                    <View
                      className="h-6 w-6 rounded-full items-center justify-center mr-3 mt-0.5"
                      style={{ backgroundColor: `${theme.accentColor}20` }}>
                      <Text style={{ color: theme.accentColor, fontSize: 10 }}>✦</Text>
                    </View>
                    <Text className="flex-1" style={{ color: theme.textColor, fontSize: 14, lineHeight: 22 }}>
                      {d.text}
                    </Text>
                  </Animated.View>
                ))
              )}
            </View>
          )}

          {module.type === 'voice_message' && (
            <View className="mt-3">
              <LinearGradient
                colors={[`${theme.primaryColor}12`, `${theme.primaryColor}06`]}
                className="p-5 rounded-2xl items-center">
                <View
                  className="h-14 w-14 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: `${theme.primaryColor}20` }}>
                  <Mic size={24} color={theme.primaryColor} />
                </View>
                <Text style={{ color: theme.textColor, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
                  {module.transcript || (module.audioUri ? 'Voice message ready to play' : 'Record a voice message')}
                </Text>
                {module.duration ? (
                  <Text style={{ color: theme.primaryColor, fontSize: 11, fontWeight: '700', marginTop: 6 }}>
                    {Math.floor(module.duration / 60)}:{String(module.duration % 60).padStart(2, '0')}
                  </Text>
                ) : null}
              </LinearGradient>
            </View>
          )}

          {module.type === 'video_memory' && (
            <View className="mt-3">
              {module.videoUri ? (
                <View className="rounded-2xl overflow-hidden">
                  <Image
                    source={{ uri: module.thumbnailUri || module.videoUri }}
                    style={{ width: '100%', height: 180, borderRadius: 16 }}
                    contentFit="cover"
                  />
                  <View className="absolute inset-0 items-center justify-center">
                    <View
                      className="h-16 w-16 rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <Play size={28} color="#FFF" fill="#FFF" />
                    </View>
                  </View>
                </View>
              ) : (
                <View className="p-6 rounded-2xl items-center" style={{ backgroundColor: `${theme.primaryColor}08` }}>
                  <Video size={28} color={`${theme.primaryColor}60`} />
                  <Text style={{ color: theme.textColor, opacity: 0.4, fontSize: 13, marginTop: 8 }}>
                    Add a video memory
                  </Text>
                </View>
              )}
              {module.caption ? (
                <Text style={{ color: theme.textColor, fontSize: 13, textAlign: 'center', marginTop: 8, opacity: 0.7 }}>
                  {module.caption}
                </Text>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
});
