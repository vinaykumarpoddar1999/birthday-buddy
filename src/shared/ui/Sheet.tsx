import { Modal, Pressable, View, type ModalProps } from 'react-native';

export type SheetProps = ModalProps & {
  onClose: () => void;
};

export function Sheet({ children, onClose, visible, ...props }: SheetProps) {
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose} {...props}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="rounded-t-3xl bg-surface px-6 pt-4 pb-8"
          onPress={(e) => e.stopPropagation()}>
          <View className="h-1 w-12 self-center rounded-full bg-muted/40 mb-4" />
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
