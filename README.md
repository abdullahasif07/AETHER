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

## Texture asset

`src/assets/earth-blue-marble.jpg` is NASA's 2048 × 1024 equirectangular
projected Earth imagery, designed to wrap around a sphere.

Source: [NASA/Goddard Space Flight Center Scientific Visualization Studio](https://svs.gsfc.nasa.gov/3615/).
Blue Marble Next Generation data courtesy of Reto Stöckli (NASA/GSFC) and
NASA's Earth Observatory.

## Celestial-body data

`src/data/celestialBodies.json` stores physical values with explicit units.
Mean radii and sidereal rotation/orbital periods are based on NASA/JPL
planetary fact sheets; average distances use orbital semimajor axes expressed
in kilometres. Negative `rotationPeriodHours` values denote retrograde
rotation.

`distanceFromSunKm` is nullable because the value does not meaningfully apply
to the Sun. A `null` `textureUrl` means that no local texture has been assigned
and the renderer should use the body's fallback `color`. Earth's JSON texture
path is resolved through a static TypeScript import so Vite can fingerprint the
existing local asset in production builds.

Sources:

- [JPL Solar System Dynamics planetary physical parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html)
- [NASA Science: Sun Facts](https://science.nasa.gov/sun/facts/)
