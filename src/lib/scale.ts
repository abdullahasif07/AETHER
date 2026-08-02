export const DISTANCE_SCALE_CONFIG = Object.freeze({
  minimumOrbitRadiusSceneUnits: 4,
  logarithmicGrowthSceneUnits: 5,
  referenceDistanceKm: 50_000_000,
});

export const SIZE_SCALE_CONFIG = Object.freeze({
  minimumBodyRadiusSceneUnits: 0.12,
  logarithmicGrowthSceneUnits: 0.35,
  referenceRadiusKm: 1_000,
});

/** Converts average distance from the Sun in kilometres to scene units. */
export function scaleDistanceKmToSceneUnits(
  distanceFromSunKm: number | null,
): number {
  if (
    distanceFromSunKm === null ||
    !Number.isFinite(distanceFromSunKm) ||
    distanceFromSunKm <= 0
  ) {
    return 0;
  }

  const {
    minimumOrbitRadiusSceneUnits,
    logarithmicGrowthSceneUnits,
    referenceDistanceKm,
  } = DISTANCE_SCALE_CONFIG;

  return (
    minimumOrbitRadiusSceneUnits +
    logarithmicGrowthSceneUnits *
      Math.log10(1 + distanceFromSunKm / referenceDistanceKm)
  );
}

/** Converts mean body radius in kilometres to a display radius in scene units. */
export function scaleRadiusKmToSceneUnits(radiusKm: number): number {
  if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
    return 0;
  }

  const {
    minimumBodyRadiusSceneUnits,
    logarithmicGrowthSceneUnits,
    referenceRadiusKm,
  } = SIZE_SCALE_CONFIG;

  return (
    minimumBodyRadiusSceneUnits +
    logarithmicGrowthSceneUnits * Math.log10(1 + radiusKm / referenceRadiusKm)
  );
}
