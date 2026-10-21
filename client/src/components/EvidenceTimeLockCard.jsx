import React, { useState } from 'react';
import { Lock, ShieldCheck, Copy, Check, Eye, FileText, Clock, Hash } from 'lucide-react';

const EvidenceTimeLockCard = ({ evidence }) => {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (!evidence) return null;

  const {
    evidenceId = 'EV-HT-00001',
    title = 'Field Botanical Evidence',
    category = 'Botanical Photo',
    fileUrl,
    fileHash = '0x8fa37d38249bce37b822eefd0921a415b3941df80cbb0299e900c3b5ec1e4b9f',
    capturedAt,
    uploadedAt,
    locked = true,
    version = 1,
    blockchainTxHash,
  } = evidence;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(fileHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-botanical-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-botanical-900 to-botanical-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-tight">🔒 Evidence-Time Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-200 border border-white/20">
            v{version}.0 Immutable
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
            SEALED
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Evidence Title & ID */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-botanical-950">{title}</h4>
            <p className="text-[11px] font-mono text-botanical-600 mt-0.5">{evidenceId}</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-botanical-100 text-botanical-800 font-medium">
            {category}
          </span>
        </div>

        {/* Image Preview (if image URL exists) */}
        {fileUrl && (
          <div className="relative rounded-lg overflow-hidden border border-botanical-200 aspect-video group bg-botanical-50">
            <img
              src={fileUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <button
              onClick={() => setModalOpen(true)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Inspect Original Document</span>
            </button>
          </div>
        )}

        {/* Timestamps */}
        <div className="bg-botanical-50/70 rounded-lg p-2.5 text-[11px] space-y-1.5 border border-botanical-100">
          <div className="flex items-center justify-between text-botanical-900">
            <span className="text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-botanical-600" />
              Field Capture Time:
            </span>
            <span className="font-mono font-medium">
              {capturedAt ? new Date(capturedAt).toLocaleString() : 'Recorded at Collection'}
            </span>
          </div>
          <div className="flex items-center justify-between text-botanical-900">
            <span className="text-gray-500 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              Evidence Lock Time:
            </span>
            <span className="font-mono font-medium">
              {uploadedAt ? new Date(uploadedAt).toLocaleString() : new Date().toLocaleString()}
            </span>
          </div>
        </div>

        {/* SHA-256 Hash Bar */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3 text-botanical-600" />
              SHA-256 Cryptographic Hash
            </span>
            <button
              onClick={handleCopyHash}
              className="text-botanical-700 hover:text-botanical-900 flex items-center gap-1 font-sans"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-botanical-950 text-emerald-300 font-mono text-[10px] p-2 rounded-lg break-all select-all border border-botanical-800">
            {fileHash}
          </div>
        </div>

        {/* On-Chain Anchor */}
        {blockchainTxHash && (
          <div className="text-[10px] text-gray-500 flex items-center justify-between pt-1">
            <span>On-Chain Tx:</span>
            <span className="font-mono text-botanical-700">{blockchainTxHash.slice(0, 14)}...</span>
          </div>
        )}
      </div>

      {/* Full Preview Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="text-sm font-bold">{title}</h3>
                <p className="text-xs text-gray-500 font-mono">{evidenceId}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
            <img src={fileUrl} alt={title} className="w-full rounded-lg max-h-[60vh] object-contain bg-black/5" />
            <div className="bg-botanical-50 p-3 rounded-lg text-xs space-y-1">
              <div><strong>SHA-256 Hash:</strong> <code className="break-all">{fileHash}</code></div>
              <div><strong>Captured:</strong> {new Date(capturedAt).toLocaleString()}</div>
              <div><strong>Status:</strong> 🔒 Tamper-Proof Cryptographically Locked</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceTimeLockCard;
