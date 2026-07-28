import { create } from "zustand";

type AetherState = {
  isRotating: boolean;
  rotationSpeed: number;
  toggleRotation: () => void;
};

export const useAetherStore = create<AetherState>((set) => ({
  isRotating: true,
  rotationSpeed: 0.16,
  toggleRotation: () =>
    set((state) => ({ isRotating: !state.isRotating })),
}));
