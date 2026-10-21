import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Cpu, ExternalLink, Globe, Heart } from 'lucide-react';
import HerbTraceLogo from './HerbTraceLogo';

const Footer = () => {
  return (
    <footer className="bg-botanical-950 text-botanical-200 pt-16 pb-12 border-t border-botanical-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-botanical-900/60">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <HerbTraceLogo size="md" variant="dark" showSubtitle={true} />
            <p className="text-xs text-botanical-300/80 leading-relaxed max-w-sm">
              Blockchain-based botanical provenance and supply chain integrity platform for the Ayurvedic and herbal medicine ecosystem. Tracking genuine herbs from forest collectors to consumer formulations.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-botanical-900/80 text-[11px] text-botanical-300 border border-botanical-800">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                AYUSH API Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-botanical-900/80 text-[11px] text-botanical-300 border border-botanical-800">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Solidity EVM Anchored
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-botanical-400 mb-4">
              Traceability
            </h4>
            <ul className="space-y-2.5 text-xs text-botanical-300/90">
              <li>
                <Link to="/trace/PROD-AYUR-00101" className="hover:text-white transition-colors">
                  Ashwagandha Vitality Trace
                </Link>
              </li>
              <li>
                <Link to="/trace/PROD-AYUR-00102" className="hover:text-white transition-colors">
                  Pure Rasayana Churna Trace
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="hover:text-white transition-colors">
                  QR Code Scanner
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Botanical Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Role Access */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-botanical-400 mb-4">
              Stakeholders
            </h4>
            <ul className="space-y-2.5 text-xs text-botanical-300/90">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Wild Collector Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Quality Inspector Desk
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Herbal Processing Unit
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Ayurvedic Manufacturer
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  National Regulatory Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Tech */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-botanical-400 mb-4">
              Smart Contracts
            </h4>
            <div className="space-y-2 text-xs text-botanical-300/80">
              <p className="font-mono text-[11px] text-botanical-400 break-all bg-botanical-900/90 p-2 rounded border border-botanical-800">
                0x5FbDB2315678afecb367f032d93F642f64180aa3
              </p>
              <p className="text-[11px] text-botanical-400">
                Network: Hardhat Local EVM (Chain 31337)
              </p>
              <p className="text-[11px] text-botanical-400">
                Solidity Version: 0.8.20
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-botanical-400/80 gap-4">
          <p>
            © {new Date().getFullYear()} HerbTrace Ecosystem. Designed for botanical transparency & consumer safety.
          </p>
          <p className="flex items-center gap-1">
            Built with MERN + Solidity Smart Contracts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
