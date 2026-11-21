import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getRoleMeta, normalizeRole } from "@/lib/roles"
import { requireServerSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const session = await requireServerSession("/dashboard")
  const role = normalizeRole(session.user.role)

  redirect(getRoleMeta(role).dashboardHref)
}
