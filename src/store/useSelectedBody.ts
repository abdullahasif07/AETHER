import { getCelestialBodyById } from "../data/celestialBodies";
import { useSelectionStore } from "./selectionStore";

export function useSelectedBody() {
  const selectedBodyId = useSelectionStore((state) => state.selectedBodyId);

  return selectedBodyId
    ? getCelestialBodyById(selectedBodyId)
    : undefined;
}
