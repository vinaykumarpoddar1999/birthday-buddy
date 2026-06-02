import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Image as ImageIcon, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';

import { Colors, Shadows, scale } from '../constants/design-tokens';

function CardPreview({
  colors,
  rotate,
  offsetX,
  zIndex,
}: {
  colors: [string, string];
  rotate: string;
  offsetX: number;
  zIndex: number;
}) {
  return (
    <View
      style={[
        styles.cardPreview,
        {
          transform: [{ rotate }],
          left: offsetX,
          zIndex,
        },
      ]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardPreviewInner}>
        <View style={styles.cardPreviewImageArea}>
          <ImageIcon size={scale(16)} color="#FFFFFF" />
        </View>
        <Text style={styles.cardPreviewText}>Happy{'\n'}Birthday</Text>
      </LinearGradient>
    </View>
  );
}

export function SpecialCardsBanner() {
  return (
    <View style={[styles.container, Shadows.card]}>
      <LinearGradient
        colors={['#FDF2F8', '#FCE7F3', '#F5F3FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Make it extra special</Text>
              <Sparkles size={scale(16)} color="#A855F7" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.subtitle}>
              Create stunning cards, add photos, music, and AI magic
            </Text>
            <Pressable
              style={styles.ctaButton}
              onPress={() => router.push('/card-studio')}
              accessibilityRole="button"
              accessibilityLabel="Explore Cards">
              <Text style={styles.ctaText}>Explore Cards</Text>
              <ChevronRight size={scale(14)} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.rightContent}>
            <CardPreview
              colors={['#A78BFA', '#7C3AED']}
              rotate="-12deg"
              offsetX={0}
              zIndex={1}
            />
            <CardPreview
              colors={['#F472B6', '#EC4899']}
              rotate="3deg"
              offsetX={scale(28)}
              zIndex={2}
            />
            <CardPreview
              colors={['#60A5FA', '#3B82F6']}
              rotate="14deg"
              offsetX={scale(56)}
              zIndex={3}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: scale(24),
    borderRadius: scale(24),
    overflow: 'hidden',
  },
  gradient: {
    padding: scale(18),
    minHeight: scale(140),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    paddingRight: scale(12),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(6),
  },
  title: {
    fontSize: scale(17),
    fontWeight: '800',
    color: Colors.foreground,
  },
  subtitle: {
    fontSize: scale(12),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
    lineHeight: scale(18),
    marginBottom: scale(14),
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    borderRadius: scale(20),
    alignSelf: 'flex-start',
    gap: scale(4),
  },
  ctaText: {
    fontSize: scale(12),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rightContent: {
    width: scale(110),
    height: scale(100),
    position: 'relative',
  },
  cardPreview: {
    position: 'absolute',
    width: scale(60),
    height: scale(80),
    borderRadius: scale(10),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  cardPreviewInner: {
    flex: 1,
    padding: scale(8),
    justifyContent: 'space-between',
  },
  cardPreviewImageArea: {
    width: scale(28),
    height: scale(24),
    borderRadius: scale(6),
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPreviewText: {
    fontSize: scale(7),
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: scale(10),
  },
});
