import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface StudioHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
}

export function StudioHeader({ title, onBack, rightAction }: StudioHeaderProps) {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}>
          <ChevronLeft size={20} color="#7C3AED" />
        </Pressable>
        <View style={styles.titleCol}>
          <View style={styles.badgeRow}>
            <Sparkles size={12} color="#7C3AED" />
            <Text style={styles.badge}>Surprise Link Studio</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.rightSlot}>{rightAction}</View>
      </View>
    </View>
  );
}

interface ContinueButtonProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ContinueButton({ label = 'Continue', onPress, disabled }: ContinueButtonProps) {
  return (
    <View style={styles.continueWrap}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.continuePress,
          disabled && styles.continueDisabled,
          pressed && !disabled && { transform: [{ scale: 0.98 }] },
        ]}>
        <LinearGradient
          colors={disabled ? ['#9CA3AF', '#6B7280'] : ['#7C3AED', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.continueGradient}>
          <Text style={styles.continueLabel}>{label}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  titleCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  rightSlot: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  continueWrap: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229,231,235,0.5)',
    backgroundColor: '#F8F6FC',
  },
  continuePress: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  continueLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
