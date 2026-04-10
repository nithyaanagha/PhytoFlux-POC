# PhytoFlux Air Cleaner Simulation

An interactive proof-of-concept web app for modeling an urban bio-sieve air filtration system. PhytoFlux simulates multi-stage particulate removal, filter health, and performance metrics based on environmental and operating conditions.

## Live Demo

The app is deployed at:

https://phyto-flux-poc.vercel.app/

## Overview

- Adjust airflow and pollutant inputs
- Simulate PM2.5 / PM10 filtration performance
- View filter health and maintenance timing
- Compare airflow, efficiency, and energy savings

## Features

- Multi-stage filtration model:
  - Structural pre-filter
  - Diatomaceous earth layer
  - Chitosan-coated layer
  - Vortex flow chamber
- Real-time results dashboard
- Performance and filter health charts
- Built with React, Vite, TypeScript, and Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal, typically:

```bash
http://localhost:5173
```

## Build

```bash
npm run build
```

## Notes

- Core simulation logic is in `src/lib/simulation.ts`
- Default app wiring is in `src/pages/Index.tsx`
- The UI is composed of component modules under `src/components`

## Future Improvements

- add persistent scenario saving
- support multiple filter designs
- improve data visualization with more charts
- connect to real sensor data
