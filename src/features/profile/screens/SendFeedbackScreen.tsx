import { router } from 'expo-router';
import { ArrowLeft, Bug, Camera, MessageCircle, PartyPopper, Send, Sparkles, TrendingUp } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconCircle } from '@shared/ui/IconCircle';

import { useActivityStore } from '../store/activity.store';

const CATEGORIES = ['bug', 'feature', 'improvement', 'other'] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_CONFIG: Record<Category, { label: string; icon: LucideIcon }> = {
  bug: { label: 'Bug', icon: Bug },
  feature: { label: 'Feature', icon: Sparkles },
  improvement: { label: 'Improvement', icon: TrendingUp },
  other: { label: 'Other', icon: MessageCircle },
};

export const SendFeedbackScreen = () => {
  const addFeedback = useActivityStore((s) => s.addFeedback);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<Category>('feature');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) return;
    addFeedback({ subject, category, message });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6" edges={['top']}>
        <IconCircle icon={PartyPopper} size="xl" iconColor="#7C3AED" bgColor="#EDE9FE" className="mb-4" />
        <Text className="text-heading text-foreground font-bold text-center">Thank You!</Text>
        <Text className="text-body text-foreground-secondary text-center mt-2">Your feedback has been submitted. We appreciate your input!</Text>
        <Pressable className="bg-primary rounded-xl px-6 py-3 mt-6" onPress={() => router.back()} accessibilityRole="button">
          <Text className="text-[15px] font-bold text-white">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Send Feedback</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">We would love to hear from you. Share your thoughts!</Text>

        <View className="gap-4">
          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-1.5">Subject</Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description"
              placeholderTextColor="#9CA3AF"
              className="bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-foreground"
            />
          </View>

          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-2">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const { label, icon: Icon } = CATEGORY_CONFIG[c];
                const isSelected = category === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    className={`rounded-xl px-4 py-2.5 border flex-row items-center gap-1.5 ${isSelected ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                    accessibilityRole="button">
                    <Icon size={14} color={isSelected ? '#7C3AED' : '#9CA3AF'} />
                    <Text className={`text-[13px] font-semibold ${isSelected ? 'text-primary' : 'text-foreground-secondary'}`}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-1.5">Message</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your feedback in detail..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={5}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-foreground min-h-[120px]"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          <Pressable className="bg-surface border border-border rounded-xl py-3 flex-row items-center justify-center gap-2" accessibilityRole="button">
            <Camera size={18} color="#9CA3AF" />
            <Text className="text-[14px] text-foreground-secondary">Attach Screenshot (optional)</Text>
          </Pressable>
        </View>

        <Pressable
          className={`rounded-2xl py-4 mt-6 items-center flex-row justify-center gap-2 ${subject.trim() && message.trim() ? 'bg-primary' : 'bg-primary/40'}`}
          onPress={handleSubmit}
          disabled={!subject.trim() || !message.trim()}
          accessibilityRole="button">
          <Send size={18} color="#FFFFFF" />
          <Text className="text-[15px] font-bold text-white">Submit Feedback</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
