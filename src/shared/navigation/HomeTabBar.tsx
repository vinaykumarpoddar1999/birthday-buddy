import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Home,
  Plus,
  Settings,
  Users,
} from 'lucide-react-native';

import { scale } from '@features/home/constants/design-tokens';
import { QuickAddModal } from '@shared/navigation/QuickAddModal';
import { openSelectFromContact } from '@shared/navigation/quick-add-actions';

const tabs = [
  { name: 'index', label: 'Home', Icon: Home, center: false },
  { name: 'calendar', label: 'Calendar', Icon: Calendar, center: false },
  { name: 'add', label: 'Add', Icon: Plus, center: true },
  { name: 'contacts', label: 'People', Icon: Users, center: false },
  { name: 'settings', label: 'Settings', Icon: Settings, center: false },
] as const;

type TabBarProps = {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { navigate: (name: string) => void };
};

export function HomeTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const paddingBottom = Math.max(insets.bottom, scale(10));

  return (
    <>
      <View style={[styles.container, { paddingBottom }]}>
        <View style={styles.row}>
          {tabs.map((tab) => {
            const routeIndex = state.routes.findIndex((r: { name: string }) => r.name === tab.name);
            if (routeIndex < 0) return null;

            const isFocused = state.index === routeIndex;
            const color = isFocused ? '#7C3AED' : '#94A3B8';

            if (tab.center) {
              return (
                <View key={tab.name} style={styles.centerWrapper}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Add person"
                    onPress={() => setShowAddMenu(true)}
                    style={styles.centerBtnPressable}>
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

            const Icon = tab.Icon;
            return (
              <Pressable
                key={tab.name}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={tab.label}
                onPress={() => navigation.navigate(tab.name)}
                style={styles.tabItem}>
                <Icon
                  size={scale(22)}
                  color={color}
                  strokeWidth={isFocused ? 2.5 : 2}
                />
                <Text style={[styles.tabLabel, { color }]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <QuickAddModal
        visible={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        onAddManually={() => {
          setShowAddMenu(false);
          router.push('/add-person');
        }}
        onSelectFromContact={() => {
          setShowAddMenu(false);
          void openSelectFromContact();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(26),
    borderTopRightRadius: scale(26),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 16,
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
    minHeight: scale(44),
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
  centerBtnPressable: {
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
