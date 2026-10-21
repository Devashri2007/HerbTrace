import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import BatchGenealogyGraph from '../../components/BatchGenealogyGraph';
import BlockchainBadge from '../../components/BlockchainBadge';
import {
  Users,
  Sprout,
  FileCheck2,
  Workflow,
  Layers,
  Factory,
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  ExternalLink,
  RefreshCw,
  GitBranch,
} from 'lucide-react';

const AdminDashboard = ({ activeTab = 'dashboard' }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [blockchainRecords, setBlockchainRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserStatus, setSelectedUserStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenealogyProduct, setSelectedGenealogyProduct] = useState('PROD-AYUR-00101');
  const [genealogyData, setGenealogyData] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, batchesRes, auditRes, bcRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/batches'),
        api.get('/admin/audit-logs'),
        api.get('/admin/blockchain-records'),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setBatches(batchesRes.data.batches);
      setAuditLogs(auditRes.data.logs);
      setBlockchainRecords(bcRes.data.records);

      // Fetch sample genealogy for graph tab
      const genRes = await api.get(`/public/trace/${selectedGenealogyProduct}`);
      setGenealogyData(genRes.data.genealogyGraph);
    } catch (err) {
      console.error('Failed to load admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesStatus = selectedUserStatus === 'all' || u.status === selectedUserStatus;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-botanical-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-botanical-800">Loading Admin Governance Console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
            National Regulatory Administration
          </span>
          <h1 className="text-2xl font-serif font-bold text-botanical-950 mt-1">
            HerbTrace System Governance
          </h1>
        </div>

        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-botanical-200 hover:bg-botanical-50 text-botanical-800 rounded-xl text-xs font-semibold shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger Data</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600 bg-purple-50' },
              { label: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'text-amber-600 bg-amber-50' },
              { label: 'Herb Batches', value: stats.totalBatches, icon: Sprout, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Quality Verified', value: stats.approvedBatches, icon: FileCheck2, color: 'text-teal-600 bg-teal-50' },
              { label: 'Formulations', value: stats.totalFormulations, icon: Layers, color: 'text-sky-600 bg-sky-50' },
              { label: 'Blockchain Logs', value: stats.blockchainRecordsCount, icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-4 border border-botanical-100 shadow-xs space-y-2">
                  <div className={`w-8 h-8 rounded-lg ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block">{metric.label}</span>
                    <span className="text-xl font-bold font-serif text-botanical-950">{metric.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending Users Quick Approvals Bar (if any) */}
          {stats.pendingApprovals > 0 && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-amber-950">
                    Action Required: {stats.pendingApprovals} Stakeholder Registration(s) Pending Review
                  </h3>
                </div>
              </div>
              <p className="text-xs text-amber-800">
                Farmers and wild collectors cannot register batches on the blockchain until approved by an administrator.
              </p>
            </div>
          )}

          {/* Recent Batches & Recent Audit Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Batches */}
            <div className="bg-white rounded-2xl border border-botanical-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-botanical-950 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-botanical-700" />
                <span>Recent Botanical Batches</span>
              </h3>
              <div className="space-y-2.5">
                {batches.slice(0, 5).map((b) => (
                  <div key={b.batchId} className="flex items-center justify-between p-3 rounded-xl bg-botanical-50/60 border border-botanical-100 text-xs">
                    <div>
                      <div className="font-bold text-botanical-950">{b.commonName} ({b.botanicalName})</div>
                      <div className="font-mono text-[10px] text-gray-500">{b.batchId} • {b.quantity} {b.unit}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Logs */}
            <div className="bg-white rounded-2xl border border-botanical-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-botanical-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-botanical-700" />
                <span>Immutable Audit Trail (Recent Activity)</span>
              </h3>
              <div className="space-y-2.5">
                {auditLogs.slice(0, 5).map((log, idx) => (
                  <div key={log._id || idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-gray-500 text-[10px]">
                      <span className="font-bold text-botanical-900">{log.action}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-700 text-[11px]">{log.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {(activeTab === 'users' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 shadow-sm p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif font-bold text-botanical-950">
                User Governance & Approval Desk
              </h3>
              <p className="text-xs text-gray-500">
                Manage role access and approve pending wild collector registrations
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedUserStatus}
                onChange={(e) => setSelectedUserStatus(e.target.value)}
                className="bg-botanical-50 border border-botanical-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-botanical-900"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Only</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-botanical-50 text-botanical-900 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l-lg">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Location / Region</th>
                  <th className="p-3">ID Reference</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-botanical-50/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-botanical-950">{u.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{u.email}</div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-botanical-100 text-botanical-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {u.district ? `${u.district}, ${u.state}` : 'HQ'}
                    </td>
                    <td className="p-3 font-mono text-gray-500 text-[11px]">
                      {u.govIdRef || 'N/A'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {u.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateUserStatus(u._id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateUserStatus(u._id, 'rejected')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {u.status === 'approved' && u.role !== 'admin' && (
                        <button
                          onClick={() => handleUpdateUserStatus(u._id, 'suspended')}
                          className="px-2.5 py-1 border border-gray-200 text-gray-600 hover:text-red-600 rounded text-[10px] font-semibold"
                        >
                          Suspend
                        </button>
                      )}
                      {u.status === 'suspended' && (
                        <button
                          onClick={() => handleUpdateUserStatus(u._id, 'approved')}
                          className="px-2.5 py-1 bg-botanical-700 text-white rounded text-[10px] font-bold"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blockchain Ledger Tab */}
      {(activeTab === 'blockchain' || activeTab === 'dashboard') && (
        <div className="bg-white rounded-2xl border border-botanical-200 shadow-sm p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-botanical-100">
            <div>
              <h3 className="text-base font-serif font-bold text-botanical-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>On-Chain Ledger State & Smart Contract Transactions</span>
              </h3>
              <p className="text-xs text-gray-500">
                Direct view into Solidity smart contract (HerbTrace.sol) state anchors
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-botanical-50 text-botanical-800 border">
              0x5FbDB2315678afecb367f032d93F642f64180aa3
            </span>
          </div>

          <div className="space-y-3">
            {blockchainRecords.map((rec) => (
              <div key={rec._id} className="p-3.5 rounded-xl bg-botanical-50/70 border border-botanical-200/80 text-xs font-mono space-y-1">
                <div className="flex justify-between items-center font-sans">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-botanical-950">
                    {rec.recordType}
                  </span>
                  <span className="text-gray-500 text-[10px]">{new Date(rec.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-emerald-800 break-all select-all text-[11px]">Tx: {rec.transactionHash}</div>
                <div className="flex items-center justify-between text-gray-500 text-[10px] pt-1 border-t border-botanical-100">
                  <span>Block #{rec.blockNumber} • Gas: {rec.gasUsed || '48,210'}</span>
                  <span>From: {rec.fromAddress?.slice(0, 10)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genealogy Tab */}
      {activeTab === 'genealogy' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-serif font-bold text-botanical-950">
              Platform Batch Genealogy Explorer
            </h3>
            <p className="text-xs text-gray-500">
              Interactive Multi-Batch DAG Genealogy Graph
            </p>
          </div>
          {genealogyData ? (
            <BatchGenealogyGraph graphData={genealogyData} />
          ) : (
            <div className="p-12 text-center text-gray-400">Loading graph...</div>
          )}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-botanical-200 shadow-sm p-6 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-base font-serif font-bold text-botanical-950">
            System Security Audit Logs
          </h3>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log._id} className="p-3 rounded-lg bg-gray-50 border text-xs flex justify-between items-start gap-4">
                <div>
                  <div className="font-bold text-gray-900">{log.action} ({log.actorRole})</div>
                  <div className="text-gray-600 text-[11px]">{log.description}</div>
                </div>
                <span className="text-[10px] font-mono text-gray-400 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
