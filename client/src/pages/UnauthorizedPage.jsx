import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold font-serif text-gray-900">Access Restricted</h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        Your current account role ({user?.role || 'Guest'}) does not have permission to view this workspace. Role-based access control (RBAC) is enforced across all HerbTrace operations.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-4 py-2 bg-botanical-700 text-white rounded-xl text-xs font-semibold hover:bg-botanical-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
