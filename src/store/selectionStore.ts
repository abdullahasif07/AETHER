import { create } from "zustand";
import { isCelestialBodyId } from "../data/celestialBodyIds";

interface SelectionState {
  selectedBodyId: string | null;
  selectBody: (id: string) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedBodyId: null,
  selectBody: (id) =>
    set({ selectedBodyId: isCelestialBodyId(id) ? id : null }),
  clearSelection: () => set({ selectedBodyId: null }),
}));
