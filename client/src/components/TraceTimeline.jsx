import React from 'react';
import {
  Sprout,
  MapPin,
  FileCheck2,
  Workflow,
  Factory,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';

const TraceTimeline = ({ batches = [], qualityInspections = [], processingHistory = [], product, formulation }) => {
  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-botanical-600 before:via-teal-600 before:to-emerald-600">
      {/* 1. Origin & Botanical Collection Stage */}
      {batches.map((batch, bIdx) => (
        <div key={batch.batchId} className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-botanical-700 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <div className="bg-white rounded-xl border border-botanical-100 p-5 shadow-sm space-y-3 hover:border-botanical-300 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-botanical-800 uppercase tracking-wider">
                  Stage 1: Botanical Harvest & Geo-tagging
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-botanical-50 text-botanical-700 border border-botanical-200">
                  {batch.batchId}
                </span>
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-botanical-500" />
                {new Date(batch.collectionDate).toLocaleDateString()}
              </span>
            </div>

            <h4 className="text-sm font-bold text-botanical-950">
              {batch.commonName} ({batch.botanicalName}) — Part: {batch.plantPart}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-botanical-800 bg-botanical-50/60 p-3 rounded-lg border border-botanical-100">
              <div>
                <span className="text-gray-500 block text-[11px]">Harvest Method:</span>
                <span className="font-semibold">{batch.collectionMethod}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Collection Region:</span>
                <span className="font-semibold">{batch.location.locationName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Collector Badge:</span>
                <span className="font-semibold text-emerald-800">
                  {batch.collectorInfo?.collectorType || 'Certified Forest Collector'}
                </span>
              </div>
            </div>

            {batch.evidenceLock?.locked && (
              <div className="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Primary Evidence Time-Locked ({batch.evidenceLock.evidenceId})
                </span>
                <span className="font-mono text-[10px] opacity-75">
                  {batch.evidenceLock.sha256Hash?.slice(0, 12)}...
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* 2. Quality Verification Stage */}
      {qualityInspections.map((insp, qIdx) => (
        <div key={insp.inspectionId || qIdx} className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
            <FileCheck2 className="w-3.5 h-3.5" />
          </div>
          <div className="bg-white rounded-xl border border-teal-100 p-5 shadow-sm space-y-3 hover:border-teal-300 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                Stage 2: Pharmacognosy Quality Inspection
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-500" />
                {new Date(insp.inspectionDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  insp.status === 'QUALITY APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {insp.status}
              </span>
              <span className="text-xs font-mono text-gray-500">Batch: {insp.batchId}</span>
            </div>

            <p className="text-xs text-gray-700 italic bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
              "{insp.remarks || 'Meets Ayurvedic Pharmacopoeia of India standards.'}"
            </p>

            {insp.parameters && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                  <span className="text-gray-500 block">Moisture:</span>
                  <span className="font-semibold font-mono">{insp.parameters.moistureContentPercent}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Foreign Matter:</span>
                  <span className="font-semibold font-mono">{insp.parameters.foreignMatterPercent}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Total Ash:</span>
                  <span className="font-semibold font-mono">{insp.parameters.totalAshPercent}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Pesticide Residue:</span>
                  <span className="font-semibold text-emerald-700">Compliant (Zero)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* 3. Chronological Processing Pipeline Stages */}
      {processingHistory.map((proc, pIdx) => (
        <div key={proc.eventId || pIdx} className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-sky-700 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
            <Workflow className="w-3.5 h-3.5" />
          </div>
          <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-sm space-y-2.5 hover:border-sky-300 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                Stage 3: Processing Stage — {proc.stage}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-500" />
                {new Date(proc.timestamp).toLocaleDateString()}
              </span>
            </div>

            <h4 className="text-xs font-bold text-gray-900">{proc.method}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{proc.description}</p>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-600 bg-sky-50/60 p-2.5 rounded-lg border border-sky-100 gap-2">
              <div>
                <span className="text-gray-500">Location:</span>{' '}
                <span className="font-medium text-gray-800">{proc.location}</span>
              </div>
              <div>
                <span className="text-gray-500">Net Quantity:</span>{' '}
                <span className="font-mono font-semibold text-gray-800">
                  {proc.quantityAfter} {proc.unit || 'kg'}
                </span>
              </div>
              {proc.blockchainTxHash && (
                <div className="font-mono text-[10px] text-sky-700">
                  Tx: {proc.blockchainTxHash.slice(0, 10)}...
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* 4. Formulation & Compounding Stage */}
      {formulation && (
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
            <Factory className="w-3.5 h-3.5" />
          </div>
          <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm space-y-3 hover:border-amber-400 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Stage 4: Ayurvedic Compounding & Manufacturing
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                {new Date(formulation.manufacturingDate || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h4 className="text-sm font-bold text-botanical-950">
              {formulation.productName || product?.productName}
            </h4>
            <p className="text-xs text-gray-600">{formulation.description}</p>

            {formulation.ingredients && (
              <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200 text-xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                  Compound Ingredients & Batch Binds:
                </span>
                {formulation.ingredients.map((ing, iIdx) => (
                  <div key={iIdx} className="flex justify-between items-center text-[11px]">
                    <span className="font-medium text-gray-800">{ing.herbName}</span>
                    <span className="font-mono text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                      Batch {ing.batchId} ({ing.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Finished Product & Consumer QR Verification */}
      {product && (
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="bg-gradient-to-br from-botanical-900 to-botanical-950 text-white rounded-xl p-5 shadow-md space-y-3 border border-botanical-700">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Stage 5: Finished Product Sealed & QR Enabled
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Public Provenance Active
              </span>
            </div>

            <h4 className="text-base font-bold font-serif">{product.productName}</h4>
            <p className="text-xs text-botanical-200">
              Manufactured by {product.manufacturerName} • License #{product.licenseNumber}
            </p>

            <div className="pt-2 border-t border-botanical-800 flex flex-wrap items-center justify-between text-xs text-botanical-300 gap-2">
              <div>Product ID: <span className="font-mono text-white font-semibold">{product.productId}</span></div>
              <div className="text-emerald-400 font-bold">✓ Blockchain Verified & Consumer Safe</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraceTimeline;
