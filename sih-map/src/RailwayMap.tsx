import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function RailwayMap() {
  // --- State and refs ---
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  // new: From/To destination inputs (UI only)
  const [fromDestination, setFromDestination] = useState('');
  const [toDestination, setToDestination] = useState('');

  // --- Initialize Map ---
  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current as HTMLDivElement,
      center: [77.2, 28.6],
      zoom: 8,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          basemap: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          },
          openmaptiles: {
            type: 'vector',
            url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL'
          },
          stateRails: {
            type: 'geojson',
            data: '/station_geo/Tamil_Nadu.geojson'
          }
        },
        layers: [
          {
            id: 'basemap',
            type: 'raster',
            source: 'basemap',
            minzoom: 0,
            maxzoom: 19,
            paint: { 'raster-opacity': 0.95 }
          },
          {
            id: 'railway',
            type: 'line',
            source: 'openmaptiles',
            'source-layer': 'transportation',
            filter: ['==', ['get', 'class'], 'rail'],
            paint: {
              'line-color': '#1f3a93',
              'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 8, 1, 12, 2, 16, 4]
            }
          },
          {
            id: 'state-rails-overlay',
            type: 'line',
            source: 'stateRails',
            paint: {
              'line-color': '#0b6bcb',
              'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1.5, 10, 2.5, 14, 4]
            }
          }
        ]
      },
      attributionControl: { compact: true }
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // no search/suggestions: this component now exposes From/To inputs only
  const fromMarkerRef = useRef<maplibregl.Marker | null>(null);
  const toMarkerRef = useRef<maplibregl.Marker | null>(null);

  async function geocodeOnce(q: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=in&q=${encodeURIComponent(q)}&limit=1`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'sih-map/1.0' } });
      if (!res.ok) return null;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return null;
      const first = data[0];
      return { lon: parseFloat(first.lon), lat: parseFloat(first.lat), display_name: first.display_name };
    } catch {
      return null;
    }
  }

  async function handleToolbarSearch() {
    if (!fromDestination.trim() || !toDestination.trim() || !mapRef.current) return;
    const [a, b] = await Promise.all([geocodeOnce(fromDestination), geocodeOnce(toDestination)]);
    const m = mapRef.current;
    // remove old markers
    fromMarkerRef.current?.remove();
    toMarkerRef.current?.remove();
    fromMarkerRef.current = null;
    toMarkerRef.current = null;

    const pts: Array<[number, number]> = [];
    if (a) {
      fromMarkerRef.current = new maplibregl.Marker({ color: '#0bda51' }).setLngLat([a.lon, a.lat]).addTo(m);
      pts.push([a.lon, a.lat]);
    }
    if (b) {
      toMarkerRef.current = new maplibregl.Marker({ color: '#ff4d4d' }).setLngLat([b.lon, b.lat]).addTo(m);
      pts.push([b.lon, b.lat]);
    }

    if (pts.length === 1) {
      m.flyTo({ center: pts[0], zoom: 12 });
    } else if (pts.length === 2) {
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend(pts[0]);
      bounds.extend(pts[1]);
      m.fitBounds(bounds, { padding: 80, duration: 800 });
    }
  }

  // UI: simple toolbar with From and To inputs only
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        padding: 8,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        minWidth: 360
      }}>
        <input
          type="text"
          placeholder="From destination"
          value={fromDestination}
          onChange={e => setFromDestination(e.target.value)}
          style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4, width: 180 }}
        />
        <input
          type="text"
          placeholder="To destination"
          value={toDestination}
          onChange={e => setToDestination(e.target.value)}
          style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4, width: 180 }}
        />
        <button
          onClick={handleToolbarSearch}
          style={{ padding: '6px 12px', background: '#0b6bcb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Search
        </button>
      </div>
      {/* --- Map Container --- */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}