import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';

import type { CardTemplate } from '../../types';
import { TemplateCard } from './TemplateCard';

type Props = {
  templates: CardTemplate[];
  onSelect: (template: CardTemplate) => void;
};

export function TrendingSection({ templates, onSelect }: Props) {
  if (templates.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between px-5 mb-3.5">
        <View className="flex-row items-center gap-2">
          <View className="h-7 w-7 rounded-lg items-center justify-center overflow-hidden">
            <LinearGradient
              colors={['#F97316', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TrendingUp size={14} color="#FFF" strokeWidth={2.5} />
            </LinearGradient>
          </View>
          <View>
            <Text className="text-[15px] font-bold text-foreground">Trending Now</Text>
            <Text className="text-[10px] text-foreground-muted mt-0.5">Most popular this week</Text>
          </View>
        </View>
        <Pressable
          className="px-3 py-1.5 rounded-full bg-primary/10"
          accessibilityRole="button">
          <Text className="text-[11px] font-semibold text-primary">See All</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        decelerationRate="fast"
        snapToInterval={168}>
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} onSelect={onSelect} width={158} />
        ))}
      </ScrollView>
    </View>
  );
}
