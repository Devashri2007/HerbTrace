import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LocationPicker from '../../components/LocationPicker';
import BotanicalValidatorWidget from '../../components/BotanicalValidatorWidget';
import EvidenceTimeLockCard from '../../components/EvidenceTimeLockCard';
import MapViewer from '../../components/MapViewer';
import BlockchainBadge from '../../components/BlockchainBadge';
import {
  Sprout,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Lock,
  Upload,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const HERB_PRESETS = [
  { bot: 'Withania somnifera', com: 'Ashwagandha', fam: 'Solanaceae', part: 'Root' },
  { bot: 'Curcuma longa', com: 'Turmeric', fam: 'Zingiberaceae', part: 'Rhizome' },
  { bot: 'Ocimum sanctum', com: 'Tulsi', fam: 'Lamiaceae', part: 'Leaves' },
  { bot: 'Phyllanthus emblica', com: 'Amla', fam: 'Phyllanthaceae', part: 'Fruit' },
  { bot: 'Azadirachta indica', com: 'Neem', fam: 'Meliaceae', part: 'Leaves' },
  { bot: 'Tinospora cordifolia', com: 'Giloy', fam: 'Menispermaceae', part: 'Stem' },
];

const FarmerDashboard = ({ activeTab = 'dashboard' }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  // New Batch Form State
  const [formData, setFormData] = useState({
    botanicalName: 'Withania somnifera',
    commonName: 'Ashwagandha',
    plantFamily: 'Solanaceae',
    plantPart: 'Root',
    variety: 'Nagori Standard Harvest',
    collectionMethod: 'Certified Organic Harvest',
    description: 'Fresh winter root harvest, washed and shade pre-dried.',
    quantity: '50',
    unit: 'kg',
    collectionDate: new Date().toISOString().split('T')[0],
    collectionTime: '08:30 AM',
    initialEvidenceUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    initialEvidenceTitle: 'Field Harvest & Rhizosphere Photo',
  });

  const [location, setLocation] = useState({
    latitude: 24.4682,
    longitude: 74.8698,
    accuracy: 4.5,
    locationName: 'Neemuch Herbal Cultivation Belt, MP',
    district: 'Neemuch',
    state: 'Madhya Pradesh',
  });

  // Live validation preview state
  const [liveValidation, setLiveValidation] = useState(null);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/batches');
      setBatches(res.data.batches);
    } catch (err) {
      console.error('Failed to load batches:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Update live botanical validation preview when herb inputs change
  useEffect(() => {
    const runValidation = async () => {
      try {
        const res = await api.post('/botanical/validate', {
          botanicalName: formData.botanicalName,
          commonName: formData.commonName,
          plantFamily: formData.plantFamily,
          plantPart: formData.plantPart,
          variety: formData.variety,
        });
        setLiveValidation(res.data.result);
      } catch (_) {}
    };

    const timer = setTimeout(runValidation, 300);
    return () => clearTimeout(timer);
  }, [formData.botanicalName, formData.commonName, formData.plantFamily, formData.plantPart]);

  const handleHerbPreset = (herb) => {
    setFormData((prev) => ({
      ...prev,
      botanicalName: herb.bot,
      commonName: herb.com,
      plantFamily: herb.fam,
      plantPart: herb.part,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessNotice(null);

    try {
      const payload = {
        ...formData,
        collectionLocation: location,
      };

      const res = await api.post('/batches', payload);
      setSuccessNotice({
        batchId: res.data.batch.batchId,
        message: res.data.message,
        txHash: res.data.blockchain?.txHash,
        status: res.data.batch.status,
      });

      fetchBatches();
    } catch (err) {
      alert(err.message || 'Failed to submit batch');
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics
  const totalBatches = batches.length;
  const pendingBatches = batches.filter((b) => b.status === 'SUBMITTED' || b.status === 'QUALITY_PENDING').length;
  const approvedBatches = batches.filter((b) => b.status === 'APPROVED' || b.status === 'PROCESSING' || b.status === 'FORMULATION_USED').length;
  const rejectedBatches = batches.filter((b) => b.status === 'REJECTED').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Farmer & Wild Collector Portal
          </span>
          <h1 className="text-2xl font-serif font-bold text-botanical-950 mt-1">
            Botanical Harvest Workspace
          </h1>
        </div>

        <button
          onClick={fetchBatches}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-botanical-200 hover:bg-botanical-50 text-botanical-800 rounded-xl text-xs font-semibold shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-gray-500 block">Total Collected</span>
          <span className="text-2xl font-bold font-serif text-botanical-950">{totalBatches}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-amber-600 block">Pending Inspection</span>
          <span className="text-2xl font-bold font-serif text-amber-700">{pendingBatches}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-emerald-600 block">Quality Approved</span>
          <span className="text-2xl font-bold font-serif text-emerald-700">{approvedBatches}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-rose-600 block">Rejected Lots</span>
          <span className="text-2xl font-bold font-serif text-rose-700">{rejectedBatches}</span>
        </div>
      </div>

      {/* Register Batch Tab or Section */}
      {(activeTab === 'register' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-botanical-700" />
              <span>Register New Botanical Herb Batch</span>
            </h3>
            <p className="text-xs text-botanical-600">
              Captures botanical taxonomy, GPS coordinates, evidence hash, and anchors batch to the blockchain.
            </p>
          </div>

          {/* Success Notice Modal / Card */}
          {successNotice && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Herb Batch Successfully Registered & Anchored!</span>
              </div>
              <p className="text-xs text-emerald-800">
                Batch ID: <strong className="font-mono">{successNotice.batchId}</strong> has been saved and submitted to quality inspectors.
              </p>
              {successNotice.txHash && (
                <div className="font-mono text-[11px] text-emerald-700 break-all bg-emerald-100/60 p-2 rounded">
                  Blockchain Tx: {successNotice.txHash}
                </div>
              )}
            </div>
          )}

          {/* Quick Herb Fill Presets */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-botanical-500 block mb-2">
              Quick Autofill Popular Ayurvedic Herbs:
            </span>
            <div className="flex flex-wrap gap-2">
              {HERB_PRESETS.map((h, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleHerbPreset(h)}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-botanical-50 border border-botanical-200 text-botanical-800 hover:bg-botanical-100"
                >
                  🌿 {h.com} ({h.part})
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmitBatch} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Botanical Name *
                </label>
                <input
                  type="text"
                  name="botanicalName"
                  value={formData.botanicalName}
                  onChange={handleFormChange}
                  placeholder="Withania somnifera"
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Common / Local Name *
                </label>
                <input
                  type="text"
                  name="commonName"
                  value={formData.commonName}
                  onChange={handleFormChange}
                  placeholder="Ashwagandha"
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Plant Family *
                </label>
                <input
                  type="text"
                  name="plantFamily"
                  value={formData.plantFamily}
                  onChange={handleFormChange}
                  placeholder="Solanaceae"
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Plant Part Collected *
                </label>
                <select
                  name="plantPart"
                  value={formData.plantPart}
                  onChange={handleFormChange}
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  required
                >
                  <option value="Root">Root</option>
                  <option value="Rhizome">Rhizome</option>
                  <option value="Leaves">Leaves</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Stem">Stem</option>
                  <option value="Stem Bark">Stem Bark</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Whole plant">Whole plant</option>
                  <option value="Oleo-gum resin (Exudate)">Oleo-gum resin</option>
                  <option value="Root Tuber">Root Tuber</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Quantity Collected *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleFormChange}
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="g">g</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Collection Method
                </label>
                <select
                  name="collectionMethod"
                  value={formData.collectionMethod}
                  onChange={handleFormChange}
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  <option value="Certified Organic Harvest">Certified Organic Harvest</option>
                  <option value="Wild Hand-Picked">Wild Hand-Picked</option>
                  <option value="Regulated Forestry Collection">Regulated Forestry Collection</option>
                  <option value="Cooperative Farm Harvest">Cooperative Farm Harvest</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Harvest Date
                </label>
                <input
                  type="date"
                  name="collectionDate"
                  value={formData.collectionDate}
                  onChange={handleFormChange}
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-medium"
                  required
                />
              </div>
            </div>

            {/* 🌱 Core Feature 1: Live Botanical Consistency Validator Widget */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-botanical-600 block mb-2">
                Real-Time Botanical Consistency Check:
              </span>
              <BotanicalValidatorWidget validation={liveValidation} compact={false} />
            </div>

            {/* Geo Location Component */}
            <LocationPicker location={location} setLocation={setLocation} />

            {/* Field Photo / Evidence Input */}
            <div className="bg-botanical-50/70 border border-botanical-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-botanical-700" />
                <h4 className="text-xs font-bold text-botanical-950">Field Evidence Photo & Time Lock</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Photo URL (Unsplash or Field Storage)
                  </label>
                  <input
                    type="url"
                    name="initialEvidenceUrl"
                    value={formData.initialEvidenceUrl}
                    onChange={handleFormChange}
                    className="w-full bg-white border border-botanical-200 rounded-lg px-3 py-1.5 text-xs font-mono"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Evidence Title
                  </label>
                  <input
                    type="text"
                    name="initialEvidenceTitle"
                    value={formData.initialEvidenceTitle}
                    onChange={handleFormChange}
                    className="w-full bg-white border border-botanical-200 rounded-lg px-3 py-1.5 text-xs"
                    placeholder="Field Harvest Photo"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-botanical-700 hover:bg-botanical-800 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Registering on Blockchain...' : 'Submit Herb Batch & Seal on Blockchain'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* My Batches Tab */}
      {(activeTab === 'batches' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-botanical-700" />
              <span>My Registered Batches ({batches.length})</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-botanical-50 text-botanical-900 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l-lg">Batch ID</th>
                  <th className="p-3">Herb & Part</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Harvest Location</th>
                  <th className="p-3">Validator Status</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right rounded-r-lg">On-Chain Tx</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batches.map((b) => (
                  <tr key={b.batchId} className="hover:bg-botanical-50/40">
                    <td className="p-3 font-mono font-bold text-botanical-700">{b.batchId}</td>
                    <td className="p-3">
                      <div className="font-bold text-botanical-950">{b.commonName}</div>
                      <div className="text-[11px] text-gray-500 italic">{b.botanicalName} • {b.plantPart}</div>
                    </td>
                    <td className="p-3 font-semibold">{b.quantity} {b.unit}</td>
                    <td className="p-3 text-gray-600">{b.collectionLocation?.locationName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.consistencyValidation?.validatorStatus === 'Consistent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.consistencyValidation?.validatorStatus || 'Consistent'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'APPROVED' || b.status === 'PROCESSING' || b.status === 'FORMULATION_USED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-[11px] text-emerald-700">
                      {b.blockchainRecord?.transactionHash ? `${b.blockchainRecord.transactionHash.slice(0, 10)}...` : '0x...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collection Map Tab */}
      {activeTab === 'map' && (
        <div className="bg-white rounded-2xl border border-botanical-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-botanical-950">
            Field Harvest Locations Map
          </h3>
          <MapViewer
            latitude={location.latitude}
            longitude={location.longitude}
            locationName={location.locationName}
            height="400px"
          />
        </div>
      )}

      {/* Evidence Tab */}
      {activeTab === 'evidence' && (
        <div className="bg-white rounded-2xl border border-botanical-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
            <Lock className="w-5 h-5 text-botanical-700" />
            <span>Field Evidence-Time Locks</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map((b) =>
              b.evidenceLock ? (
                <div key={b.batchId} className="p-4 bg-botanical-50/60 rounded-xl border border-botanical-200 text-xs space-y-2 font-mono">
                  <div className="flex justify-between items-center font-sans">
                    <span className="font-bold text-botanical-900">{b.commonName}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">🔒 LOCKED</span>
                  </div>
                  <div>Evidence ID: <strong>{b.evidenceLock.evidenceId}</strong></div>
                  <div className="text-[10px] text-gray-500 break-all">SHA-256: {b.evidenceLock.sha256Hash}</div>
                  <div className="text-[10px] text-gray-400 font-sans">Locked: {new Date(b.evidenceLock.lockedAt || Date.now()).toLocaleString()}</div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
