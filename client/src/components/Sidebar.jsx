import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Sprout,
  PlusCircle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Workflow,
  Factory,
  Layers,
  QrCode,
  ShieldCheck,
  FileText,
  Clock,
  MapPin,
  Lock,
  GitBranch,
  LogOut,
  Settings,
  Leaf,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const role = user.role;

  // Determine navigation items based on user role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
          { id: 'users', label: 'User Approvals', icon: Users },
          { id: 'batches', label: 'All Herb Batches', icon: Sprout },
          { id: 'quality', label: 'Quality Verification', icon: FileCheck2 },
          { id: 'processing', label: 'Processing Pipeline', icon: Workflow },
          { id: 'formulations', label: 'Formulations', icon: Layers },
          { id: 'products', label: 'QR Products', icon: QrCode },
          { id: 'blockchain', label: 'Blockchain Ledger', icon: ShieldCheck },
          { id: 'genealogy', label: 'Genealogy Graph', icon: GitBranch },
          { id: 'audit', label: 'System Audit Logs', icon: Clock },
        ];
      case 'farmer':
      case 'collector':
        return [
          { id: 'dashboard', label: 'Harvest Dashboard', icon: LayoutDashboard },
          { id: 'register', label: 'Register New Batch', icon: PlusCircle },
          { id: 'batches', label: 'My Herb Batches', icon: Sprout },
          { id: 'map', label: 'Collection Map', icon: MapPin },
          { id: 'evidence', label: 'Evidence Time-Locks', icon: Lock },
        ];
      case 'inspector':
        return [
          { id: 'dashboard', label: 'Inspection Desk', icon: LayoutDashboard },
          { id: 'pending', label: 'Pending Batches', icon: Clock },
          { id: 'approved', label: 'Quality Approved', icon: CheckCircle2 },
          { id: 'rejected', label: 'Quality Rejected', icon: XCircle },
          { id: 'history', label: 'Verification Records', icon: FileText },
        ];
      case 'processor':
        return [
          { id: 'dashboard', label: 'Facility Dashboard', icon: LayoutDashboard },
          { id: 'assigned', label: 'Batches for Processing', icon: Sprout },
          { id: 'add-stage', label: 'Record Stage Event', icon: Workflow },
          { id: 'history', label: 'Processing Timeline', icon: Clock },
        ];
      case 'manufacturer':
        return [
          { id: 'dashboard', label: 'Production Desk', icon: LayoutDashboard },
          { id: 'verified', label: 'Verified Batches', icon: Sprout },
          { id: 'create-formulation', label: 'Create Formulation', icon: Layers },
          { id: 'products', label: 'My Products', icon: Factory },
          { id: 'qr', label: 'QR Generator', icon: QrCode },
          { id: 'trace', label: 'Traceability Preview', icon: ShieldCheck },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-botanical-100 flex flex-col h-[calc(100vh-4.5rem)] sticky top-18 select-none">
      {/* Role Profile Header */}
      <div className="p-4 border-b border-botanical-100 bg-botanical-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-botanical-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xs font-bold text-botanical-950 truncate">{user.name}</h3>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-botanical-200 text-botanical-800">
              {user.role}
            </span>
          </div>
        </div>
        {user.organization && (
          <p className="mt-2 text-[11px] text-botanical-600 truncate font-medium">
            🏛 {user.organization}
          </p>
        )}
      </div>

      {/* Navigation tabs */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-botanical-400 px-3 py-2">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-botanical-700 text-white shadow-sm shadow-botanical-700/20'
                  : 'text-botanical-700 hover:bg-botanical-50 hover:text-botanical-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-botanical-500'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-botanical-200" />}
            </button>
          );
        })}
      </nav>

      {/* Logout / Switch Footer */}
      <div className="p-3 border-t border-botanical-100 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
