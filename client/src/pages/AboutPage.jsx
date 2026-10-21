import React from 'react';
import { Leaf, ShieldCheck, Cpu, Lock, BookOpen, CheckCircle, Database } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ayurvedic Standards & Technical Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-botanical-950">
          About the HerbTrace Ecosystem
        </h1>
        <p className="text-sm text-botanical-700 max-w-2xl mx-auto leading-relaxed">
          Preserving the ancient sacred legacy of Ayurvedic medicine through 21st-century distributed ledger cryptography and botanical rule engines.
        </p>
      </div>

      {/* The Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-botanical-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-red-800 flex items-center gap-2">
            <span>⚠ The Botanical Adulteration Challenge</span>
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            The global demand for Ayurvedic botanical remedies has exploded. However, traditional supply chains suffer from:
          </p>
          <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
            <li>Unintentional or fraudulent species substitution (e.g. wild weed root mixed with true Ashwagandha).</li>
            <li>Use of non-medicinal plant parts (e.g. leaves or stems instead of therapeutic rhizomes/roots).</li>
            <li>Lack of verified origin geo-tagging and unsustainable harvesting.</li>
            <li>Paper records susceptible to backdating, loss, and alteration.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-emerald-800 flex items-center gap-2">
            <span>✓ The HerbTrace Solution</span>
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            HerbTrace implements a decentralized, immutable provenance record ensuring absolute transparency:
          </p>
          <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
            <li>Every collected lot receives an immutable on-chain batch identifier.</li>
            <li>Automated software checks against the Ayurvedic Pharmacopoeia of India (API) database.</li>
            <li>Field photos and certificates are sealed with cryptographic SHA-256 evidence locks.</li>
            <li>Consumer QR verification reveals complete multi-batch lineage via interactive DAG genealogy graphs.</li>
          </ul>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-white rounded-2xl p-8 border border-botanical-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold font-serif text-botanical-950">
          Core Technical Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-botanical-950">MERN Stack Backend</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Express REST endpoints backed by MongoDB schemas for users, batches, inspections, chronological processing stages, and formulations.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-botanical-950">Solidity Smart Contracts</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              <code>HerbTrace.sol</code> contract compiled and deployed with Hardhat. Anchors botanical hashes, evidence locks, quality verifications, and formulations to the Ethereum Virtual Machine.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-botanical-950">SHA-256 Evidence Seals</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Field capture files are hashed upon upload. Preserves original capture timestamps and issues non-destructive versioning if records are amended.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
