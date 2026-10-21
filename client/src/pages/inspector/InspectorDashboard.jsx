import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import BotanicalValidatorWidget from '../../components/BotanicalValidatorWidget';
import MapViewer from '../../components/MapViewer';
import BlockchainBadge from '../../components/BlockchainBadge';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Lock,
  Search,
  Eye,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const InspectorDashboard = ({ activeTab = 'dashboard' }) => {
  const [pendingBatches, setPendingBatches] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [actionType, setActionType] = useState('approve'); // 'approve' | 'reject'
  const [submitting, setSubmitting] = useState(false);

  // Inspector form parameters
  const [params, setParams] = useState({
    moistureContentPercent: 8.2,
    foreignMatterPercent: 0.5,
    totalAshPercent: 4.8,
    acidInsolubleAshPercent: 0.4,
    activePhytochemicalAssay: 'HPLC Certified: Withanolide A 1.85% w/w',
    pesticideResidueCompliant: true,
    microbialContaminationCompliant: true,
    heavyMetalsCompliant: true,
    remarks: 'Sample verified against Ayurvedic Pharmacopoeia of India monograph standards.',
    rejectionReason: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, historyRes] = await Promise.all([
        api.get('/quality/pending'),
        api.get('/quality/history'),
      ]);
      setPendingBatches(pendingRes.data.batches);
      setHistory(historyRes.data.inspections);
    } catch (err) {
      console.error('Failed to load inspector data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openInspection = (batch, type) => {
    setSelectedBatch(batch);
    setActionType(type);
    if (type === 'approve') {
      setParams((prev) => ({
        ...prev,
        remarks: `Lot ${batch.batchId} meets all pharmacopoeial standards for ${batch.botanicalName}. Approved for processing.`,
        rejectionReason: '',
      }));
    } else {
      setParams((prev) => ({
        ...prev,
        rejectionReason: 'Failed physical examination: excessive foreign matter and moisture content.',
        remarks: 'Sample rejected.',
      }));
    }
    setInspectModalOpen(true);
  };

  const handleDecision = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setSubmitting(true);
    try {
      if (actionType === 'approve') {
        await api.post(`/quality/${selectedBatch.batchId}/approve`, {
          remarks: params.remarks,
          parameters: params,
        });
      } else {
        await api.post(`/quality/${selectedBatch.batchId}/reject`, {
          rejectionReason: params.rejectionReason,
          remarks: params.remarks,
        });
      }

      setInspectModalOpen(false);
      setSelectedBatch(null);
      fetchData();
    } catch (err) {
      alert(err.message || 'Inspection recording failed');
    } finally {
      setSubmitting(false);
    }
  };

  const approvedCount = history.filter((i) => i.status === 'QUALITY APPROVED').length;
  const rejectedCount = history.filter((i) => i.status === 'QUALITY REJECTED').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
            Government / Pharmacopoeia Verifier Desk
          </span>
          <h1 className="text-2xl font-serif font-bold text-botanical-950 mt-1">
            Quality Inspection & Pharmacognosy Verification
          </h1>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-botanical-200 hover:bg-botanical-50 text-botanical-800 rounded-xl text-xs font-semibold shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-amber-600 font-medium block">Batches Awaiting Inspection</span>
          <span className="text-2xl font-bold font-serif text-amber-700">{pendingBatches.length}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-emerald-600 font-medium block">Approved Lots</span>
          <span className="text-2xl font-bold font-serif text-emerald-700">{approvedCount}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-rose-600 font-medium block">Rejected Lots</span>
          <span className="text-2xl font-bold font-serif text-rose-700">{rejectedCount}</span>
        </div>
      </div>

      {/* Pending Queue */}
      {(activeTab === 'pending' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Batches Pending Quality Inspection ({pendingBatches.length})</span>
            </h3>
          </div>

          {pendingBatches.length === 0 ? (
            <div className="p-8 text-center bg-botanical-50/50 rounded-xl border border-botanical-100 text-xs text-gray-500">
              ✓ All submitted batches have been inspected and sealed. No pending queues.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingBatches.map((batch) => (
                <div key={batch.batchId} className="bg-botanical-50/60 rounded-xl border border-botanical-200 p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-botanical-800 bg-white px-2 py-0.5 rounded border border-botanical-200">
                      {batch.batchId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      AWAITING INSPECTION
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-botanical-950">{batch.commonName} ({batch.botanicalName})</h4>
                    <p className="text-xs text-gray-600">Part: <strong>{batch.plantPart}</strong> • Net: {batch.quantity} {batch.unit}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-botanical-600" />
                      <span>{batch.collectionLocation?.locationName}</span>
                    </p>
                  </div>

                  {/* Botanical consistency snapshot */}
                  <BotanicalValidatorWidget validation={batch.consistencyValidation} compact={true} />

                  {/* Actions */}
                  <div className="pt-2 border-t border-botanical-200/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openInspection(batch, 'reject')}
                      className="px-3 py-1.5 border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => openInspection(batch, 'approve')}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1"
                    >
                      <span>Inspect & Approve</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Verification History Tab */}
      {(activeTab === 'history' || activeTab === 'approved' || activeTab === 'rejected' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-700" />
            <span>Inspection History & Pharmacognosy Ledger</span>
          </h3>

          <div className="space-y-3">
            {history.map((h) => (
              <div key={h._id} className="p-4 rounded-xl bg-botanical-50/50 border border-botanical-100 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-botanical-800">{h.batchId}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        h.status === 'QUALITY APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {h.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(h.inspectionDate).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-700 italic bg-white p-2.5 rounded border border-botanical-100">
                  "{h.remarks || h.rejectionReason}"
                </p>

                {h.blockchainTxHash && (
                  <div className="font-mono text-[10px] text-emerald-700">
                    On-Chain Seal: {h.blockchainTxHash}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Decision Recording */}
      {inspectModalOpen && selectedBatch && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl border border-botanical-200">
            <div className="flex items-center justify-between pb-3 border-b border-botanical-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Quality Inspector Evaluation
                </span>
                <h3 className="text-base font-bold text-botanical-950">
                  {selectedBatch.commonName} ({selectedBatch.batchId})
                </h3>
              </div>
              <button
                onClick={() => setInspectModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Botanical consistency card */}
            <BotanicalValidatorWidget validation={selectedBatch.consistencyValidation} />

            <form onSubmit={handleDecision} className="space-y-4 text-xs">
              {actionType === 'approve' ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-botanical-50 p-4 rounded-xl border border-botanical-200">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Moisture % (&lt;12%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={params.moistureContentPercent}
                        onChange={(e) => setParams({ ...params, moistureContentPercent: parseFloat(e.target.value) })}
                        className="w-full bg-white border rounded px-2 py-1 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Foreign Matter % (&lt;2%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={params.foreignMatterPercent}
                        onChange={(e) => setParams({ ...params, foreignMatterPercent: parseFloat(e.target.value) })}
                        className="w-full bg-white border rounded px-2 py-1 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Total Ash % (&lt;8%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={params.totalAshPercent}
                        onChange={(e) => setParams({ ...params, totalAshPercent: parseFloat(e.target.value) })}
                        className="w-full bg-white border rounded px-2 py-1 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Acid-Insoluble Ash %</label>
                      <input
                        type="number"
                        step="0.05"
                        value={params.acidInsolubleAshPercent}
                        onChange={(e) => setParams({ ...params, acidInsolubleAshPercent: parseFloat(e.target.value) })}
                        className="w-full bg-white border rounded px-2 py-1 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Active Phytochemical Assay Target</label>
                    <input
                      type="text"
                      value={params.activePhytochemicalAssay}
                      onChange={(e) => setParams({ ...params, activePhytochemicalAssay: e.target.value })}
                      className="w-full bg-white border rounded-lg px-3 py-1.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Inspection Remarks</label>
                    <textarea
                      rows={2}
                      value={params.remarks}
                      onChange={(e) => setParams({ ...params, remarks: e.target.value })}
                      className="w-full bg-white border rounded-lg px-3 py-1.5"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-rose-800 uppercase mb-1">
                    Rejection Reason (Required) *
                  </label>
                  <textarea
                    rows={3}
                    value={params.rejectionReason}
                    onChange={(e) => setParams({ ...params, rejectionReason: e.target.value })}
                    className="w-full bg-rose-50/50 border border-rose-300 rounded-lg p-2.5 text-xs text-rose-950 focus:ring-2 focus:ring-rose-500"
                    placeholder="Provide specific pharmacopoeial test failure details..."
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setInspectModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 text-white rounded-lg text-xs font-bold ${
                    actionType === 'approve' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                >
                  {submitting
                    ? 'Recording on Blockchain...'
                    : actionType === 'approve'
                    ? 'Confirm Quality Approval'
                    : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectorDashboard;
