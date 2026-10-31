import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
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
  Fuel,
  Users,
  Minimize2
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
}

type MapLayerType = 'voyager' | 'dark' | 'satellite';

const MOROCCO_CITY_COORDINATES: Record<string, [number, number]> = {
  Tetouan: [35.5785, -5.3684],
  Casablanca: [33.5731, -7.5898],
  Marrakech: [31.6295, -7.9811],
  Tangier: [35.7595, -5.8340],
  Rabat: [34.0209, -6.8416],
  Agadir: [30.4278, -9.5981],
  Fes: [34.0181, -5.0078],
  Chefchaouen: [35.1714, -5.2696],
  Merzouga: [31.0993, -4.0116],
};

const TILE_LAYERS: Record<MapLayerType, { url: string; attribution: string; maxZoom: number; subdomains?: string }> = {
  voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20,
    subdomains: 'abcd'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20,
    subdomains: 'abcd'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  }
};

export const SearchMapView: React.FC<SearchMapViewProps> = ({
  cars,
  selectedCarId,
  hoveredCarId,
  onSelectCar,
  city,
  isFullscreenExternal,
  onToggleFullscreen
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [internalFullscreen, setInternalFullscreen] = useState<boolean>(false);
  const isFullscreen = isFullscreenExternal !== undefined ? isFullscreenExternal : internalFullscreen;

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('voyager');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [activePreviewCar, setActivePreviewCar] = useState<CarListing | null>(null);

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

  // Sync active preview car when selectedCarId or hoveredCarId changes
  useEffect(() => {
    const targetId = hoveredCarId || selectedCarId;
    if (targetId) {
      const found = cars.find((c) => c.id === targetId);
      if (found) {
        setActivePreviewCar(found);
      }
    }
  }, [hoveredCarId, selectedCarId, cars]);

  // Center coordinates helper
  const getCenterCoordinates = useCallback((): [number, number] => {
    if (cars.length > 0 && cars[0].coordinates?.lat && cars[0].coordinates?.lng) {
      return [cars[0].coordinates.lat, cars[0].coordinates.lng];
    }
    const matchedCityKey = Object.keys(MOROCCO_CITY_COORDINATES).find(
      (c) => c.toLowerCase() === city.toLowerCase()
    );
    if (matchedCityKey) {
      return MOROCCO_CITY_COORDINATES[matchedCityKey];
    }
    return [35.5785, -5.3684]; // Default Tetouan
  }, [cars, city]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Remove existing map if container already has one
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Clean any residual leaflet id from container
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const center = getCenterCoordinates();

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // Add minimal custom attribution
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    // Initial tile layer
    const config = TILE_LAYERS[activeLayer];
    const tileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abc'
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Handle container resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);

    // Initial size invalidation
    const timer1 = setTimeout(() => map.invalidateSize(), 150);
    const timer2 = setTimeout(() => map.invalidateSize(), 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [city, getCenterCoordinates]);

  // Switch Tile Layer on state change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const config = TILE_LAYERS[activeLayer];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abc'
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [activeLayer]);

  // Create Marker Icon helper
  const createMarkerIcon = useCallback((car: CarListing, isSelected: boolean, isHovered: boolean) => {
    const isSpecial = isSelected || isHovered;

    return L.divIcon({
      className: 'airbcar-custom-marker-wrapper',
      html: `
        <div class="relative cursor-pointer transition-transform duration-200 ${
          isSpecial ? 'scale-110 z-50' : 'scale-100 hover:scale-105'
        }">
          <div class="px-3 py-1.5 rounded-full font-bold text-xs tracking-tight shadow-md flex items-center gap-1.5 whitespace-nowrap transition-all border ${
            isSpecial
              ? 'bg-[#f95721] text-white border-white/60 ring-4 ring-[#f95721]/30 shadow-[#f95721]/40'
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
      iconSize: [88, 38],
      iconAnchor: [44, 38],
    });
  }, []);

  // Update Markers on cars or selection change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    (Object.values(markersRef.current) as L.Marker[]).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers
    cars.forEach((car) => {
      if (!car.coordinates?.lat || !car.coordinates?.lng) return;

      const isSelected = selectedCarId === car.id;
      const isHovered = hoveredCarId === car.id;

      const icon = createMarkerIcon(car, isSelected, isHovered);

      const marker = L.marker([car.coordinates.lat, car.coordinates.lng], {
        icon,
        zIndexOffset: isSelected || isHovered ? 1000 : 100
      }).addTo(map);

      marker.on('click', () => {
        setActivePreviewCar(car);
        onSelectCar(car);
        map.panTo([car.coordinates.lat, car.coordinates.lng], { animate: true, duration: 0.6 });
      });

      marker.on('mouseover', () => {
        setActivePreviewCar(car);
      });

      markersRef.current[car.id] = marker;
    });

    // Fit bounds if multiple cars exist
    if (cars.length > 1) {
      const validCars = cars.filter((c) => c.coordinates?.lat && c.coordinates?.lng);
      if (validCars.length > 0) {
        const bounds = L.latLngBounds(validCars.map((c) => [c.coordinates.lat, c.coordinates.lng]));
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14, animate: true });
      }
    } else if (cars.length === 1 && cars[0].coordinates) {
      map.setView([cars[0].coordinates.lat, cars[0].coordinates.lng], 14, { animate: true });
    }
  }, [cars, createMarkerIcon, onSelectCar]);

  // Update Marker icon states when selectedCarId or hoveredCarId updates
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
  }, [selectedCarId, hoveredCarId, cars, createMarkerIcon]);

  // Recenter / Fit All helper
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const validCars = cars.filter((c) => c.coordinates?.lat && c.coordinates?.lng);
    if (validCars.length > 0) {
      const bounds = L.latLngBounds(validCars.map((c) => [c.coordinates.lat, c.coordinates.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14, animate: true });
    } else {
      const center = getCenterCoordinates();
      map.setView(center, 13, { animate: true });
    }
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
    <div className={`relative transition-all duration-300 flex flex-col overflow-hidden ${
      isFullscreen 
        ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none border-none shadow-2xl bg-[#FAF7F2]' 
        : 'w-full h-[620px] lg:h-[calc(100vh-140px)] min-h-[520px] rounded-3xl overflow-hidden bg-[#FAF7F2] shadow-xl border border-[#EAE3D9]'
    }`}>
      {/* Fullscreen Top Header */}
      {isFullscreen && (
        <div className="bg-white/95 backdrop-blur-md border-b border-[#EAE3D9] px-4 sm:px-6 py-2.5 z-[1000] flex items-center justify-between gap-3 shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#f95721] text-white flex items-center justify-center text-xs font-bold">
              🚗
            </div>
            <span className="font-serif-display font-bold text-base text-[#1a1412]">
              Airbcar Fullscreen Map
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

      {/* Map DOM Canvas Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full min-h-[520px] flex-1 z-0 relative"
      />

      {/* ── TOP-LEFT: CITY BADGE (Non-fullscreen mode) ── */}
      {!isFullscreen && (
        <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-white/95 text-[#1a1412] text-xs font-semibold shadow-md flex items-center gap-2 border border-[#E0D7CC] backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-[#f95721]" />
            <span className="font-bold">{city || 'Morocco'}</span>
            <span className="text-neutral-400">·</span>
            <span className="text-[#f95721] font-mono text-[11px] font-bold">{cars.length} cars</span>
          </div>
        </div>
      )}

      {/* ── TOP-RIGHT: CONTROLS (ZOOM, RECENTER, LAYER TOGGLE) ── */}
      <div className={`absolute right-4 z-[1000] flex flex-col items-end gap-2 ${isFullscreen ? 'top-16' : 'top-4'}`}>
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
            <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-[#E0D7CC] shadow-2xl p-1.5 flex flex-col gap-1 text-xs">
              <button
                type="button"
                onClick={() => { setActiveLayer('voyager'); setShowLayerMenu(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                  activeLayer === 'voyager' ? 'bg-[#f95721] text-white font-bold' : 'text-[#3D332D] hover:bg-[#F7F4EE]'
                }`}
              >
                <span>Street View</span>
                {activeLayer === 'voyager' && <span className="text-[10px]">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => { setActiveLayer('dark'); setShowLayerMenu(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                  activeLayer === 'dark' ? 'bg-[#f95721] text-white font-bold' : 'text-[#3D332D] hover:bg-[#F7F4EE]'
                }`}
              >
                <span>Night Map</span>
                {activeLayer === 'dark' && <span className="text-[10px]">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => { setActiveLayer('satellite'); setShowLayerMenu(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                  activeLayer === 'satellite' ? 'bg-[#f95721] text-white font-bold' : 'text-[#3D332D] hover:bg-[#F7F4EE]'
                }`}
              >
                <span>Satellite</span>
                {activeLayer === 'satellite' && <span className="text-[10px]">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Recenter button */}
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2.5 rounded-xl bg-white/95 hover:bg-[#F7F4EE] text-[#1a1412] border border-[#E0D7CC] shadow-md transition-all cursor-pointer backdrop-blur-md"
          title="Recenter Map"
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
        <div className="absolute bottom-4 left-4 right-4 z-[1000] transition-all duration-300">
          <div className="bg-white/98 border border-[#E0D7CC] rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-lg flex items-center justify-between gap-3 text-[#1a1412]">
            <div 
              onClick={() => onSelectCar(activePreviewCar)}
              className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-[#F7F4EE] border border-[#EAE3D9]">
                <img 
                  src={activePreviewCar.images[0]} 
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
                    <span>{activePreviewCar.rating > 0 ? activePreviewCar.rating.toFixed(1) : 'New'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6B5E55] truncate">
                  <span className="capitalize">{activePreviewCar.transmission}</span>
                  <span>·</span>
                  <span>{activePreviewCar.seats} Seats</span>
                  <span>·</span>
                  <span className="text-[#3D332D] font-medium">{activePreviewCar.agency?.name || 'Partner Agency'}</span>
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
                onClick={() => onSelectCar(activePreviewCar)}
                className="px-3.5 py-2 rounded-xl bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
              >
                <span>View</span>
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
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <div className="max-w-4xl mx-auto overflow-x-auto pb-2 scrollbar-none flex items-center gap-2.5 px-2">
            {cars.map((car) => {
              const isSel = selectedCarId === car.id;
              return (
                <div
                  key={car.id}
                  onClick={() => {
                    setActivePreviewCar(car);
                    onSelectCar(car);
                    if (car.coordinates?.lat && car.coordinates?.lng && mapInstanceRef.current) {
                      mapInstanceRef.current.panTo([car.coordinates.lat, car.coordinates.lng], { animate: true, duration: 0.6 });
                    }
                  }}
                  className={`shrink-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center gap-3 ${
                    isSel ? 'border-[#f95721] ring-2 ring-[#f95721]/30' : 'border-[#E0D7CC]'
                  }`}
                >
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0">
                    <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif-display font-bold text-xs text-[#1a1412] truncate">{car.name}</div>
                    <div className="text-[10px] text-[#6B5E55] truncate">{car.location} · {car.transmission}</div>
                    <div className="font-extrabold text-xs text-[#f95721]">{car.dailyRate.toFixed(0)} DH <span className="text-[9px] font-normal text-[#8C7E74]">/day</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── EMPTY STATE FALLBACK IF NO CARS ── */}
      {cars.length === 0 && (
        <div className="absolute inset-0 z-[900] bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-[#1a1412]">
          <Car className="w-10 h-10 text-[#f95721] mb-2 animate-bounce" />
          <p className="font-serif-display font-bold text-base text-[#1a1412]">No cars located on map for this filter</p>
          <p className="text-xs text-[#6B5E55] mt-1 max-w-xs">
            Reset search filters or switch city location to view available fleet pins.
          </p>
        </div>
      )}
    </div>
  );
};
