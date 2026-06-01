import { useFeedbackStore } from '@/stores/feedback.store';

/** Imperative feedback API for use outside React components. */
export const feedback = {
  success: (title: string, message?: string) => useFeedbackStore.getState().showSuccess(title, message),
  error: (title: string, message?: string) => useFeedbackStore.getState().showError(title, message),
  warning: (title: string, message?: string) => useFeedbackStore.getState().showWarning(title, message),
  toast: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') =>
    useFeedbackStore.getState().showToast(message, type),
  confirm: (opts: Parameters<ReturnType<typeof useFeedbackStore.getState>['showConfirm']>[0]) =>
    useFeedbackStore.getState().showConfirm(opts),
  deleteConfirm: (opts: Parameters<ReturnType<typeof useFeedbackStore.getState>['showDeleteConfirm']>[0]) =>
    useFeedbackStore.getState().showDeleteConfirm(opts),
  actionSheet: (opts: Parameters<ReturnType<typeof useFeedbackStore.getState>['showActionSheet']>[0]) =>
    useFeedbackStore.getState().showActionSheet(opts),
};
