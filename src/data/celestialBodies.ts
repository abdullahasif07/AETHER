import earthTextureAssetUrl from "../assets/earth-blue-marble.jpg";
import celestialBodiesJson from "./celestialBodies.json";

export type CelestialBodyKind = "star" | "planet";

export interface CelestialBody {
  id: string;
  name: string;
  kind: CelestialBodyKind;
  radiusKm: number;
  distanceFromSunKm: number | null;
  orbitalPeriodDays: number | null;
  rotationPeriodHours: number | null;
  textureUrl: string | null;
  color: `#${string}`;
  description: string;
}

const LOCAL_TEXTURE_URLS: Readonly<Record<string, string>> = {
  "../assets/earth-blue-marble.jpg": earthTextureAssetUrl,
};

const importedCelestialBodies = celestialBodiesJson as CelestialBody[];

export const celestialBodies: readonly CelestialBody[] =
  importedCelestialBodies.map((body) => ({
    ...body,
    textureUrl: body.textureUrl
      ? (LOCAL_TEXTURE_URLS[body.textureUrl] ?? body.textureUrl)
      : null,
  }));

export function getCelestialBodyById(
  id: string,
): CelestialBody | undefined {
  return celestialBodies.find((body) => body.id === id);
}
