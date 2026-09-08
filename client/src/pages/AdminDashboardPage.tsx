import { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { Card } from '../components/ui';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'users'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusNote, setStatusNote] = useState<string>('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('Under Review');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, reportsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getReports(statusFilter, searchQuery),
        adminService.getUsers(),
      ]);
      setStats(statsRes.data.data);
      setReports(reportsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to load admin panel data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [statusFilter, searchQuery]);

  const handleUpdateStatus = async (reportId: string) => {
    try {
      await adminService.updateReportStatus(reportId, selectedStatus, statusNote);
      setMsg({ type: 'success', text: `Report status updated to ${selectedStatus}` });
      setSelectedReportId(null);
      setStatusNote('');
      fetchAdminData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update report status' });
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(userId, newRole);
      setMsg({ type: 'success', text: `User role changed to ${newRole}` });
      fetchAdminData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update user role' });
    }
  };

  const handleToggleBlock = async (userId: string) => {
    try {
      const res = await adminService.toggleUserBlock(userId);
      const isBlocked = res.data.data.isBlocked;
      setMsg({ type: 'success', text: `User ${isBlocked ? 'suspended' : 'reactivated'} successfully` });
      fetchAdminData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update user status' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>🛡️</span> Admin Command Center
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Platform governance, fraud report verification, and user access management.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'reports' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Report Management ({stats?.overview?.pendingReports || 0} Pending)
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            User Management ({users.length})
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center justify-between ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}

      {loading && !stats ? (
        <div className="text-center py-20 text-gray-500 font-medium">Loading Admin Console...</div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border border-blue-100 bg-blue-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Total Users</p>
                  <p className="text-3xl font-black text-blue-900">{stats?.overview?.totalUsers || 0}</p>
                </Card>
                <Card className="border border-amber-100 bg-amber-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Investments Logged</p>
                  <p className="text-3xl font-black text-amber-900">{stats?.overview?.totalInvestments || 0}</p>
                </Card>
                <Card className="border border-purple-100 bg-purple-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Total Reports</p>
                  <p className="text-3xl font-black text-purple-900">{stats?.overview?.totalReports || 0}</p>
                </Card>
                <Card className="border border-rose-100 bg-rose-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">High Risk Flagged</p>
                  <p className="text-3xl font-black text-rose-900">{stats?.overview?.highRiskCases || 0}</p>
                </Card>
              </div>

              {/* Recent Reports Table */}
              <Card className="border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Recent Fraud Submissions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Report ID</th>
                        <th className="py-3 px-4">Target Entity</th>
                        <th className="py-3 px-4">Reporter</th>
                        <th className="py-3 px-4">Risk Score</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stats?.recentReports?.map((r: any) => (
                        <tr key={r._id} className="hover:bg-gray-50/80">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">{r.reportId}</td>
                          <td className="py-3 px-4 font-semibold text-gray-800">{r.investmentId?.name || 'N/A'}</td>
                          <td className="py-3 px-4">{r.userId?.email || 'Anonymous'}</td>
                          <td className="py-3 px-4">
                            <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                              r.riskScore >= 70 ? 'bg-red-100 text-red-800' : r.riskScore >= 31 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {r.riskScore}/100
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium">{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: REPORTS MANAGEMENT */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by Report ID, Company, Reporter Email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Filter Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Verified Scam">Verified Scam</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                </div>
              </div>

              {/* Reports Table */}
              <Card className="border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Report ID</th>
                        <th className="py-3 px-4">Investment Name</th>
                        <th className="py-3 px-4">Reporter</th>
                        <th className="py-3 px-4">Risk Score</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reports.map((r: any) => (
                        <tr key={r._id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">{r.reportId}</td>
                          <td className="py-3 px-4 font-semibold text-gray-900">{r.investmentId?.name || 'N/A'}</td>
                          <td className="py-3 px-4">{r.userId?.email || 'N/A'}</td>
                          <td className="py-3 px-4 font-bold text-rose-600">{r.riskScore}/100</td>
                          <td className="py-3 px-4">
                            <span className="bg-gray-100 text-gray-800 font-semibold px-2.5 py-0.5 rounded text-xs">
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedReportId(r._id);
                                setSelectedStatus(r.status || 'Under Review');
                              }}
                              className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded border border-blue-200"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Status Update Modal */}
              {selectedReportId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Update Report Status</h3>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full p-2.5 border rounded-lg text-sm bg-gray-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Verified Scam">Verified Scam</option>
                          <option value="Dismissed">Dismissed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Admin Audit Note</label>
                        <textarea
                          rows={3}
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          placeholder="Reason or notes for status update..."
                          className="w-full p-2.5 border rounded-lg text-sm bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setSelectedReportId(null)}
                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedReportId)}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <Card className="border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Activity</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u: any) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-bold text-gray-900">{u.fullName}</td>
                        <td className="py-3 px-4 text-gray-700">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs">
                          {u.investmentsCount || 0} Investments | {u.reportsCount || 0} Reports
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              u.isBlocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {u.isBlocked ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleRole(u._id, u.role)}
                            className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-2.5 py-1 rounded border border-purple-200"
                          >
                            Toggle Role
                          </button>
                          <button
                            onClick={() => handleToggleBlock(u._id)}
                            className={`text-xs font-bold px-2.5 py-1 rounded border ${
                              u.isBlocked
                                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                : 'text-rose-700 bg-rose-50 border-rose-200'
                            }`}
                          >
                            {u.isBlocked ? 'Unblock' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
