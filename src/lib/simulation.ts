const FULL_ROTATION_RADIANS = Math.PI * 2;

export const SIMULATION_TIME_CONFIG = Object.freeze({
  simulatedDaysPerRealSecond: 0.25,
  maximumFrameDeltaSeconds: 0.1,
});

function getSimulatedDayDelta(
  realDeltaSeconds: number,
  timeScale: number,
): number {
  if (
    !Number.isFinite(realDeltaSeconds) ||
    realDeltaSeconds <= 0 ||
    !Number.isFinite(timeScale) ||
    timeScale <= 0
  ) {
    return 0;
  }

  const safeRealDeltaSeconds = Math.min(
    realDeltaSeconds,
    SIMULATION_TIME_CONFIG.maximumFrameDeltaSeconds,
  );

  return (
    safeRealDeltaSeconds *
    SIMULATION_TIME_CONFIG.simulatedDaysPerRealSecond *
    timeScale
  );
}

/** Returns an axial-rotation angle in radians. Negative hours rotate retrograde. */
export function getAxialRotationDeltaRadians(
  rotationPeriodHours: number | null,
  realDeltaSeconds: number,
  timeScale: number,
): number {
  if (
    rotationPeriodHours === null ||
    !Number.isFinite(rotationPeriodHours) ||
    rotationPeriodHours === 0
  ) {
    return 0;
  }

  const simulatedDays = getSimulatedDayDelta(realDeltaSeconds, timeScale);

  return (
    (FULL_ROTATION_RADIANS * simulatedDays * 24) / rotationPeriodHours
  );
}

/** Returns a prograde orbital-revolution angle in radians. */
export function getOrbitalRevolutionDeltaRadians(
  orbitalPeriodDays: number | null,
  realDeltaSeconds: number,
  timeScale: number,
): number {
  if (
    orbitalPeriodDays === null ||
    !Number.isFinite(orbitalPeriodDays) ||
    orbitalPeriodDays <= 0
  ) {
    return 0;
  }

  const simulatedDays = getSimulatedDayDelta(realDeltaSeconds, timeScale);

  return (FULL_ROTATION_RADIANS * simulatedDays) / orbitalPeriodDays;
}
