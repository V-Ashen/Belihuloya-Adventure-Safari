"use client";

import { useState, useEffect } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { fetchRoles, createRole, updateRole, deleteRole } from "@/actions/roles";
import { ALL_PERMISSIONS, RoleDoc } from "@/lib/permissions";
import { ShieldCheck, Plus, Edit2, Trash2, CheckSquare, Square, Loader2, RefreshCw, AlertCircle, Lock } from "lucide-react";

export default function RolesPage() {
  const { roleCode, roleName, hasPermission, isLoading: authLoading } = useAdminAuthStore();
  const [roles, setRoles] = useState<RoleDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDoc | null>(null);
  const [roleNameInput, setRoleNameInput] = useState("");
  const [level, setLevel] = useState<number>(2); // Default to Staff (2)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const canManageRoles = roleCode === 0 || roleName === "Master Admin" || hasPermission("manage roles");

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchRoles();
    setRoles(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    setRoleNameInput("");
    setLevel(2);
    setSelectedPermissions([]);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (role: RoleDoc) => {
    setEditingRole(role);
    setRoleNameInput(role.name);
    setLevel(role.level);
    setSelectedPermissions(role.permissions || []);
    setError("");
    setIsModalOpen(true);
  };

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPermissions.length === ALL_PERMISSIONS.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions([...ALL_PERMISSIONS]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleNameInput.trim()) {
      setError("Please enter a role name.");
      return;
    }

    setIsSaving(true);
    setError("");

    let res;
    if (editingRole) {
      res = await updateRole(editingRole.id, {
        name: roleNameInput.trim(),
        level,
        permissions: selectedPermissions,
      });
    } else {
      res = await createRole({
        name: roleNameInput.trim(),
        level,
        permissions: selectedPermissions,
      });
    }

    setIsSaving(false);

    if (res.success) {
      setIsModalOpen(false);
      loadData();
    } else {
      setError(res.error || "Failed to save role.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" role?`)) return;
    const res = await deleteRole(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.error || "Failed to delete role.");
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

  if (!canManageRoles) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-500">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-sm text-slate-400">
          You do not have permission to view or manage role definitions. Contact a Master Admin if you require access.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-1">Roles & Permissions</h1>
          <p className="text-slate-400 text-sm">Define job templates and configure granular permission access levels.</p>
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
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          >
            <Plus className="w-4 h-4" /> Create Role
          </button>
        </div>
      </div>

      {/* Roles Cards Grid */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span>Loading roles...</span>
        </div>
      ) : roles.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
          <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Custom Roles Created</h3>
          <p className="text-xs text-slate-400">Click &quot;Create Role&quot; above to define permissions for staff members.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white">{role.name}</h3>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        role.level === 1
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      Level {role.level}: {role.level === 1 ? "Admin" : "Staff"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {role.permissions.length} of {ALL_PERMISSIONS.length} permissions granted
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(role)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Edit Role"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id, role.name)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                    title="Delete Role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Granted Permissions Badges */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Enabled Permissions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium"
                    >
                      {perm}
                    </span>
                  ))}
                  {role.permissions.length === 0 && (
                    <span className="text-xs text-slate-600 italic">No permissions assigned.</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-2xl font-bold font-display text-white">
                {editingRole ? "Edit Role Template" : "Create New Role Template"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
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

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Role Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cashier, Fleet Manager"
                    value={roleNameInput}
                    onChange={(e) => setRoleNameInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Hierarchy Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value={1}>Level 1 — Admin (Management)</option>
                    <option value={2}>Level 2 — Staff (Standard Employee)</option>
                  </select>
                </div>
              </div>

              {/* Permissions Checkbox Grid */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Permissions ({selectedPermissions.length}/{ALL_PERMISSIONS.length})
                  </label>
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-xs text-orange-400 hover:underline font-bold"
                  >
                    {selectedPermissions.length === ALL_PERMISSIONS.length ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  {ALL_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm);
                    return (
                      <div
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? "bg-orange-500/10 border-orange-500/40 text-white"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-orange-500 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold capitalize">{perm}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Role Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
