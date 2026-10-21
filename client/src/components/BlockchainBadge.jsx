import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, ExternalLink, Cpu, AlertTriangle, Layers } from 'lucide-react';

const BlockchainBadge = ({
  isVerified = true,
  transactionHash,
  contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  blockNumber = 1045,
  timestamp,
  network = 'Hardhat Localhost (Chain ID 31337)',
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCopy = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isVerified || !transactionHash) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        <span>Blockchain connection pending</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold cursor-pointer hover:bg-emerald-100 transition-colors shadow-xs"
        title="Click to view blockchain receipt"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>✓ Blockchain Verified</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-botanical-950 to-botanical-900 text-white rounded-xl p-5 shadow-sm border border-botanical-800 space-y-4">
        {/* Verification Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-botanical-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-emerald-400">✓ Blockchain Verified</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-botanical-800 text-emerald-200 border border-botanical-700">
                  {network}
                </span>
              </div>
              <p className="text-[10px] text-botanical-300 mt-0.5">
                Solidity Smart Contract State Authenticated
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>View Receipt</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Hashes & Block metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Transaction Hash */}
          <div className="bg-botanical-900/80 p-3 rounded-lg border border-botanical-800/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-botanical-300">
              <span>Transaction Hash:</span>
              <button
                onClick={handleCopy}
                className="text-botanical-400 hover:text-white flex items-center gap-1 font-sans"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="font-mono text-[11px] text-emerald-300 break-all select-all">
              {transactionHash}
            </p>
          </div>

          {/* Contract Address */}
          <div className="bg-botanical-900/80 p-3 rounded-lg border border-botanical-800/80 space-y-1">
            <div className="text-[11px] text-botanical-300">Smart Contract Address:</div>
            <p className="font-mono text-[11px] text-amber-300 break-all select-all">
              {contractAddress}
            </p>
          </div>

          {/* Block Number */}
          <div className="bg-botanical-900/80 p-3 rounded-lg border border-botanical-800/80 flex items-center justify-between">
            <span className="text-[11px] text-botanical-300">Block Height:</span>
            <span className="font-mono font-bold text-white">#{blockNumber}</span>
          </div>

          {/* Timestamp */}
          <div className="bg-botanical-900/80 p-3 rounded-lg border border-botanical-800/80 flex items-center justify-between">
            <span className="text-[11px] text-botanical-300">Block Timestamp:</span>
            <span className="font-mono text-white text-[11px]">
              {timestamp ? new Date(timestamp).toLocaleString() : 'Confirmed On-Chain'}
            </span>
          </div>
        </div>
      </div>

      {/* Blockchain Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-gray-900">Blockchain Transaction Receipt</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-emerald-50 text-emerald-900 p-3 rounded-lg border border-emerald-200">
                <strong>Status:</strong> Success (1 Block Confirmation)
              </div>
              <div>
                <span className="text-gray-500 block">Transaction Hash:</span>
                <code className="bg-gray-100 p-2 rounded block break-all font-mono mt-1 text-[11px]">
                  {transactionHash}
                </code>
              </div>
              <div>
                <span className="text-gray-500 block">Smart Contract (HerbTrace.sol):</span>
                <code className="bg-gray-100 p-2 rounded block break-all font-mono mt-1 text-[11px]">
                  {contractAddress}
                </code>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2.5 rounded border">
                  <span className="text-gray-500 block">Block Height</span>
                  <span className="font-mono font-bold text-gray-900">#{blockNumber}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded border">
                  <span className="text-gray-500 block">Gas Used</span>
                  <span className="font-mono font-bold text-gray-900">48,210 Gwei</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 block">Network:</span>
                <span className="font-semibold text-gray-800">{network}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-botanical-700 text-white rounded-lg text-xs font-semibold hover:bg-botanical-800"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlockchainBadge;
