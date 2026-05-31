import { Pressable, ScrollView, Text, View } from 'react-native';

import type { Category, CategoryId } from '../types';

type CategoryTabsProps = {
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
};

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="pr-4"
      className="mb-3">
      {categories.map((category) => {
        const active = selectedCategory === category.id;
        const Icon = category.icon;

        return (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityLabel={`${category.label} category`}
            accessibilityState={active ? { selected: true } : {}}
            onPress={() => onSelectCategory(category.id)}
            className={`mr-2.5 rounded-xl border px-3 py-2.5 min-w-[88px] ${
              active ? 'bg-primary/10 border-primary/30' : 'bg-surface border-border/80'
            }`}>
            <View className="flex-row items-center gap-1.5">
              <Icon size={14} color={active ? '#7C3AED' : '#6B7280'} />
              <Text className={`text-caption font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>
                {category.label}
              </Text>
            </View>
            <Text className={`text-caption mt-1 ${active ? 'text-primary' : 'text-foreground-secondary'}`}>
              {category.count}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
