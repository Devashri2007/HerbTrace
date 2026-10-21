import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import TraceabilityPage from './pages/TraceabilityPage';
import QrScannerPage from './pages/QrScannerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Stakeholder Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import InspectorDashboard from './pages/inspector/InspectorDashboard';
import ProcessorDashboard from './pages/processor/ProcessorDashboard';
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard';

function App() {
  const [adminTab, setAdminTab] = useState('dashboard');
  const [farmerTab, setFarmerTab] = useState('dashboard');
  const [inspectorTab, setInspectorTab] = useState('dashboard');
  const [processorTab, setProcessorTab] = useState('dashboard');
  const [mfgTab, setMfgTab] = useState('dashboard');

  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/trace/:productId" element={<TraceabilityPage />} />
        <Route path="/scanner" element={<QrScannerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        element={
          <DashboardLayout
            allowedRoles={['admin']}
            activeTab={adminTab}
            setActiveTab={setAdminTab}
          />
        }
      >
        <Route path="/admin" element={<AdminDashboard activeTab={adminTab} />} />
      </Route>

      {/* Farmer / Wild Collector Dashboard */}
      <Route
        element={
          <DashboardLayout
            allowedRoles={['farmer', 'collector']}
            activeTab={farmerTab}
            setActiveTab={setFarmerTab}
          />
        }
      >
        <Route path="/farmer" element={<FarmerDashboard activeTab={farmerTab} />} />
      </Route>

      {/* Quality Inspector Dashboard */}
      <Route
        element={
          <DashboardLayout
            allowedRoles={['inspector']}
            activeTab={inspectorTab}
            setActiveTab={setInspectorTab}
          />
        }
      >
        <Route path="/inspector" element={<InspectorDashboard activeTab={inspectorTab} />} />
      </Route>

      {/* Processor Dashboard */}
      <Route
        element={
          <DashboardLayout
            allowedRoles={['processor']}
            activeTab={processorTab}
            setActiveTab={setProcessorTab}
          />
        }
      >
        <Route path="/processor" element={<ProcessorDashboard activeTab={processorTab} />} />
      </Route>

      {/* Manufacturer Dashboard */}
      <Route
        element={
          <DashboardLayout
            allowedRoles={['manufacturer']}
            activeTab={mfgTab}
            setActiveTab={setMfgTab}
          />
        }
      >
        <Route path="/manufacturer" element={<ManufacturerDashboard activeTab={mfgTab} />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
