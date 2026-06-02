import { useCallback } from 'react';

import { useFeedbackStore } from '@/stores/feedback.store';

export function useFeedback() {
  const showSuccess = useFeedbackStore((s) => s.showSuccess);
  const showError = useFeedbackStore((s) => s.showError);
  const showWarning = useFeedbackStore((s) => s.showWarning);
  const showConfirm = useFeedbackStore((s) => s.showConfirm);
  const showDeleteConfirm = useFeedbackStore((s) => s.showDeleteConfirm);
  const showSecurity = useFeedbackStore((s) => s.showSecurity);
  const showPermission = useFeedbackStore((s) => s.showPermission);
  const showActionSheet = useFeedbackStore((s) => s.showActionSheet);
  const showToast = useFeedbackStore((s) => s.showToast);

  const toast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      showToast(message, type);
    },
    [showToast],
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showConfirm,
    showDeleteConfirm,
    showSecurity,
    showPermission,
    showActionSheet,
    showToast,
    toast,
  };
}
