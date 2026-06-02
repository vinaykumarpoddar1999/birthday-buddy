import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function EngagementModalShell({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 bg-black/50 justify-center px-6"
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close dialog">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-3xl overflow-hidden bg-surface"
          accessibilityRole="none">
          <LinearGradient
            colors={['#7C3AED', '#5B21B6', '#4C1D95']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 }}>
            <Pressable
              onPress={onClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Close">
              <X size={18} color="#FFF" />
            </Pressable>
            <Text className="text-[22px] font-bold text-white pr-10">{title}</Text>
            {subtitle ? (
              <Text className="text-[14px] text-white/85 mt-2 leading-5">{subtitle}</Text>
            ) : null}
          </LinearGradient>

          <View className="px-6 py-5">{children}</View>

          {footer ? <View className="px-6 pb-6 pt-0 gap-3">{footer}</View> : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
