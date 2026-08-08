import celestialBodiesJson from "./celestialBodies.json";

const celestialBodyIds = new Set(
  celestialBodiesJson.map((body) => body.id),
);

export function isCelestialBodyId(id: string): boolean {
  return celestialBodyIds.has(id);
}
