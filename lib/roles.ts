export type UserRole = "customer" | "technician" | "admin"

type RoleMeta = {
  label: string
  dashboardHref: string
  badgeClass: string
  dotClass: string
}

export const ROLE_META: Record<UserRole, RoleMeta> = {
  customer: {
    label: "Customer",
    dashboardHref: "/dashboard/customer",
    badgeClass:
      "bg-blue-50 text-blue-700 ring-blue-600/15 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20",
    dotClass: "bg-blue-500",
  },
  technician: {
    label: "Technician",
    dashboardHref: "/dashboard/technician",
    badgeClass:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    dotClass: "bg-emerald-500",
  },
  admin: {
    label: "Admin",
    dashboardHref: "/dashboard/admin",
    badgeClass:
      "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
    dotClass: "bg-amber-500",
  },
}

export function normalizeRole(role?: string | null): UserRole {
  if (role === "admin" || role === "technician" || role === "customer") {
    return role
  }

  // Treat older "provider" style roles as technicians.
  if (role === "provider" || role === "expert") {
    return "technician"
  }

  return "customer"
}

export function getRoleMeta(role?: string | null) {
  return ROLE_META[normalizeRole(role)]
}
