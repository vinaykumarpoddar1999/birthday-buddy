import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gift, Link2, Sparkles, Wand2 } from 'lucide-react-native';
import { router, type Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';

import { Colors, Shadows, scale } from '../constants/design-tokens';

type ActionItem = {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  subtitle: string;
  href: Href;
};

const ACTIONS: ActionItem[] = [
  {
    id: 'ai-wish',
    icon: Wand2,
    iconColor: '#7C3AED',
    title: 'AI Wish',
    subtitle: 'Generate',
    href: '/ai-wish',
  },
  {
    id: 'create-card',
    icon: Sparkles,
    iconColor: '#EC4899',
    title: 'Create Card',
    subtitle: 'Make it special',
    href: '/card-studio',
  },
  {
    id: 'surprise-link',
    icon: Link2,
    iconColor: '#3B82F6',
    title: 'Surprise Link',
    subtitle: 'Interactive',
    href: '/surprise-link-studio',
  },
  {
    id: 'gift-ideas',
    icon: Gift,
    iconColor: '#F59E0B',
    title: 'Gift Ideas',
    subtitle: 'For them',
    href: { pathname: '/coming-soon', params: { feature: 'gift-ideas' } },
  },
];

export function HeroActionPanel() {
  return (
    <View style={[styles.container, Shadows.card]}>
      <View style={styles.row}>
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Pressable
              key={action.id}
              style={styles.actionItem}
              onPress={() => router.push(action.href)}
              accessibilityRole="button"
              accessibilityLabel={action.title}>
              <View style={[styles.iconCircle, { backgroundColor: `${action.iconColor}12` }]}>
                <Icon size={scale(24)} color={action.iconColor} strokeWidth={2} />
              </View>
              <Text style={styles.actionTitle} numberOfLines={1}>{action.title}</Text>
              <Text style={styles.actionSubtitle} numberOfLines={1}>{action.subtitle}</Text>
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
    borderRadius: scale(24),
    paddingVertical: scale(18),
    paddingHorizontal: scale(12),
    marginTop: -scale(30),
    marginHorizontal: scale(12),
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(8),
  },
  actionTitle: {
    fontSize: scale(12),
    fontWeight: '700',
    color: Colors.foreground,
    textAlign: 'center',
    marginBottom: scale(2),
  },
  actionSubtitle: {
    fontSize: scale(10),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
    textAlign: 'center',
  },
});
