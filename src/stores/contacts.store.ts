import { create } from 'zustand';

export type DeviceContactPreview = {
  id: string;
  deviceContactId?: string;
  fullName: string;
  birthDate: string | null;
  phone?: string;
  email?: string;
  avatarUri?: string;
  isDuplicate: boolean;
  selected: boolean;
};

interface ContactsStoreState {
  importSessionActive: boolean;
  deviceContacts: DeviceContactPreview[];
  importing: boolean;
  setImportSessionActive: (active: boolean) => void;
  setDeviceContacts: (contacts: DeviceContactPreview[]) => void;
  toggleContactSelection: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  setImporting: (importing: boolean) => void;
  reset: () => void;
}

export const useContactsStore = create<ContactsStoreState>()((set) => ({
  importSessionActive: false,
  deviceContacts: [],
  importing: false,

  setImportSessionActive: (importSessionActive) => set({ importSessionActive }),
  setDeviceContacts: (deviceContacts) => set({ deviceContacts }),
  toggleContactSelection: (id) =>
    set((s) => ({
      deviceContacts: s.deviceContacts.map((c) =>
        c.id === id ? { ...c, selected: !c.selected } : c,
      ),
    })),
  selectAll: () =>
    set((s) => ({
      deviceContacts: s.deviceContacts.map((c) =>
        !c.isDuplicate ? { ...c, selected: true } : c,
      ),
    })),
  deselectAll: () =>
    set((s) => ({
      deviceContacts: s.deviceContacts.map((c) => ({ ...c, selected: false })),
    })),
  setImporting: (importing) => set({ importing }),
  reset: () => set({ importSessionActive: false, deviceContacts: [], importing: false }),
}));
