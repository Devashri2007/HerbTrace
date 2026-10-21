import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Custom Botanical Leaf Marker Icon
const createBotanicalPinIcon = () => {
  return L.divIcon({
    className: 'custom-botanical-pin',
    html: `
      <div style="
        background: #166534;
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          transform: rotate(45deg);
          color: #ffffff;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">🌿</div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

const MapViewer = ({
  latitude = 24.4682,
  longitude = 74.8698,
  accuracy = 5,
  locationName = 'Harvest Zone, Neemuch, MP',
  botanicalName = 'Withania somnifera',
  commonName = 'Ashwagandha',
  batchId = 'HT-2026-000001',
  height = '320px',
}) => {
  const position = [Number(latitude) || 24.4682, Number(longitude) || 74.8698];
  const pinIcon = createBotanicalPinIcon();

  return (
    <div className="rounded-xl overflow-hidden border border-botanical-200 shadow-sm relative z-0">
      <div
        style={{ height }}
        className="w-full relative"
      >
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={pinIcon}>
            <Popup>
              <div className="p-1 space-y-1 text-xs">
                <div className="font-bold text-botanical-950">{commonName}</div>
                <div className="italic text-gray-500 text-[11px]">{botanicalName}</div>
                <div className="font-semibold text-botanical-700">{locationName}</div>
                <div className="font-mono text-[10px] text-gray-400">Batch: {batchId}</div>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={position}
            radius={Math.max(accuracy * 20, 150)}
            pathOptions={{
              color: '#166534',
              fillColor: '#22c55e',
              fillOpacity: 0.15,
              weight: 1.5,
            }}
          />
        </MapContainer>

        {/* Floating Geo Overlay Card */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md rounded-lg p-2.5 shadow-md border border-botanical-200 text-xs z-[1000] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-botanical-100 text-botanical-800">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-botanical-950 truncate max-w-[170px]">{locationName}</div>
              <div className="text-[10px] font-mono text-gray-500">
                {position[0].toFixed(4)}° N, {position[1].toFixed(4)}° E (±{accuracy}m)
              </div>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            GPS Locked
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;
