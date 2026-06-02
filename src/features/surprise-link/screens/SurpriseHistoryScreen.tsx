import { router } from 'expo-router';
import { ArrowLeft, ChartBar, Clock, Eye, Link2, Plus, Search, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { EmptyState } from '@shared/ui/EmptyState';
import { StudioHistorySkeleton } from '../components/common/StudioHistorySkeleton';
import { SURPRISE_STUDIO } from '../constants/surprise-studio.tokens';
import { useSurpriseExperiences } from '../hooks/useSurpriseLinks';

const FILTERS = ['All', 'Published', 'Drafts'] as const;
type FilterType = (typeof FILTERS)[number];

const FILTER_COLORS: Record<FilterType, { active: string; text: string }> = {
  All: { active: '#7C3AED', text: '#FFF' },
  Published: { active: '#22C55E', text: '#FFF' },
  Drafts: { active: '#F59E0B', text: '#FFF' },
};

export function SurpriseHistoryScreen() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [query, setQuery] = useState('');
  const { data: experiences = [], isLoading } = useSurpriseExperiences();

  const filtered = useMemo(() => {
    let items = experiences;
    if (filter === 'Published') items = items.filter((e) => e.status === 'published');
    if (filter === 'Drafts') items = items.filter((e) => e.status === 'draft');
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (e) =>
          e.personalization.recipientName.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q),
      );
    }
    return items.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [experiences, filter, query]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 rounded-xl bg-white border border-gray-100 items-center justify-center mr-3"
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 2,
          }}>
          <ArrowLeft size={20} color={SURPRISE_STUDIO.color.primary} />
        </Pressable>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Sparkles size={12} color="#7C3AED" />
            <Text className="text-[10px] font-bold text-primary uppercase tracking-wider ml-1">
              Surprise Studio
            </Text>
          </View>
          <Text className="text-[18px] font-black text-foreground">Your Surprises</Text>
        </View>
        <Pressable
          onPress={() => router.push('/surprise-link-studio')}
          accessibilityRole="button"
          className="h-10 w-10 rounded-xl bg-primary items-center justify-center"
          style={{
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}>
          <Plus size={20} color="#FFF" />
        </Pressable>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View entering={FadeInDown.delay(100).duration(300)} className="px-5 mb-3">
        <View
          className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 6,
            elevation: 1,
          }}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or link..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 py-3 text-[15px] text-foreground"
            accessibilityLabel="Search surprises"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </Animated.View>

      {/* Filters */}
      <Animated.View entering={FadeInDown.delay(200).duration(300)} className="px-5 mb-4">
        <View className="flex-row gap-2">
          {FILTERS.map((f) => {
            const isActive = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                className="rounded-xl px-4 py-2"
                style={isActive ? {
                  backgroundColor: FILTER_COLORS[f].active,
                  shadowColor: FILTER_COLORS[f].active,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 3,
                } : {
                  backgroundColor: '#FFF',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
                accessibilityRole="button">
                <Text
                  className={`text-[12px] font-bold ${isActive ? 'text-white' : 'text-foreground-secondary'}`}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <StudioHistorySkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={query.trim() ? 'No matches' : 'No surprises yet'}
            subtitle={
              query.trim()
                ? 'Try a different name or clear your search.'
                : 'Create your first interactive experience in Surprise Link Studio.'
            }
            primaryAction={{
              label: query.trim() ? 'Clear search' : 'Create Surprise',
              onPress: () => (query.trim() ? setQuery('') : router.push('/surprise-link-studio')),
            }}
            className="pt-12"
          />
        ) : (
          filtered.map((exp, idx) => (
            <Animated.View key={exp.id} entering={FadeInDown.delay(idx * 80).duration(400)}>
              <View
                className="bg-white rounded-2xl mb-3 border border-gray-100 overflow-hidden"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                <LinearGradient
                  colors={[`${exp.theme.primaryColor}08`, '#FFFFFF']}
                  className="px-4 py-4 flex-row items-center">
                  <LinearGradient
                    colors={[exp.theme.primaryColor, exp.theme.secondaryColor]}
                    className="h-12 w-12 rounded-xl items-center justify-center mr-3">
                    <Link2 size={20} color="#FFF" />
                  </LinearGradient>
                  <View className="flex-1 min-w-0">
                    <Text className="text-[15px] font-bold text-foreground" numberOfLines={1}>
                      {exp.personalization.recipientName || 'Untitled Surprise'}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-[11px] text-foreground-secondary capitalize">
                        {exp.occasion.replace(/_/g, ' ')}
                      </Text>
                      <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                      <Clock size={10} color="#9CA3AF" />
                      <Text className="text-[10px] text-foreground-muted ml-1">
                        {new Date(exp.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                  <View
                    className="rounded-full px-2.5 py-1"
                    style={{
                      backgroundColor: exp.status === 'published' ? '#DCFCE7' : '#FEF9C3',
                    }}>
                    <Text
                      className="text-[9px] font-bold uppercase"
                      style={{ color: exp.status === 'published' ? '#16A34A' : '#D97706' }}>
                      {exp.status}
                    </Text>
                  </View>
                </LinearGradient>

                <View className="flex-row border-t border-gray-50">
                  <Pressable
                    onPress={() =>
                      router.push({ pathname: '/surprise-experience/[slug]', params: { slug: exp.slug } })
                    }
                    className="flex-1 py-3.5 flex-row items-center justify-center gap-2"
                    accessibilityRole="button">
                    <Eye size={15} color="#7C3AED" />
                    <Text className="text-[12px] font-bold text-primary">Preview</Text>
                  </Pressable>
                  <View className="w-px bg-gray-50" />
                  <Pressable
                    onPress={() =>
                      router.push({ pathname: '/surprise-analytics', params: { experienceId: exp.id } })
                    }
                    className="flex-1 py-3.5 flex-row items-center justify-center gap-2"
                    accessibilityRole="button">
                    <ChartBar size={15} color="#7C3AED" />
                    <Text className="text-[12px] font-bold text-primary">Analytics</Text>
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
