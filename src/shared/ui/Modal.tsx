import { type ReactNode } from 'react';
import { Modal as RNModal, Pressable, View, type ModalProps as RNModalProps } from 'react-native';

export type ModalProps = RNModalProps & {
  onClose: () => void;
};

export function Modal({ children, onClose, visible, ...props }: ModalProps) {
  return (
    <RNModal transparent animationType="fade" visible={visible} onRequestClose={onClose} {...props}>
      <Pressable className="flex-1 bg-black/60 justify-center px-6" onPress={onClose}>
        <Pressable className="rounded-2xl bg-surface p-6" onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

export function ModalHeader({ children }: { children: ReactNode }) {
  return <View className="mb-4">{children}</View>;
}
