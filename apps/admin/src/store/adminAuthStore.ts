import { create } from "zustand";

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AdminAuthStore {
  user: AdminUser | null;
  roleName: string | null;
  roleCode: number | null;
  permissions: string[] | null;
  isLoading: boolean;
  setAdminData: (
    user: AdminUser | null,
    roleName: string | null,
    roleCode: number | null,
    permissions: string[] | null
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
  hasPermission: (permission: string) => boolean;
  clearAdminData: () => void;
}

export const useAdminAuthStore = create<AdminAuthStore>((set, get) => ({
  user: null,
  roleName: null,
  roleCode: null,
  permissions: null,
  isLoading: true,
  setAdminData: (user, roleName, roleCode, permissions) =>
    set({ user, roleName, roleCode, permissions, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearAdminData: () => set({ user: null, roleName: null, roleCode: null, permissions: null, isLoading: false }),
  hasPermission: (permission) => {
    const state = get();
    // Master Admin (0) bypasses all permission checks
    if (state.roleCode === 0 || state.roleName === "Master Admin") return true;
    return !!state.permissions && state.permissions.includes(permission);
  },
}));
