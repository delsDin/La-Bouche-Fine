import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from 'react-leaflet';
import { X, MapPin, Crosshair } from 'lucide-react';
import L from 'leaflet';
import { useAppContext } from '../lib/AppContext';

// Fix for default marker icon in React-Leaflet
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationMarker = ({ position, setPosition }: { position: any, setPosition: any }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose, onConfirm, initialLocation }) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  // Default to Cotonou, Benin if no initial location
  const defaultCenter = { lat: 6.36536, lng: 2.41833 };
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(initialLocation || null);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && initialLocation) {
      setPosition(initialLocation);
    }
  }, [isOpen, initialLocation]);

  if (!isOpen) return null;

  const handleLocateMe = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(newPos);
        if (mapRef.current) {
          mapRef.current.flyTo(newPos, 16);
        }
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert("Impossible d'obtenir votre position. Veuillez vérifier vos permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleConfirm = () => {
    if (position) {
      onConfirm(position);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[80vh] transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`flex justify-between items-center p-4 border-b transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
          <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <MapPin size={20} className="text-amber-600" />
            Choisir sur la carte
          </h3>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <X size={20} />
          </button>
        </div>
        
        <div className={`flex-1 relative transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <MapContainer 
            center={position || defaultCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            zoomControl={false}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Plan (Standard)">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url={isDark 
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  attribution='&copy; <a href="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">Esri</a>'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>

          <button 
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`absolute bottom-4 right-4 z-[400] p-3 rounded-full shadow-lg transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:text-amber-500' : 'bg-white text-gray-700 hover:text-amber-600'}`}
            title="Ma position"
          >
            <Crosshair size={24} className={isLocating ? "animate-spin text-amber-600" : ""} />
          </button>
          
          {!position && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-[400] backdrop-blur px-4 py-2 rounded-full shadow-md text-sm font-medium pointer-events-none transition-colors duration-300 ${isDark ? 'bg-gray-800/90 text-gray-300' : 'bg-white/90 text-gray-700'}`}>
              Touchez la carte pour placer un repère
            </div>
          )}
        </div>

        <div className={`p-4 border-t transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <button 
            onClick={handleConfirm}
            disabled={!position}
            className="w-full bg-amber-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-amber-700 transition-colors"
          >
            Confirmer cette position
          </button>
        </div>
      </div>
    </div>
  );
};
