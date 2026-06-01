import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  HeartHandshake,
  Laugh,
  Sparkles,
  Users,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { AIRelationship, AITone } from '../../types';
import { generateCardContent } from '../../utils/ai-generator';

type ChipOption<T extends string> = { id: T; label: string; Icon: LucideIcon };

const TONES: ChipOption<AITone>[] = [
  { id: 'heartfelt', label: 'Heartfelt', Icon: Heart },
  { id: 'funny', label: 'Funny', Icon: Laugh },
  { id: 'romantic', label: 'Romantic', Icon: Heart },
  { id: 'emotional', label: 'Emotional', Icon: Heart },
  { id: 'formal', label: 'Formal', Icon: Briefcase },
  { id: 'luxury', label: 'Luxury', Icon: Sparkles },
];

const RELATIONSHIPS: ChipOption<AIRelationship>[] = [
  { id: 'friend', label: 'Friend', Icon: HeartHandshake },
  { id: 'family', label: 'Family', Icon: Users },
  { id: 'partner', label: 'Partner', Icon: Heart },
  { id: 'colleague', label: 'Colleague', Icon: Briefcase },
];

export function AIGeneratorPanel() {
  const p = useCardStudioStore((s) => s.personalization);
  const update = useCardStudioStore((s) => s.updatePersonalization);

  const [isExpanded, setIsExpanded] = useState(false);
  const [tone, setTone] = useState<AITone>('heartfelt');
  const [rel, setRel] = useState<AIRelationship>('friend');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = useCallback(() => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      const result = generateCardContent(tone, rel, p.recipientName || 'Friend');
      update({
        message: result.wish,
        signature: result.signature,
      });
      setLoading(false);
      setGenerated(true);
      setTimeout(() => setGenerated(false), 3000);
    }, 1000);
  }, [tone, rel, p.recipientName, update]);

  return (
    <View
      className="mx-5 mb-4 rounded-2xl overflow-hidden"
      style={{
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}>
      {/* Header - always visible */}
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? 'Collapse AI generator' : 'Expand AI generator'}>
        <LinearGradient
          colors={isExpanded ? ['#7C3AED', '#9333EA'] : ['#F5F3FF', '#EDE9FE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View className="flex-row items-center px-4 py-3.5">
            <View className={`h-8 w-8 rounded-xl items-center justify-center mr-3 ${isExpanded ? 'bg-white/15' : 'bg-primary/10'}`}>
              <Sparkles size={16} color={isExpanded ? '#FFF' : '#7C3AED'} />
            </View>
            <View className="flex-1">
              <Text className={`text-[14px] font-bold ${isExpanded ? 'text-white' : 'text-foreground'}`}>
                AI Message Writer
              </Text>
              <Text className={`text-[10px] mt-0.5 ${isExpanded ? 'text-white/70' : 'text-foreground-muted'}`}>
                Generate the perfect birthday wish
              </Text>
            </View>
            {isExpanded ? (
              <ChevronUp size={18} color="#FFF" />
            ) : (
              <ChevronDown size={18} color="#7C3AED" />
            )}
          </View>
        </LinearGradient>
      </Pressable>

      {/* Expandable content */}
      {isExpanded && (
        <View className="bg-white border border-gray-100 border-t-0 rounded-b-2xl">
          <View className="px-4 py-4">
            {/* Tone */}
            <Text className="text-[12px] font-bold text-foreground mb-2.5">Choose Tone</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {TONES.map((t) => {
                const { Icon } = t;
                const isSelected = tone === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => setTone(t.id)}
                    className={`flex-row items-center px-3.5 py-2 rounded-xl gap-1.5 ${
                      isSelected
                        ? 'bg-primary'
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                    style={isSelected ? {
                      shadowColor: '#7C3AED',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    } : undefined}
                    accessibilityRole="button">
                    <Icon size={13} color={isSelected ? '#FFFFFF' : '#6B7280'} strokeWidth={2} />
                    <Text
                      className={`text-[12px] font-semibold ${
                        isSelected ? 'text-white' : 'text-foreground-secondary'
                      }`}>
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Relationship */}
            <Text className="text-[12px] font-bold text-foreground mb-2.5">Relationship</Text>
            <View className="flex-row flex-wrap gap-2 mb-5">
              {RELATIONSHIPS.map((r) => {
                const { Icon } = r;
                const isSelected = rel === r.id;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => setRel(r.id)}
                    className={`flex-row items-center px-3.5 py-2 rounded-xl gap-1.5 ${
                      isSelected
                        ? 'bg-primary'
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                    style={isSelected ? {
                      shadowColor: '#7C3AED',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    } : undefined}
                    accessibilityRole="button">
                    <Icon size={13} color={isSelected ? '#FFFFFF' : '#6B7280'} strokeWidth={2} />
                    <Text
                      className={`text-[12px] font-semibold ${
                        isSelected ? 'text-white' : 'text-foreground-secondary'
                      }`}>
                      {r.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Generate button */}
            <Pressable
              onPress={handleGenerate}
              disabled={loading}
              className="rounded-2xl overflow-hidden"
              style={{
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 5,
              }}
              accessibilityRole="button">
              <LinearGradient
                colors={generated ? ['#22C55E', '#16A34A'] : ['#7C3AED', '#9333EA', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <View className="flex-row items-center justify-center py-3.5 gap-2.5">
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="#FFF" />
                      <Text className="text-[14px] font-bold text-white">
                        Writing magic...
                      </Text>
                    </>
                  ) : generated ? (
                    <>
                      <Check size={17} color="#FFF" strokeWidth={2.5} />
                      <Text className="text-[14px] font-bold text-white">
                        Message Updated!
                      </Text>
                    </>
                  ) : (
                    <>
                      <WandSparkles size={17} color="#FFF" />
                      <Text className="text-[14px] font-bold text-white">
                        Generate Message
                      </Text>
                    </>
                  )}
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
