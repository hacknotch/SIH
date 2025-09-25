import { useEffect, useRef, useState, useRef as useReactRef } from 'react';
// Simple fuzzy match function
function fuzzyMatch(str: string, query: string) {
  str = str.toLowerCase();
  query = query.toLowerCase();
  if (str.includes(query)) return true;
  // Allow up to 2 typos (Levenshtein distance)
  let m = str.length, n = query.length;
  if (Math.abs(m - n) > 2) return false;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str[i - 1] === query[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n] <= 2;
}
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function RailwayMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Search handler
  // Add marker state
  const [marker, setMarker] = useState<maplibregl.Marker | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useReactRef<HTMLInputElement>(null);

  async function handleSearch(e?: React.FormEvent, suggestion?: any) {
    if (e) e.preventDefault();
    setError(null);
    let query = search;
    if (suggestion) {
      query = suggestion.display_name;
      setSearch(query);
      setShowSuggestions(false);
    }
    if (!query.trim()) return;
    // Check if the query matches any of the suggestions
    const match = suggestions.find((item: any) => {
      const name = item.address?.station || item.address?.suburb || item.address?.village || item.address?.town || item.address?.city || item.address?.name || item.display_name.split(',')[0];
      return fuzzyMatch(name, query);
    });
    if (!match) {
      setError('Please select a railway station from the suggestions.');
      return;
    }
    setLoading(true);
    try {
      // Use Nominatim API for India only, restrict to railway stations
      const url = `https://nominatim.openstreetmap.org/search?countrycodes=in&q=${encodeURIComponent(query)}&format=json&addressdetails=1&extratags=1&limit=50`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      let data = await res.json();
      // Filter for railway stations only
      data = data.filter((item: any) => item.class === 'railway' && item.type === 'station');
      // Fuzzy match for search query
      let best = data.find((item: any) => {
        const name = item.address?.station || item.address?.suburb || item.address?.village || item.address?.town || item.address?.city || item.address?.name || item.display_name.split(',')[0];
        return fuzzyMatch(name, query);
      }) || data[0];
      if (data && data.length > 0 && best) {
        const { lon, lat, display_name, address } = best;
        const lngLat: [number, number] = [parseFloat(lon), parseFloat(lat)];
        const name = address?.station || address?.suburb || address?.village || address?.town || address?.city || address?.name || display_name.split(',')[0];
        const state = address?.state || '';
        const popupText = `${name}${state ? ', ' + state : ''}`;
        if (mapRef.current) {
          mapRef.current.flyTo({ center: lngLat, zoom: 12, essential: true });
          // Remove old marker
          if (marker) marker.remove();
          // Add marker at result
          const newMarker = new maplibregl.Marker({ color: '#d00' })
            .setLngLat(lngLat)
            .setPopup(new maplibregl.Popup().setText(popupText))
            .addTo(mapRef.current);
          setMarker(newMarker);
        }
      } else {
        setError('No station found in India.');
      }
    } catch (err) {
      setError('Search failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  // Fetch suggestions as user types
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?countrycodes=in&q=${encodeURIComponent(search)}&format=json&addressdetails=1&extratags=1&limit=50`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: controller.signal });
        let data = await res.json();
        // Filter for railway stations only
        data = data.filter((item: any) => item.class === 'railway' && item.type === 'station');
        // Fuzzy filter for suggestions: match station name or city name
        const filtered = data.filter((item: any) => {
          const station = item.address?.station || item.address?.name || item.display_name.split(',')[0];
          const city = item.address?.city || item.address?.town || item.address?.village || item.address?.suburb || '';
          return fuzzyMatch(station, search) || fuzzyMatch(city, search);
        });
        setSuggestions(filtered.length > 0 ? filtered : data);
      } catch (err) {
        // TypeScript fix for unknown error
        if ((err as any).name !== 'AbortError') setSuggestions([]);
      }
    };
    const timeout = setTimeout(fetchSuggestions, 300); // debounce
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        autoComplete="off"
        style={{
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
          minWidth: 280
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Indian railway station only..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: 16
            }}
            disabled={loading}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              zIndex: 100,
              listStyle: 'none',
              margin: 0,
              padding: 0,
              maxHeight: 180,
              overflowY: 'auto',
            }}>
              {suggestions.map((s, i) => (
                <li
                  key={s.place_id}
                  onMouseDown={() => handleSearch(undefined, s)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: i !== suggestions.length - 1 ? '1px solid #eee' : 'none',
                    background: '#fff',
                  }}
                  tabIndex={0}
                >
                  {(() => {
                    const station = s.address?.station || s.address?.name || s.display_name.split(',')[0];
                    const city = s.address?.city || s.address?.town || s.address?.village || s.address?.suburb || '';
                    const state = s.address?.state || '';
                    let label = station;
                    if (city && !station.toLowerCase().includes(city.toLowerCase())) label += `, ${city}`;
                    if (state) label += `, ${state}`;
                    return label;
                  })()}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          style={{
            padding: '6px 16px',
            background: '#0b6bcb',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Go'}
        </button>
      </form>
      {error && (
        <div style={{
          position: 'absolute',
          top: 56,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 11,
          background: '#fff3f3',
          color: '#b00020',
          border: '1px solid #fbb',
          borderRadius: 4,
          padding: '4px 12px',
          fontSize: 14
        }}>{error}</div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
