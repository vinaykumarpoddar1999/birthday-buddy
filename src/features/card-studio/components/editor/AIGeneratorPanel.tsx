import React, { useCallback, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { AIRelationship, AITone } from '../../types';
import { generateCardContent } from '../../utils/ai-generator';

const TONES: { id: AITone; label: string; icon: string }[] = [
  { id: 'heartfelt', label: 'Heartfelt', icon: '💖' },
  { id: 'funny', label: 'Funny', icon: '😂' },
  { id: 'romantic', label: 'Romantic', icon: '💕' },
  { id: 'formal', label: 'Formal', icon: '🤝' },
];

const RELATIONSHIPS: { id: AIRelationship; label: string }[] = [
  { id: 'friend', label: 'Friend' },
  { id: 'family', label: 'Family' },
  { id: 'partner', label: 'Partner' },
  { id: 'colleague', label: 'Colleague' },
];

export function AIGeneratorPanel() {
  const p = useCardStudioStore((s) => s.personalization);
  const update = useCardStudioStore((s) => s.updatePersonalization);

  const [tone, setTone] = useState<AITone>('heartfelt');
  const [rel, setRel] = useState<AIRelationship>('friend');
  const [loading, setLoading] = useState(false);

  const handleGenerate = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const result = generateCardContent(tone, rel, p.recipientName || 'Friend');
      update({
        message: result.wish,
        signature: result.signature,
      });
      setLoading(false);
      Alert.alert('Done!', 'Your card message has been updated with AI-generated content.');
    }, 800);
  }, [tone, rel, p.recipientName, update]);

  return (
    <View className="mx-5 mb-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <View className="px-4 py-3 border-b border-gray-50">
        <View className="flex-row items-center gap-1.5">
          <Sparkles size={15} color="#7C3AED" />
          <Text className="text-[13px] font-bold text-foreground">AI Message Generator</Text>
        </View>
      </View>

      <View className="px-4 py-3">
        <Text className="text-[11px] font-semibold text-foreground-secondary mb-2">Tone</Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {TONES.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTone(t.id)}
              className={`flex-row items-center px-3 py-2 rounded-full gap-1.5 ${
                tone === t.id ? 'bg-primary' : 'bg-gray-50 border border-gray-200'
              }`}
              accessibilityRole="button">
              <Text className="text-[12px]">{t.icon}</Text>
              <Text
                className={`text-[11px] font-semibold ${
                  tone === t.id ? 'text-white' : 'text-foreground-secondary'
                }`}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-[11px] font-semibold text-foreground-secondary mb-2">Relationship</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {RELATIONSHIPS.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => setRel(r.id)}
              className={`px-3 py-2 rounded-full ${
                rel === r.id ? 'bg-primary' : 'bg-gray-50 border border-gray-200'
              }`}
              accessibilityRole="button">
              <Text
                className={`text-[11px] font-semibold ${
                  rel === r.id ? 'text-white' : 'text-foreground-secondary'
                }`}>
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleGenerate}
          disabled={loading}
          className="rounded-xl overflow-hidden"
          accessibilityRole="button">
          <LinearGradient colors={['#7C3AED', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <View className="flex-row items-center justify-center py-3 gap-2">
              <Sparkles size={16} color="#FFF" />
              <Text className="text-[13px] font-bold text-white">
                {loading ? 'Generating...' : 'Generate Message'}
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
