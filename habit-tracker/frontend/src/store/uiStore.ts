import { create } from 'zustand';

interface UIState {
  isAddHabitModalOpen: boolean;
  isEditHabitModalOpen: boolean;
  selectedHabitId: string | null;
  openAddHabitModal: () => void;
  closeAddHabitModal: () => void;
  openEditHabitModal: (id: string) => void;
  closeEditHabitModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAddHabitModalOpen: false,
  isEditHabitModalOpen: false,
  selectedHabitId: null,
  openAddHabitModal: () => set({ isAddHabitModalOpen: true }),
  closeAddHabitModal: () => set({ isAddHabitModalOpen: false }),
  openEditHabitModal: (id) => set({ isEditHabitModalOpen: true, selectedHabitId: id }),
  closeEditHabitModal: () => set({ isEditHabitModalOpen: false, selectedHabitId: null }),
}));
