import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { ShieldCheck } from 'lucide-react-native';
import { Text, View } from 'react-native';

type AuthHeroProps = {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showTrustBadge?: boolean;
};

export function AuthHero({
  icon: Icon,
  iconColor = '#7C3AED',
  iconBg = '#EDE9FE',
  title,
  subtitle,
  compact = false,
  showTrustBadge = false,
}: AuthHeroProps) {
  return (
    <View className={`items-center ${compact ? 'mb-6 mt-2' : 'mb-8 mt-4'}`}>
      <LinearGradient
        colors={[iconBg, '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`${compact ? 'h-[72px] w-[72px]' : 'h-[88px] w-[88px]'} rounded-[28px] items-center justify-center shadow-md border border-white/80`}>
        <Icon size={compact ? 32 : 40} color={iconColor} />
      </LinearGradient>
      {title ? (
        <Text className={`${compact ? 'text-2xl' : 'text-3xl'} text-foreground font-bold text-center mt-5 tracking-tight`}>
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text className="text-base text-foreground-secondary text-center mt-2 leading-6 max-w-[320px] px-2">
          {subtitle}
        </Text>
      ) : null}
      {showTrustBadge ? (
        <View className="flex-row items-center gap-1.5 mt-5 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
          <ShieldCheck size={14} color="#059669" />
          <Text className="text-xs text-emerald-700 font-semibold">Private & secure on your device</Text>
        </View>
      ) : null}
    </View>
  );
}
