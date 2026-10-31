import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  LocateFixed, 
  ZoomIn, 
  ZoomOut, 
  Car, 
  Star, 
  X, 
  ChevronRight, 
  MapPin, 
  Sparkles,
  ShieldCheck,
  Minimize2,
  Maximize2,
  RotateCw,
  Compass
} from 'lucide-react';
import { CarListing } from '../../types';

interface SearchMapViewProps {
  cars: CarListing[];
  selectedCarId: string | null;
  hoveredCarId: string | null;
  onSelectCar: (car: CarListing) => void;
  city: string;
  isFullscreenExternal?: boolean;
  onToggleFullscreen?: () => void;
  viewLayout?: 'split' | 'map' | 'list';
}

type MapLayerType = 'voyager' | 'osm' | 'light' | 'dark' | 'satellite';

export const MOROCCO_CITY_COORDINATES: Record<string, [number, number]> = {
  'All Morocco': [32.0, -6.5],
  Tetouan: [35.5785, -5.3684],
  Casablanca: [33.5731, -7.5898],
  Marrakech: [31.6295, -7.9811],
  Tangier: [35.7595, -5.8340],
  Rabat: [34.0209, -6.8416],
  Agadir: [30.4278, -9.5981],
  Fes: [34.0181, -5.0078],
  Nador: [35.1688, -2.9335],
  Oujda: [34.6814, -1.9086],
  Meknes: [33.8938, -5.5516],
  Chefchaouen: [35.1714, -5.2696],
  Merzouga: [31.0993, -4.0116],
};

const TILE_LAYERS: Record<MapLayerType, { name: string; url: string; attribution: string; maxZoom: number; subdomains?: string }> = {
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    subdomains: 'abc'
  },
  voyager: {
    name: 'Carto Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd'
  },
  light: {
    name: 'Positron Clean Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd'
  },
  dark: {
    name: 'Dark Night Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd'
  },
  satellite: {
    name: 'Satellite Aerial',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; DigitalGlobe, Earthstar Geographics',
    maxZoom: 18,
    subdomains: 'abc'
  }
};

export const SearchMapView: React.FC<SearchMapViewProps> = ({
  cars,
  selectedCarId,
  hoveredCarId,
  onSelectCar,
  city,
  isFullscreenExternal,
  onToggleFullscreen,
  viewLayout = 'split'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  
  // Stable ref for onSelectCar to prevent unnecessary marker re-renders
  const onSelectCarRef = useRef(onSelectCar);
  useEffect(() => {
    onSelectCarRef.current = onSelectCar;
  }, [onSelectCar]);

  // Track previous car IDs and city to avoid map jumps
  const prevCarsFingerprintRef = useRef<string>('');
  const prevCityRef = useRef<string>('');

  const [internalFullscreen, setInternalFullscreen] = useState<boolean>(false);
  const isFullscreen = isFullscreenExternal !== undefined ? isFullscreenExternal : internalFullscreen;

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('osm');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [activePreviewCar, setActivePreviewCar] = useState<CarListing | null>(null);
  const [selectedHub, setSelectedHub] = useState<string>(city || 'Tetouan');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const toggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      setInternalFullscreen((prev) => !prev);
    }
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);
  }, [onToggleFullscreen]);

  // Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  // Center coordinates helper
  const getCenterCoordinates = useCallback((): [number, number] => {
    const matchedCityKey = Object.keys(MOROCCO_CITY_COORDINATES).find(
      (c) => c.toLowerCase() === (city || '').toLowerCase()
    );
    if (matchedCityKey) {
      return MOROCCO_CITY_COORDINATES[matchedCityKey];
    }
    if (cars.length > 0 && cars[0].coordinates?.lat && cars[0].coordinates?.lng) {
      return [cars[0].coordinates.lat, cars[0].coordinates.lng];
    }
    return [35.5785, -5.3684]; // Default Tetouan
  }, [cars, city]);

  // Create Marker Icon helper
  const createMarkerIcon = useCallback((car: CarListing, isSelected: boolean, isHovered: boolean) => {
    const isSpecial = isSelected || isHovered;

    return L.divIcon({
      className: 'airbcar-custom-marker-wrapper',
      html: `
        <div class="relative cursor-pointer transition-transform duration-200 select-none ${
          isSpecial ? 'scale-110 z-50' : 'scale-100 hover:scale-105'
        }">
          <div class="px-2.5 py-1.5 rounded-full font-bold text-xs tracking-tight shadow-md flex items-center gap-1.5 whitespace-nowrap transition-all border ${
            isSpecial
              ? 'bg-[#f95721] text-white border-white ring-4 ring-[#f95721]/30 shadow-[#f95721]/40'
              : 'bg-white text-[#1a1412] border-[#D6CCC0] hover:border-[#f95721] hover:bg-[#FFFBF8] shadow-sm'
          }">
            <span class="w-1.5 h-1.5 rounded-full ${isSpecial ? 'bg-white animate-pulse' : 'bg-[#f95721]'}"></span>
            <span class="${isSpecial ? 'text-white' : 'text-[#1a1412]'} font-extrabold">${car.dailyRate.toFixed(0)} DH</span>
          </div>
          <div class="w-2.5 h-2.5 rotate-45 mx-auto -mt-1.5 border-r border-b ${
            isSpecial 
              ? 'bg-[#f95721] border-[#f95721]' 
              : 'bg-white border-[#D6CCC0]'
          }"></div>
        </div>
      `,
      iconSize: [84, 36],
      iconAnchor: [42, 36],
    });
  }, []);

  // 1. Initialize Leaflet Map ONCE on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // If map already exists on this container, re-invalidate size
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      return;
    }

    // Clean any residual leaflet id from container to avoid Leaflet error "Map container is already initialized"
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const initialCenter = getCenterCoordinates();

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: city === 'All Morocco' ? 6 : 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      fadeAnimation: true,
      zoomAnimation: true,
    });

    // Custom attribution
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    // Initial tile layer with fallback handler
    const config = TILE_LAYERS[activeLayer];
    const tileOptions: L.TileLayerOptions = {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abc',
    };
    const tileLayer = L.tileLayer(config.url, tileOptions).addTo(map);

    tileLayer.on('tileerror', () => {
      // If tile fails and not already osm, fallback to OpenStreetMap
      if (activeLayer !== 'osm') {
        console.warn('Map tile error, fallback to OpenStreetMap standard');
        tileLayer.setUrl(TILE_LAYERS.osm.url);
      }
    });

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Observe container resize & invalidate size smoothly
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    // Multiple staggered invalidations to ensure full canvas coverage once layout stabilizes
    const t0 = setTimeout(() => map.invalidateSize(), 50);
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 400);
    const t3 = setTimeout(() => map.invalidateSize(), 800);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // 2. Invalidate size when viewLayout or isFullscreen changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 200);
    const t3 = setTimeout(() => map.invalidateSize(), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [viewLayout, isFullscreen]);

  // 3. Switch Tile Layer on activeLayer change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const config = TILE_LAYERS[activeLayer];
    const tileOptions: L.TileLayerOptions = {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abc',
    };
    const newLayer = L.tileLayer(config.url, tileOptions).addTo(map);

    newLayer.on('tileerror', () => {
      if (activeLayer !== 'osm') {
        newLayer.setUrl(TILE_LAYERS.osm.url);
      }
    });

    tileLayerRef.current = newLayer;
  }, [activeLayer]);

  // 4. Update Markers and view bounds when cars or city changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Build fingerprint of current cars to determine if fleet actually changed
    const currentFingerprint = cars.map((c) => `${c.id}:${c.coordinates?.lat}:${c.coordinates?.lng}`).sort().join('|');
    const carsChanged = currentFingerprint !== prevCarsFingerprintRef.current;
    const cityChanged = city !== prevCityRef.current;

    // Clear old markers
    (Object.values(markersRef.current) as L.Marker[]).forEach((marker) => {
      try {
        marker.remove();
      } catch {
        // safe ignore
      }
    });
    markersRef.current = {};

    // Filter cars with valid coordinates
    const validCars = cars.filter((c) => c.coordinates && typeof c.coordinates.lat === 'number' && typeof c.coordinates.lng === 'number');

    validCars.forEach((car) => {
      const isSelected = selectedCarId === car.id;
      const isHovered = hoveredCarId === car.id;
      const icon = createMarkerIcon(car, isSelected, isHovered);

      const marker = L.marker([car.coordinates.lat, car.coordinates.lng], {
        icon,
        zIndexOffset: isSelected || isHovered ? 1000 : 100,
        title: `${car.name} - ${car.dailyRate} DH/day`
      }).addTo(map);

      marker.on('click', () => {
        setActivePreviewCar(car);
        if (onSelectCarRef.current) {
          onSelectCarRef.current(car);
        }
        map.panTo([car.coordinates.lat, car.coordinates.lng], { animate: true, duration: 0.5 });
      });

      marker.on('mouseover', () => {
        setActivePreviewCar(car);
      });

      markersRef.current[car.id] = marker;
    });

    // Auto-fit or pan view to vehicles ONLY when the fleet or city has actually changed
    if (carsChanged || cityChanged) {
      prevCarsFingerprintRef.current = currentFingerprint;
      prevCityRef.current = city;

      if (validCars.length > 1) {
        try {
          const bounds = L.latLngBounds(validCars.map((c) => [c.coordinates.lat, c.coordinates.lng]));
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: true });
        } catch (e) {
          console.warn('Map fitBounds notice:', e);
        }
      } else if (validCars.length === 1) {
        map.setView([validCars[0].coordinates.lat, validCars[0].coordinates.lng], 13, { animate: true });
      } else {
        const center = getCenterCoordinates();
        map.setView(center, city === 'All Morocco' ? 6 : 12, { animate: true });
      }
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [cars, city, createMarkerIcon, getCenterCoordinates]);

  // 5. Update Marker icon states when selection or hover changes
  useEffect(() => {
    cars.forEach((car) => {
      const marker = markersRef.current[car.id];
      if (!marker) return;

      const isSelected = selectedCarId === car.id;
      const isHovered = hoveredCarId === car.id;

      const icon = createMarkerIcon(car, isSelected, isHovered);
      marker.setIcon(icon);
      marker.setZIndexOffset(isSelected || isHovered ? 1000 : 100);
    });

    const targetId = hoveredCarId || selectedCarId;
    if (targetId) {
      const found = cars.find((c) => c.id === targetId);
      if (found) {
        setActivePreviewCar(found);
      }
    }
  }, [selectedCarId, hoveredCarId, cars, createMarkerIcon]);

  // Recenter / Fit All helper
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    setIsRefreshing(true);
    map.invalidateSize();

    const validCars = cars.filter((c) => c.coordinates?.lat && c.coordinates?.lng);
    if (validCars.length > 1) {
      const bounds = L.latLngBounds(validCars.map((c) => [c.coordinates.lat, c.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: true });
    } else if (validCars.length === 1) {
      map.setView([validCars[0].coordinates.lat, validCars[0].coordinates.lng], 13, { animate: true });
    } else {
      const center = getCenterCoordinates();
      map.setView(center, 12, { animate: true });
    }

    setTimeout(() => {
      map.invalidateSize();
      setIsRefreshing(false);
    }, 400);
  };

  // Zoom to a specific Moroccan hub
  const handleJumpToCity = (cityName: string) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    setSelectedHub(cityName);

    if (cityName === 'All Morocco') {
      const validCars = cars.filter((c) => c.coordinates?.lat && c.coordinates?.lng);
      if (validCars.length > 0) {
        const bounds = L.latLngBounds(validCars.map((c) => [c.coordinates.lat, c.coordinates.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: true });
      } else {
        map.setView([32.0, -6.5], 6, { animate: true });
      }
      return;
    }

    const coords = MOROCCO_CITY_COORDINATES[cityName];
    if (coords) {
      map.setView(coords, 13, { animate: true });
      // Find cars in this city
      const cityCars = cars.filter((c) => c.city?.toLowerCase() === cityName.toLowerCase() && c.coordinates);
      if (cityCars.length > 0) {
        setActivePreviewCar(cityCars[0]);
      }
    }
    map.invalidateSize();
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div 
      className={`airbcar-map-wrapper relative transition-all duration-300 flex flex-col overflow-hidden ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none border-none shadow-2xl bg-[#FAF7F2]' 
          : 'w-full h-[580px] lg:h-[calc(100vh-160px)] min-h-[480px] rounded-3xl overflow-hidden bg-[#FAF7F2] shadow-xl border border-[#EAE3D9]'
      }`}
      style={{ isolation: 'isolate' }}
    >
      {/* Fullscreen Top Header */}
      {isFullscreen && (
        <div className="bg-white/95 backdrop-blur-md border-b border-[#EAE3D9] px-4 sm:px-6 py-2.5 z-[1000] flex items-center justify-between gap-3 shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#f95721] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              🚗
            </div>
            <span className="font-serif-display font-bold text-base text-[#1a1412]">
              Airbcar Morocco Live Fleet Map
            </span>
            <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E0D7CC] text-[11px] font-semibold text-[#6B5E55]">
              <MapPin className="w-3 h-3 text-[#f95721]" />
              <span>{city || 'Morocco'}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-[#f95721] font-bold">{cars.length} vehicles</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[11px] text-[#8C7E74]">Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-[#D6CCC0] text-[10px] font-mono">Esc</kbd> to exit</span>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="px-3.5 py-1.5 rounded-full bg-[#1a1412] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Minimize2 className="w-3.5 h-3.5 text-[#f95721]" />
              <span>Exit Fullscreen</span>
            </button>
          </div>
        </div>
      )}

      {/* Map DOM Canvas Container (with explicit style dimensions) */}
      <div 
        ref={mapContainerRef} 
        id="airbcar-leaflet-map-canvas"
        className="w-full h-full min-h-[480px] flex-1 z-0 relative"
        style={{ width: '100%', height: '100%', minHeight: '480px' }}
      />

      {/* ── TOP-LEFT: CITY / HUBS QUICK SELECTOR ── */}
      <div className="absolute top-3.5 left-3.5 z-[500] max-w-[85%] flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E0D7CC] shadow-md">
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-[#1a1412] shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#f95721]" />
            <span>{city || 'Morocco'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#f95721]/15 text-[#f95721] text-[10px] font-mono font-bold">
              {cars.length} cars
            </span>
          </div>

          <div className="h-4 w-px bg-[#EAE3D9] mx-0.5 hidden sm:block" />

          {/* Quick Hub Jump Pills */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            {['All Morocco', 'Tetouan', 'Casablanca', 'Marrakech', 'Tangier', 'Rabat', 'Agadir'].map((hub) => (
              <button
                key={hub}
                type="button"
                onClick={() => handleJumpToCity(hub)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedHub === hub
                    ? 'bg-[#1a1412] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#6B5E55] hover:text-[#1a1412] hover:bg-[#EAE3D9]'
                }`}
              >
                {hub === 'All Morocco' ? '🇲🇦 All' : hub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOP-RIGHT: CONTROLS (ZOOM, RECENTER, LAYER TOGGLE, FULLSCREEN) ── */}
      <div className={`absolute right-3.5 z-[500] flex flex-col items-end gap-2 ${isFullscreen ? 'top-16' : 'top-3.5'}`}>
        
        {/* Fullscreen external toggle button */}
        {!isFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/95 hover:bg-[#F7F4EE] text-[#1a1412] border border-[#E0D7CC] shadow-md transition-all cursor-pointer backdrop-blur-md active:scale-95"
            title="Full Screen Map"
          >
            <Maximize2 className="w-4 h-4 text-[#1a1412]" />
          </button>
        )}

        {/* Layer Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="p-2.5 rounded-xl bg-white/95 hover:bg-[#F7F4EE] text-[#1a1412] border border-[#E0D7CC] shadow-md transition-all cursor-pointer backdrop-blur-md flex items-center gap-1.5 text-xs font-medium"
            title="Switch Map Style"
          >
            <Layers className="w-4 h-4 text-[#f95721]" />
            <span className="hidden sm:inline capitalize">{activeLayer}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-[#E0D7CC] shadow-2xl p-1.5 flex flex-col gap-1 text-xs z-[600]">
              {(['voyager', 'osm', 'light', 'dark', 'satellite'] as MapLayerType[]).map((layerKey) => (
                <button
                  key={layerKey}
                  type="button"
                  onClick={() => { setActiveLayer(layerKey); setShowLayerMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    activeLayer === layerKey ? 'bg-[#f95721] text-white font-bold' : 'text-[#3D332D] hover:bg-[#F7F4EE]'
                  }`}
                >
                  <span>{TILE_LAYERS[layerKey].name}</span>
                  {activeLayer === layerKey && <span className="text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recenter & Refresh button */}
        <button
          type="button"
          onClick={handleRecenter}
          className={`p-2.5 rounded-xl bg-white/95 hover:bg-[#F7F4EE] text-[#1a1412] border border-[#E0D7CC] shadow-md transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
            isRefreshing ? 'animate-spin text-[#f95721]' : ''
          }`}
          title="Recenter and Reload Map Canvas"
        >
          <LocateFixed className="w-4 h-4 text-[#1a1412]" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl overflow-hidden bg-white/95 border border-[#E0D7CC] shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 text-[#1a1412] hover:bg-[#F7F4EE] border-b border-[#EAE3D9] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 text-[#1a1412] hover:bg-[#F7F4EE] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── BOTTOM OVERLAY: INTERACTIVE SELECTED / HOVERED CAR PREVIEW CARD ── */}
      {activePreviewCar && (
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-[500] transition-all duration-300">
          <div className="bg-white/98 border border-[#E0D7CC] rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-lg flex items-center justify-between gap-3 text-[#1a1412]">
            <div 
              onClick={() => {
                if (onSelectCarRef.current) {
                  onSelectCarRef.current(activePreviewCar);
                }
              }}
              className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-[#F7F4EE] border border-[#EAE3D9]">
                <img 
                  src={activePreviewCar.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'} 
                  alt={activePreviewCar.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
              </div>

              {/* Specs and Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif-display font-bold text-sm sm:text-base text-[#1a1412] truncate group-hover:text-[#f95721] transition-colors">
                    {activePreviewCar.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold shrink-0">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{activePreviewCar.rating > 0 ? activePreviewCar.rating.toFixed(1) : '5.0'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#6B5E55] truncate">
                  <span className="capitalize">{activePreviewCar.transmission}</span>
                  <span>·</span>
                  <span>{activePreviewCar.seats} Seats</span>
                  <span>·</span>
                  <span className="text-[#3D332D] font-medium">{activePreviewCar.agency?.name || 'Verified Agency'}</span>
                  <span>·</span>
                  <span className="text-[#f95721] font-semibold">{activePreviewCar.city || activePreviewCar.location}</span>
                </div>

                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-extrabold text-sm sm:text-base text-[#f95721]">
                    {activePreviewCar.dailyRate.toFixed(0)} DH
                  </span>
                  <span className="text-[10px] text-[#8C7E74]">/ day</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onSelectCarRef.current) {
                    onSelectCarRef.current(activePreviewCar);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
              >
                <span>View &amp; Book</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setActivePreviewCar(null)}
                className="p-2 rounded-xl hover:bg-[#F7F4EE] text-[#8C7E74] hover:text-[#1a1412] transition-colors cursor-pointer"
                title="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM OVERLAY: FULLSCREEN CAR CAROUSEL WHEN NOT INSPECTING SINGLE CAR ── */}
      {isFullscreen && cars.length > 0 && !activePreviewCar && (
        <div className="absolute bottom-4 left-4 right-4 z-[500]">
          <div className="max-w-4xl mx-auto overflow-x-auto pb-2 scrollbar-none flex items-center gap-2.5 px-2">
            {cars.map((car) => {
              const isSel = selectedCarId === car.id;
              return (
                <div
                  key={car.id}
                  onClick={() => {
                    setActivePreviewCar(car);
                    if (onSelectCarRef.current) {
                      onSelectCarRef.current(car);
                    }
                    if (car.coordinates?.lat && car.coordinates?.lng && mapInstanceRef.current) {
                      mapInstanceRef.current.panTo([car.coordinates.lat, car.coordinates.lng], { animate: true, duration: 0.6 });
                    }
                  }}
                  className={`shrink-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center gap-3 ${
                    isSel ? 'border-[#f95721] ring-2 ring-[#f95721]/30' : 'border-[#E0D7CC]'
                  }`}
                >
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0">
                    <img 
                      src={car.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'} 
                      alt={car.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif-display font-bold text-xs text-[#1a1412] truncate">{car.name}</div>
                    <div className="text-[10px] text-[#6B5E55] truncate">{car.city || car.location} · {car.transmission}</div>
                    <div className="font-extrabold text-xs text-[#f95721]">{car.dailyRate.toFixed(0)} DH <span className="text-[9px] font-normal text-[#8C7E74]">/day</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── NOTICE PILL IF 0 CARS CURRENTLY MATCH FILTERS ── */}
      {cars.length === 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[500] max-w-sm w-[90%] bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E0D7CC] shadow-xl text-center text-[#1a1412]">
          <Car className="w-8 h-8 text-[#f95721] mx-auto mb-1.5" />
          <p className="font-serif-display font-bold text-sm text-[#1a1412]">No cars pinned for "{city}" with current filter</p>
          <p className="text-[11px] text-[#6B5E55] mt-1">
            Try switching location to All Morocco or resetting price/transmission filters.
          </p>
          <button
            type="button"
            onClick={() => handleJumpToCity('All Morocco')}
            className="mt-2.5 px-4 py-1.5 rounded-full bg-[#1a1412] hover:bg-[#f95721] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Show All Morocco Fleet
          </button>
        </div>
      )}
    </div>
  );
};
