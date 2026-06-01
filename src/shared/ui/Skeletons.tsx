import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

function usePulse() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return opacity;
}

function Bone({ className = '', style }: { className?: string; style?: object }) {
  const opacity = usePulse();
  return (
    <Animated.View
      className={`bg-gray-200/80 rounded-xl ${className}`.trim()}
      style={[{ opacity }, style]}
    />
  );
}

export function PageSkeleton() {
  return (
    <View className="flex-1 px-5 pt-4">
      <Bone className="h-14 w-full rounded-2xl mb-6" />
      <Bone className="h-52 w-full rounded-3xl mb-6" />
      <Bone className="h-5 w-40 mb-4" />
      <View className="flex-row gap-3 mb-6">
        <Bone className="h-28 w-24 rounded-2xl" />
        <Bone className="h-28 w-24 rounded-2xl" />
        <Bone className="h-28 w-24 rounded-2xl" />
      </View>
      <View className="flex-row gap-3">
        <Bone className="h-24 flex-1 rounded-2xl" />
        <Bone className="h-24 flex-1 rounded-2xl" />
      </View>
    </View>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <View className="gap-3 px-5">
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} className="flex-row items-center gap-3">
          <Bone className="h-12 w-12 rounded-full" />
          <View className="flex-1 gap-2">
            <Bone className="h-4 w-3/5" />
            <Bone className="h-3 w-2/5" />
          </View>
        </View>
      ))}
    </View>
  );
}

export function CardSkeleton() {
  return (
    <View className="px-5">
      <Bone className="h-64 w-full rounded-3xl" />
    </View>
  );
}

export function CalendarSkeleton() {
  return (
    <View className="px-5 gap-4">
      <Bone className="h-10 w-full rounded-xl" />
      <View className="flex-row flex-wrap gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Bone key={i} className="h-10 w-[12%] rounded-lg" style={{ width: '13%' }} />
        ))}
      </View>
      <Bone className="h-32 w-full rounded-2xl" />
    </View>
  );
}

export function HeroSkeleton() {
  return (
    <View className="px-5 mb-6">
      <Bone className="h-56 w-full rounded-3xl" />
    </View>
  );
}

export function SectionSkeleton({ title = true }: { title?: boolean }) {
  return (
    <View className="px-5 mb-5">
      {title ? <Bone className="h-5 w-36 mb-3" /> : null}
      <ListSkeleton rows={3} />
    </View>
  );
}
