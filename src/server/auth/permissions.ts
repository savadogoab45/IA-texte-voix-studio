import { permissions } from "@/constants";

type UserRole = "USER" | "ADMIN";

const rolePermissions: Record<UserRole, string[]> = {
  USER: [permissions.generateText, permissions.generateAudio, permissions.viewBilling],
  ADMIN: Object.values(permissions)
};

export function hasPermission(role: UserRole, permission: string) {
  return rolePermissions[role]?.includes(permission) ?? false;
}
