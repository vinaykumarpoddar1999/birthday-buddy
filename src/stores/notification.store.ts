import { create } from 'zustand';

type NotificationState = {
  pushToken: string | null;
  permissionGranted: boolean;
  setPushToken: (token: string | null) => void;
  setPermissionGranted: (granted: boolean) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  pushToken: null,
  permissionGranted: false,
  setPushToken: (pushToken) => set({ pushToken }),
  setPermissionGranted: (permissionGranted) => set({ permissionGranted }),
}));
