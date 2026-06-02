import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

interface WishSectionHeaderProps {
  step: number;
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
}

export function WishSectionHeader({ step, title, subtitle, Icon }: WishSectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.badge}>
          {Icon ? <Icon size={14} color="#7C3AED" strokeWidth={2.5} /> : (
            <Text style={styles.badgeNum}>{step}</Text>
          )}
        </View>
        <View style={styles.textCol}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7C3AED',
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
});
