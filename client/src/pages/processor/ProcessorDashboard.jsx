import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import BlockchainBadge from '../../components/BlockchainBadge';
import {
  Workflow,
  Clock,
  PlusCircle,
  Sprout,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  MapPin,
} from 'lucide-react';

const STAGES = [
  'Cleaning',
  'Sorting',
  'Drying',
  'Grinding',
  'Extraction',
  'Storage',
  'Packaging preparation',
];

const ProcessorDashboard = ({ activeTab = 'dashboard' }) => {
  const [batches, setBatches] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState('');

  // Processing Stage Form
  const [stageForm, setStageForm] = useState({
    batchId: '',
    stage: 'Drying',
    method: 'Controlled solar tunnel dehumidification below 42°C',
    description: 'Dehydration under indirect sunlight to preserve active marker compounds.',
    quantityBefore: 100,
    quantityAfter: 88,
    unit: 'kg',
    location: 'Haridwar Herbal Processing Complex, Unit 3',
    evidenceUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchesRes, histRes] = await Promise.all([
        api.get('/processing/ready'),
        api.get('/batches'),
      ]);

      setBatches(batchesRes.data.batches);
      if (batchesRes.data.batches.length > 0 && !stageForm.batchId) {
        setStageForm((prev) => ({
          ...prev,
          batchId: batchesRes.data.batches[0].batchId,
          quantityBefore: batchesRes.data.batches[0].quantity,
          quantityAfter: Math.round(batchesRes.data.batches[0].quantity * 0.88),
        }));
      }

      // Load processing history for all batches
      const allHist = [];
      for (const b of batchesRes.data.batches) {
        try {
          const hRes = await api.get(`/processing/${b.batchId}`);
          allHist.push(...hRes.data.history);
        } catch (_) {}
      }
      setHistory(allHist);
    } catch (err) {
      console.error('Failed to load processor data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBatchSelect = (bId) => {
    const matched = batches.find((b) => b.batchId === bId);
    setStageForm((prev) => ({
      ...prev,
      batchId: bId,
      quantityBefore: matched?.quantity || 100,
      quantityAfter: Math.round((matched?.quantity || 100) * 0.9),
      unit: matched?.unit || 'kg',
    }));
  };

  const handleSubmitStage = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/processing', stageForm);
      alert(`Processing stage '${stageForm.stage}' recorded and sealed on blockchain!`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to record processing event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
            Herbal Processing Facility Desk
          </span>
          <h1 className="text-2xl font-serif font-bold text-botanical-950 mt-1">
            Standardized Processing Pipeline
          </h1>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-botanical-200 hover:bg-botanical-50 text-botanical-800 rounded-xl text-xs font-semibold shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Record Processing Stage Form */}
      {(activeTab === 'add-stage' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-sky-700" />
              <span>Record Chronological Processing Stage Event</span>
            </h3>
            <p className="text-xs text-botanical-600">
              Each processing step links previous event hashes into an immutable blockchain audit chain.
            </p>
          </div>

          <form onSubmit={handleSubmitStage} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Select Approved Batch *
                </label>
                <select
                  value={stageForm.batchId}
                  onChange={(e) => handleBatchSelect(e.target.value)}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  required
                >
                  {batches.map((b) => (
                    <option key={b.batchId} value={b.batchId}>
                      {b.batchId} — {b.commonName} ({b.quantity} {b.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Processing Stage *
                </label>
                <select
                  value={stageForm.stage}
                  onChange={(e) => setStageForm({ ...stageForm, stage: e.target.value })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  required
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Facility Location *
                </label>
                <input
                  type="text"
                  value={stageForm.location}
                  onChange={(e) => setStageForm({ ...stageForm, location: e.target.value })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Quantity Before Processing
                </label>
                <input
                  type="number"
                  value={stageForm.quantityBefore}
                  onChange={(e) => setStageForm({ ...stageForm, quantityBefore: parseFloat(e.target.value) })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Net Quantity After Processing *
                </label>
                <input
                  type="number"
                  value={stageForm.quantityAfter}
                  onChange={(e) => setStageForm({ ...stageForm, quantityAfter: parseFloat(e.target.value) })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-sky-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={stageForm.unit}
                  onChange={(e) => setStageForm({ ...stageForm, unit: e.target.value })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                Processing Method / Equipment SOP *
              </label>
              <input
                type="text"
                value={stageForm.method}
                onChange={(e) => setStageForm({ ...stageForm, method: e.target.value })}
                className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                Detailed Operations Notes
              </label>
              <textarea
                rows={2}
                value={stageForm.description}
                onChange={(e) => setStageForm({ ...stageForm, description: e.target.value })}
                className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sky-700 hover:bg-sky-800 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Recording on Blockchain...' : 'Commit Processing Stage to Blockchain'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Processing History Timeline */}
      {(activeTab === 'history' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-700" />
            <span>Chronological Processing History Log</span>
          </h3>

          <div className="space-y-3">
            {history.map((h) => (
              <div key={h._id} className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-900 bg-white px-2 py-0.5 rounded border border-sky-200">
                      {h.batchId}
                    </span>
                    <span className="font-bold text-gray-900">{h.stage}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(h.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="font-medium text-gray-800">{h.method}</div>
                <p className="text-gray-600 text-[11px]">{h.description}</p>

                <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1 border-t border-sky-100">
                  <span>Net Qty: <strong className="text-gray-800">{h.quantityAfter} {h.unit}</strong></span>
                  <span className="font-mono text-[10px] text-sky-700">Tx: {h.blockchainTxHash?.slice(0, 12)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessorDashboard;
