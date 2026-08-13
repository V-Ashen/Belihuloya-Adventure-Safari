export const ALL_PERMISSIONS = [
  "view dashboard",
  "view bookings",
  "view messages",
  "view tour CMS",
  "fleet management",
  "view customers",
  "view settings",
  "manage staff",
  "manage roles",
] as const;

export type PermissionType = typeof ALL_PERMISSIONS[number];

export interface RoleDoc {
  id: string;
  name: string;
  level: number; // 1 (Admin) or 2 (Staff)
  permissions: string[];
  createdAt?: string;
}
