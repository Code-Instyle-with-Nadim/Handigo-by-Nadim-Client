import { redirect } from "next/navigation"

import { getRoleMeta, normalizeRole, type UserRole } from "@/lib/roles"
import { getServerSession } from "@/lib/session"

/**
 * Guard a dashboard route on the server and keep the visitor on the page they
 * originally asked for after they sign in.
 */
export async function requireDashboardRole(role: UserRole, path: string) {
  const session = await getServerSession()

  if (!session) {
    redirect(`/sign-in?redirect=${encodeURIComponent(path)}`)
  }

  const currentRole = normalizeRole(session.user.role)

  if (currentRole !== role) {
    redirect(getRoleMeta(currentRole).dashboardHref)
  }

  return { session, role: currentRole }
}
