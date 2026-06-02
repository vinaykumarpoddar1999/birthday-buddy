import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, Home, Plus, Settings, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { Colors, Shadows, scale } from '../constants/design-tokens';

type Tab = {
  key: string;
  label: string;
  icon: LucideIcon;
  isCenter?: boolean;
};

const TABS: Tab[] = [
  { key: 'index', label: 'Home', icon: Home },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'add', label: '', icon: Plus, isCenter: true },
  { key: 'contacts', label: 'People', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
];

type HomeBottomTabBarProps = {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { navigate: (name: string) => void };
};

export function HomeBottomTabBar({ state, navigation }: HomeBottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom, scale(10));

  return (
    <View style={[styles.container, Shadows.tabBar, { paddingBottom }]}>
      <View style={styles.row}>
        {TABS.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.key);
          const isFocused = routeIndex >= 0 && state.index === routeIndex;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <View key={tab.key} style={styles.centerWrapper}>
                <Pressable
                  onPress={() => navigation.navigate('add')}
                  accessibilityRole="button"
                  accessibilityLabel="Add person"
                  style={styles.centerButton}>
                  <LinearGradient
                    colors={['#7C3AED', '#A855F7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.centerGradient}>
                    <Plus size={scale(28)} color="#FFFFFF" strokeWidth={2.5} />
                  </LinearGradient>
                </Pressable>
              </View>
            );
          }

          const color = isFocused ? '#7C3AED' : '#94A3B8';

          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                if (routeIndex >= 0) navigation.navigate(tab.key);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={tab.label}
              style={styles.tabItem}>
              <Icon
                size={scale(22)}
                color={color}
                strokeWidth={isFocused ? 2.5 : 2}
              />
              <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: scale(26),
    borderTopRightRadius: scale(26),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: scale(10),
    paddingHorizontal: scale(8),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(6),
    minWidth: scale(56),
  },
  tabLabel: {
    fontSize: scale(10),
    fontWeight: '600',
    marginTop: scale(4),
  },
  centerWrapper: {
    alignItems: 'center',
    marginTop: -scale(24),
  },
  centerButton: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  centerGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
