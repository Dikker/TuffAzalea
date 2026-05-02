import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
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
  }>;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectable?: boolean;
  showHeatmap?: boolean;
}

const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
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

const Map: React.FC<MapProps> = ({ 
  center = [14.5995, 120.9842], // Manila default
  markers = [],
  onLocationSelect,
  selectable = false,
  showHeatmap: initialShowHeatmap = false
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeatmapOn, setIsHeatmapOn] = useState(initialShowHeatmap);

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      // OpenStreetMap Nominatim API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Philippines")}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        setMapCenter([newLat, newLng]);
        if (selectable) {
          setSelectedLocation([newLat, newLng]);
          if (onLocationSelect) onLocationSelect(newLat, newLng);
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner bg-slate-100 border border-slate-200">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
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
          markers.map((marker) => (
            <Marker key={marker.id} position={[marker.lat, marker.lng]}>
              <Popup className="custom-popup">
                <div className="p-1 min-w-[150px]">
                  {marker.imageUrl && (
                    <img src={marker.imageUrl} alt={marker.title} className="w-full h-24 object-cover rounded mb-2 shadow-sm" />
                  )}
                  <h3 className="font-bold text-sm text-primary">{marker.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{marker.description}</p>
                </div>
              </Popup>
            </Marker>
          ))
        )}

        {selectedLocation && selectable && (
          <Marker position={selectedLocation} />
        )}

        {selectable && <MapEvents onLocationSelect={(lat, lng) => {
          setSelectedLocation([lat, lng]);
          onLocationSelect?.(lat, lng);
        }} />}
        
        <ChangeView center={mapCenter} zoom={13} />
      </MapContainer>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col space-y-2 pointer-events-none">
        <div className="flex space-x-2 pointer-events-auto">
          <form onSubmit={handleSearch} className="flex-1 flex overflow-hidden rounded-lg shadow-lg border border-slate-200 bg-white">
            <input 
              type="text" 
              placeholder="Search specific location..." 
              className="flex-1 px-4 py-2 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-primary text-white p-2 hover:bg-primary/90 transition-colors">
              <Search size={18} />
            </button>
          </form>
          
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
