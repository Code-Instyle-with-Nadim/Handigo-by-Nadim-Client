import type { Metadata } from "next"

import { AdminUsers } from "@/components/dashboard/admin-users"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { getAdminUsers } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Manage users",
}

export default async function AdminUsersPage() {
  const { session } = await requireDashboardRole(
    "admin",
    "/dashboard/admin/users"
  )
  const users = await getAdminUsers()
  const currentUserId = session.user.id

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Admin workspace"
        title="Manage users"
        description="Every account on the platform. Change a role when someone joins the team or moves between customer and technician."
      />

      <AdminUsers users={users} currentUserId={currentUserId} />
    </div>
  )
}
