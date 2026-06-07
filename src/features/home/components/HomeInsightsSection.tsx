import { Bell, Flame, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

type HomeInsightsSectionProps = {
  remindersToday: number;
  streakDays: number;
  upcomingThisWeek: number;
};

function InsightCard({
  title,
  value,
  subtitle,
  Icon,
  gradient,
  valueSuffix,
}: {
  title: string;
  value: number;
  subtitle: string;
  Icon: typeof Bell;
  gradient: [string, string, ...string[]];
  valueSuffix?: string;
}) {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-4 border border-white/30"
        style={{
          shadowColor: gradient[0],
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.22,
          shadowRadius: 14,
          elevation: 6,
          minHeight: 126,
        }}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="h-10 w-10 rounded-xl bg-white/25 items-center justify-center">
            <Icon size={20} color="#FFFFFF" />
          </View>
          <Sparkles size={14} color="rgba(255,255,255,0.8)" />
        </View>
        <Text className="text-[12px] font-semibold text-white/90">{title}</Text>
        <Text className="text-[33px] leading-[38px] text-white font-black mt-1">
          {value}
          {valueSuffix ?? ''}
        </Text>
        <Text className="text-[11px] text-white/85 mt-1.5">{subtitle}</Text>
      </LinearGradient>
    </View>
  );
}

export function HomeInsightsSection({
  remindersToday,
  streakDays,
  upcomingThisWeek,
}: HomeInsightsSectionProps) {
  return (
    <View className="mb-6">
      <View className="flex-row gap-3">
        <InsightCard
          title="Today's Reminders"
          value={remindersToday}
          subtitle={`${upcomingThisWeek} birthdays coming in 7 days`}
          Icon={Bell}
          gradient={['#F59E0B', '#F97316', '#EA580C']}
        />
        <InsightCard
          title="Birthdays Wished"
          value={streakDays}
          subtitle="Total birthdays you have celebrated so far"
          Icon={Flame}
          gradient={['#A855F7', '#7C3AED', '#6D28D9']}
        />
      </View>
    </View>
  );
}
