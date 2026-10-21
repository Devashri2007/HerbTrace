import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import QrModal from '../../components/QrModal';
import {
  Factory,
  Layers,
  QrCode,
  Sprout,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Printer,
  Download,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const PRODUCT_TYPES = [
  'Capsules (Standardized Extract)',
  'Churna (Fine Herbal Powder)',
  'Vati / Gutika (Ayurvedic Tablet)',
  'Kwath / Kashayam (Decoction)',
  'Asava / Arishta (Fermented Liquid)',
  'Taila (Medicated Herbal Oil)',
  'Avaleha (Herbal Paste/Jam)',
  'Syrup (Liquid Formulation)',
];

const ManufacturerDashboard = ({ activeTab = 'dashboard' }) => {
  const [verifiedBatches, setVerifiedBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProductForQR, setSelectedProductForQR] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Formulation Form State
  const [formState, setFormState] = useState({
    productName: 'HerbTrace Vitality Rasayana Capsules',
    productType: 'Capsules (Standardized Extract)',
    manufacturerName: 'AyurVeda Botanicals Manufacturing Ltd.',
    licenseNumber: 'AYUSH-UK-GMP-2022/944',
    selectedBatchIds: [],
    totalQuantity: 1000,
    quantityUnit: 'Bottles (60 capsules)',
    manufacturingDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    manufacturingLocation: 'AyurVeda GMP Facility, Industrial Plot 14, Haridwar',
    description: 'Synergistic classical Ayurvedic formulation prepared under GMP standards.',
    dosageInstructions: '1-2 capsules twice daily with lukewarm water.',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchesRes, productsRes] = await Promise.all([
        api.get('/batches'),
        api.get('/products'),
      ]);

      const approved = batchesRes.data.batches.filter(
        (b) => b.status === 'APPROVED' || b.status === 'PROCESSING' || b.status === 'FORMULATION_USED'
      );
      setVerifiedBatches(approved);
      setProducts(productsRes.data.products);

      if (approved.length > 0 && formState.selectedBatchIds.length === 0) {
        setFormState((prev) => ({
          ...prev,
          selectedBatchIds: [approved[0].batchId],
        }));
      }
    } catch (err) {
      console.error('Failed to load manufacturer data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleBatch = (batchId) => {
    setFormState((prev) => {
      const exists = prev.selectedBatchIds.includes(batchId);
      const updated = exists
        ? prev.selectedBatchIds.filter((id) => id !== batchId)
        : [...prev.selectedBatchIds, batchId];
      return { ...prev, selectedBatchIds: updated };
    });
  };

  const handleCreateFormulation = async (e) => {
    e.preventDefault();
    if (formState.selectedBatchIds.length === 0) {
      alert('Please select at least one verified ingredient batch to compound.');
      return;
    }

    setSubmitting(true);
    try {
      // Build ingredients list from selected batches
      const ingredients = formState.selectedBatchIds.map((bId) => {
        const b = verifiedBatches.find((item) => item.batchId === bId);
        return {
          herbName: b ? `${b.commonName} (${b.botanicalName})` : bId,
          batchId: bId,
          percentage: Math.round(100 / formState.selectedBatchIds.length),
          partUsed: b?.plantPart || 'Standard Part',
        };
      });

      const res = await api.post('/formulations', {
        ...formState,
        ingredients,
        batchIds: formState.selectedBatchIds,
      });

      alert(`Product ${res.data.product.productId} successfully compounded and sealed on blockchain!`);
      setSelectedProductForQR(res.data.product);
      setQrModalOpen(true);
      fetchData();
    } catch (err) {
      alert(err.message || 'Formulation creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Ayurvedic Pharma Production Desk
          </span>
          <h1 className="text-2xl font-serif font-bold text-botanical-950 mt-1">
            Manufacturing & QR Packaging
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

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-gray-500 block">Verified Batches Available</span>
          <span className="text-2xl font-bold font-serif text-botanical-950">{verifiedBatches.length}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-amber-600 block">Finished Formulations</span>
          <span className="text-2xl font-bold font-serif text-amber-700">{products.length}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs">
          <span className="text-[11px] text-emerald-600 block">QR Codes Active</span>
          <span className="text-2xl font-bold font-serif text-emerald-700">{products.length}</span>
        </div>
      </div>

      {/* Create Formulation Form */}
      {(activeTab === 'create-formulation' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-700" />
              <span>Compound New Ayurvedic Formulation & Generate QR</span>
            </h3>
            <p className="text-xs text-botanical-600">
              Select one or more verified herb batches to bind into a finished product with on-chain genealogy.
            </p>
          </div>

          <form onSubmit={handleCreateFormulation} className="space-y-6 text-xs">
            {/* Multi-Batch Ingredient Selector */}
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Select Ingredient Herb Batches ({formState.selectedBatchIds.length} Selected)
                </span>
                <span className="text-[10px] text-amber-800">
                  Multiple batches can be blended together
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {verifiedBatches.map((b) => {
                  const isChecked = formState.selectedBatchIds.includes(b.batchId);
                  return (
                    <div
                      key={b.batchId}
                      onClick={() => handleToggleBatch(b.batchId)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-amber-100 border-amber-400 shadow-xs'
                          : 'bg-white border-amber-200/80 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[11px] text-amber-900">{b.batchId}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </div>
                      <div className="font-bold text-botanical-950 mt-1">{b.commonName}</div>
                      <div className="text-[10px] text-gray-500 italic">{b.botanicalName} ({b.plantPart})</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product Details Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formState.productName}
                  onChange={(e) => setFormState({ ...formState, productName: e.target.value })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Product Type *
                </label>
                <select
                  value={formState.productType}
                  onChange={(e) => setFormState({ ...formState, productType: e.target.value })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  required
                >
                  {PRODUCT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  AYUSH License Number *
                </label>
                <input
                  type="text"
                  value={formState.licenseNumber}
                  onChange={(e) => setFormState({ ...formState, licenseNumber: e.target.value })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Manufacturing Location *
                </label>
                <input
                  type="text"
                  value={formState.manufacturingLocation}
                  onChange={(e) => setFormState({ ...formState, manufacturingLocation: e.target.value })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Total Units Compounded
                </label>
                <input
                  type="number"
                  value={formState.totalQuantity}
                  onChange={(e) => setFormState({ ...formState, totalQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                  Packaging Unit
                </label>
                <input
                  type="text"
                  value={formState.quantityUnit}
                  onChange={(e) => setFormState({ ...formState, quantityUnit: e.target.value })}
                  className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                Formulation Therapeutic Description
              </label>
              <textarea
                rows={2}
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                className="w-full bg-botanical-50/60 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Creating Formulation on Blockchain...' : 'Create Formulation & Generate Consumer QR'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* My Products Table */}
      {(activeTab === 'products' || activeTab === 'qr' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
              <Factory className="w-5 h-5 text-botanical-700" />
              <span>Registered Products & QR Traceability ({products.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.productId}
                className="p-4 rounded-xl bg-botanical-50/50 border border-botanical-200 text-xs flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-botanical-800 bg-white px-2 py-0.5 rounded border border-botanical-200">
                      {p.productId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ✓ PUBLISHED & VERIFIED
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-botanical-950">{p.productName}</h4>
                  <div className="text-gray-500 text-[11px]">
                    Ingredients: {p.batchIds?.join(', ')} • {p.productType}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedProductForQR(p);
                      setQrModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-botanical-700 hover:bg-botanical-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View / Print QR</span>
                  </button>

                  <a
                    href={`/trace/${p.productId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-2 border border-botanical-300 hover:bg-botanical-100 text-botanical-900 rounded-lg text-xs font-semibold"
                  >
                    <span>Public Trace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Modal Component */}
      <QrModal
        product={selectedProductForQR}
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
};

export default ManufacturerDashboard;
