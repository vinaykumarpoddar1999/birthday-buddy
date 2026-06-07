import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Sparkles, Star, Wand2 } from 'lucide-react-native';
import { router, type Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';

import { Colors, Shadows, scale } from '../constants/design-tokens';

type QuickAction = {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  href: Href;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'wish-gen',
    icon: Wand2,
    iconColor: '#EC4899',
    iconBg: '#FDF2F8',
    title: 'Wish Generator',
    subtitle: 'Personalized messages for your loved ones',
    href: '/ai-wish',
  },
  {
    id: 'create-card',
    icon: Sparkles,
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
    title: 'Create Card',
    subtitle: 'Design & share beautiful cards',
    href: '/card-studio',
  },
];

export function QuickActionsGrid() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Quick Actions</Text>
          <Star size={scale(16)} color="#F59E0B" fill="#F59E0B" style={{ marginLeft: 6 }} />
        </View>
        <Text style={styles.subtitle}>
          Wishes and cards in one place
        </Text>
      </View>

      <View style={styles.grid}>
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Pressable
              key={action.id}
              style={[styles.card, Shadows.card]}
              onPress={() => router.push(action.href)}
              accessibilityRole="button"
              accessibilityLabel={action.title}>
              <View style={styles.cardContent}>
                <View style={[styles.cardIcon, { backgroundColor: action.iconBg }]}>
                  <Icon size={scale(22)} color={action.iconColor} strokeWidth={2} />
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{action.title}</Text>
                <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: scale(24),
  },
  header: {
    marginBottom: scale(16),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  title: {
    fontSize: scale(20),
    fontWeight: '800',
    color: Colors.foreground,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: scale(12),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
    lineHeight: scale(18),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(12),
  },
  card: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  cardContent: {
    padding: scale(14),
    minHeight: scale(120),
    position: 'relative',
  },
  cardIcon: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(10),
  },
  cardTitle: {
    fontSize: scale(13),
    fontWeight: '700',
    color: Colors.foreground,
    marginBottom: scale(3),
  },
  cardSubtitle: {
    fontSize: scale(10),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
    lineHeight: scale(14),
  },
});
