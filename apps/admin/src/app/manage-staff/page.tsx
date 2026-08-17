"use client";

import { useState, useEffect } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { fetchUsers, saveUserDoc, updateUserRole, deleteUserDoc, UserDoc } from "@/actions/staff";
import { fetchRoles, RoleDoc } from "@/actions/roles";
import { getSecondaryAuth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Users, UserPlus, Shield, Lock, Trash2, Edit2, Loader2, RefreshCw, AlertCircle, Crown, Mail, Key } from "lucide-react";
import Pagination from "@/components/Pagination";

export default function ManageStaffPage() {
  const { roleCode, roleName, hasPermission, isLoading: authLoading } = useAdminAuthStore();
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [roles, setRoles] = useState<RoleDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Invite Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Edit Role Modal state
  const [editingUser, setEditingUser] = useState<UserDoc | null>(null);

  const canManageStaff = roleCode === 0 || roleName === "Master Admin" || hasPermission("manage staff");

  const loadData = async () => {
    setIsLoading(true);
    const [fetchedUsers, fetchedRoles] = await Promise.all([fetchUsers(), fetchRoles()]);
    setUsers(fetchedUsers);
    setRoles(fetchedRoles);
    if (fetchedRoles.length > 0 && !selectedRoleName) {
      setSelectedRoleName(fetchedRoles[0].name);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out email and password.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Find role definition
      const targetRole = roles.find((r) => r.name === selectedRoleName);
      const targetRoleCode = targetRole ? targetRole.level : 2;

      // 1. Create user in Firebase Auth using Secondary App to prevent current admin logout!
      const secondaryAuth = getSecondaryAuth();
      const userCred = await createUserWithEmailAndPassword(secondaryAuth, email, password);

      // 2. Create user document in Firestore `users` collection
      const res = await saveUserDoc({
        uid: userCred.user.uid,
        email,
        displayName: displayName || email.split("@")[0],
        roleName: selectedRoleName || "Staff",
        roleCode: targetRoleCode,
      });

      if (res.success) {
        setIsInviteModalOpen(false);
        setDisplayName("");
        setEmail("");
        setPassword("");
        loadData();
      } else {
        setError(res.error || "Failed to save staff profile.");
      }
    } catch (err: any) {
      console.error("Error creating staff auth user:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Failed to create staff account.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRole = async (user: UserDoc, newRoleName: string) => {
    const targetRole = roles.find((r) => r.name === newRoleName);
    const targetRoleCode = targetRole ? targetRole.level : 2;

    const res = await updateUserRole(user.uid, newRoleName, targetRoleCode);
    if (res.success) {
      setEditingUser(null);
      loadData();
    } else {
      alert(res.error || "Failed to update user role.");
    }
  };

  const handleDeleteStaff = async (targetUser: UserDoc) => {
    // Rule 1: Staff member (roleCode 2) cannot delete anyone
    if (roleCode === 2) {
      alert("Permission Denied: Staff members cannot delete accounts.");
      return;
    }

    // Rule 2: Admin (roleCode 1) cannot delete Master Admin (roleCode 0)
    if (roleCode === 1 && targetUser.roleCode === 0) {
      alert("Permission Denied: Admins cannot delete Master Admin accounts.");
      return;
    }

    if (!confirm(`Are you sure you want to delete staff account for "${targetUser.email}"?`)) return;

    const res = await deleteUserDoc(targetUser.uid);
    if (res.success) {
      loadData();
    } else {
      alert(res.error || "Failed to delete staff user.");
    }
  };

  if (authLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 max-w-xl mx-auto my-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="text-sm font-medium">Verifying permissions...</span>
      </div>
    );
  }

  if (!canManageStaff) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-500">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-sm text-slate-400">
          You do not have permission to manage staff accounts. Contact a Master Admin if you require access.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-1">Manage Staff Accounts</h1>
          <p className="text-slate-400 text-sm">Invite employees, assign access roles, and manage team permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setError("");
              setIsInviteModalOpen(true);
            }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          >
            <UserPlus className="w-4 h-4" /> Invite Staff
          </button>
        </div>
      </div>

      {/* Staff Users Directory Table */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span>Loading staff accounts...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
          <Users className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Staff Accounts Found</h3>
          <p className="text-xs text-slate-400">Click &quot;Invite Staff&quot; above to create accounts for employees.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-mono">
                  <th className="p-4 pl-6">Staff Member</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Hierarchy Level</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {paginatedUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold font-display uppercase">
                          {u.displayName ? u.displayName[0] : u.email[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {u.displayName || "Staff Member"}
                            {u.roleCode === 0 && (
                              <span title="Master Admin">
                                <Crown className="w-4 h-4 text-amber-400" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {editingUser?.uid === u.uid ? (
                        <div className="flex items-center gap-2">
                          <select
                            defaultValue={u.roleName}
                            onChange={(e) => handleUpdateRole(u, e.target.value)}
                            className="bg-slate-950 border border-orange-500 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            u.roleCode === 0
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : u.roleCode === 1
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {u.roleName}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-xs font-mono text-slate-400">
                      {u.roleCode === 0
                        ? "Level 0 (Superuser)"
                        : u.roleCode === 1
                        ? "Level 1 (Admin)"
                        : "Level 2 (Staff)"}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      {u.roleCode !== 0 && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingUser(editingUser?.uid === u.uid ? null : u)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Edit Role"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(u)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}

      {/* Invite Staff Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-2xl font-bold font-display text-white">Invite Staff Account</h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleInviteStaff} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ruwan Silva"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="ruwan@belihuloya.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Temporary Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Assigned Role Template</label>
                {roles.length === 0 ? (
                  <div className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    No roles created yet. Please create a role in the Roles page first, or default role will be assigned.
                  </div>
                ) : (
                  <select
                    value={selectedRoleName}
                    onChange={(e) => setSelectedRoleName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} (Level {r.level})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
