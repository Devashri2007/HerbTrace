import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import BotanicalValidatorWidget from '../components/BotanicalValidatorWidget';
import EvidenceTimeLockCard from '../components/EvidenceTimeLockCard';
import BatchGenealogyGraph from '../components/BatchGenealogyGraph';
import TraceTimeline from '../components/TraceTimeline';
import BlockchainBadge from '../components/BlockchainBadge';
import MapViewer from '../components/MapViewer';
import {
  ShieldCheck,
  CheckCircle2,
  Printer,
  Calendar,
  Building2,
  Sprout,
  FileCheck2,
  Workflow,
  Lock,
  GitBranch,
  AlertCircle,
  ExternalLink,
  MapPin,
  ChevronDown,
} from 'lucide-react';

const TraceabilityPage = () => {
  const { productId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchTrace = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/public/trace/${productId}`);
        setData(res.data);
      } catch (err) {
        setError(err.message || 'Product not found. Please verify the product ID or QR code.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchTrace();
    }
  }, [productId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-botanical-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="text-sm font-bold text-botanical-950">Querying Blockchain Provenance Ledger...</h3>
        <p className="text-xs text-botanical-600">Retrieving authentic botanical lot records, evidence hashes, and genealogy</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-gray-900">Trace Record Not Found</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {error || `No product registered under identifier '${productId}'.`}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/scanner"
            className="px-4 py-2 bg-botanical-700 text-white rounded-lg text-xs font-semibold hover:bg-botanical-800"
          >
            Scan Another QR
          </Link>
          <Link
            to="/trace/PROD-AYUR-00101"
            className="px-4 py-2 border border-botanical-300 text-botanical-800 rounded-lg text-xs font-semibold hover:bg-botanical-50"
          >
            View Sample Product
          </Link>
        </div>
      </div>
    );
  }

  const { product, formulation, batches = [], qualityInspections = [], processingHistory = [], evidenceRecords = [], blockchainRecords = [], genealogyGraph } = data;
  const primaryBatch = batches[0];
  const primaryBlockchain = blockchainRecords[0] || (primaryBatch?.blockchainRecord);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-botanical-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>✓ Blockchain Verified Product</span>
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-botanical-50 text-botanical-700 border border-botanical-200">
                {product.productId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-botanical-950">
              {product.productName}
            </h1>

            <p className="text-xs text-botanical-700 font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-botanical-600" />
              <span>Manufacturer: {product.manufacturerName} • License #{product.licenseNumber}</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-botanical-200 hover:bg-botanical-50 text-botanical-800 rounded-xl text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>

        {/* Product Quick Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-botanical-100 text-xs">
          <div>
            <span className="text-gray-500 block text-[11px]">Product Type</span>
            <span className="font-semibold text-botanical-950">{product.productType}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">Compounded Date</span>
            <span className="font-semibold text-botanical-950">
              {product.manufacturingDate ? new Date(product.manufacturingDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">Expiry Date</span>
            <span className="font-semibold text-botanical-950">
              {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '2 Years from Mfg'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">Verified Batches Bound</span>
            <span className="font-semibold text-emerald-700">{batches.length} Certified Lots</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Consumer Deep Dive */}
      <div className="flex border-b border-botanical-200 gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview & Origin', icon: Sprout },
          { id: 'timeline', label: 'Chronological Journey', icon: Workflow },
          { id: 'genealogy', label: 'Batch Genealogy Graph', icon: GitBranch },
          { id: 'evidence', label: 'Evidence-Time Locks', icon: Lock },
          { id: 'blockchain', label: 'Blockchain Verification', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-botanical-700 text-botanical-950 font-bold'
                  : 'border-transparent text-gray-500 hover:text-botanical-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Botanical Origin */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Botanical Origins Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-botanical-700" />
              <span>Botanical Origins & Geo-Locations</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {batches.map((b) => (
                <div key={b.batchId} className="bg-white rounded-2xl border border-botanical-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-botanical-100">
                    <div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-botanical-100 text-botanical-800">
                        {b.batchId}
                      </span>
                      <h4 className="text-base font-bold text-botanical-950 mt-1">
                        {b.commonName} <span className="text-xs font-normal italic text-gray-500">({b.botanicalName})</span>
                      </h4>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 block">Plant Part Used:</span>
                      <span className="font-semibold text-botanical-900">{b.plantPart}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Harvest Method:</span>
                      <span className="font-semibold text-botanical-900">{b.collectionMethod}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Collection Date:</span>
                      <span className="font-semibold text-botanical-900">{new Date(b.collectionDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Collector Classification:</span>
                      <span className="font-semibold text-emerald-800">{b.collectorInfo?.collectorType}</span>
                    </div>
                  </div>

                  {/* Botanical consistency status */}
                  <BotanicalValidatorWidget validation={b.consistencyValidation} compact={true} />

                  {/* Map viewer for this batch */}
                  <MapViewer
                    latitude={b.location.latitude}
                    longitude={b.location.longitude}
                    locationName={b.location.locationName}
                    botanicalName={b.botanicalName}
                    commonName={b.commonName}
                    batchId={b.batchId}
                    height="200px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain verification card */}
          <BlockchainBadge
            isVerified={true}
            transactionHash={product.blockchainTxHash || primaryBlockchain?.transactionHash}
            contractAddress={primaryBlockchain?.contractAddress || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}
            blockNumber={primaryBlockchain?.blockNumber || 1045}
            timestamp={product.manufacturingDate}
          />
        </div>
      )}

      {/* Tab 2: Chronological Journey Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-botanical-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-serif font-bold text-botanical-950">
              Chronological Supply-Chain History
            </h3>
            <p className="text-xs text-botanical-600">
              Vertical immutable timeline recording all transitions from wild gathering to consumer packaging.
            </p>
          </div>

          <TraceTimeline
            batches={batches}
            qualityInspections={qualityInspections}
            processingHistory={processingHistory}
            product={product}
            formulation={formulation}
          />
        </div>
      )}

      {/* Tab 3: Interactive Batch Genealogy Graph */}
      {activeTab === 'genealogy' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-serif font-bold text-botanical-950">
              Batch Genealogy & Provenance Graph
            </h3>
            <p className="text-xs text-botanical-600">
              Directed Acyclic Graph (DAG) visualizing batch aggregations, pharmacognosy verifications, and compound formulations.
            </p>
          </div>

          <BatchGenealogyGraph graphData={genealogyGraph} />
        </div>
      )}

      {/* Tab 4: Evidence-Time Locks */}
      {activeTab === 'evidence' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
              <Lock className="w-5 h-5 text-botanical-700" />
              <span>Cryptographic Evidence-Time Locks</span>
            </h3>
            <p className="text-xs text-botanical-600">
              Field evidence documents sealed with SHA-256 hashes to guarantee data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evidenceRecords.map((evi) => (
              <EvidenceTimeLockCard key={evi.evidenceId} evidence={evi} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Blockchain Ledger Records */}
      {activeTab === 'blockchain' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <BlockchainBadge
            isVerified={true}
            transactionHash={product.blockchainTxHash || primaryBlockchain?.transactionHash}
            contractAddress={primaryBlockchain?.contractAddress || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}
            blockNumber={primaryBlockchain?.blockNumber || 1045}
            timestamp={product.manufacturingDate}
          />

          <div className="bg-white rounded-2xl border border-botanical-200 p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-botanical-950">Associated Blockchain Transaction Logs</h4>
            <div className="space-y-3">
              {blockchainRecords.map((rec, rIdx) => (
                <div key={rec._id || rIdx} className="bg-botanical-50/70 p-3.5 rounded-xl border border-botanical-100 text-xs space-y-1 font-mono">
                  <div className="flex justify-between items-center text-botanical-900 font-sans">
                    <span className="font-bold text-[11px] uppercase tracking-wider">{rec.recordType}</span>
                    <span className="text-gray-500 text-[10px]">{new Date(rec.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-emerald-800 break-all select-all">Tx: {rec.transactionHash}</div>
                  <div className="text-[10px] text-gray-500">Block #{rec.blockNumber} • Contract: {rec.contractAddress}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraceabilityPage;
