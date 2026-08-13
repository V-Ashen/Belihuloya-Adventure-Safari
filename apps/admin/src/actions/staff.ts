"use server";

import { adminDb } from "@belihuloya/core";

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  roleName: string;
  roleCode: number; // 0: Master Admin, 1: Admin, 2: Staff
  createdAt?: string;
}

export async function fetchUsers(): Promise<UserDoc[]> {
  try {
    const snapshot = await adminDb.collection("users").get();
    const users: UserDoc[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        roleName: data.roleName || "Staff",
        roleCode: typeof data.roleCode === "number" ? data.roleCode : 2,
        createdAt: data.createdAt ? new Date(data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt).toISOString() : undefined,
      });
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

import { ALL_PERMISSIONS } from "@/lib/permissions";

export async function fetchUserRoleAndPermissions(uid: string, email?: string | null): Promise<{
  roleName: string;
  roleCode: number;
  permissions: string[];
}> {
  try {
    let userData: any = null;
    try {
      const userDoc = await adminDb.collection("users").doc(uid).get();

      if (userDoc.exists) {
        userData = userDoc.data();
      } else if (email) {
        const snap = await adminDb.collection("users").where("email", "==", email).limit(1).get();
        if (!snap.empty) {
          userData = snap.docs[0].data();
        }
      }
    } catch (dbErr) {
      console.warn("Firestore query warning, using Master Admin fallback:", dbErr);
    }

    // Fallback: If no specific user doc found, default authenticated user to Master Admin
    if (!userData) {
      return {
        roleName: "Master Admin",
        roleCode: 0,
        permissions: [...ALL_PERMISSIONS],
      };
    }

    const roleName = userData?.roleName || "Master Admin";
    const roleCode = userData?.roleCode !== undefined ? Number(userData.roleCode) : 0;

    if (roleCode === 0 || roleName === "Master Admin") {
      // Master admin has full implicit access to all permissions
      return { 
        roleName: "Master Admin", 
        roleCode: 0, 
        permissions: [...ALL_PERMISSIONS] 
      };
    }

    // Fetch corresponding role permissions from `roles` collection
    try {
      const rolesSnapshot = await adminDb.collection("roles").where("name", "==", roleName).limit(1).get();
      if (!rolesSnapshot.empty) {
        const roleData = rolesSnapshot.docs[0].data();
        return {
          roleName,
          roleCode,
          permissions: Array.isArray(roleData.permissions) ? roleData.permissions : [],
        };
      }
    } catch (roleErr) {
      console.warn("Role fetch warning:", roleErr);
    }

    return { roleName, roleCode, permissions: [...ALL_PERMISSIONS] };
  } catch (error) {
    console.error("Error fetching user role & permissions:", error);
    return { roleName: "Master Admin", roleCode: 0, permissions: [...ALL_PERMISSIONS] };
  }
}

export async function saveUserDoc(data: {
  uid: string;
  email: string;
  displayName: string;
  roleName: string;
  roleCode: number;
}) {
  try {
    await adminDb.collection("users").doc(data.uid).set({
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      roleName: data.roleName,
      roleCode: Number(data.roleCode),
      createdAt: new Date(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error saving user doc:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(uid: string, roleName: string, roleCode: number) {
  try {
    await adminDb.collection("users").doc(uid).update({
      roleName,
      roleCode: Number(roleCode),
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUserDoc(uid: string) {
  try {
    await adminDb.collection("users").doc(uid).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user doc:", error);
    return { success: false, error: error.message };
  }
}
