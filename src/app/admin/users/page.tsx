'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Users as UsersIcon, Shield, Trash2, UserCheck } from 'lucide-react';

interface UserRecord {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('anitha_admin_token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users', { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUsers(json.data);
      }
    } catch (err) {
      console.warn("Failed fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user account?")) {
      try {
        await fetch(`/api/users?id=${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user account.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="border-b border-amber-500/20 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white font-serif flex items-center gap-2">
              <UsersIcon className="w-6 h-6 text-amber-400" />
              <span>User & Admin Accounts</span>
            </h1>
            <p className="text-xs text-amber-200/70">View registered customers, store administrators, and privileges.</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-maroon-900/60 rounded-2xl border border-amber-500/30 overflow-x-auto shadow-luxury">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-maroon-950 text-amber-300 border-b border-amber-500/20 font-bold">
                <th className="p-3.5">Name / Email</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Account Role</th>
                <th className="p-3.5">Registered Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10 text-gold-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-amber-300 font-serif">
                    Loading accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-amber-300 font-serif">
                    No registered accounts found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const userId = u._id || u.id || '';
                  const isAdmin = u.role === 'super_admin' || u.role === 'store_admin';
                  return (
                    <tr key={userId} className="hover:bg-amber-500/5 transition">
                      <td className="p-3.5">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {isAdmin ? <Shield className="w-4 h-4 text-amber-400" /> : <UserCheck className="w-4 h-4 text-emerald-400" />}
                          <span>{u.name}</span>
                        </p>
                        <p className="text-[10px] text-gray-400">{u.email}</p>
                      </td>
                      <td className="p-3.5 font-mono text-amber-300">{u.phone || 'N/A'}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          isAdmin ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-gray-300">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>
                      <td className="p-3.5 text-right">
                        {!isAdmin && (
                          <button
                            onClick={() => handleDeleteUser(userId)}
                            className="p-1.5 bg-maroon-950 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
