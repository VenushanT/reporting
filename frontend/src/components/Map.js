import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationMarker({ onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    },
  });

  return null;
}

function Map({ onLocationSelect, selectedLocation, modalOpen }) {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], 15);
    }
  }, [selectedLocation]);

  // Lower z-index of all Leaflet panes when modal is open
  useEffect(() => {
    const paneSelectors = [
      '.leaflet-container',
      '.leaflet-pane',
      '.leaflet-map-pane',
      '.leaflet-tile-pane',
      '.leaflet-marker-pane',
      '.leaflet-shadow-pane',
      '.leaflet-overlay-pane',
      '.leaflet-tooltip-pane',
      '.leaflet-popup-pane',
    ];
    if (modalOpen) {
      paneSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.dataset.prevZ = el.style.zIndex;
          el.style.zIndex = '1';
        });
      });
    } else {
      paneSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (el.dataset.prevZ !== undefined) {
            el.style.zIndex = el.dataset.prevZ;
            delete el.dataset.prevZ;
          } else {
            el.style.zIndex = '';
          }
        });
      });
    }
  }, [modalOpen]);

  const handleFindMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        onLocationSelect(location);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Please allow location access to use this feature');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An error occurred while getting your location');
        }
      }
    );
  };

  return (
    <div className="relative">
      <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-xl border border-gray-700">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker onLocationSelect={onLocationSelect} />
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
            />
          )}
        </MapContainer>
      </div>
      
      <button
        onClick={handleFindMyLocation}
        className="absolute top-4 right-4 bg-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 z-[1000] border border-gray-700 transition-colors"
      >
        Find My Location
      </button>

      {error && (
        <div className="absolute top-16 right-4 bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-lg shadow-lg text-sm z-[1000]">
          {error}
        </div>
      )}
    </div>
  );
}

export default Map; 