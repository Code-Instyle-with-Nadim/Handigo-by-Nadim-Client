import type { Metadata } from "next"

import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Admin dashboard",
}

export default async function AdminDashboardPage() {
  const { session } = await requireDashboardRole("admin", "/dashboard/admin")

  return <DashboardWelcome role="admin" name={session.user.name} />
}
