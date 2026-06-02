import { create } from 'zustand';

type ModalId = 'premium' | 'rate' | 'update' | 'referral' | 'share' | 'confirm-delete' | null;

type ModalState = {
  activeModal: ModalId;
  modalPayload: Record<string, unknown> | null;
  openModal: (id: ModalId, payload?: Record<string, unknown>) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalPayload: null,
  openModal: (activeModal, modalPayload) =>
    set({ activeModal, modalPayload: modalPayload ?? null }),
  closeModal: () => set({ activeModal: null, modalPayload: null }),
}));
