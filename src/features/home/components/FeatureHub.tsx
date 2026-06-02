import { router, type Href } from 'expo-router';
import {
  ArrowRight,
  Gift,
  Link2,
  Sparkles,
  Star,
  Wand2,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type QuickAction = {
  id: string;
  label: string;
  subtitle: string;
  helperText: string;
  Icon: LucideIcon;
  iconColor: string;
  tileGradient: [string, string, ...string[]];
  href: Href;
  featured?: boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'wish-generator',
    label: 'Wish Generator',
    subtitle: 'Personalized messages',
    helperText: 'Create in seconds',
    Icon: Wand2,
    iconColor: '#EC4899',
    tileGradient: ['#FCE7F3', '#F9A8D4', '#F5D0FE'],
    href: '/ai-wish',
  },
  {
    id: 'create-card',
    label: 'Create Card',
    subtitle: 'Design & share',
    helperText: 'Beautiful templates',
    Icon: Sparkles,
    iconColor: '#3B82F6',
    tileGradient: ['#DBEAFE', '#BFDBFE', '#E0E7FF'],
    href: '/card-studio',
  },
  {
    id: 'surprise-link',
    label: 'Surprise Link',
    subtitle: 'Interactive experiences',
    helperText: 'Share magic links',
    Icon: Link2,
    iconColor: '#7C3AED',
    tileGradient: ['#EDE9FE', '#DDD6FE', '#F5D0FE'],
    href: '/surprise-link-studio',
    featured: true,
  },
  {
    id: 'gift-ideas',
    label: 'Gift Ideas',
    subtitle: 'Perfect picks',
    helperText: 'Suggestions by relation',
    Icon: Gift,
    iconColor: '#22C55E',
    tileGradient: ['#DCFCE7', '#BBF7D0', '#D1FAE5'],
    href: { pathname: '/coming-soon', params: { feature: 'gift-ideas' } },
  },
];

function ActionTile({ action }: { action: QuickAction }) {
  const { Icon } = action;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.label}
      className="w-[48%]"
      onPress={() => router.push(action.href)}>
      {action.featured ? (
        <LinearGradient
          colors={['#7C3AED', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-[2px]"
          style={{
            shadowColor: action.iconColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.28,
            shadowRadius: 12,
            elevation: 6,
          }}>
          <View className="rounded-[14px] p-3.5 bg-white min-h-[122px]">
            <View
              className="h-10 w-10 rounded-xl items-center justify-center mb-2.5"
              style={{ backgroundColor: `${action.iconColor}18` }}>
              <Icon size={20} color={action.iconColor} strokeWidth={2.2} />
            </View>
            <Text className="text-[14px] font-bold text-foreground">{action.label}</Text>
            <Text className="text-[11px] text-foreground-secondary mt-0.5 leading-4">{action.subtitle}</Text>
            <Text className="text-[10px] text-foreground-muted mt-0.5">{action.helperText}</Text>
            <View className="mt-2 self-start rounded-full bg-primary/10 px-2 py-0.5">
              <Text className="text-[9px] font-bold text-primary uppercase tracking-wide">Flagship</Text>
            </View>
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={action.tileGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-3.5 border border-white/60 min-h-[122px]"
          style={{
            shadowColor: action.iconColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 3,
          }}>
          <View
            className="h-10 w-10 rounded-xl items-center justify-center mb-2.5 border border-white/60"
            style={{ backgroundColor: '#FFFFFFB3' }}>
            <Icon size={20} color={action.iconColor} strokeWidth={2.2} />
          </View>
          <Text className="text-[14px] font-bold text-foreground">{action.label}</Text>
          <Text className="text-[11px] text-foreground-secondary mt-0.5 leading-4">{action.subtitle}</Text>
          <View className="mt-2 flex-row items-center gap-1">
            <Text className="text-[10px] font-semibold text-foreground-muted">{action.helperText}</Text>
            <ArrowRight size={12} color="#6B7280" />
          </View>
        </LinearGradient>
      )}
    </Pressable>
  );
}

export function FeatureHub() {
  return (
    <View className="mb-6">
      <LinearGradient
        colors={['#6D28D9', '#7C3AED', '#9333EA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl overflow-hidden"
        style={{
          shadowColor: '#5B21B6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.22,
          shadowRadius: 16,
          elevation: 8,
        }}>
        <View className="px-5 pt-5 pb-4">
          <Text className="text-[11px] font-bold text-white/70 tracking-wider uppercase mb-1">
            Quick Actions
          </Text>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[20px] font-black text-white">Celebrate Smarter</Text>
            <Star size={14} color="#FCD34D" fill="#FCD34D" />
          </View>
          <Text className="text-[12px] text-white/80 mt-1">
            Wishes, cards, surprises, and gift inspiration in one place
          </Text>
        </View>
        <View className="px-3 pb-4">
          <View className="flex-row flex-wrap justify-between gap-y-2">
            {QUICK_ACTIONS.map((action) => (
              <ActionTile key={action.id} action={action} />
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
