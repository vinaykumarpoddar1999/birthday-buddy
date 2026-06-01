import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react-native';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFeedbackStore } from '@/stores/feedback.store';

const MODAL_ICON = {
  success: { Icon: CheckCircle2, color: '#22C55E', bg: '#DCFCE7' },
  error: { Icon: XCircle, color: '#EF4444', bg: '#FEE2E2' },
  warning: { Icon: AlertTriangle, color: '#F59E0B', bg: '#FEF3C7' },
  confirm: { Icon: Info, color: '#7C3AED', bg: '#EDE9FE' },
  delete: { Icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
  'action-sheet': { Icon: Info, color: '#7C3AED', bg: '#EDE9FE' },
} as const;

function FeedbackModal() {
  const insets = useSafeAreaInsets();
  const modal = useFeedbackStore((s) => s.modal);
  const hideModal = useFeedbackStore((s) => s.hideModal);

  if (!modal.visible) return null;

  const config = MODAL_ICON[modal.type];
  const Icon = config.Icon;
  const isActionSheet = modal.type === 'action-sheet';
  const hasCancel = modal.type === 'confirm' || modal.type === 'delete';

  const handleConfirm = () => {
    modal.onConfirm?.();
    hideModal();
  };

  const handleCancel = () => {
    modal.onCancel?.();
    hideModal();
  };

  return (
    <Modal transparent animationType="fade" visible={modal.visible} onRequestClose={hideModal}>
      <Pressable
        className="flex-1 bg-black/60 justify-center px-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        onPress={isActionSheet ? hideModal : undefined}>
        <Pressable
          className="rounded-2xl bg-surface overflow-hidden shadow-lg"
          onPress={(e) => e.stopPropagation()}>
          {!isActionSheet && (
            <View className="p-6 items-center">
              <View
                className="h-14 w-14 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: config.bg }}>
                <Icon size={28} color={config.color} />
              </View>
              <Text className="text-[18px] font-bold text-foreground text-center">{modal.title}</Text>
              {modal.message ? (
                <Text className="text-[14px] text-foreground-secondary text-center mt-2 leading-5">
                  {modal.message}
                </Text>
              ) : null}
            </View>
          )}

          {isActionSheet && (
            <View className="p-4">
              <Text className="text-[16px] font-bold text-foreground text-center mb-3">{modal.title}</Text>
              <ScrollView className="max-h-72">
                {modal.actionSheetOptions.map((opt, i) => (
                  <Pressable
                    key={`${opt.label}-${i}`}
                    className={`py-3.5 px-4 rounded-xl mb-1 ${opt.destructive ? 'bg-error/5' : 'bg-background'}`}
                    onPress={() => {
                      hideModal();
                      opt.onPress();
                    }}
                    accessibilityRole="button">
                    <Text
                      className={`text-[15px] font-semibold text-center ${opt.destructive ? 'text-error' : 'text-foreground'}`}>
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable
                className="py-3.5 mt-2 rounded-xl bg-border/30"
                onPress={hideModal}
                accessibilityRole="button">
                <Text className="text-[15px] font-semibold text-foreground-secondary text-center">Cancel</Text>
              </Pressable>
            </View>
          )}

          {!isActionSheet && (
            <View className={`flex-row border-t border-border/60 ${hasCancel ? '' : 'justify-center'}`}>
              {hasCancel && (
                <Pressable
                  className="flex-1 py-4 items-center border-r border-border/60"
                  onPress={handleCancel}
                  accessibilityRole="button">
                  <Text className="text-[15px] font-semibold text-foreground-secondary">{modal.cancelLabel}</Text>
                </Pressable>
              )}
              <Pressable
                className={`py-4 items-center ${hasCancel ? 'flex-1' : 'px-10'}`}
                onPress={handleConfirm}
                accessibilityRole="button">
                <Text
                  className={`text-[15px] font-bold ${modal.type === 'delete' ? 'text-error' : 'text-primary'}`}>
                  {hasCancel ? modal.confirmLabel : modal.confirmLabel}
                </Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function FeedbackToast() {
  const insets = useSafeAreaInsets();
  const toast = useFeedbackStore((s) => s.toast);
  const hideToast = useFeedbackStore((s) => s.hideToast);

  if (!toast.visible) return null;

  const bg =
    toast.type === 'success'
      ? '#DCFCE7'
      : toast.type === 'error'
        ? '#FEE2E2'
        : toast.type === 'warning'
          ? '#FEF3C7'
          : '#EDE9FE';

  const color =
    toast.type === 'success'
      ? '#166534'
      : toast.type === 'error'
        ? '#991B1B'
        : toast.type === 'warning'
          ? '#92400E'
          : '#5B21B6';

  return (
    <View
      className="absolute left-4 right-4 z-50"
      style={{ top: insets.top + 8 }}
      pointerEvents="box-none">
      <Pressable
        className="flex-row items-center rounded-xl px-4 py-3 shadow-md"
        style={{ backgroundColor: bg }}
        onPress={hideToast}
        accessibilityRole="button">
        <Text className="flex-1 text-[14px] font-medium" style={{ color }}>
          {toast.message}
        </Text>
        <X size={16} color={color} />
      </Pressable>
    </View>
  );
}

export function FeedbackHost() {
  return (
    <>
      <FeedbackModal />
      <FeedbackToast />
    </>
  );
}
