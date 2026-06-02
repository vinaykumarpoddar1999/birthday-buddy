import { create } from 'zustand';

export type FeedbackModalType =
  | 'success'
  | 'error'
  | 'warning'
  | 'confirm'
  | 'delete'
  | 'action-sheet'
  | 'security'
  | 'permission';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ActionSheetOption = {
  label: string;
  destructive?: boolean;
  onPress: () => void;
};

type ModalState = {
  visible: boolean;
  type: FeedbackModalType;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  actionSheetOptions: ActionSheetOption[];
};

type ToastState = {
  visible: boolean;
  message: string;
  type: ToastType;
};

type FeedbackStore = {
  modal: ModalState;
  toast: ToastState;
  toastTimer: ReturnType<typeof setTimeout> | null;

  showSuccess: (title: string, message?: string, onDismiss?: () => void) => void;
  showError: (title: string, message?: string, onDismiss?: () => void) => void;
  showWarning: (title: string, message?: string, onDismiss?: () => void) => void;
  showConfirm: (opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  showDeleteConfirm: (opts: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  showSecurity: (title: string, message?: string, onDismiss?: () => void) => void;
  showPermission: (title: string, message?: string, onConfirm?: () => void) => void;
  showActionSheet: (opts: { title: string; options: ActionSheetOption[] }) => void;
  hideModal: () => void;
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
  hideToast: () => void;
};

const defaultModal: ModalState = {
  visible: false,
  type: 'success',
  title: '',
  message: '',
  confirmLabel: 'OK',
  cancelLabel: 'Cancel',
  onConfirm: null,
  onCancel: null,
  actionSheetOptions: [],
};

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  modal: defaultModal,
  toast: { visible: false, message: '', type: 'info' },
  toastTimer: null,

  showSuccess: (title, message = '', onDismiss) =>
    set({
      modal: {
        ...defaultModal,
        visible: true,
        type: 'success',
        title,
        message,
        onConfirm: onDismiss ?? null,
      },
    }),

  showError: (title, message = '', onDismiss) =>
    set({
      modal: {
        ...defaultModal,
        visible: true,
        type: 'error',
        title,
        message,
        onConfirm: onDismiss ?? null,
      },
    }),

  showWarning: (title, message = '', onDismiss) =>
    set({
      modal: {
        ...defaultModal,
        visible: true,
        type: 'warning',
        title,
        message,
        onConfirm: onDismiss ?? null,
      },
    }),

  showConfirm: ({
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = false,
    onConfirm,
    onCancel,
  }) =>
    set({
      modal: {
        ...defaultModal,
        visible: true,
        type: destructive ? 'delete' : 'confirm',
        title,
        message,
        confirmLabel,
        cancelLabel,
        onConfirm,
        onCancel: onCancel ?? null,
      },
    }),

  showDeleteConfirm: ({ title, message, onConfirm, onCancel }) =>
    set({
      modal: {
        ...defaultModal,
        visible: true,
        type: 'delete',
        title,
        message,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        onConfirm,
        onCancel: onCancel ?? null,
      },
    }),

  showSecurity: (title, message = '', onDismiss) =>
    set({
      modal: {
        ...defaultModal,
        visible: true,
        type: 'security',
        title,
        message,
        onConfirm: onDismiss ?? null,
      },
    }),

  showPermission: (title, message = '', onConfirm) =>
    set({
      modal: {
        ...defaultModal,
        visible: true,
        type: 'permission',
        title,
        message,
        confirmLabel: 'Allow',
        cancelLabel: 'Not Now',
        onConfirm: onConfirm ?? null,
      },
    }),

  showActionSheet: ({ title, options }) =>
    set({
      modal: {
        ...defaultModal,
        visible: true,
        type: 'action-sheet',
        title,
        actionSheetOptions: options,
      },
    }),

  hideModal: () => set({ modal: defaultModal }),

  showToast: (message, type = 'info', durationMs = 3000) => {
    const prev = get().toastTimer;
    if (prev) clearTimeout(prev);
    const timer = setTimeout(() => get().hideToast(), durationMs);
    set({
      toast: { visible: true, message, type },
      toastTimer: timer,
    });
  },

  hideToast: () => {
    const prev = get().toastTimer;
    if (prev) clearTimeout(prev);
    set({
      toast: { visible: false, message: '', type: 'info' },
      toastTimer: null,
    });
  },
}));
