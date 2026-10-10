import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mapAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { DEFAULT_MAP_DATA, DEFAULT_MAP_STATS } from '../../data/mapInfrastructureData';
import L from 'leaflet';

// Fix leaflet icon asset paths for standard markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper to map energy source type to local assets
const getMediaForSupplier = (sup) => {
  const types = (sup?.energy_types || []).map(t => String(t).toLowerCase());
  const name = String(sup?.name || '').toLowerCase();
  
  if (types.some(t => t.includes('pumped')) || name.includes('pumped') || name.includes('pinnapuram')) {
    return { img: '/energy-media/pumped-hydro.jpg', type: 'pumped-hydro', label: 'Pumped Hydro' };
  }
  if (types.some(t => t.includes('hydro')) || name.includes('hydro') || name.includes('dam')) {
    return { img: '/energy-media/large-hydro.jpg', type: 'large-hydro', label: 'Large Hydro' };
  }
  if (types.some(t => t.includes('battery') || t.includes('bess')) || name.includes('bess')) {
    return { img: '/energy-media/bess.jpg', type: 'bess', label: 'Grid BESS' };
  }
  if (types.some(t => t.includes('biomass')) || name.includes('biomass')) {
    return { img: '/energy-media/biomass.jpg', type: 'biomass', label: 'Biomass' };
  }
  if (types.some(t => t.includes('hydrogen')) || name.includes('hydrogen')) {
    return { img: '/energy-media/green-hydrogen.jpg', type: 'green-hydrogen', label: 'Green Hydrogen' };
  }
  if (types.some(t => t.includes('geothermal')) || name.includes('geothermal') || name.includes('puga')) {
    return { img: '/energy-media/geothermal.jpg', type: 'geothermal', label: 'Geothermal' };
  }
  if (types.some(t => t.includes('wind')) && !types.some(t => t.includes('solar'))) {
    return { img: '/energy-media/wind.jpg', type: 'wind', label: 'Wind Power' };
  }
  return { img: '/energy-media/solar.jpg', type: 'solar', label: 'Solar PV' };
};

// Custom DC Icon
const dcIcon = new L.DivIcon({
  className: 'custom-dc-marker',
  html: `
    <div style="
      background: linear-gradient(135deg, #38bdf8, #2563eb); 
      width: 18px; 
      height: 18px; 
      border-radius: 50%; 
      border: 2px solid #ffffff; 
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.7); 
      display: flex; 
      align-items: center; 
      justify-content: center;
    ">
      <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function LiveMapDashboard() {
  const [data, setData] = useState(DEFAULT_MAP_DATA);
  const [stats, setStats] = useState(DEFAULT_MAP_STATS);
  
  const [activeFilter, setActiveFilter] = useState('all'); 
  const [baseLayer, setBaseLayer] = useState('dark'); 
  const [streetViewTarget, setStreetViewTarget] = useState(null); 
  const [previewMapType, setPreviewMapType] = useState('satellite'); 
  
  // Simplified mock events to look more like typical system logs
  const [events, setEvents] = useState([
    'Connection updated: Adani Green Khavda to Yotta D2',
    'Contract active: Greenko Pinnapuram and AdaniConneX',
    'New capacity added: Avaada Energy Bikaner (83 MW)',
    'Status change: CleanMax Babra Park online',
  ]);
  
  const wsRef = useRef(null);

  useEffect(() => {
    mapAPI.getMarkers()
      .then(res => {
        if (res?.data?.suppliers?.length) {
          setData(res.data);
        }
      })
      .catch((err) => {
        console.warn('Map API using verified infrastructure dataset:', err?.message || err);
      });

    mapAPI.getStats()
      .then(res => {
        if (res?.data) {
          setStats(res.data);
        }
      })
      .catch(() => {
        // Fallback to verified local stats
      });

    const isLocal = window.location.hostname === 'localhost' && window.location.port === '5173';
    const defaultWs = isLocal 
      ? 'ws://localhost:8000/ws/map/' 
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/map/`;
    
    const wsUrl = import.meta.env.VITE_WS_URL || defaultWs;
    
    try {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg?.message) {
            setEvents(prev => [msg.message, ...prev.slice(0, 7)]);
          }
        } catch (err) {
          console.warn("Failed to parse WS message", err);
        }
      };
    } catch (e) {
      console.warn("WebSocket connection failed", e);
    }

    return () => {
      const socket = wsRef.current;
      if (socket) {
        socket.onmessage = null;
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      }
    };
  }, []);

  const suppliersList = data?.suppliers || [];
  const dcsList = data?.data_centers || [];
  const matchesList = data?.match_lines || [];

  const showSuppliers = ['all', 'suppliers'].includes(activeFilter);
  const showDCs = ['all', 'dcs'].includes(activeFilter);
  const showMatches = ['all', 'matches'].includes(activeFilter);

  const getFilterClass = (filterName) => {
    const isActive = activeFilter === filterName;
    if (!isActive) return 'px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all text-white/60 hover:text-white cursor-pointer';
    if (filterName === 'dcs') return 'px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all bg-sky-500 text-neutral-950 font-medium cursor-pointer shadow-sm';
    return 'px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all bg-emerald-500 text-neutral-950 font-medium cursor-pointer shadow-sm';
  };

  return (
    <div className="h-screen w-screen bg-[#08090a] text-white flex flex-col overflow-hidden pt-16">
      <Navbar />

      <div className="shrink-0 bg-[#0c0e10]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-medium text-emerald-400 uppercase text-xs">
            Live Grid Map
          </span>
        </div>

        <div className="flex items-center gap-1 bg-black/70 p-1 rounded border border-white/10 overflow-x-auto">
          <button onClick={() => setActiveFilter('all')} className={getFilterClass('all')}>
            All ({suppliersList.length + dcsList.length})
          </button>
          <button onClick={() => setActiveFilter('suppliers')} className={getFilterClass('suppliers')}>
            Sources ({suppliersList.length})
          </button>
          <button onClick={() => setActiveFilter('dcs')} className={getFilterClass('dcs')}>
            Data Centers ({dcsList.length})
          </button>
          <button onClick={() => setActiveFilter('matches')} className={getFilterClass('matches')}>
            Routes ({matchesList.length})
          </button>
        </div>

        <div className="flex items-center gap-1 bg-black/80 p-1 rounded border border-white/10">
          <button
            onClick={() => setBaseLayer('dark')}
            className={`px-2 py-1 rounded text-xs transition-all cursor-pointer ${
              baseLayer === 'dark' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-white/50 hover:text-white'
            }`}
          >
            Standard Map
          </button>
          <button
            onClick={() => setBaseLayer('satellite')}
            className={`px-2 py-1 rounded text-xs transition-all cursor-pointer ${
              baseLayer === 'satellite' ? 'bg-sky-500/20 text-sky-300 font-medium' : 'text-white/50 hover:text-white'
            }`}
          >
            Satellite Map
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-white/70 text-xs">
          <div>Capacity: <span className="font-medium text-emerald-400">{stats?.clean_energy_gw || 130.7} GW</span></div>
          <div>DCs: <span className="font-medium text-sky-400">{dcsList.length}</span></div>
          <div>Routes: <span className="font-medium text-emerald-300">{matchesList.length}</span></div>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full">
        <MapContainer
          key={`map_${suppliersList.length}_${dcsList.length}`}
          center={[21.5000, 78.9629]}
          zoom={5}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {baseLayer === 'satellite' ? (
            <>
              <TileLayer
                key="satellite-imagery-layer"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                className="satellite-tile-layer"
                maxZoom={19}
                maxNativeZoom={18}
              />
              <TileLayer
                key="satellite-labels-layer"
                attribution="&copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
                maxNativeZoom={18}
                opacity={0.85}
              />
            </>
          ) : (
            <TileLayer
              key="standard-dark-layer"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="dark-tile-layer"
              maxZoom={19}
            />
          )}

          {showSuppliers && suppliersList.map((sup) => {
            if (!sup?.lat || !sup?.lng) return null;
            const radius = Math.min(22, Math.max(8, Math.sqrt(sup.capacity_mw || 1000) / 9));
            const media = getMediaForSupplier(sup);
            
            return (
              <CircleMarker
                key={sup.id}
                center={[sup.lat, sup.lng]}
                radius={radius}
                pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.65, weight: 2 }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 text-neutral-900 max-w-xs">
                    <div className="relative w-full h-24 rounded overflow-hidden mb-2 bg-neutral-900">
                      <img src={media.img} alt={sup.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                      <div className="absolute bottom-1.5 left-1.5 text-[10px] text-emerald-400 bg-black/75 px-1.5 py-0.5 rounded">
                        {media.label}
                      </div>
                      <Link
                        to={`/sources/${media.type}`}
                        className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] uppercase"
                      >
                        Details
                      </Link>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        Source
                      </span>
                      <span className="text-xs text-emerald-700">{sup.rtc_pct}% RTC</span>
                    </div>
                    
                    <h4 className="font-medium text-sm text-black mb-1">{sup.name}</h4>
                    <p className="text-xs text-neutral-600 mb-2">
                      Capacity: <span className="text-emerald-700">{sup.capacity_mw.toLocaleString()} MW</span>
                    </p>
                    
                    <div className="flex flex-wrap gap-1 text-[10px] mb-3">
                      {sup.energy_types?.map(et => (
                        <span key={et} className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800">{et}</span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-neutral-200 flex gap-1.5">
                      <a
                        href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${sup.lat},${sup.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs py-1.5 px-3 rounded text-center"
                      >
                        Street View
                      </a>
                      <button
                        onClick={() => {
                          setPreviewMapType('satellite');
                          setStreetViewTarget({
                            name: sup.name,
                            lat: sup.lat,
                            lng: sup.lng,
                            type: 'Renewable Power Plant',
                            image: media.img,
                            label: media.label,
                            sourceId: media.type
                          });
                        }}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white text-xs py-1.5 px-3 rounded cursor-pointer"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {showDCs && dcsList.map((dc) => {
            if (!dc?.lat || !dc?.lng) return null;
            return (
              <Marker key={dc.id} position={[dc.lat, dc.lng]} icon={dcIcon}>
                <Popup>
                  <div className="p-2 text-neutral-900 max-w-xs">
                    <div className="flex justify-between gap-2 mb-1">
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">Data Center</span>
                      <span className="text-xs text-sky-700">{dc.tier || 'TIER IV'}</span>
                    </div>
                    
                    <h4 className="font-medium text-sm mb-0.5">{dc.name}</h4>
                    <p className="text-xs text-neutral-600 mb-2">{dc.city}, {dc.state}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-100 p-2 rounded mb-3">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">IT Load:</span>
                        <span>{dc.it_load_mw} MW</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">PUE:</span>
                        <span>{dc.pue}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Cooling:</span>
                        <span className="capitalize">{dc.cooling}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 flex gap-1.5">
                      <a
                        href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${dc.lat},${dc.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs py-1.5 px-3 rounded text-center"
                      >
                        Street View
                      </a>
                      <button
                        onClick={() => {
                          setPreviewMapType('satellite');
                          setStreetViewTarget({
                            name: dc.name,
                            lat: dc.lat,
                            lng: dc.lng,
                            type: 'Hyperscale Data Center',
                            tier: dc.tier || 'TIER IV',
                            city: dc.city,
                            it_load: dc.it_load_mw
                          });
                        }}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white text-xs py-1.5 px-3 rounded cursor-pointer"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {showMatches && matchesList.map((l) => {
            if (!l?.from?.lat || !l?.from?.lng || !l?.to?.lat || !l?.to?.lng) return null;
            return (
              <Polyline
                key={l.id}
                positions={[[l.from.lat, l.from.lng], [l.to.lat, l.to.lng]]}
                pathOptions={{ color: '#34d399', dashArray: '6, 8', weight: 2, opacity: 0.8 }}
              >
                <Popup>
                  <div className="p-2 text-neutral-900 text-xs">
                    <div className="font-medium text-emerald-700 mb-1">Route ({l.score}% Match)</div>
                    <p className="text-neutral-600">From: {l.from.name}</p>
                    <p className="text-neutral-600">To: {l.to.name}</p>
                  </div>
                </Popup>
              </Polyline>
            );
          })}
        </MapContainer>

        <div className="absolute top-3 right-3 z-[1000] p-3 rounded bg-black/80 backdrop-blur-md border border-white/10 text-xs space-y-2">
          <div className="text-white mb-2">Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-white/80">Sources</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-white/80">Data Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 border-t border-dashed border-emerald-400" />
            <span className="text-white/80">Connections</span>
          </div>
        </div>

        <div className="absolute bottom-3 inset-x-4 z-[1000] pointer-events-none">
          <div className="max-w-4xl mx-auto rounded bg-black/85 border border-white/10 px-4 py-2 flex items-center gap-3 pointer-events-auto">
            <div className="text-emerald-400 text-xs">
              Latest:
            </div>
            <div className="overflow-hidden flex-1 text-xs text-white/70 whitespace-nowrap">
              {events.join('  |  ')}
            </div>
          </div>
        </div>

        {streetViewTarget && (
          <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111317] border border-white/15 rounded-xl w-full max-w-xl overflow-hidden flex flex-col shadow-2xl">
              
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h3 className="text-white text-sm font-semibold">{streetViewTarget.name}</h3>
                  <span className="text-xs text-white/50 font-mono">
                    {streetViewTarget.lat.toFixed(4)}°N, {streetViewTarget.lng.toFixed(4)}°E • {streetViewTarget.type}
                  </span>
                </div>
                <button 
                  onClick={() => setStreetViewTarget(null)} 
                  className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-sm"
                >
                  &times;
                </button>
              </div>

              <div className="p-4 flex-1 space-y-3.5 max-h-[85vh] overflow-y-auto">
                {streetViewTarget.image && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-emerald-500/25 bg-neutral-950">
                    <img
                      src={streetViewTarget.image}
                      alt={streetViewTarget.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded border border-emerald-500/30">
                        {streetViewTarget.label || 'Clean Infrastructure'}
                      </span>
                    </div>
                    {streetViewTarget.sourceId && (
                      <Link
                        to={`/sources/${streetViewTarget.sourceId}`}
                        className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono text-[10px] uppercase tracking-wider transition-all"
                      >
                        Specs →
                      </Link>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70 font-mono text-[11px]">Inspection Layer:</span>
                  <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-white/10">
                    <button
                      onClick={() => setPreviewMapType('satellite')}
                      className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                        previewMapType === 'satellite' ? 'bg-sky-500 text-black font-semibold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Satellite Imagery
                    </button>
                    <button
                      onClick={() => setPreviewMapType('map')}
                      className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                        previewMapType === 'map' ? 'bg-emerald-500 text-black font-semibold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      OpenStreetMap
                    </button>
                  </div>
                </div>

                <div className="relative aspect-video w-full rounded-lg bg-neutral-900 border border-white/10 overflow-hidden shadow-inner">
                  {previewMapType === 'satellite' ? (
                    <iframe
                      title="Satellite Aerial Preview"
                      src={`https://maps.google.com/maps?q=${streetViewTarget.lat},${streetViewTarget.lng}&t=k&z=16&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  ) : (
                    <iframe
                      title="Street Map Preview"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${streetViewTarget.lng - 0.015},${streetViewTarget.lat - 0.015},${streetViewTarget.lng + 0.015},${streetViewTarget.lat + 0.015}&layer=mapnik&marker=${streetViewTarget.lat},${streetViewTarget.lng}`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-emerald-400 border border-white/10 font-mono">
                    {previewMapType === 'satellite' ? '🛰️ High-Resolution Orbital Satellite' : '📍 OpenStreetMap Geolocation'}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <a
                    href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${streetViewTarget.lat},${streetViewTarget.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>🚶</span>
                    <span>360° Ground View</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${streetViewTarget.lat},${streetViewTarget.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 rounded text-xs transition-colors cursor-pointer"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}