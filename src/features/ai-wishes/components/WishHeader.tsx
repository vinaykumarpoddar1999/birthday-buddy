import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, Sparkles, Star, Wand2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';

type Props = {
  onBack: () => void;
};

export function WishHeader({ onBack }: Props) {
  const credits = useAIWishesStore((s) => s.credits);

  return (
    <LinearGradient
      colors={['#7C3AED', '#9333EA', '#EC4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.inner}>
        <Pressable
          onPress={onBack}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ChevronLeft size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.center}>
          <View style={styles.titleRow}>
            <View style={styles.iconWrap}>
              <Wand2 size={18} color="#FCD34D" />
            </View>
            <Text style={styles.title}>AI Wish Generator</Text>
          </View>
          <Text style={styles.tagline}>Personalized messages that feel truly yours</Text>
        </View>

        <View style={styles.creditsPill}>
          <Star size={13} color="#FCD34D" fill="#FCD34D" />
          <Text style={styles.creditsText}>{credits}</Text>
          <Sparkles size={11} color="rgba(255,255,255,0.7)" />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    textAlign: 'center',
  },
  creditsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  creditsText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
