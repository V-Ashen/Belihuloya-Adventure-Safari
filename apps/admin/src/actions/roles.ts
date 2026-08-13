"use server";

import { adminDb } from "@belihuloya/core";
import { RoleDoc } from "@/lib/permissions";

export type { RoleDoc };

export async function fetchRoles(): Promise<RoleDoc[]> {
  try {
    const snapshot = await adminDb.collection("roles").get();
    const roles: RoleDoc[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      roles.push({
        id: doc.id,
        name: data.name || "",
        level: Number(data.level) || 2,
        permissions: Array.isArray(data.permissions) ? data.permissions : [],
        createdAt: data.createdAt ? new Date(data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt).toISOString() : undefined,
      });
    });
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

export async function createRole(data: { name: string; level: number; permissions: string[] }) {
  try {
    const docRef = adminDb.collection("roles").doc();
    await docRef.set({
      id: docRef.id,
      name: data.name,
      level: Number(data.level),
      permissions: data.permissions,
      createdAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating role:", error);
    return { success: false, error: error.message || "Failed to create role." };
  }
}

export async function updateRole(id: string, data: { name: string; level: number; permissions: string[] }) {
  try {
    await adminDb.collection("roles").doc(id).update({
      name: data.name,
      level: Number(data.level),
      permissions: data.permissions,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating role:", error);
    return { success: false, error: error.message || "Failed to update role." };
  }
}

export async function deleteRole(id: string) {
  try {
    await adminDb.collection("roles").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting role:", error);
    return { success: false, error: error.message || "Failed to delete role." };
  }
}
