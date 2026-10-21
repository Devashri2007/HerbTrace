import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import HerbTraceLogo from '../components/HerbTraceLogo';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    collectorType: 'Farmer',
    govIdRef: '',
    address: '',
    district: '',
    state: '',
    organization: '',
    consentGiven: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      setError('You must accept the AYUSH botanical transparency consent.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await register({
        ...formData,
        role: formData.collectorType === 'Wild Collector' ? 'collector' : 'farmer',
      });
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/farmer');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <HerbTraceLogo size="lg" variant="light" showSubtitle={true} className="justify-center" />
        <div className="pt-2">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-botanical-950">
            Farmer & Wild Collector Registration
          </h2>
          <p className="text-xs sm:text-sm text-botanical-700 mt-1">
            Join the national blockchain botanical traceability network for authentic Ayurvedic sourcing.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-botanical-200 p-6 sm:p-8 shadow-sm space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-900 text-xs rounded-xl border border-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">{successMsg}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Redirecting to your portal...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rameshwar Patidar"
                className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="farmer@domain.com"
                className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 94251 XXXXX"
                className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                Collector Type *
              </label>
              <select
                name="collectorType"
                value={formData.collectorType}
                onChange={handleChange}
                className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs font-semibold"
              >
                <option value="Farmer">Farmer (Cultivator)</option>
                <option value="Wild Collector">Wild Collector (Forest Harvester)</option>
                <option value="Cooperative">Farmer Producer Org (FPO)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                Govt ID / Tribal Forest Ref *
              </label>
              <input
                type="text"
                name="govIdRef"
                value={formData.govIdRef}
                onChange={handleChange}
                placeholder="e.g. VAN-DHAN-9842 / Aadhaar / FPO ID"
                className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                District *
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Neemuch"
                className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Madhya Pradesh"
                className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
              Organization / FPO Name (Optional)
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="e.g. Malwa Herbal Cultivators FPO"
              className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-botanical-950 uppercase mb-1">
              Field Address
            </label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Village, Tehsil, Landmark..."
              className="w-full bg-botanical-50/50 border border-botanical-200 rounded-lg px-3 py-2 text-xs"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="consentGiven"
              name="consentGiven"
              checked={formData.consentGiven}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-botanical-600 rounded border-gray-300 focus:ring-botanical-500"
            />
            <label htmlFor="consentGiven" className="text-xs text-gray-700 leading-relaxed">
              I consent to geo-tagging collection records and anchoring botanical batch verifications to the HerbTrace blockchain network in compliance with AYUSH traceability guidelines.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-botanical-700 hover:bg-botanical-800 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{loading ? 'Submitting Registration...' : 'Register Collector Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <span className="text-xs text-gray-500">Already registered? </span>
          <Link to="/login" className="text-xs font-bold text-botanical-700 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
