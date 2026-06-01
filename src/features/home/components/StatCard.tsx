import { Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Bell, Flame, Users, type LucideIcon } from 'lucide-react-native';

const iconMap = {
  bell: Bell,
  flame: Flame,
  users: Users,
} as const;

export type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: keyof typeof iconMap;
  gradientColors: [string, string];
  onPress?: () => void;
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradientColors,
  onPress,
}: StatCardProps) {
  const Icon: LucideIcon = iconMap[icon] ?? Bell;

  return (
    <Pressable onPress={onPress} disabled={!onPress} className="flex-1" accessibilityRole="button">
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: 16,
          minHeight: 140,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.25)',
          shadowColor: gradientColors[0],
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.28,
          shadowRadius: 12,
          elevation: 6,
        }}>
        <View className="flex-row items-start justify-between">
          <View
            style={{
              height: 44,
              width: 44,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon size={22} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>
        <Text
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '600',
            marginTop: 14,
            letterSpacing: 0.3,
          }}>
          {title}
        </Text>
        <Text
          style={{
            fontSize: 32,
            lineHeight: 38,
            color: '#FFFFFF',
            fontWeight: '800',
            marginTop: 2,
          }}>
          {value}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.85)',
              marginTop: 4,
              fontWeight: '500',
            }}
            numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </LinearGradient>
    </Pressable>
  );
}
