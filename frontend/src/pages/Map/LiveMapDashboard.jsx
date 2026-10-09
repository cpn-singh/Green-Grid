import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mapAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import L from 'leaflet';

// Fix leaflet icon asset paths for standard markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper to map energy source type to local high-res visual assets
const getMediaForSupplier = (sup) => {
  const types = (sup?.energy_types || []).map(t => String(t).toLowerCase());
  const name = String(sup?.name || '').toLowerCase();
  if (types.some(t => t.includes('pumped')) || name.includes('pumped') || name.includes('pinnapuram')) {
    return { img: '/energy-media/pumped-hydro.jpg', type: 'pumped-hydro', label: 'Pumped Hydro (PSP)' };
  }
  if (types.some(t => t.includes('hydro')) || name.includes('hydro') || name.includes('dam')) {
    return { img: '/energy-media/large-hydro.jpg', type: 'large-hydro', label: 'Large Hydro' };
  }
  if (types.some(t => t.includes('battery') || t.includes('bess')) || name.includes('bess')) {
    return { img: '/energy-media/bess.jpg', type: 'bess', label: 'Grid BESS' };
  }
  if (types.some(t => t.includes('biomass')) || name.includes('biomass')) {
    return { img: '/energy-media/biomass.jpg', type: 'biomass', label: 'Biomass Cogeneration' };
  }
  if (types.some(t => t.includes('hydrogen')) || name.includes('hydrogen')) {
    return { img: '/energy-media/green-hydrogen.jpg', type: 'green-hydrogen', label: 'Green Hydrogen' };
  }
  if (types.some(t => t.includes('geothermal')) || name.includes('geothermal') || name.includes('puga')) {
    return { img: '/energy-media/geothermal.jpg', type: 'geothermal', label: 'Geothermal Energy' };
  }
  if (types.some(t => t.includes('wind')) && !types.some(t => t.includes('solar'))) {
    return { img: '/energy-media/wind.jpg', type: 'wind', label: 'Wind Power' };
  }
  return { img: '/energy-media/solar.jpg', type: 'solar', label: 'Solar PV' };
};

// Custom DC Icon
const dcIcon = new L.DivIcon({
  className: 'custom-dc-marker',
  html: `<div style="background: linear-gradient(135deg, #38bdf8, #2563eb); width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 0 14px rgba(56, 189, 248, 0.9); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const DEFAULT_MAP_DATA = {
  suppliers: [
    {
      id: "sup_1",
      name: "Adani Green Energy (AGEL) — Khavda",
      category: "ipp",
      type: "supplier",
      lat: 23.8500,
      lng: 69.7500,
      capacity_mw: 20000.0,
      available_capacity_mw: 4500.0,
      energy_types: ["Solar", "Wind", "Hybrid", "BESS"],
      sourcing_models: ["Physical PPA", "vPPA", "Open Access", "RTC/FDRE"],
      states: ["Gujarat", "Rajasthan", "Maharashtra"],
      rtc_pct: 88,
      description: "World's largest 30 GW renewable energy plant in Khavda, Gujarat."
    },
    {
      id: "sup_2",
      name: "ReNew Power — Rajasthan Hub",
      category: "ipp",
      type: "supplier",
      lat: 26.9124,
      lng: 70.9000,
      capacity_mw: 12600.0,
      available_capacity_mw: 2600.0,
      energy_types: ["Solar", "Wind", "BESS"],
      sourcing_models: ["Physical PPA", "vPPA", "RTC/FDRE"],
      states: ["Rajasthan", "Karnataka", "Maharashtra"],
      rtc_pct: 85,
      description: "Utility-scale solar and round-the-clock clean energy installations."
    },
    {
      id: "sup_3",
      name: "Greenko Group — Pinnapuram IRESP",
      category: "ipp",
      type: "supplier",
      lat: 15.6500,
      lng: 78.1000,
      capacity_mw: 7500.0,
      available_capacity_mw: 1800.0,
      energy_types: ["Pumped Hydro (PSP)", "Solar", "Wind"],
      sourcing_models: ["Physical PPA", "RTC/FDRE", "Open Access"],
      states: ["Andhra Pradesh", "Karnataka", "Telangana"],
      rtc_pct: 94,
      description: "Pinnapuram Integrated Renewable Energy Storage Project (IRESP)."
    },
    {
      id: "sup_4",
      name: "Tata Power Renewable Energy (TPREL)",
      category: "utility",
      type: "supplier",
      lat: 18.9220,
      lng: 72.8347,
      capacity_mw: 9000.0,
      available_capacity_mw: 1950.0,
      energy_types: ["Solar", "Wind", "Hybrid", "Rooftop Solar"],
      sourcing_models: ["Group Captive", "Physical PPA", "Open Access"],
      states: ["Maharashtra", "Gujarat", "Tamil Nadu"],
      rtc_pct: 82,
      description: "Pioneer in commercial group captive clean power for enterprise campuses."
    },
    {
      id: "sup_5",
      name: "Avaada Energy — Bikaner Complex",
      category: "ipp",
      type: "supplier",
      lat: 28.0229,
      lng: 73.3119,
      capacity_mw: 5000.0,
      available_capacity_mw: 1200.0,
      energy_types: ["Solar", "Green Hydrogen", "Hybrid"],
      sourcing_models: ["Open Access", "vPPA", "Physical PPA"],
      states: ["Rajasthan", "Maharashtra", "Uttar Pradesh"],
      rtc_pct: 80,
      description: "Utility solar installations powering cloud regions and green ammonia."
    },
    {
      id: "sup_6",
      name: "CleanMax Solar",
      category: "c&i",
      type: "supplier",
      lat: 19.0760,
      lng: 72.8777,
      capacity_mw: 2000.0,
      available_capacity_mw: 450.0,
      energy_types: ["Solar", "Wind-Solar Hybrid", "BESS"],
      sourcing_models: ["Group Captive", "Open Access", "Behind-the-Meter"],
      states: ["Maharashtra", "Karnataka", "Tamil Nadu"],
      rtc_pct: 86,
      description: "India's largest B2B clean energy provider dedicated to data centers."
    }
  ],
  data_centers: [
    {
      id: "dc_1",
      name: "Yotta D1 / NM1 Hyperscale Campus",
      type: "dc",
      city: "Navi Mumbai",
      state: "Maharashtra",
      lat: 19.0330,
      lng: 73.0297,
      it_load_mw: 250.0,
      cooling: "liquid",
      pue: 1.25,
      tier: "Tier IV",
      timeline: "Operational",
      server_types: ["AI/GPU Clusters", "Cloud Hyperscale"],
      green_goal_pct: 100
    },
    {
      id: "dc_2",
      name: "AdaniConneX Hyderabad AI Hub",
      type: "dc",
      city: "Hyderabad",
      state: "Telangana",
      lat: 17.3850,
      lng: 78.4867,
      it_load_mw: 100.0,
      cooling: "direct-to-chip",
      pue: 1.22,
      tier: "Tier IV",
      timeline: "Operational",
      server_types: ["AI Supercomputing", "High-Density Compute"],
      green_goal_pct: 100
    },
    {
      id: "dc_3",
      name: "CtrlS Bangalore Datacenter Campus",
      type: "dc",
      city: "Bengaluru",
      state: "Karnataka",
      lat: 12.9716,
      lng: 77.5946,
      it_load_mw: 80.0,
      cooling: "evaporative",
      pue: 1.28,
      tier: "Tier IV",
      timeline: "Operational",
      server_types: ["Enterprise Cloud", "AI Inference"],
      green_goal_pct: 90
    },
    {
      id: "dc_4",
      name: "STT GDC Noida Campus",
      type: "dc",
      city: "Noida",
      state: "Uttar Pradesh",
      lat: 28.5355,
      lng: 77.3910,
      it_load_mw: 70.0,
      cooling: "liquid",
      pue: 1.24,
      tier: "Tier III+",
      timeline: "Operational",
      server_types: ["Hyperscale Cloud", "Fintech"],
      green_goal_pct: 95
    },
    {
      id: "dc_5",
      name: "Nxtra by Airtel Chennai Central",
      type: "dc",
      city: "Chennai",
      state: "Tamil Nadu",
      lat: 13.0827,
      lng: 80.2707,
      it_load_mw: 60.0,
      cooling: "air",
      pue: 1.30,
      tier: "Tier III+",
      timeline: "Operational",
      server_types: ["Telecom Edge", "Cloud Storage"],
      green_goal_pct: 85
    }
  ],
  match_lines: [
    {
      id: "match_1",
      score: 98.5,
      status: "active",
      from: { name: "Adani Green Energy Khavda", lat: 23.8500, lng: 69.7500 },
      to: { name: "Yotta D1 Navi Mumbai", lat: 19.0330, lng: 73.0297 }
    },
    {
      id: "match_2",
      score: 97.5,
      status: "active",
      from: { name: "Greenko Pinnapuram IRESP", lat: 15.6500, lng: 78.1000 },
      to: { name: "AdaniConneX Hyderabad", lat: 17.3850, lng: 78.4867 }
    },
    {
      id: "match_3",
      score: 94.0,
      status: "active",
      from: { name: "CleanMax Solar", lat: 19.0760, lng: 72.8777 },
      to: { name: "CtrlS Bangalore", lat: 12.9716, lng: 77.5946 }
    }
  ]
};

export default function LiveMapDashboard() {
  const [data, setData] = useState(DEFAULT_MAP_DATA);
  const [stats, setStats] = useState({
    clean_energy_gw: 120.4,
    total_suppliers: 16,
    total_dcs: 17,
    total_matches: 10
  });
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'suppliers' | 'dcs' | 'matches'
  const [baseLayer, setBaseLayer] = useState('dark'); // 'dark' | 'satellite'
  const [streetViewTarget, setStreetViewTarget] = useState(null); // { name, lat, lng, type }
  const [events, setEvents] = useState([
    '⚡ Active PPA: Adani Green Khavda Mega Park ↔ Yotta D2 20,736 Blackwell Ultra GPU AI Campus (98.5% Compatibility)',
    '🔋 Firm RTC: Greenko Pinnapuram Pumped Hydro ↔ AdaniConneX Hyderabad Hyperscale Campus (97.5% Compatibility)',
    '☀️ Clean Energy PPA: Avaada Energy Bikaner ↔ Digital Edge BOM 350 MW Campus (83 MW Solar PPA)',
    '🌱 Captive Hybrid: CleanMax Babra Park ↔ Equinix MB1/MB2 Mumbai (33 MW Contracted)',
    '⚡ 309.6 MWp RE: ReNew Power ↔ Sify Technologies DGX-Ready AI Campus (97% Compatibility)',
    '💨 Wind Wheeling: Suzlon Muppandal Wind Complex ↔ Nxtra by Airtel Chennai (92% Compatibility)',
    '🏛️ Strategic Pipeline: Adani Green Khavda ↔ AdaniConneX Visakhapatnam 1 GW Megahub (99% Compatibility)',
  ]);
  const wsRef = useRef(null);

  useEffect(() => {
    // 1. Fetch markers and stats with strict validation
    mapAPI.getMarkers()
      .then((res) => {
        if (res && res.data && typeof res.data === 'object' && Array.isArray(res.data.suppliers) && res.data.suppliers.length > 0) {
          setData(res.data);
        }
      })
      .catch(() => {});

    mapAPI.getStats()
      .then((res) => {
        if (res && res.data && typeof res.data === 'object') {
          setStats(res.data);
        }
      })
      .catch(() => {});

    // 2. Setup WebSocket live ticker
    try {
      let defaultWs = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/map/`;
      if (window.location.hostname === 'localhost' && window.location.port === '5173') {
        defaultWs = 'ws://localhost:8000/ws/map/';
      }
      const wsUrl = import.meta.env.VITE_WS_URL || defaultWs;
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg && msg.message) {
            setEvents((prev) => [msg.message, ...prev.slice(0, 7)]);
          }
        } catch (err) {}
      };

      socket.onerror = () => {
        // Silently handle connection drops
      };
    } catch (e) {
      // fallback
    }

    return () => {
      const socket = wsRef.current;
      if (socket) {
        socket.onmessage = null;
        socket.onerror = null;
        if (socket.readyState === WebSocket.OPEN) {
          try { socket.close(); } catch (_) {}
        } else if (socket.readyState === WebSocket.CONNECTING) {
          // Prevent browser error: "WebSocket is closed before the connection is established"
          socket.onopen = () => {
            try { socket.close(); } catch (_) {}
          };
        }
      }
    };
  }, []);

  const suppliersList = Array.isArray(data?.suppliers) ? data.suppliers : [];
  const dcsList = Array.isArray(data?.data_centers) ? data.data_centers : [];
  const matchesList = Array.isArray(data?.match_lines) ? data.match_lines : [];

  const showSuppliers = activeFilter === 'all' || activeFilter === 'suppliers';
  const showDCs = activeFilter === 'all' || activeFilter === 'dcs';
  const showMatches = activeFilter === 'all' || activeFilter === 'matches';

  return (
    <div className="h-screen w-screen bg-[#08090a] text-white flex flex-col overflow-hidden pt-16">
      <Navbar />

      {/* Top Bar Stats & Filter Switcher */}
      <div className="shrink-0 bg-[#0c0e10]/95 backdrop-blur-md border-b border-white/[0.08] px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse shrink-0" />
          <span className="font-bold tracking-wider text-emerald-400 uppercase text-[11px] sm:text-xs">
            National Grid & DC Map
          </span>
          <span className="text-white/40 hidden lg:inline">• Pan-India Geospatial Telemetry</span>
        </div>

        {/* Responsive Layer Filters */}
        <div className="flex items-center gap-1 bg-black/70 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            All ({suppliersList.length + dcsList.length})
          </button>
          <button
            onClick={() => setActiveFilter('suppliers')}
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs whitespace-nowrap transition-all ${
              activeFilter === 'suppliers'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Renewable Sources ({suppliersList.length})
          </button>
          <button
            onClick={() => setActiveFilter('dcs')}
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs whitespace-nowrap transition-all ${
              activeFilter === 'dcs'
                ? 'bg-sky-500 text-neutral-950 font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Data Centers ({dcsList.length})
          </button>
          <button
            onClick={() => setActiveFilter('matches')}
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs whitespace-nowrap transition-all ${
              activeFilter === 'matches'
                ? 'bg-emerald-400 text-neutral-950 font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            PPA Corridors ({matchesList.length})
          </button>
        </div>

        {/* Map Base Layer Switcher (Dark Grid vs Satellite) */}
        <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setBaseLayer('dark')}
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium flex items-center gap-1.5 transition-all ${
              baseLayer === 'dark'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-white/50 hover:text-white'
            }`}
            title="Dark Grid High-Contrast Map"
          >
            <span>🌙</span>
            <span className="hidden sm:inline">Dark Grid</span>
          </button>
          <button
            onClick={() => setBaseLayer('satellite')}
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium flex items-center gap-1.5 transition-all ${
              baseLayer === 'satellite'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                : 'text-white/50 hover:text-white'
            }`}
            title="Real Earth Satellite Aerial Imagery"
          >
            <span>🛰️</span>
            <span className="hidden sm:inline">Satellite</span>
          </button>
        </div>

        {/* Global Key Metrics */}
        <div className="hidden sm:flex items-center gap-4 text-white/70 text-[11px]">
          <div>
            Clean Capacity: <span className="font-bold text-emerald-400">{stats?.clean_energy_gw || 120.4} GW</span>
          </div>
          <div>
            Data Centers: <span className="font-bold text-sky-400">{dcsList.length} Sites</span>
          </div>
          <div>
            PPA Routes: <span className="font-bold text-emerald-300">{matchesList.length} Active</span>
          </div>
        </div>
      </div>

      {/* Map View — Fills 100% of remaining viewport height */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        <MapContainer
          key={`map_${suppliersList.length}_${dcsList.length}`}
          center={[21.5000, 78.9629]} // Center of India
          zoom={5}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ height: '100%', width: '100%' }}
        >
          {baseLayer === 'satellite' ? (
            <TileLayer
              key="satellite-layer"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
              className="satellite-tile-layer"
            />
          ) : (
            <TileLayer
              key="dark-layer"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
              className="dark-tile-layer"
            />
          )}

          {/* Supplier Markers (Green circles scaled by capacity) */}
          {showSuppliers && suppliersList.map((sup) => {
            const radius = Math.min(22, Math.max(8, Math.sqrt(sup.capacity_mw) / 9));
            return (
              <CircleMarker
                key={sup.id}
                center={[sup.lat, sup.lng]}
                radius={radius}
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#10b981',
                  fillOpacity: 0.65,
                  weight: 2,
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 text-neutral-900 max-w-xs">
                    {/* Visual Media Header */}
                    {(() => {
                      const media = getMediaForSupplier(sup);
                      return (
                        <div className="relative w-full h-24 rounded-md overflow-hidden mb-2 border border-emerald-500/30 bg-neutral-950">
                          <img
                            src={media.img}
                            alt={sup.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                          <div className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-emerald-400 font-bold bg-black/75 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            {media.label}
                          </div>
                          <Link
                            to={`/sources/${media.type}`}
                            className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-[9px] font-mono uppercase tracking-wider flex items-center gap-0.5 transition-all shadow-sm"
                          >
                            <span>Specs →</span>
                          </Link>
                        </div>
                      );
                    })()}

                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {sup.category.toUpperCase()} • Renewable Source
                      </span>
                      <span className="text-xs font-bold text-emerald-700">{sup.rtc_pct}% RTC</span>
                    </div>
                    <h4 className="font-bold text-sm text-neutral-950 mb-1">{sup.name}</h4>
                    <p className="text-xs text-neutral-700 font-semibold mb-2">
                      Total Capacity: <span className="text-emerald-700 font-bold">{sup.capacity_mw.toLocaleString()} MW</span>
                      {sup.available_capacity_mw > 0 && ` (${sup.available_capacity_mw.toLocaleString()} MW available)`}
                    </p>
                    <p className="text-[11px] text-neutral-600 leading-relaxed mb-2">
                      {sup.description}
                    </p>
                    <div className="flex flex-wrap gap-1 text-[10px] mb-3">
                      {sup.energy_types?.map((et) => (
                        <span key={et} className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800 font-medium">
                          {et}
                        </span>
                      ))}
                      {sup.sourcing_models?.map((sm) => (
                        <span key={sm} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                          {sm}
                        </span>
                      ))}
                    </div>

                    {/* Street View & Maps Actions */}
                    <div className="pt-2 border-t border-neutral-200 flex items-center gap-1.5">
                      <a
                        href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${sup.lat},${sup.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#ffffff' }}
                        className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white !text-white font-bold text-[11px] py-2 px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span className="text-sm">🚶</span>
                        <span className="text-white !text-white font-bold tracking-wide">360° Street View</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const media = getMediaForSupplier(sup);
                          setStreetViewTarget({
                            name: sup.name,
                            lat: sup.lat,
                            lng: sup.lng,
                            type: 'Renewable Plant',
                            image: media.img,
                            sourceId: media.type,
                            sourceLabel: media.label
                          });
                        }}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white font-medium text-[10px] py-1.5 px-2 rounded-md transition-colors"
                        title="Interactive Aerial & Street Inspection"
                      >
                        🔍 Preview
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Data Center Markers (Blue icons) */}
          {showDCs && dcsList.map((dc) => (
            <Marker key={dc.id} position={[dc.lat, dc.lng]} icon={dcIcon}>
              <Popup>
                <div className="p-2 text-neutral-900 max-w-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      Installed Data Center
                    </span>
                    <span className="text-xs font-bold text-sky-700">{dc.tier?.toUpperCase() || 'TIER IV'}</span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-950 mb-0.5">{dc.name}</h4>
                  <p className="text-xs text-neutral-600 mb-1.5">{dc.city}, {dc.state}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-100 p-2 rounded-lg mb-2">
                    <div>
                      <span className="text-neutral-500 block">Critical IT Load:</span>
                      <span className="font-bold text-neutral-900">{dc.it_load_mw} MW</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Design PUE:</span>
                      <span className="font-bold text-neutral-900">{dc.pue}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Cooling Type:</span>
                      <span className="font-semibold text-neutral-900 capitalize">{dc.cooling}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Clean Goal:</span>
                      <span className="font-bold text-emerald-700">{dc.green_goal_pct}%</span>
                    </div>
                  </div>

                  {dc.timeline && (
                    <p className="text-[10px] text-neutral-600 mb-2 font-medium">
                      Status: <span className="text-emerald-700 font-bold">{dc.timeline}</span>
                    </p>
                  )}

                  {dc.server_types && (
                    <div className="flex flex-wrap gap-1 text-[10px] mb-3">
                      {dc.server_types.map((st) => (
                        <span key={st} className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 font-medium">
                          {st}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Street View & Maps Actions */}
                  <div className="pt-2 border-t border-neutral-200 flex items-center gap-1.5">
                    <a
                      href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${dc.lat},${dc.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#ffffff' }}
                      className="flex-1 text-center bg-sky-600 hover:bg-sky-700 text-white !text-white font-bold text-[11px] py-2 px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span className="text-sm">🚶</span>
                      <span className="text-white !text-white font-bold tracking-wide">360° Street View</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setStreetViewTarget({ name: dc.name, lat: dc.lat, lng: dc.lng, type: 'Data Center' })}
                      className="bg-neutral-800 hover:bg-neutral-900 text-white font-medium text-[10px] py-1.5 px-2 rounded-md transition-colors"
                      title="Interactive Aerial & Street Inspection"
                    >
                      🔍 Preview
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Connected Match Polyline */}
          {showMatches && matchesList.map((l) => (
            <Polyline
              key={l.id}
              positions={[
                [l.from.lat, l.from.lng],
                [l.to.lat, l.to.lng],
              ]}
              pathOptions={{
                color: '#34d399',
                dashArray: '6, 8',
                weight: 2.5,
                opacity: 0.85,
              }}
            >
              <Popup>
                <div className="p-2 text-neutral-900 text-xs">
                  <div className="font-bold text-emerald-700 mb-1">Active PPA Sourcing Route ({l.score}% Compatibility)</div>
                  <p className="font-semibold text-neutral-800">From: {l.from.name}</p>
                  <p className="font-semibold text-neutral-800">To: {l.to.name}</p>
                </div>
              </Popup>
            </Polyline>
          ))}
        </MapContainer>

        {/* Floating Map Legend (Responsive & Glassmorphic) */}
        <div className="absolute top-3 right-3 z-[1000] p-3 md:p-3.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/10 text-[11px] md:text-xs space-y-2 shadow-2xl max-w-[280px]">
          <div className="font-bold text-white flex items-center justify-between">
            <span>Map Layers</span>
            <span className="text-[10px] text-emerald-400 font-normal">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] shrink-0" />
            <span className="text-white/85 truncate">Renewable Sources ({suppliersList.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 border border-white shadow-[0_0_8px_rgba(56,189,248,0.7)] shrink-0" />
            <span className="text-white/85 truncate">Data Centers ({dcsList.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-emerald-400 shrink-0" />
            <span className="text-white/85 truncate">Contracted PPAs ({matchesList.length})</span>
          </div>
        </div>

        {/* Bottom Floating Telemetry Ticker (Non-blocking Overlay) */}
        <div className="absolute bottom-3 inset-x-3 md:inset-x-6 z-[1000] pointer-events-none">
          <div className="max-w-4xl mx-auto rounded-xl bg-black/85 backdrop-blur-xl border border-white/15 px-3.5 py-2 flex items-center gap-3 text-xs shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono font-bold text-emerald-400 text-[10px] md:text-xs uppercase tracking-wider">
                Telemetry:
              </span>
            </div>
            <div className="overflow-hidden flex-1 font-mono text-[11px] text-white/80">
              <div className="animate-ticker whitespace-nowrap">
                {events.join('  •  ')}
              </div>
            </div>
          </div>
        </div>

        {/* Street View / Aerial Preview Modal */}
        {streetViewTarget && (
          <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="bg-[#111317] border border-white/20 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-sm font-bold">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{streetViewTarget.name}</h3>
                    <p className="text-[11px] text-white/60">
                      {streetViewTarget.type} • Coordinates: {streetViewTarget.lat.toFixed(4)}°N, {streetViewTarget.lng.toFixed(4)}°E
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStreetViewTarget(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body: Embed / Satellite & Street View Preview */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                {/* Real Asset Image Banner if available */}
                {streetViewTarget.image && (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-emerald-500/25 bg-neutral-950">
                    <img
                      src={streetViewTarget.image}
                      alt={streetViewTarget.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded border border-emerald-500/30">
                        {streetViewTarget.sourceLabel || 'Renewable Infrastructure'}
                      </span>
                    </div>
                    {streetViewTarget.sourceId && (
                      <Link
                        to={`/sources/${streetViewTarget.sourceId}`}
                        className="absolute bottom-3 right-3 px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1"
                      >
                        <span>View Technical Specs →</span>
                      </Link>
                    )}
                  </div>
                )}

                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-inner">
                  {/* High-res satellite / aerial preview map */}
                  <iframe
                    title="Aerial Preview"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${streetViewTarget.lng - 0.015}%2C${streetViewTarget.lat - 0.015}%2C${streetViewTarget.lng + 0.015}%2C${streetViewTarget.lat + 0.015}&layer=mapnik&marker=${streetViewTarget.lat}%2C${streetViewTarget.lng}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white/90 border border-white/10 font-mono">
                    High-Precision Geolocation Target
                  </div>
                </div>

                <div className="bg-white/[0.04] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-white mb-0.5">Explore 360° Panoramic Ground & Street View</p>
                    <p className="text-white/60 text-[11px]">
                      View Google Street View coverage, perimeter substation, access roads, and campus gates.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${streetViewTarget.lat},${streetViewTarget.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none text-center bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(52,211,153,0.4)] text-xs flex items-center justify-center gap-1.5"
                    >
                      <span>🚶</span>
                      <span>Launch 360° Street View</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${streetViewTarget.lat},${streetViewTarget.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none text-center bg-white/10 hover:bg-white/20 text-white font-medium px-3.5 py-2 rounded-xl transition-colors text-xs"
                    >
                      Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

