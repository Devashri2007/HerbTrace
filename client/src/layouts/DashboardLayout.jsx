import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AlertTriangle, Clock } from 'lucide-react';

const DashboardLayout = ({ allowedRoles = [], activeTab, setActiveTab }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9f6]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-botanical-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-botanical-800">Authenticating HerbTrace Access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.status === 'pending' && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f9f6]">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Registration Pending Approval</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Welcome, <strong>{user.name}</strong>! Your {user.collectorType || user.role} account is currently awaiting regulatory review and verification by the HerbTrace System Admin. Once approved, you will be able to create herb batches.
          </p>
          <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-500 font-mono">
            Status: PENDING_ADMIN_VERIFICATION
          </div>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9f6]">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
