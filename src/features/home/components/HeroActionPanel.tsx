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
    title: 'Wish Generator',
    subtitle: '',
    href: '/ai-wish',
  },
  {
    id: 'create-card',
    icon: Sparkles,
    iconColor: '#3B82F6',
    title: 'Create Card',
    subtitle: '',
    href: '/card-studio',
  },
  {
    id: 'surprise-link',
    icon: Link2,
    iconColor: '#7C3AED',
    title: 'Surprise Link',
    subtitle: '',
    href: '/surprise-link-studio',
  },
  {
    id: 'gift-ideas',
    icon: Gift,
    iconColor: '#EC4899',
    title: 'Gift Ideas',
    subtitle: '',
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
                <Icon size={scale(20)} color={action.iconColor} strokeWidth={2} />
              </View>
              <Text style={styles.actionTitle} numberOfLines={1}>
                {action.title}
              </Text>
              <Text style={styles.actionSubtitle} numberOfLines={1}>
                {action.subtitle}
              </Text>
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
    borderRadius: scale(18),
    paddingVertical: scale(12),
    paddingHorizontal: scale(8),
    marginTop: -scale(20),
    marginHorizontal: scale(10),
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
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(6),
  },
  actionTitle: {
    fontSize: scale(10),
    fontWeight: '700',
    color: Colors.foreground,
    textAlign: 'center',
    marginBottom: scale(1),
  },
  actionSubtitle: {
    fontSize: scale(9),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
    textAlign: 'center',
  },
});
