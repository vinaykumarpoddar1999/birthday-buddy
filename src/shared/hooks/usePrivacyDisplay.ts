import { useCallback, useMemo } from 'react';

import { useProfileStore } from '@features/profile/store/profile.store';

function maskText(value: string, visibleEdges = 1): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed.length <= visibleEdges * 2) return '•••';
  const start = trimmed.slice(0, visibleEdges);
  const end = trimmed.slice(-visibleEdges);
  const hiddenLength = Math.min(trimmed.length - visibleEdges * 2, 6);
  return `${start}${'•'.repeat(hiddenLength)}${end}`;
}

function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@');
  if (!domain) return maskText(email);
  return `${maskText(local, 1)}@${domain}`;
}

export function usePrivacyDisplay() {
  const shouldMask = false;

  const maskName = useCallback(
    (name: string) => (shouldMask ? maskText(name) : name),
    [shouldMask],
  );

  const maskEmailValue = useCallback(
    (email: string) => (shouldMask ? maskEmail(email) : email),
    [shouldMask],
  );

  const maskPhone = useCallback(
    (phone: string) => (shouldMask ? maskText(phone.replace(/\s/g, ''), 2) : phone),
    [shouldMask],
  );

  return useMemo(
    () => ({
      shouldMask,
      maskName,
      maskEmail: maskEmailValue,
      maskPhone,
    }),
    [shouldMask, maskName, maskEmailValue, maskPhone],
  );
}
