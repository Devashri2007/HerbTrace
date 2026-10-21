import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, Camera, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const QrScannerPage = () => {
  const [productId, setProductId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (productId.trim()) {
      navigate(`/trace/${productId.trim()}`);
    }
  };

  const handleQuickSelect = (id) => {
    navigate(`/trace/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-botanical-100 text-botanical-800 flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-botanical-950">
          HerbTrace QR Scanner
        </h1>
        <p className="text-xs sm:text-sm text-botanical-700">
          Scan the QR label on your Ayurvedic medicine bottle to verify authenticity and track its botanical journey.
        </p>
      </div>

      {/* Manual Input Card */}
      <div className="bg-white rounded-2xl border border-botanical-200 p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-botanical-950 uppercase tracking-wider mb-2">
              Enter Product ID / Lot Code:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. PROD-AYUR-00101"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full bg-botanical-50/70 border border-botanical-200 rounded-xl px-4 py-3 text-sm text-botanical-950 font-mono placeholder-botanical-400 focus:outline-none focus:ring-2 focus:ring-botanical-600"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-botanical-700 hover:bg-botanical-800 text-white px-5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Verify</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-botanical-100"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400 font-semibold uppercase">Or Sample Products</span>
          <div className="flex-grow border-t border-botanical-100"></div>
        </div>

        {/* Quick Test Sample Cards */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold text-botanical-700 uppercase tracking-wider block">
            Click to trace live verified products:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickSelect('PROD-AYUR-00101')}
              className="text-left p-3.5 rounded-xl border border-botanical-200 bg-botanical-50/50 hover:bg-botanical-100/70 hover:border-botanical-300 transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-botanical-700">PROD-AYUR-00101</span>
                <span className="text-[10px] text-emerald-700 font-semibold">✓ Verified</span>
              </div>
              <h4 className="text-xs font-bold text-botanical-950">Ashwagandha + Haridra Capsules</h4>
              <p className="text-[11px] text-gray-500">Dual-Batch Synergy Lineage</p>
            </button>

            <button
              onClick={() => handleQuickSelect('PROD-AYUR-00102')}
              className="text-left p-3.5 rounded-xl border border-botanical-200 bg-botanical-50/50 hover:bg-botanical-100/70 hover:border-botanical-300 transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-botanical-700">PROD-AYUR-00102</span>
                <span className="text-[10px] text-emerald-700 font-semibold">✓ Verified</span>
              </div>
              <h4 className="text-xs font-bold text-botanical-950">Pure Ashwagandha Churna</h4>
              <p className="text-[11px] text-gray-500">Single Lot Cryo-Milled</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrScannerPage;
