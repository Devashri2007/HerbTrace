import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  MapPin,
  Lock,
  FileCheck2,
  Workflow,
  Factory,
  QrCode,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import HerbTraceLogo from '../components/HerbTraceLogo';

const STEPS = [
  { icon: Sprout, title: '🌱 Collection', desc: 'Sustainably harvested by certified farmers & wild collectors', color: 'emerald', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-600 hover:text-white', badge: 'bg-emerald-100 text-emerald-800' },
  { icon: MapPin, title: '📍 Geo-tagging', desc: 'Exact field coordinates & OpenStreetMap satellite tagging', color: 'teal', bg: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-600 hover:text-white', badge: 'bg-teal-100 text-teal-800' },
  { icon: Lock, title: '🔐 Evidence Lock', desc: 'Field evidence locked with SHA-256 hashes & immutable timestamp', color: 'amber', bg: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-600 hover:text-white', badge: 'bg-amber-100 text-amber-800' },
  { icon: FileCheck2, title: '🧪 Quality Check', desc: 'API pharmacopoeia & botanical consistency rules validation', color: 'rose', bg: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-600 hover:text-white', badge: 'bg-rose-100 text-rose-800' },
  { icon: Workflow, title: '⚙ Processing', desc: 'Chronological cleaning, solar drying, cryo-grinding, & extraction', color: 'violet', bg: 'bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-600 hover:text-white', badge: 'bg-violet-100 text-violet-800' },
  { icon: Factory, title: '🏭 Manufacturing', desc: 'Standardized compounding into finished Ayurvedic formulation', color: 'orange', bg: 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-600 hover:text-white', badge: 'bg-orange-100 text-orange-800' },
  { icon: QrCode, title: '📱 QR Verification', desc: 'Instant consumer scan revealing complete batch genealogy graph', color: 'sky', bg: 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-600 hover:text-white', badge: 'bg-sky-100 text-sky-800' },
];

const SAMPLE_PRODUCTS = [
  {
    id: 'PROD-AYUR-00101',
    name: 'HerbTrace Ashwagandha + Haridra Vitality Capsules',
    type: 'Capsules (Standardized Extract)',
    herbs: 'Withania somnifera + Curcuma longa',
    batches: 'HT-2026-000001, HT-2026-000002',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    location: 'Neemuch (MP) & Erode (TN)',
  },
  {
    id: 'PROD-AYUR-00102',
    name: 'HerbTrace Pure Ashwagandha Rasayana Churna',
    type: 'Churna (Fine Herbal Powder)',
    herbs: 'Withania somnifera (Nagori Root)',
    batches: 'HT-2026-000001',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    location: 'Neemuch, Madhya Pradesh',
  },
];

const LandingPage = () => {
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();
  const { demoLogin, user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/trace/${searchId.trim()}`);
    }
  };

  const handleQuickDemo = async (role) => {
    try {
      await demoLogin(role);
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'farmer':
        case 'collector':
          navigate('/farmer');
          break;
        case 'inspector':
          navigate('/inspector');
          break;
        case 'processor':
          navigate('/processor');
          break;
        case 'manufacturer':
          navigate('/manufacturer');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-botanical-100 bg-gradient-to-b from-botanical-50/60 via-[#f7f9f6] to-[#f7f9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {/* Logo Emblem Header */}
          <div className="flex justify-center">
            <HerbTraceLogo size="lg" variant="light" showSubtitle={true} className="justify-center scale-105" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical-100/90 border border-botanical-200/80 text-botanical-900 text-xs font-semibold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Ayurvedic Pharmacopoeia + Solidity EVM Traceability</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-botanical-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            From Source to Shelf, <br className="hidden sm:block" />
            <span className="text-botanical-700 font-sans">Every Herb Has a Story.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-botanical-800/90 max-w-2xl mx-auto font-normal leading-relaxed">
            Blockchain-powered botanical traceability for trusted Ayurvedic products. Preserving an immutable, cryptographically sealed record from wild harvest to consumer verification.
          </p>

          {/* Search Bar & Primary Actions */}
          <div className="max-w-xl mx-auto pt-2 space-y-3">
            <form onSubmit={handleSearch} className="flex items-center bg-white p-2 rounded-2xl shadow-lg border border-botanical-200">
              <div className="pl-3 pr-2 text-botanical-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter Product ID (e.g. PROD-AYUR-00101)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full text-sm text-botanical-950 placeholder-botanical-400 focus:outline-none py-1.5 font-medium"
              />
              <button
                type="submit"
                className="bg-botanical-700 hover:bg-botanical-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
              >
                <span>Verify Product</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs font-semibold">
              <Link
                to="/trace/PROD-AYUR-00101"
                className="text-botanical-700 hover:text-botanical-950 flex items-center gap-1 hover:underline"
              >
                <span>Try Demo Trace: PROD-AYUR-00101</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-botanical-300">•</span>
              <Link
                to="/scanner"
                className="text-botanical-700 hover:text-botanical-950 flex items-center gap-1 hover:underline"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Open QR Scanner</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Visual Flow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-botanical-600">
            End-To-End Integrity
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-botanical-950">
            How Botanical Traceability Works
          </h2>
          <p className="text-xs sm:text-sm text-botanical-700">
            Every transition is recorded with SHA-256 evidence time-locks and anchored to smart contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-botanical-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${step.bg}`}>
                      {idx + 1}
                    </div>
                    <Icon className="w-4 h-4 text-botanical-600 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                  <h3 className="text-xs font-bold text-botanical-950">{step.title}</h3>
                  <p className="text-[11px] text-botanical-700/80 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Three New Core Features Callout — Vibrant Ayurvedic & Blockchain Color Scheme */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0a271a] via-[#071f14] to-[#04150e] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-500/30 relative overflow-hidden">
          {/* Ambient Glowing Atmospheric Orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 max-w-3xl mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/25 via-amber-500/25 to-sky-500/25 border border-emerald-400/50 text-emerald-300 text-xs font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>HerbTrace Innovation Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white tracking-tight">
              3 Advanced Architectural Pillars
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
              Engineered specifically to solve botanical substitution, evidence tampering, and batch blending opacity in the herbal medicine sector.
            </p>
          </div>

          {/* 3 Distinctly Colored Pillars */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Lush Emerald / Mint Green */}
            <div className="bg-gradient-to-b from-emerald-950/90 via-[#062417]/95 to-[#03150d] rounded-2xl p-6 sm:p-7 border-2 border-emerald-500/40 shadow-xl hover:border-emerald-400 hover:shadow-emerald-500/20 hover:-translate-y-1.5 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Pillar 01
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors flex items-center gap-1.5">
                    <span>🌱 Botanical Consistency Validator</span>
                  </h3>
                  <p className="text-xs text-emerald-100/85 leading-relaxed mt-2.5">
                    Rules-based AI validation engine cross-referencing botanical taxonomy, plant family, and officinal plant parts against <strong className="text-emerald-300 font-semibold">Ayurvedic Pharmacopoeia of India (API)</strong> standards to immediately flag botanical mismatches.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-5 border-t border-emerald-800/60 flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/70 text-emerald-300 border border-emerald-600/40 font-medium">Taxonomy Check</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/70 text-emerald-300 border border-emerald-600/40 font-medium">Part Verification</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/70 text-emerald-300 border border-emerald-600/40 font-medium">API Standards</span>
              </div>
            </div>

            {/* Pillar 2: Warm Golden Saffron / Amber */}
            <div className="bg-gradient-to-b from-[#2b1704]/90 via-[#1e1003]/95 to-[#0f0801] rounded-2xl p-6 sm:p-7 border-2 border-amber-500/40 shadow-xl hover:border-amber-400 hover:shadow-amber-500/20 hover:-translate-y-1.5 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Pillar 02
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors flex items-center gap-1.5">
                    <span>🔐 Evidence-Time Lock</span>
                  </h3>
                  <p className="text-xs text-amber-100/85 leading-relaxed mt-2.5">
                    Harvest photos, GPS coordinates, and lab certificates are sealed at collection moment with an immutable timestamp and <strong className="text-amber-300 font-semibold">SHA-256 cryptographic digest</strong>. Any modification produces a non-destructive new version.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-5 border-t border-amber-800/60 flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-900/70 text-amber-300 border border-amber-600/40 font-medium">SHA-256 Digest</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-900/70 text-amber-300 border border-amber-600/40 font-medium">GPS Time-Lock</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-900/70 text-amber-300 border border-amber-600/40 font-medium">Anti-Tamper Log</span>
              </div>
            </div>

            {/* Pillar 3: Royal Sapphire / Cyan Blockchain Blue */}
            <div className="bg-gradient-to-b from-[#061e30]/90 via-[#031522]/95 to-[#010b12] rounded-2xl p-6 sm:p-7 border-2 border-sky-500/40 shadow-xl hover:border-sky-400 hover:shadow-sky-500/20 hover:-translate-y-1.5 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30">
                    <Workflow className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    Pillar 03
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-200 transition-colors flex items-center gap-1.5">
                    <span>🔗 Batch Genealogy Graph</span>
                  </h3>
                  <p className="text-xs text-sky-100/85 leading-relaxed mt-2.5">
                    Interactive <strong className="text-sky-300 font-semibold">Directed Acyclic Graph (DAG)</strong> visualizing how multiple distinct herb harvest batches are inspected, processed through chronological stages, and compounded into consumer formulations.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-5 border-t border-sky-800/60 flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-900/70 text-sky-300 border border-sky-600/40 font-medium">Lineage DAG</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-900/70 text-sky-300 border border-sky-600/40 font-medium">Multi-Batch Blend</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-900/70 text-sky-300 border border-sky-600/40 font-medium">Interactive Nodes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Ayurvedic Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-botanical-600">
              Live Verified Products
            </span>
            <h2 className="text-2xl font-serif font-bold text-botanical-950">
              Scan & Inspect Product Provenance
            </h2>
          </div>
          <Link
            to="/scanner"
            className="text-xs font-bold text-botanical-700 hover:text-botanical-900 flex items-center gap-1"
          >
            <span>Open Scanner Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-botanical-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-4">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-24 h-24 rounded-xl object-cover shrink-0 border border-botanical-100 bg-botanical-50"
                />
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-botanical-100 text-botanical-800">
                    {prod.id}
                  </span>
                  <h3 className="text-sm font-bold text-botanical-950">{prod.name}</h3>
                  <p className="text-xs text-botanical-600 font-medium">{prod.herbs}</p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-botanical-600" />
                    <span>Origin: {prod.location}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-botanical-100 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Blockchain Sealed</span>
                </span>
                <Link
                  to={`/trace/${prod.id}`}
                  className="px-4 py-2 bg-botanical-700 hover:bg-botanical-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Trace Journey</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 1-Click Interactive Demo Role Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-botanical-50 rounded-2xl border border-botanical-200 p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-botanical-600">
              Presentation & Evaluation Demo
            </span>
            <h3 className="text-xl font-bold text-botanical-950 font-serif">
              Test Any Role With 1-Click Instant Login
            </h3>
            <p className="text-xs text-botanical-700">
              No need to manually enter passwords. Experience the entire supply chain workflow from each stakeholder's perspective:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { role: 'admin', label: '1. Admin Portal', color: 'bg-purple-700 hover:bg-purple-800' },
              { role: 'farmer', label: '2. Farmer', color: 'bg-emerald-700 hover:bg-emerald-800' },
              { role: 'collector', label: '3. Wild Collector', color: 'bg-green-700 hover:bg-green-800' },
              { role: 'inspector', label: '4. Quality Inspector', color: 'bg-teal-700 hover:bg-teal-800' },
              { role: 'processor', label: '5. Processor', color: 'bg-sky-700 hover:bg-sky-800' },
              { role: 'manufacturer', label: '6. Manufacturer', color: 'bg-amber-700 hover:bg-amber-800' },
            ].map((r) => (
              <button
                key={r.role}
                onClick={() => handleQuickDemo(r.role)}
                className={`py-3 px-3 rounded-xl text-white text-xs font-bold text-center transition-all shadow-sm ${r.color} flex flex-col items-center justify-center gap-1`}
              >
                <span>{r.label}</span>
                <span className="text-[10px] opacity-75 font-normal">Click to Open</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
