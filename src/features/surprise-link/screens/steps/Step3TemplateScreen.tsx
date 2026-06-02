import React, { useCallback, useMemo } from 'react';
import { Dimensions, FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Crown,
  Heart,
  Layers,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react-native';

import { templateRegistry } from '../../templates/template-registry';
import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import type { ExperienceTemplate, TemplateCategory } from '../../types';
import { ContinueButton } from '../../components/common/StudioHeader';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';

const SCREEN_W = Dimensions.get('window').width;
const CARD_W = Math.floor((SCREEN_W - 52) / 2);

interface CategoryConfig {
  id: TemplateCategory | 'all';
  label: string;
  Icon?: React.ComponentType<{ size: number; color: string }>;
  gradient: [string, string];
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'all', label: 'All', gradient: ['#7C3AED', '#A855F7'] },
  { id: 'romantic', label: 'Romantic', Icon: Heart, gradient: ['#EC4899', '#F472B6'] },
  { id: 'birthday', label: 'Birthday', gradient: ['#F59E0B', '#FBBF24'] },
  { id: 'friends', label: 'Friends', gradient: ['#3B82F6', '#60A5FA'] },
  { id: 'family', label: 'Family', gradient: ['#22C55E', '#4ADE80'] },
  { id: 'luxury', label: 'Luxury', Icon: Crown, gradient: ['#D4AF37', '#F5D16C'] },
  { id: 'minimal', label: 'Minimal', gradient: ['#64748B', '#94A3B8'] },
  { id: 'cute', label: 'Cute', gradient: ['#F472B6', '#FB923C'] },
  { id: 'modern', label: 'Modern', Icon: Zap, gradient: ['#6366F1', '#818CF8'] },
  { id: 'interactive', label: 'Interactive', gradient: ['#14B8A6', '#2DD4BF'] },
  { id: 'trending', label: 'Trending', Icon: TrendingUp, gradient: ['#EF4444', '#F87171'] },
  { id: 'premium', label: 'Premium', Icon: Star, gradient: ['#7C3AED', '#A78BFA'] },
];

function TemplateCard({
  template,
  selected,
  onSelect,
  onToggleFavorite,
  isFavorite,
  index,
}: {
  template: ExperienceTemplate;
  selected: boolean;
  onSelect: (t: ExperienceTemplate) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 10) * 50).springify()}
      style={{ width: CARD_W }}>
      <Pressable
        onPress={() => onSelect(template)}
        accessibilityRole="button"
        accessibilityLabel={template.name}
        className="mb-3"
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}>
        <LinearGradient
          colors={template.previewColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl overflow-hidden min-h-[185px]"
          style={{
            borderWidth: selected ? 2.5 : 1.5,
            borderColor: selected ? '#7C3AED' : 'rgba(255,255,255,0.6)',
            shadowColor: selected ? '#7C3AED' : template.previewColors[1],
            shadowOffset: { width: 0, height: selected ? 8 : 4 },
            shadowOpacity: selected ? 0.35 : 0.15,
            shadowRadius: selected ? 16 : 8,
            elevation: selected ? 10 : 3,
          }}>
          <View className="p-3.5 flex-1 justify-between">
            <View className="flex-row items-start justify-between">
              <Text className="text-[32px]">{template.icon}</Text>
              <Pressable
                onPress={() => onToggleFavorite(template.id)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                className="h-8 w-8 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
                <Heart
                  size={15}
                  color={isFavorite ? '#EF4444' : '#9CA3AF'}
                  fill={isFavorite ? '#EF4444' : 'transparent'}
                />
              </Pressable>
            </View>

            <View className="mt-2">
              <Text
                className="text-[13px] font-black leading-4"
                style={{ color: '#1F2937' }}
                numberOfLines={2}>
                {template.name}
              </Text>
              <Text
                className="text-[10px] mt-1 leading-[14px]"
                style={{ color: '#4B5563' }}
                numberOfLines={2}>
                {template.description}
              </Text>

              <View className="flex-row flex-wrap mt-2.5 gap-1">
                {template.isPremium && (
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="px-2 py-0.5 rounded-full flex-row items-center gap-0.5">
                    <Crown size={8} color="#FFFBEB" />
                    <Text className="text-[7px] font-black text-white">PREMIUM</Text>
                  </LinearGradient>
                )}
                {template.isTrending && (
                  <LinearGradient
                    colors={['#7C3AED', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="px-2 py-0.5 rounded-full flex-row items-center gap-0.5">
                    <TrendingUp size={8} color="#FFF" />
                    <Text className="text-[7px] font-black text-white">TRENDING</Text>
                  </LinearGradient>
                )}
                {template.defaultModules.slice(0, 2).map((mod) => (
                  <View
                    key={mod}
                    className="px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.75)' }}>
                    <Text className="text-[7px] font-bold uppercase" style={{ color: '#6B7280' }}>
                      {mod.replace(/_/g, ' ')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {selected && (
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-2 items-center flex-row justify-center gap-1">
              <Sparkles size={10} color="#FFF" />
              <Text className="text-[9px] font-black text-white tracking-widest">SELECTED</Text>
            </LinearGradient>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export function Step3TemplateScreen() {
  const occasion = useSurpriseLinkStore((s) => s.occasion);
  const recipientType = useSurpriseLinkStore((s) => s.recipientType);
  const selectedTemplate = useSurpriseLinkStore((s) => s.selectedTemplate);
  const searchQuery = useSurpriseLinkStore((s) => s.searchQuery);
  const selectedCategory = useSurpriseLinkStore((s) => s.selectedCategory);
  const favoriteTemplateIds = useSurpriseLinkStore((s) => s.favoriteTemplateIds);
  const setSearchQuery = useSurpriseLinkStore((s) => s.setSearchQuery);
  const setSelectedCategory = useSurpriseLinkStore((s) => s.setSelectedCategory);
  const selectTemplate = useSurpriseLinkStore((s) => s.selectTemplate);
  const toggleFavoriteTemplate = useSurpriseLinkStore((s) => s.toggleFavoriteTemplate);
  const nextStep = useSurpriseLinkStore((s) => s.nextStep);

  const results = useMemo(() => {
    let list =
      occasion && recipientType
        ? templateRegistry.filterForContext(occasion, recipientType, selectedCategory)
        : templateRegistry.getByCategory(selectedCategory);

    if (selectedCategory === 'favorites') {
      list = list.filter((t) => favoriteTemplateIds.includes(t.id));
    }

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.includes(q),
      );
    }

    return list;
  }, [occasion, recipientType, selectedCategory, searchQuery, favoriteTemplateIds]);

  const trending = useMemo(() => templateRegistry.getTrending(6), []);

  const renderItem = useCallback(
    ({ item, index }: { item: ExperienceTemplate; index: number }) => (
      <TemplateCard
        template={item}
        selected={selectedTemplate?.id === item.id}
        onSelect={selectTemplate}
        onToggleFavorite={toggleFavoriteTemplate}
        isFavorite={favoriteTemplateIds.includes(item.id)}
        index={index}
      />
    ),
    [selectedTemplate, selectTemplate, toggleFavoriteTemplate, favoriteTemplateIds],
  );

  const ListHeader = useMemo(
    () => (
      <>
        <StudioScreenIntro
          title="Experience Templates"
          subtitle="Pick a premium starting point — romantic journeys, birthday adventures, family legacies, and more."
          Icon={Layers}
        />

        <Animated.View entering={FadeInDown.delay(80).springify()} className="px-5 mb-3">
          <View
            className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-100"
            style={{
              shadowColor: '#7C3AED',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}>
            <Search size={17} color="#7C3AED" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search experiences..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2.5 text-[14px] text-foreground p-0"
              accessibilityLabel="Search templates"
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery('')}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                className="h-6 w-6 rounded-full bg-gray-100 items-center justify-center">
                <X size={12} color="#6B7280" />
              </Pressable>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).springify()} className="mb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 4 }}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  className="mr-2"
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  })}>
                  {active ? (
                    <LinearGradient
                      colors={cat.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="px-4 py-2 rounded-full flex-row items-center gap-1.5">
                      {cat.Icon && <cat.Icon size={12} color="#FFF" />}
                      <Text className="text-[11px] font-black text-white">{cat.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View className="px-4 py-2 rounded-full bg-white border border-gray-200 flex-row items-center gap-1.5">
                      {cat.Icon && <cat.Icon size={12} color="#6B7280" />}
                      <Text className="text-[11px] font-bold text-foreground-secondary">
                        {cat.label}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {selectedCategory === 'all' && !searchQuery.trim() && trending.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-5 px-5">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="h-6 w-6 rounded-lg bg-primary/10 items-center justify-center">
                <TrendingUp size={13} color="#7C3AED" />
              </View>
              <Text className="text-[15px] font-black text-foreground">Trending Now</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
              {trending.map((t, i) => (
                <Animated.View key={t.id} entering={FadeInRight.delay(i * 60).springify()}>
                  <Pressable
                    onPress={() => selectTemplate(t)}
                    className="mr-3"
                    style={({ pressed }) => ({
                      width: 145,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    })}>
                    <LinearGradient
                      colors={t.previewColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="rounded-2xl p-3.5 h-[110px] justify-between"
                      style={{
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.5)',
                        shadowColor: t.previewColors[1],
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 3,
                      }}>
                      <Text className="text-[26px]">{t.icon}</Text>
                      <Text
                        className="text-[11px] font-bold"
                        style={{ color: '#1F2937' }}
                        numberOfLines={2}>
                        {t.name}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <View className="px-5 mb-3">
          <Text className="text-[13px] font-bold text-foreground-secondary">
            {results.length} experience{results.length !== 1 ? 's' : ''} available
          </Text>
        </View>
      </>
    ),
    [
      selectedCategory,
      searchQuery,
      trending,
      results.length,
      selectTemplate,
      setSearchQuery,
      setSelectedCategory,
    ],
  );

  const ListEmpty = useMemo(
    () => (
      <View className="px-5 py-10 items-center">
        <Text className="text-[15px] font-bold text-foreground text-center">
          No templates match your filters
        </Text>
        <Text className="text-[13px] text-foreground-secondary text-center mt-2">
          Try another category or clear your search.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <StudioStepLayout footer={<ContinueButton onPress={nextStep} disabled={!selectedTemplate} />}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        showsVerticalScrollIndicator={false}
      />
    </StudioStepLayout>
  );
}
