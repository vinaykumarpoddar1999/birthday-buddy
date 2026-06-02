import { create } from 'zustand';

export type PermissionKey = 'contacts' | 'calendar' | 'notifications' | 'mediaLibrary' | 'camera';

type PermissionStatus = 'undetermined' | 'granted' | 'denied';

interface PermissionsStoreState {
  permissions: Record<PermissionKey, PermissionStatus>;
  setPermission: (key: PermissionKey, status: PermissionStatus) => void;
  hydrate: (permissions: Partial<Record<PermissionKey, PermissionStatus>>) => void;
  reset: () => void;
}

const DEFAULT_PERMISSIONS: Record<PermissionKey, PermissionStatus> = {
  contacts: 'undetermined',
  calendar: 'undetermined',
  notifications: 'undetermined',
  mediaLibrary: 'undetermined',
  camera: 'undetermined',
};

export const usePermissionsStore = create<PermissionsStoreState>()((set) => ({
  permissions: { ...DEFAULT_PERMISSIONS },

  setPermission: (key, status) =>
    set((s) => ({ permissions: { ...s.permissions, [key]: status } })),

  hydrate: (partial) =>
    set((s) => ({ permissions: { ...s.permissions, ...partial } })),

  reset: () => set({ permissions: { ...DEFAULT_PERMISSIONS } }),
}));
