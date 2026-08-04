import { create } from "zustand";

export const TIME_SCALE_CONFIG = Object.freeze({
  minimum: 0,
  maximum: 4,
  step: 0.25,
  default: 1,
});

interface SimulationState {
  timeScale: number;
  setTimeScale: (timeScale: number) => void;
  resetTimeScale: () => void;
}

function clampTimeScale(timeScale: number): number {
  if (!Number.isFinite(timeScale)) {
    return TIME_SCALE_CONFIG.default;
  }

  return Math.min(
    TIME_SCALE_CONFIG.maximum,
    Math.max(TIME_SCALE_CONFIG.minimum, timeScale),
  );
}

export const useSimulationStore = create<SimulationState>((set) => ({
  timeScale: TIME_SCALE_CONFIG.default,
  setTimeScale: (timeScale) => set({ timeScale: clampTimeScale(timeScale) }),
  resetTimeScale: () => set({ timeScale: TIME_SCALE_CONFIG.default }),
}));
