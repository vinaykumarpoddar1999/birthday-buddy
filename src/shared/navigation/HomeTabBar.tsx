import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import {
  Calendar,
  Grid2x2,
  Home,
  Plus,
  Users,
} from 'lucide-react-native';

const tabs = [
  { name: 'index', label: 'Home', Icon: Home, center: false },
  { name: 'calendar', label: 'Calendar', Icon: Calendar, center: false },
  { name: 'add', label: 'Add', Icon: Plus, center: true },
  { name: 'contacts', label: 'People', Icon: Users, center: false },
  { name: 'profile', label: 'More', Icon: Grid2x2, center: false },
] as const;

export function HomeTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-surface border-t border-border/80"
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        shadowColor: '#111827',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 12,
      }}>
      <View className="flex-row items-end justify-around px-1 pt-2">
        {tabs.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
          if (routeIndex < 0) return null;

          const isFocused = state.index === routeIndex;
          const color = isFocused ? '#7C3AED' : '#9CA3AF';

          if (tab.center) {
            return (
              <Pressable
                key={tab.name}
                accessibilityRole="button"
                accessibilityLabel="Add person"
                onPress={() => router.push('/add-person')}
                className="items-center -mt-7 px-2">
                <View
                  className="h-[56px] w-[56px] rounded-full bg-primary items-center justify-center border-[5px] border-background"
                  style={{
                    shadowColor: '#7C3AED',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    elevation: 8,
                  }}>
                  <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </Pressable>
            );
          }

          const Icon = tab.Icon;
          const useFilledIcon =
            isFocused && (tab.name === 'index' || tab.name === 'calendar' || tab.name === 'contacts');
          return (
            <Pressable
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => navigation.navigate(tab.name)}
              className="items-center py-1 min-w-[60px] min-h-[44px] justify-center">
              <Icon
                size={22}
                color={color}
                strokeWidth={isFocused ? 2.5 : 2}
                fill={useFilledIcon ? color : 'transparent'}
              />
              <Text className="text-[10px] mt-1 font-semibold" style={{ color }}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
