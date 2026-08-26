import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import * as adminService from '../services/adminService';
import { useToast } from '../components/common/Toast';
import { formatDate } from '../utils/formatters';
import { Users, Shield, User, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminUsersPage = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('[Admin Users Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.updateUser(userId, { role });
      showToast(`User role updated to ${role.toUpperCase()}`, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleToggleEnabled = async (userId, currentStatus) => {
    try {
      await adminService.updateUser(userId, { isEnabled: !currentStatus });
      showToast(`Account ${!currentStatus ? 'enabled' : 'disabled'}`, 'info');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-black text-white">User Accounts & Roles</h1>
          <p className="text-xs text-slate-400">Manage registered user accounts, admin privileges, and access states</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase text-[10px] bg-slate-800/60 rounded-xl">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Account Status</th>
                <th className="p-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white flex items-center gap-3">
                    <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="" className="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-500/20" />
                    <span>{u.name}</span>
                  </td>
                  <td className="p-3 text-slate-300">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleEnabled(u._id, u.isEnabled)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
                        u.isEnabled
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {u.isEnabled ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-rose-400" />}
                      {u.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="p-3 text-slate-400">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsersPage;
