# Railway Map Application

A React-based interactive railway map application that highlights train routes between destinations using GeoJSON data.

## Features

### 🚂 Railway Track Highlighting
- **Continuous Route Display**: Shows complete railway routes between selected destinations
- **GeoJSON Integration**: Uses real railway track data from HOT OSM and state-specific datasets
- **Smart Route Finding**: Automatically finds the longest continuous track connecting two cities
- **Visual Enhancement**: Thick red lines with white stroke for clear visibility

### 🗺️ Interactive Map
- **MapLibre GL JS**: High-performance mapping with smooth interactions
- **Multi-State Support**: Covers Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana
- **Real-time Search**: Search for destinations and instantly see highlighted routes
- **Responsive Design**: Works on desktop and mobile devices

### 📊 Data Management
- **HOT OSM Dataset**: 8,991+ railway lines for comprehensive coverage
- **State-Specific Data**: Individual GeoJSON files for each state
- **Coordinate Validation**: Ensures proper [longitude, latitude] format
- **Distance Calculation**: Precise distance-based track selection

## Technical Implementation

### Route Finding Algorithm
1. **Primary**: Finds single continuous track connecting both cities
2. **Secondary**: Combines best connecting tracks if no single track exists
3. **Fallback**: Uses closest track approximation with scoring system

### Data Processing
- **Track Filtering**: Filters tracks within city corridors
- **Connection Validation**: Verifies tracks actually connect both destinations
- **Length Prioritization**: Selects longest continuous tracks
- **MultiLineString Support**: Handles fragmented track segments

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
cd railway-map-app
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Usage

1. **Search Destinations**: Enter source and destination in the search fields
2. **View Route**: Click "Search" to highlight the railway route
3. **Explore Map**: Zoom and pan to see detailed track information
4. **Test Features**: Use "Test Red Line" for debugging

## File Structure

```
src/
├── RailwayMap.tsx          # Main map component
├── App.tsx                 # Application root
├── App.css                 # Application styles
└── main.tsx                # Entry point

public/
├── karnataka_railways_hotosm.geojson  # HOT OSM railway data
├── station_geo/            # State-specific GeoJSON files
└── stations/               # Station-specific data
```

## Data Sources

- **HOT OSM**: Humanitarian OpenStreetMap Team railway data
- **OpenStreetMap**: Community-contributed railway information
- **Indian Railways**: State-specific railway network data

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

This project is part of the Smart India Hackathon (SIH) submission.