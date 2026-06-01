import { create } from 'zustand';

type UiState = {
  selectedPersonId: string | null;
  peopleFilter: string;
  setSelectedPersonId: (id: string | null) => void;
  setPeopleFilter: (filter: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedPersonId: null,
  peopleFilter: '',
  setSelectedPersonId: (id) => set({ selectedPersonId: id }),
  setPeopleFilter: (filter) => set({ peopleFilter: filter }),
}));
