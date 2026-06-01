import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Search, Navigation, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { cn } from '../lib/utils';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center?: [number, number];
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    description: string;
    imageUrl?: string;
    category?: string;
    status?: string;
  }>;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectable?: boolean;
  showHeatmap?: boolean;
  onMarkerSelect?: (id: string) => void;
  onViewUpdates?: (id: string) => void;
  selectedMarkerId?: string;
}

const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842]; // Manila default

const iconCache: Record<string, any> = {};

const getCustomIcon = (status: string, isSelected: boolean) => {
  const cacheKey = `${status}-${isSelected ? 'selected' : 'normal'}`;
  if (iconCache[cacheKey]) {
    return iconCache[cacheKey];
  }

  let color = '#ef4444'; // default pending red
  if (status === 'resolved' || status === 'verified') {
    color = '#10b981'; // green
  } else if (status === 'in-progress') {
    color = '#f97316'; // orange
  }

  const size = isSelected ? 36 : 32;
  const pinSize = isSelected ? 36 : 32;
  const innerSize = isSelected ? 12 : 10;
  const innerOffset = isSelected ? 12 : 11;
  const borderStyle = isSelected ? '3px solid #ffffff' : '2px solid #ffffff';
  const shadowStyle = isSelected ? '0 6px 12px rgba(0,0,0,0.45)' : '0 4px 6px rgba(0,0,0,0.3)';

  const pulseHtml = isSelected ? `
    <div style="
      position: absolute;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${color};
      opacity: 0.25;
      animation: pin-pulse 1.8s infinite ease-out;
      top: -10px;
      left: -10px;
      pointer-events: none;
    "></div>
  ` : '';

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px;">
      ${pulseHtml}
      <div style="
        position: absolute;
        width: ${pinSize}px;
        height: ${pinSize}px;
        border-radius: 50% 50% 50% 0;
        background: ${color};
        transform: rotate(-135deg);
        box-shadow: ${shadowStyle};
        border: ${borderStyle};
        transition: all 0.2s ease-in-out;
      "></div>
      <div style="
        position: absolute;
        width: ${innerSize}px;
        height: ${innerSize}px;
        border-radius: 50%;
        background: #ffffff;
        top: ${innerOffset}px;
        left: ${innerOffset}px;
      "></div>
    </div>
  `;

  const icon = L.divIcon({
    html,
    className: `custom-div-icon${isSelected ? ' selected-marker' : ''}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });

  iconCache[cacheKey] = icon;
  return icon;
};

const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  const lat = center[0];
  const lng = center[1];

  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
};

const MapEvents = ({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const MarkerWithPopup = ({ 
  marker, 
  customIcon, 
  isSelected, 
  onMarkerSelect, 
  onViewUpdates 
}: { 
  marker: any; 
  customIcon: any; 
  isSelected: boolean; 
  onMarkerSelect?: (id: string) => void; 
  onViewUpdates?: (id: string) => void; 
  key?: any;
}) => {
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      const timer = setTimeout(() => {
        markerRef.current.openPopup();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);

  return (
    <Marker 
      ref={markerRef}
      position={[marker.lat, marker.lng]} 
      icon={customIcon}
      eventHandlers={{
        click: () => {
          if (onMarkerSelect) onMarkerSelect(marker.id);
        }
      }}
    >
      <Popup className="custom-popup">
        <div className="p-3 min-w-[200px] text-slate-800">
          {marker.imageUrl && (
            <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 shadow-sm border border-slate-100">
              <img src={marker.imageUrl} alt={marker.title} className="w-full h-full object-cover" />
              <span className={cn(
                "absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase text-white shadow-sm",
                marker.status === 'resolved' || marker.status === 'verified' ? "bg-emerald-500" :
                marker.status === 'in-progress' ? "bg-orange-500" : "bg-red-500"
              )}>
                {marker.status || 'pending'}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-[9px] font-bold bg-secondary text-primary px-1.5 py-0.5 rounded uppercase">
              {marker.category || 'waste'}
            </span>
          </div>
          <h3 className="font-bold text-sm text-[#064e3b] tracking-tight">{marker.title}</h3>
          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">{marker.description}</p>
          
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewUpdates) {
                onViewUpdates(marker.id);
              } else if (onMarkerSelect) {
                onMarkerSelect(marker.id);
              }
            }}
            className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-3 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>💬 View Pin Updates</span>
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

const Map: React.FC<MapProps> = ({ 
  center = DEFAULT_CENTER,
  markers = [],
  onLocationSelect,
  selectable = false,
  showHeatmap: initialShowHeatmap = false,
  onMarkerSelect,
  onViewUpdates,
  selectedMarkerId
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeatmapOn, setIsHeatmapOn] = useState(initialShowHeatmap);

  const centerLat = center?.[0];
  const centerLng = center?.[1];

  useEffect(() => {
    if (centerLat !== undefined && centerLng !== undefined) {
      setMapCenter([centerLat, centerLng]);
      // Use wider zoom on initial/default Manila, tighter zoom on real spots
      if (centerLat === DEFAULT_CENTER[0] && centerLng === DEFAULT_CENTER[1]) {
        setMapZoom(13);
      } else {
        setMapZoom(15);
      }
    }
  }, [centerLat, centerLng]);

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
          if (selectable) {
            setSelectedLocation([latitude, longitude]);
            if (onLocationSelect) onLocationSelect(latitude, longitude);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // OpenStreetMap Nominatim API for geocoding
      // We append "Philippines" to narrow down results to the user's expected region
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Philippines")}`, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.5'
        }
      });
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        
        // Update both center and map view
        setMapCenter([newLat, newLng]);
        setMapZoom(15);
        
        // Extract a clean name (e.g., "Sampaloc" instead of the full address)
        const parts = display_name.split(',');
        const cleanName = parts[0];
        setSearchQuery(cleanName);
        
        if (selectable) {
          setSelectedLocation([newLat, newLng]);
          if (onLocationSelect) onLocationSelect(newLat, newLng);
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSearch();
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner bg-slate-100 border border-slate-200">
      <style>{`
        @keyframes pin-pulse {
          0% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 1rem;
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {isHeatmapOn ? (
          markers.map((marker) => (
            <Circle
              key={`heat-${marker.id}`}
              center={[marker.lat, marker.lng]}
              pathOptions={{
                fillColor: '#ef4444',
                color: '#ef4444',
                fillOpacity: 0.2,
                weight: 0
              }}
              radius={300}
            />
          ))
        ) : (
          markers.map((marker) => {
            const isSelected = selectedMarkerId === marker.id;
            const customIcon = getCustomIcon(marker.status || 'pending', isSelected);

            return (
              <MarkerWithPopup
                key={marker.id}
                marker={marker}
                customIcon={customIcon}
                isSelected={isSelected}
                onMarkerSelect={onMarkerSelect}
                onViewUpdates={onViewUpdates}
              />
            );
          })
        )}

        {selectedLocation && selectable && (
          <Marker position={selectedLocation} />
        )}

        {selectable && <MapEvents onLocationSelect={(lat, lng) => {
          setSelectedLocation([lat, lng]);
          onLocationSelect?.(lat, lng);
        }} />}
      </MapContainer>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col space-y-2 pointer-events-none">
        <div className="flex space-x-2 pointer-events-auto">
          <div className="flex-1 flex overflow-hidden rounded-lg shadow-lg border border-slate-200 bg-white">
            <input 
              type="text" 
              placeholder="Search specific location..." 
              className="flex-1 px-4 py-2 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              type="button" 
              onClick={handleSearch}
              className="bg-primary text-white p-2 hover:bg-primary/90 transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
          
          <button 
            onClick={handleLocateUser}
            className="bg-white p-2 rounded-lg shadow-lg border border-slate-200 text-primary hover:bg-slate-50 transition-colors pointer-events-auto"
            title="Use current location"
          >
            <Navigation size={20} />
          </button>

          <button 
            onClick={() => setIsHeatmapOn(!isHeatmapOn)}
            className={cn(
              "p-2 rounded-lg shadow-lg border transition-colors pointer-events-auto",
              isHeatmapOn 
                ? "bg-red-600 border-red-700 text-white" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
            title="Toggle Heatmap"
          >
            <Layers size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;
