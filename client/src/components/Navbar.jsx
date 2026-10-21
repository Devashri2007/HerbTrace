import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, ShieldCheck, QrCode, Search, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import HerbTraceLogo from './HerbTraceLogo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickTrace = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/trace/${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'farmer':
      case 'collector':
        return '/farmer';
      case 'inspector':
        return '/inspector';
      case 'processor':
        return '/processor';
      case 'manufacturer':
        return '/manufacturer';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-botanical-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-2">
          {/* Logo with Emblem Picture & Full Title/Subtitle */}
          <Link to="/" className="flex items-center group shrink-0 max-w-[280px] sm:max-w-md lg:max-w-lg">
            <HerbTraceLogo size="md" variant="light" showSubtitle={true} />
          </Link>

          {/* Search bar for quick product verify */}
          <form onSubmit={handleQuickTrace} className="hidden md:flex items-center relative max-w-xs w-full mx-6">
            <input
              type="text"
              placeholder="Enter Product / Batch ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-botanical-50/70 border border-botanical-200/80 rounded-full pl-9 pr-4 py-1.5 text-xs text-botanical-900 placeholder-botanical-400 focus:outline-none focus:ring-2 focus:ring-botanical-600/30 focus:border-botanical-600 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-botanical-500 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 text-[11px] bg-botanical-700 text-white px-2.5 py-0.5 rounded-full font-medium hover:bg-botanical-800 transition-colors"
            >
              Verify
            </button>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-botanical-900">
            <Link
              to="/"
              className={`hover:text-botanical-600 transition-colors ${
                location.pathname === '/' ? 'text-botanical-700 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`hover:text-botanical-600 transition-colors ${
                location.pathname === '/about' ? 'text-botanical-700 font-semibold' : ''
              }`}
            >
              Ayush Standards
            </Link>
            <Link
              to="/scanner"
              className="flex items-center gap-1.5 hover:text-botanical-600 transition-colors"
            >
              <QrCode className="w-4 h-4 text-botanical-600" />
              Scan QR
            </Link>
            <Link
              to="/trace/PROD-AYUR-00101"
              className="flex items-center gap-1.5 text-botanical-800 hover:text-botanical-600 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Demo Trace
            </Link>
          </nav>

          {/* Auth Action */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-botanical-100/80 text-botanical-900 hover:bg-botanical-200 transition-colors border border-botanical-200"
                >
                  <User className="w-3.5 h-3.5 text-botanical-700" />
                  <span className="capitalize">{user.role} Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-botanical-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-botanical-800 hover:text-botanical-950 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-botanical-700 hover:bg-botanical-800 rounded-lg shadow-sm shadow-botanical-700/20 transition-all hover:shadow"
                >
                  Collector Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-botanical-700 hover:bg-botanical-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-botanical-100 bg-white px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleQuickTrace} className="flex items-center relative w-full mb-3">
            <input
              type="text"
              placeholder="Product ID (e.g. PROD-AYUR-00101)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-botanical-50 border border-botanical-200 rounded-lg pl-9 pr-4 py-2 text-sm text-botanical-900"
            />
            <Search className="w-4 h-4 text-botanical-500 absolute left-3 pointer-events-none" />
            <button type="submit" className="absolute right-2 bg-botanical-700 text-white text-xs px-2.5 py-1 rounded">
              Verify
            </button>
          </form>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-botanical-900 hover:bg-botanical-50 rounded-lg"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-botanical-900 hover:bg-botanical-50 rounded-lg"
          >
            Ayush Standards
          </Link>
          <Link
            to="/scanner"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-botanical-900 hover:bg-botanical-50 rounded-lg"
          >
            Scan QR Code
          </Link>
          <Link
            to="/trace/PROD-AYUR-00101"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-botanical-900 hover:bg-botanical-50 rounded-lg"
          >
            Sample Product Trace
          </Link>

          <div className="pt-2 border-t border-botanical-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-botanical-700 text-white rounded-lg text-sm font-semibold"
                >
                  Go to {user.role} Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 border border-botanical-300 text-botanical-800 rounded-lg text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-botanical-700 text-white rounded-lg text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
