export const roles = ["USER", "MANAGER", "ADMIN"] as const;
export type Role = (typeof roles)[number];
const rank: Record<Role, number> = { USER: 1, MANAGER: 2, ADMIN: 3 };

export function isRole(value: unknown): value is Role { return typeof value === "string" && roles.includes(value as Role); }
export function getRole(appMetadata: Record<string, unknown> | undefined): Role { const role = appMetadata?.role; return isRole(role) ? role : "USER"; }
export function hasRole(current: Role, required: Role): boolean { return rank[current] >= rank[required]; }
export function requireRole(current: Role, required: Role): void { if (!hasRole(current, required)) throw new AuthorizationError(); }
export class AuthorizationError extends Error { constructor() { super("You do not have permission to perform this action"); this.name = "AuthorizationError"; } }
