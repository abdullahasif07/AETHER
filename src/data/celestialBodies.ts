import earthTextureAssetUrl from "../assets/earth-blue-marble.jpg";
import jupiterTextureAssetUrl from "../assets/textures/jupiter.jpg";
import marsTextureAssetUrl from "../assets/textures/mars.jpg";
import mercuryTextureAssetUrl from "../assets/textures/mercury.jpg";
import saturnRingsTextureAssetUrl from "../assets/textures/saturn-rings.png";
import saturnTextureAssetUrl from "../assets/textures/saturn.jpg";
import sunTextureAssetUrl from "../assets/textures/sun.jpg";
import venusTextureAssetUrl from "../assets/textures/venus.jpg";
import celestialBodiesJson from "./celestialBodies.json";

export type CelestialBodyKind = "star" | "planet";

export interface CelestialBodyRings {
  innerRadiusMultiplier: number;
  outerRadiusMultiplier: number;
  textureUrl: string;
  tiltDegrees: number;
}

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
  rings?: CelestialBodyRings;
}

const LOCAL_TEXTURE_URLS: Readonly<Record<string, string>> = {
  "../assets/earth-blue-marble.jpg": earthTextureAssetUrl,
  "../assets/textures/jupiter.jpg": jupiterTextureAssetUrl,
  "../assets/textures/mars.jpg": marsTextureAssetUrl,
  "../assets/textures/mercury.jpg": mercuryTextureAssetUrl,
  "../assets/textures/saturn-rings.png": saturnRingsTextureAssetUrl,
  "../assets/textures/saturn.jpg": saturnTextureAssetUrl,
  "../assets/textures/sun.jpg": sunTextureAssetUrl,
  "../assets/textures/venus.jpg": venusTextureAssetUrl,
};

const importedCelestialBodies = celestialBodiesJson as CelestialBody[];

export const celestialBodies: readonly CelestialBody[] =
  importedCelestialBodies.map((body) => ({
    ...body,
    textureUrl: body.textureUrl
      ? (LOCAL_TEXTURE_URLS[body.textureUrl] ?? body.textureUrl)
      : null,
    rings: body.rings
      ? {
          ...body.rings,
          textureUrl:
            LOCAL_TEXTURE_URLS[body.rings.textureUrl] ?? body.rings.textureUrl,
        }
      : undefined,
  }));

export function getCelestialBodyById(
  id: string,
): CelestialBody | undefined {
  return celestialBodies.find((body) => body.id === id);
}
