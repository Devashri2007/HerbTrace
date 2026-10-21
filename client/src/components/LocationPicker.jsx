import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Check, AlertCircle } from 'lucide-react';

const PRESET_REGIONS = [
  { name: 'Neemuch Herbal Belt, MP', lat: 24.4682, lng: 74.8698, district: 'Neemuch', state: 'Madhya Pradesh' },
  { name: 'Bhavani River Basin, Erode, TN', lat: 11.341, lng: 77.7172, district: 'Erode', state: 'Tamil Nadu' },
  { name: 'Shivalik Foothills, Haridwar, UK', lat: 29.9457, lng: 78.1642, district: 'Haridwar', state: 'Uttarakhand' },
  { name: 'Belha Devi Agro Belt, Pratapgarh, UP', lat: 25.9234, lng: 81.9983, district: 'Pratapgarh', state: 'Uttar Pradesh' },
  { name: 'Wayanad Western Ghats Reserve, KL', lat: 11.6854, lng: 76.132, district: 'Wayanad', state: 'Kerala' },
];

const LocationPicker = ({ location, setLocation }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [capturedMode, setCapturedMode] = useState('manual');

  const captureGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        setCapturedMode('gps');
        setLocation({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy || 5),
          locationName: location.locationName || 'Field Harvest GPS Coordinates',
          district: location.district || '',
          state: location.state || '',
        });
      },
      (err) => {
        setLoading(false);
        console.warn('Geolocation error:', err.message);
        setErrorMsg('Unable to retrieve GPS fix. You can select an Ayurvedic harvest region below or enter manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectPreset = (p) => {
    setCapturedMode('preset');
    setLocation({
      latitude: p.lat,
      longitude: p.lng,
      accuracy: 3.5,
      locationName: p.name,
      district: p.district,
      state: p.state,
    });
  };

  return (
    <div className="bg-botanical-50/70 border border-botanical-200 rounded-xl p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-botanical-700 text-white">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-botanical-950">Geo-Tagged Field Location</h4>
            <p className="text-[10px] text-botanical-600">
              Capture GPS coordinates directly from field device or choose harvest zone
            </p>
          </div>
        </div>

        {/* Capture GPS Button */}
        <button
          type="button"
          onClick={captureGPS}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-botanical-800 text-white text-xs font-semibold hover:bg-botanical-900 transition-colors shadow-sm disabled:opacity-50"
        >
          <Navigation className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Locating...' : 'Capture Current Location'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Coordinate Display & Manual Adjustment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-botanical-900 mb-1">
            Latitude (°N)
          </label>
          <input
            type="number"
            step="any"
            value={location.latitude || ''}
            onChange={(e) =>
              setLocation({ ...location, latitude: parseFloat(e.target.value) || 0 })
            }
            placeholder="e.g. 24.4682"
            className="w-full bg-white border border-botanical-200 rounded-lg px-3 py-1.5 text-xs text-botanical-950 font-mono focus:ring-2 focus:ring-botanical-600"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-botanical-900 mb-1">
            Longitude (°E)
          </label>
          <input
            type="number"
            step="any"
            value={location.longitude || ''}
            onChange={(e) =>
              setLocation({ ...location, longitude: parseFloat(e.target.value) || 0 })
            }
            placeholder="e.g. 74.8698"
            className="w-full bg-white border border-botanical-200 rounded-lg px-3 py-1.5 text-xs text-botanical-950 font-mono focus:ring-2 focus:ring-botanical-600"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-botanical-900 mb-1">
            Location / Forest Name
          </label>
          <input
            type="text"
            value={location.locationName || ''}
            onChange={(e) => setLocation({ ...location, locationName: e.target.value })}
            placeholder="e.g. Rampura Forest Division"
            className="w-full bg-white border border-botanical-200 rounded-lg px-3 py-1.5 text-xs text-botanical-950 focus:ring-2 focus:ring-botanical-600"
            required
          />
        </div>
      </div>

      {/* Preset Harvest Regions */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-botanical-600 block mb-1.5">
          Quick Preset Ayurvedic Harvesting Hubs:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_REGIONS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-botanical-200 text-botanical-800 hover:bg-botanical-100 hover:border-botanical-300 transition-colors flex items-center gap-1 font-medium"
            >
              <MapPin className="w-3 h-3 text-botanical-600" />
              <span>{p.name.split(',')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
