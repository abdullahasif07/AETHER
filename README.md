# AETHER

A cinematic, interactive 3D solar-system experience.

## Development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
```

## Texture assets

`src/assets/earth-blue-marble.jpg` is NASA's 2048 × 1024 equirectangular
projected Earth imagery, designed to wrap around a sphere.

Source: [NASA/Goddard Space Flight Center Scientific Visualization Studio](https://svs.gsfc.nasa.gov/3615/).
Blue Marble Next Generation data courtesy of Reto Stöckli (NASA/GSFC) and
NASA's Earth Observatory.

The Sun, Mercury, Venus, Mars, Jupiter, Saturn, and Saturn's transparent ring
map use locally stored 2K equirectangular textures from Solar System Scope,
distributed under CC BY 4.0. See [CREDITS.md](./CREDITS.md) for the complete
asset list, source links, licence, and attribution.

## Celestial-body data

`src/data/celestialBodies.json` stores physical values with explicit units.
Mean radii and sidereal rotation/orbital periods are based on NASA/JPL
planetary fact sheets; average distances use orbital semimajor axes expressed
in kilometres. Negative `rotationPeriodHours` values denote retrograde
rotation.

`distanceFromSunKm` is nullable because the value does not meaningfully apply
to the Sun. A `null` `textureUrl` means that no local texture has been assigned
and the renderer should use the body's fallback `color`. JSON texture paths are
resolved through static TypeScript imports so Vite can fingerprint every local
asset in production builds. Optional `rings` data defines reusable inner/outer
radius multipliers, a transparent texture, and axial tilt.

Sources:

- [JPL Solar System Dynamics planetary physical parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html)
- [NASA Science: Sun Facts](https://science.nasa.gov/sun/facts/)

## Visual scaling

Scientific distances and radii use separate logarithmic display mappings in
`src/lib/scale.ts`. Distances in kilometres map to orbit radii in scene units;
mean radii in kilometres map independently to readable body radii. These
display values are intentionally non-linear and are not a realistic scale
conversion.

## Simulation time

At the default `1×` time scale, one real second advances the simulation by
`0.25` Earth days. The global control ranges from paused (`0×`) to `4×`.
Axial rotation uses each body's `rotationPeriodHours`; negative values rotate
in the opposite direction to represent retrograde rotation. Orbital revolution
uses positive `orbitalPeriodDays`, while the Sun and any body with a missing or
invalid orbital period remain stationary. Animation mutates Three.js objects
inside React Three Fiber's frame loop, so elapsed simulation time does not
cause React rerenders.
