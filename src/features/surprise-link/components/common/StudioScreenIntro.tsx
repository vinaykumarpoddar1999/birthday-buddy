import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';

interface StudioScreenIntroProps {
  title: string;
  subtitle: string;
  Icon?: LucideIcon;
  badge?: string;
}

export function StudioScreenIntro({
  title,
  subtitle,
  Icon,
  badge = 'Surprise Link Studio',
}: StudioScreenIntroProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#F5F3FF', '#EDE9FE', '#FFF1F2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        <View style={styles.badgeRow}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={18} color="#FFF" strokeWidth={2.2} />
            </View>
          ) : null}
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 10,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.12)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 19,
  },
});
