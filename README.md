# SIH Railway Map Application

This repository contains a railway map application built for the Smart India Hackathon (SIH).

## Project Structure

```
project_root/
├── railway-map-app/          # Main React application
│   ├── src/                  # Source code
│   ├── public/               # Static assets and GeoJSON data
│   ├── package.json          # Dependencies
│   └── README.md             # Application documentation
└── README.md                 # This file
```

## Features

- Interactive railway map using MapLibre GL JS
- Railway track highlighting between destinations
- GeoJSON-based railway data visualization
- Real-time route finding and display
- Support for multiple Indian states

## Getting Started

1. Navigate to the `railway-map-app` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to `http://localhost:5173`

## Technology Stack

- React 18 with TypeScript
- MapLibre GL JS for mapping
- Vite for build tooling
- GeoJSON for railway data

## Data Sources

- HOT OSM (Humanitarian OpenStreetMap Team) railway data
- State-specific GeoJSON files for Indian railway networks
- OpenStreetMap contributors

## Contributing

Please ensure your changes are compatible with the existing project structure and follow the established coding standards.
