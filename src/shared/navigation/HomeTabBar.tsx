import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Cake,
  Home,
  Plus,
  Settings,
  UserPlus,
  Users,
  X,
} from 'lucide-react-native';

import { scale } from '@features/home/constants/design-tokens';

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
                    accessibilityLabel="Add person or event"
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

      <Modal visible={showAddMenu} transparent animationType="fade" onRequestClose={() => setShowAddMenu(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAddMenu(false)}
          accessibilityRole="button"
          accessibilityLabel="Close add menu">
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quick Add</Text>
              <Pressable
                onPress={() => setShowAddMenu(false)}
                style={styles.modalClose}
                accessibilityRole="button">
                <X size={18} color="#6B7280" />
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setShowAddMenu(false);
                router.push('/add-person');
              }}
              style={styles.modalOption}
              accessibilityRole="button">
              <View style={[styles.modalOptionIcon, { backgroundColor: '#7C3AED' }]}>
                <UserPlus size={22} color="#FFFFFF" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Add Person</Text>
                <Text style={styles.modalOptionSub}>
                  Save a contact with birthday & reminders
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                setShowAddMenu(false);
                router.push({ pathname: '/add-person', params: { eventFocus: 'true' } });
              }}
              style={[styles.modalOption, { marginTop: scale(12) }]}
              accessibilityRole="button">
              <View style={[styles.modalOptionIcon, { backgroundColor: '#EC4899' }]}>
                <Cake size={22} color="#FFFFFF" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Add Event</Text>
                <Text style={styles.modalOptionSub}>
                  Birthday, anniversary, or custom celebration
                </Text>
              </View>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
    paddingBottom: scale(36),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: '700',
    color: '#0F172A',
  },
  modalClose: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(18),
    backgroundColor: '#F8F6FC',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.1)',
  },
  modalOptionIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(16),
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#0F172A',
  },
  modalOptionSub: {
    fontSize: scale(12),
    color: '#64748B',
    marginTop: scale(2),
  },
});
