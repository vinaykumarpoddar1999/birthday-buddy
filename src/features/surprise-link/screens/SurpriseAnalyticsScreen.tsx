import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import {
  ArrowLeft,
  ChartBar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react-native';

import { PageSkeleton, ErrorState } from '@shared/ui';

import { useSurpriseAnalytics } from '../hooks/useSurpriseLinks';

function StatCard({
  label,
  value,
  Icon,
  color,
  index = 0,
}: {
  label: string;
  value: string | number;
  Icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  index?: number;
}) {
  return (
    <Animated.View entering={ZoomIn.delay(index * 80).springify()} className="flex-1 m-1.5">
      <View
        className="bg-white rounded-2xl p-4 border border-gray-100"
        style={{
          shadowColor: color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 3,
        }}>
        <View
          className="h-10 w-10 rounded-xl items-center justify-center mb-3"
          style={{ backgroundColor: `${color}12` }}>
          <Icon size={20} color={color} />
        </View>
        <Text className="text-[24px] font-black text-foreground" style={{ letterSpacing: -0.5 }}>
          {value}
        </Text>
        <Text className="text-[11px] text-foreground-secondary mt-1 font-medium">{label}</Text>
      </View>
    </Animated.View>
  );
}

export function SurpriseAnalyticsScreen() {
  const params = useLocalSearchParams<{ experienceId?: string }>();
  const { data: analytics, isLoading, isError } = useSurpriseAnalytics(params.experienceId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <PageSkeleton />
      </SafeAreaView>
    );
  }

  if (isError || !analytics) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ErrorState
          title="No analytics yet"
          message="Analytics will appear once someone opens your surprise."
          onRetry={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const topSection = Object.entries(analytics.sectionViews).sort(([, a], [, b]) => b - a)[0];
  const interactionRate =
    analytics.openCount > 0
      ? Math.round(((analytics.reactions.length + analytics.replies.length) / analytics.openCount) * 100)
      : 0;

  const REACTION_EMOJIS: Record<string, string> = {
    loved_it: '❤️',
    emotional: '🥹',
    smile: '😊',
    applause: '👏',
    favorite: '⭐',
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-11 w-11 rounded-xl bg-white border border-gray-100 items-center justify-center mr-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 2,
          }}>
          <ArrowLeft size={20} color="#7C3AED" />
        </Pressable>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Sparkles size={12} color="#7C3AED" />
            <Text className="text-[10px] font-bold text-primary uppercase tracking-wider ml-1">
              Analytics
            </Text>
          </View>
          <Text className="text-[18px] font-black text-foreground">Surprise Insights</Text>
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <Animated.View entering={FadeInDown.duration(400)} className="mb-4">
          <LinearGradient
            colors={analytics.viewed ? ['#F0FDF4', '#ECFDF5'] : ['#FEF3C7', '#FFFBEB']}
            className="rounded-2xl p-4 flex-row items-center border"
            style={{ borderColor: analytics.viewed ? '#BBF7D0' : '#FDE68A' }}>
            <View
              className="h-12 w-12 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: analytics.viewed ? '#DCFCE7' : '#FEF9C3' }}>
              <Eye size={22} color={analytics.viewed ? '#16A34A' : '#D97706'} />
            </View>
            <View>
              <Text className={`text-[15px] font-bold ${analytics.viewed ? 'text-green-800' : 'text-amber-800'}`}>
                {analytics.viewed ? 'Surprise has been opened!' : 'Not yet opened'}
              </Text>
              <Text className={`text-[12px] mt-0.5 ${analytics.viewed ? 'text-green-600' : 'text-amber-600'}`}>
                {analytics.lastViewedAt
                  ? `Last viewed ${new Date(analytics.lastViewedAt).toLocaleDateString()}`
                  : 'Waiting for your recipient...'}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap mb-2">
          <StatCard label="Times Opened" value={analytics.openCount} Icon={Eye} color="#3B82F6" index={0} />
          <StatCard label="Completion" value={`${Math.round(analytics.completionRate)}%`} Icon={TrendingUp} color="#22C55E" index={1} />
        </View>
        <View className="flex-row flex-wrap mb-2">
          <StatCard label="Reactions" value={analytics.reactions.length} Icon={Heart} color="#EC4899" index={2} />
          <StatCard label="Replies" value={analytics.replies.length} Icon={MessageCircle} color="#F59E0B" index={3} />
        </View>
        <View className="flex-row flex-wrap mb-5">
          <StatCard label="Interaction Rate" value={`${interactionRate}%`} Icon={Zap} color="#8B5CF6" index={4} />
          <View className="flex-1 m-1.5" />
        </View>

        {/* Top Section */}
        {topSection && (
          <Animated.View entering={FadeInDown.delay(400).duration(400)} className="mb-4">
            <View
              className="bg-white rounded-2xl p-5 border border-gray-100"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}>
              <View className="flex-row items-center mb-2">
                <ChartBar size={16} color="#7C3AED" />
                <Text className="text-[14px] font-bold text-foreground ml-2">Most Viewed Section</Text>
              </View>
              <View className="flex-row items-center mt-2">
                <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center mr-3">
                  <TrendingUp size={14} color="#7C3AED" />
                </View>
                <Text className="text-[14px] text-foreground font-semibold flex-1">
                  {topSection[0]}
                </Text>
                <View className="bg-primary/10 rounded-full px-3 py-1">
                  <Text className="text-[12px] font-bold text-primary">{topSection[1]} views</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Reactions */}
        {analytics.reactions.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500).duration(400)} className="mb-4">
            <View
              className="bg-white rounded-2xl p-5 border border-gray-100"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}>
              <View className="flex-row items-center mb-4">
                <Heart size={16} color="#EC4899" />
                <Text className="text-[14px] font-bold text-foreground ml-2">Reactions</Text>
              </View>
              {analytics.reactions.map((r, idx) => (
                <Animated.View
                  key={r.id}
                  entering={FadeIn.delay(idx * 60)}
                  className="flex-row items-center mb-3 pb-3 border-b border-gray-50 last:border-0 last:mb-0 last:pb-0">
                  <Text className="text-[22px] mr-3">{REACTION_EMOJIS[r.type] ?? '💜'}</Text>
                  <View className="flex-1">
                    <Text className="text-[13px] text-foreground font-semibold capitalize">
                      {r.type.replace(/_/g, ' ')}
                    </Text>
                    <Text className="text-[11px] text-foreground-muted mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Replies */}
        {analytics.replies.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600).duration(400)}>
            <View
              className="bg-white rounded-2xl p-5 border border-gray-100"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}>
              <View className="flex-row items-center mb-4">
                <MessageCircle size={16} color="#F59E0B" />
                <Text className="text-[14px] font-bold text-foreground ml-2">Replies</Text>
              </View>
              {analytics.replies.map((r, idx) => (
                <Animated.View
                  key={r.id}
                  entering={FadeIn.delay(idx * 60)}
                  className="mb-4 pb-4 border-b border-gray-50 last:border-0 last:mb-0 last:pb-0">
                  <View className="flex-row items-center mb-2">
                    <View className="h-6 w-6 rounded-full bg-amber-50 items-center justify-center mr-2">
                      <MessageCircle size={12} color="#F59E0B" />
                    </View>
                    <Text className="text-[11px] text-foreground-muted capitalize font-medium">
                      {r.type} reply
                    </Text>
                    <Text className="text-[10px] text-foreground-muted ml-auto">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text className="text-[14px] text-foreground leading-6 bg-gray-50 rounded-xl p-3">
                    {r.content}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
