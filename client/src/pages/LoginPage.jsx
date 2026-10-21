import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle, Shield, UserCheck } from 'lucide-react';
import HerbTraceLogo from '../components/HerbTraceLogo';

const DEMO_USERS = [
  { role: 'admin', label: 'Admin', email: 'admin@herbtrace.com', desc: 'System governance & approvals' },
  { role: 'farmer', label: 'Farmer', email: 'farmer@herbtrace.com', desc: 'Register harvest batches & GPS' },
  { role: 'collector', label: 'Wild Collector', email: 'collector@herbtrace.com', desc: 'Forest collections' },
  { role: 'inspector', label: 'Quality Inspector', email: 'inspector@herbtrace.com', desc: 'Pharmacognosy & approvals' },
  { role: 'processor', label: 'Processor', email: 'processor@herbtrace.com', desc: 'Drying, grinding, & extraction' },
  { role: 'manufacturer', label: 'Manufacturer', email: 'manufacturer@herbtrace.com', desc: 'Formulation & QR codes' },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const redirectByRole = (role) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      const user = await demoLogin(role);
      redirectByRole(user.role);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <HerbTraceLogo size="lg" variant="light" showSubtitle={true} className="justify-center" />
        <p className="text-xs sm:text-sm text-botanical-700 max-w-md pt-1">
          Authorized portal access for herbal supply chain stakeholders & Ayurvedic verifiers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Login Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-botanical-200 p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-botanical-950 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@herbtrace.com"
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-botanical-950 focus:ring-2 focus:ring-botanical-600 focus:outline-none"
                  required
                />
                <Mail className="w-4 h-4 text-botanical-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-botanical-950 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-botanical-50/50 border border-botanical-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-botanical-950 focus:ring-2 focus:ring-botanical-600 focus:outline-none"
                  required
                />
                <Lock className="w-4 h-4 text-botanical-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-botanical-700 hover:bg-botanical-800 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">Are you a new farmer or wild collector? </span>
            <Link to="/register" className="text-xs font-bold text-botanical-700 hover:underline">
              Register Account
            </Link>
          </div>
        </div>

        {/* 1-Click Demo Accounts Sidebar */}
        <div className="lg:col-span-5 bg-botanical-50 rounded-2xl border border-botanical-200 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-botanical-200">
            <UserCheck className="w-4 h-4 text-botanical-700" />
            <h3 className="text-xs font-bold text-botanical-950 uppercase tracking-wider">
              1-Click Demo Accounts
            </h3>
          </div>
          <p className="text-[11px] text-botanical-700 leading-relaxed">
            Select any predefined role below to sign in instantly with test credentials:
          </p>

          <div className="space-y-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.role}
                onClick={() => handleQuickDemo(u.role)}
                disabled={loading}
                className="w-full text-left p-2.5 rounded-xl bg-white border border-botanical-200/80 hover:border-botanical-400 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-botanical-950 group-hover:text-botanical-700">
                      {u.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">({u.email})</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{u.desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-botanical-400 group-hover:text-botanical-700 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
