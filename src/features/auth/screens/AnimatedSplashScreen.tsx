import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

const LOGO = require('../../../../assets/images/icon.png');
const APP_NAME = 'Birthday Buddy';
const RAINBOW = ['#7C3AED', '#EC4899', '#F59E0B', '#22C55E', '#3B82F6', '#A855F7'];

type DecoProps = {
  style: object;
  children: React.ReactNode;
};

function FloatingDeco({ style, children }: DecoProps) {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [float]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

function Balloon({ color }: { color: string }) {
  return (
    <Svg width={32} height={42} viewBox="0 0 32 42">
      <Ellipse cx="16" cy="14" rx="11" ry="13" fill={color} opacity={0.85} />
      <Path d="M16 27 L16 38" stroke={color} strokeWidth="1.5" opacity={0.6} />
      <Path d="M16 38 Q13 40 11 38" stroke={color} strokeWidth="1" fill="none" opacity={0.5} />
    </Svg>
  );
}

function GiftBox() {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Rect x="4" y="12" width="20" height="12" rx="2" fill="#F59E0B" opacity={0.9} />
      <Rect x="12" y="12" width="4" height="12" fill="#FBBF24" />
      <Rect x="4" y="9" width="20" height="5" rx="1" fill="#EC4899" opacity={0.9} />
    </Svg>
  );
}

function ConfettiDot({ color }: { color: string }) {
  return <Circle cx="4" cy="4" r="4" fill={color} />;
}

function CakeIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Rect x="5" y="16" width="20" height="10" rx="3" fill="#A855F7" />
      <Rect x="7" y="12" width="16" height="6" rx="2" fill="#EC4899" />
      <Path d="M15 6 L15 12" stroke="#F59E0B" strokeWidth="2" />
      <Circle cx="15" cy="5" r="2" fill="#FBBF24" />
    </Svg>
  );
}

type AnimatedSplashScreenProps = {
  onFinish: () => void;
};

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const [typedText, setTypedText] = useState('');
  const logoScale = useSharedValue(0.4);
  const logoOpacity = useSharedValue(0);
  const textProgress = useSharedValue(0);
  const containerOpacity = useSharedValue(1);
  const [visible, setVisible] = useState(true);

  const finishSplash = () => {
    setVisible(false);
    onFinish();
  };

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    textProgress.value = withDelay(400, withTiming(1, { duration: 1200 }));

    let index = 0;
    const typingInterval = setInterval(() => {
      index += 1;
      setTypedText(APP_NAME.slice(0, index));
      if (index >= APP_NAME.length) {
        clearInterval(typingInterval);
      }
    }, 80);

    const exitTimer = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(finishSplash)();
        }
      });
    }, 2800);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(exitTimer);
    };
  }, [containerOpacity, logoOpacity, logoScale, textProgress]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const rainbowLetters = useMemo(
    () =>
      typedText.split('').map((char, index) => {
        const color = RAINBOW[index % RAINBOW.length];
        return (
          <Text key={`${char}-${index}`} style={[styles.rainbowChar, { color }]}>
            {char === ' ' ? '\u00A0' : char}
          </Text>
        );
      }),
    [typedText],
  );

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, containerStyle]} exiting={FadeOut.duration(300)}>
      <FloatingDeco style={styles.decoTopLeft}>
        <Balloon color="#7C3AED" />
      </FloatingDeco>
      <FloatingDeco style={styles.decoTopRight}>
        <GiftBox />
      </FloatingDeco>
      <FloatingDeco style={styles.decoMidLeft}>
        <Svg width={16} height={16}>
          <ConfettiDot color="#EC4899" />
        </Svg>
      </FloatingDeco>
      <FloatingDeco style={styles.decoMidRight}>
        <CakeIcon />
      </FloatingDeco>
      <FloatingDeco style={styles.decoBottomLeft}>
        <Svg width={16} height={16}>
          <ConfettiDot color="#22C55E" />
        </Svg>
      </FloatingDeco>
      <FloatingDeco style={styles.decoBottomRight}>
        <Balloon color="#3B82F6" />
      </FloatingDeco>

      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Image source={LOGO} style={styles.logo} contentFit="cover" />
      </Animated.View>

      <View style={styles.titleRow}>{rainbowLetters}</View>
      <Text style={styles.tagline}>Celebrate every special moment</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  logoWrap: {
    marginBottom: 24,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: 116,
    height: 116,
    borderRadius: 28,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  rainbowChar: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  decoTopLeft: { position: 'absolute', top: '18%', left: '12%' },
  decoTopRight: { position: 'absolute', top: '22%', right: '14%' },
  decoMidLeft: { position: 'absolute', top: '42%', left: '8%' },
  decoMidRight: { position: 'absolute', top: '38%', right: '10%' },
  decoBottomLeft: { position: 'absolute', bottom: '28%', left: '16%' },
  decoBottomRight: { position: 'absolute', bottom: '24%', right: '18%' },
});
