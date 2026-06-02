import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import {
  Calendar,
  Camera,
  Gift,
  Heart,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
  User,
  WandSparkles,
} from 'lucide-react-native';

import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import { ContinueButton } from '../../components/common/StudioHeader';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  delay?: number;
}

function SectionHeader({ icon, title, subtitle, delay = 0 }: SectionHeaderProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} className="flex-row items-center mb-3 gap-2.5">
      <View
        className="h-9 w-9 rounded-xl items-center justify-center"
        style={{ backgroundColor: '#F5F3FF' }}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-black text-foreground">{title}</Text>
        {subtitle ? (
          <Text className="text-[11px] text-foreground-secondary mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  multiline?: boolean;
  delay?: number;
}

function FormField({ label, value, onChangeText, placeholder, icon, multiline, delay = 0 }: FormFieldProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} className="mb-3">
      <View className="flex-row items-center gap-2 mb-1.5">
        {icon}
        <Text className="text-[12px] font-bold text-foreground-secondary">{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        className="bg-white rounded-xl px-4 py-3 text-[14px] text-foreground border border-gray-100"
        style={{
          minHeight: multiline ? 80 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      />
    </Animated.View>
  );
}

export function Step4CustomizeScreen() {
  const personalization = useSurpriseLinkStore((s) => s.personalization);
  const questions = Array.isArray(personalization.questions) ? personalization.questions : [];
  const updatePersonalization = useSurpriseLinkStore((s) => s.updatePersonalization);
  const updateHero = useSurpriseLinkStore((s) => s.updateHero);
  const updateQuestion = useSurpriseLinkStore((s) => s.updateQuestion);
  const nextStep = useSurpriseLinkStore((s) => s.nextStep);

  const pickImage = async (field: 'heroImageUri' | 'coverImageUri') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      updateHero({ [field]: result.assets[0].uri });
    }
  };

  const pickQuestionImage = async (questionId: string, currentAnswer: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      updateQuestion(questionId, currentAnswer, result.assets[0].uri);
    }
  };

  return (
    <StudioStepLayout
      footer={
        <ContinueButton
          onPress={nextStep}
          disabled={!personalization.recipientName.trim()}
        />
      }>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <StudioScreenIntro
          title="Personalize Your Surprise"
          subtitle="Names, hero media, opening animation, and heartfelt answers make the experience unforgettable."
          Icon={WandSparkles}
        />

        {/* Hero Section */}
        <View className="px-5 mb-6">
          <SectionHeader
            icon={<Sparkles size={18} color="#7C3AED" />}
            title="Hero Section"
            subtitle="First impression matters"
            delay={100}
          />

          <FormField
            label="Welcome Message"
            value={personalization.hero.welcomeMessage}
            onChangeText={(v) => updateHero({ welcomeMessage: v })}
            placeholder="Someone created a surprise just for you ❤️"
            icon={<MessageSquare size={13} color="#9CA3AF" />}
            multiline
            delay={140}
          />

          <Animated.View entering={FadeInDown.delay(180).springify()} className="flex-row gap-3 mb-3">
            <Pressable
              onPress={() => pickImage('heroImageUri')}
              className="flex-1 rounded-2xl overflow-hidden"
              accessibilityRole="button"
              accessibilityLabel="Add hero image"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}>
              <LinearGradient
                colors={['#F5F3FF', '#EDE9FE']}
                className="p-4 items-center rounded-2xl border border-primary/10">
                <Camera size={22} color="#7C3AED" />
                <Text className="text-[11px] font-bold text-primary mt-1.5">Hero Image</Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              onPress={() => pickImage('coverImageUri')}
              className="flex-1 rounded-2xl overflow-hidden"
              accessibilityRole="button"
              accessibilityLabel="Add cover image"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}>
              <LinearGradient
                colors={['#FDF2F8', '#FCE7F3']}
                className="p-4 items-center rounded-2xl border border-pink-200/30">
                <ImageIcon size={22} color="#EC4899" />
                <Text className="text-[11px] font-bold text-pink-500 mt-1.5">Cover Image</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {personalization.hero.heroImageUri ? (
            <Animated.View entering={FadeInDown.springify()}>
              <Image
                source={{ uri: personalization.hero.heroImageUri }}
                style={{ width: '100%', height: 170, borderRadius: 16, marginBottom: 12 }}
                contentFit="cover"
              />
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(220).springify()}>
            <Text className="text-[12px] font-bold text-foreground-secondary mb-2">
              Opening Animation
            </Text>
            <View className="flex-row gap-3">
              {([
                { id: 'gift_box' as const, label: 'Gift Box', Icon: Gift, color: '#7C3AED', bg: ['#F5F3FF', '#EDE9FE'] as [string, string] },
                { id: 'envelope' as const, label: 'Envelope', Icon: Mail, color: '#EC4899', bg: ['#FDF2F8', '#FCE7F3'] as [string, string] },
              ]).map((anim) => {
                const active = personalization.hero.openingAnimation === anim.id;
                return (
                  <Pressable
                    key={anim.id}
                    onPress={() => updateHero({ openingAnimation: anim.id })}
                    className="flex-1"
                    accessibilityRole="button"
                    accessibilityLabel={`${anim.label} opening${active ? ', selected' : ''}`}
                    style={({ pressed }) => ({
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    })}>
                    <LinearGradient
                      colors={active ? [anim.color, `${anim.color}CC`] : anim.bg}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: active ? anim.color : 'transparent',
                        shadowColor: active ? anim.color : 'transparent',
                        shadowOffset: { width: 0, height: active ? 4 : 0 },
                        shadowOpacity: active ? 0.25 : 0,
                        shadowRadius: active ? 8 : 0,
                        elevation: active ? 4 : 0,
                      }}>
                      <anim.Icon size={20} color={active ? '#FFF' : anim.color} />
                      <Text
                        className="text-[11px] font-bold mt-1.5"
                        style={{ color: active ? '#FFF' : '#374151' }}>
                        {anim.label}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </View>

        {/* Basic Info Section */}
        <View className="px-5 mb-6">
          <SectionHeader
            icon={<User size={18} color="#7C3AED" />}
            title="Basic Info"
            subtitle="Tell us about both of you"
            delay={260}
          />

          <FormField
            label="Your Name"
            value={personalization.senderName}
            onChangeText={(v) => updatePersonalization({ senderName: v })}
            placeholder="Your name"
            icon={<User size={13} color="#9CA3AF" />}
            delay={300}
          />
          <FormField
            label="Recipient Name"
            value={personalization.recipientName}
            onChangeText={(v) => updatePersonalization({ recipientName: v })}
            placeholder="Their name"
            icon={<Heart size={13} color="#9CA3AF" />}
            delay={320}
          />
          <FormField
            label="Nickname"
            value={personalization.nickname}
            onChangeText={(v) => updatePersonalization({ nickname: v })}
            placeholder="Optional nickname (e.g. Babe, Bestie)"
            icon={<Sparkles size={13} color="#9CA3AF" />}
            delay={340}
          />
          <FormField
            label="Relationship"
            value={personalization.relationship}
            onChangeText={(v) => updatePersonalization({ relationship: v })}
            placeholder="e.g. Best friend since college"
            icon={<Heart size={13} color="#9CA3AF" />}
            delay={360}
          />
          <FormField
            label="Occasion Date"
            value={personalization.occasionDate}
            onChangeText={(v) => updatePersonalization({ occasionDate: v })}
            placeholder="e.g. June 15, 2026"
            icon={<Calendar size={13} color="#9CA3AF" />}
            delay={380}
          />
          <FormField
            label="Location"
            value={personalization.location}
            onChangeText={(v) => updatePersonalization({ location: v })}
            placeholder="Where it happened or will happen"
            icon={<MapPin size={13} color="#9CA3AF" />}
            delay={400}
          />
        </View>

        {/* Personal Questions Section */}
        {questions.length > 0 && (
          <View className="px-5">
            <SectionHeader
              icon={<MessageSquare size={18} color="#7C3AED" />}
              title="Personal Questions"
              subtitle="Heartfelt answers that make it special"
              delay={440}
            />

            {questions.map((q, i) => (
              <Animated.View
                key={q.id}
                entering={FadeInDown.delay(480 + i * 40).springify()}>
                <LinearGradient
                  colors={['#FFFFFF', '#FAFAFE']}
                  className="rounded-2xl p-4 mb-3"
                  style={{
                    borderWidth: 1,
                    borderColor: '#F3F4F6',
                    shadowColor: '#7C3AED',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 1,
                  }}>
                  <Text className="text-[13px] font-bold text-foreground mb-2.5">{q.label}</Text>
                  <TextInput
                    value={q.answer}
                    onChangeText={(v) => updateQuestion(q.id, v)}
                    placeholder={q.placeholder}
                    placeholderTextColor="#9CA3AF"
                    multiline
                    className="text-[13px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 min-h-[60px]"
                    style={{ textAlignVertical: 'top' }}
                  />
                  <View className="flex-row items-center mt-2.5 gap-2">
                    <Pressable
                      onPress={() => pickQuestionImage(q.id, q.answer)}
                      accessibilityRole="button"
                      accessibilityLabel="Add image to answer"
                      className="flex-row items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full">
                      <Camera size={12} color="#7C3AED" />
                      <Text className="text-[10px] font-bold text-primary">
                        {q.imageUri ? 'Change Photo' : 'Add Photo'}
                      </Text>
                    </Pressable>
                  </View>
                  {q.imageUri ? (
                    <Image
                      source={{ uri: q.imageUri }}
                      style={{ width: '100%', height: 120, borderRadius: 12, marginTop: 10 }}
                      contentFit="cover"
                    />
                  ) : null}
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </StudioStepLayout>
  );
}
