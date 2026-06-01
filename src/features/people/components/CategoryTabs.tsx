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
      contentContainerClassName="gap-2.5 pb-1 pr-1"
      className="mb-5">
      {categories.map((category) => {
        const active = selectedCategory === category.id;
        const Icon = category.icon;

        return (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityState={active ? { selected: true } : {}}
            onPress={() => onSelectCategory(category.id)}
            className={`flex-row items-center rounded-full px-4 py-2.5 gap-2 min-h-[44px] ${
              active ? 'bg-primary' : 'bg-surface border border-border'
            }`}
            style={
              !active
                ? {
                    shadowColor: '#111827',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04,
                    shadowRadius: 2,
                    elevation: 1,
                  }
                : undefined
            }>
            <Icon size={15} color={active ? '#FFFFFF' : '#6B7280'} strokeWidth={2} />
            <Text className={`text-[12px] font-semibold ${active ? 'text-white' : 'text-foreground'}`}>
              {category.label}
            </Text>
            <View
              className={`h-5 min-w-[22px] rounded-full items-center justify-center px-1.5 ${
                active ? 'bg-white/25' : 'bg-background'
              }`}>
              <Text
                className={`text-[10px] font-bold ${
                  active ? 'text-white' : 'text-foreground-secondary'
                }`}>
                {category.count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
