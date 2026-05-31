import { Pressable, Text, View } from 'react-native';

import type { CalendarViewMode } from '../types';

const VIEW_OPTIONS: { key: CalendarViewMode; label: string }[] = [
  { key: 'month', label: 'Month' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'list', label: 'List' },
];

export type CalendarSwitcherProps = {
  activeView: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
};

export function CalendarSwitcher({ activeView, onViewChange }: CalendarSwitcherProps) {
  return (
    <View className="flex-1 flex-row bg-surface border border-border rounded-full p-1 mr-3">
      {VIEW_OPTIONS.map((option) => {
        const isActive = activeView === option.key;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onViewChange(option.key)}
            className={`flex-1 py-2.5 rounded-full items-center min-h-[44px] justify-center ${
              isActive ? 'bg-primary/15' : 'bg-transparent'
            }`}>
            <Text
              className={`text-caption font-semibold ${
                isActive ? 'text-primary' : 'text-foreground-secondary'
              }`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
