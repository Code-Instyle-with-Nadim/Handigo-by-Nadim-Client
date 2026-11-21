import type { Metadata } from "next"

import { AdminBookings } from "@/components/dashboard/admin-bookings"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { getAdminBookings } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "All bookings",
}

export default async function AdminBookingsPage() {
  await requireDashboardRole("admin", "/dashboard/admin/bookings")

  const bookings = await getAdminBookings()

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Admin workspace"
        title="All bookings"
        description="A read-only record of every booking on the platform, with service, customer, technician, status and payment details."
      />

      <AdminBookings bookings={bookings} />
    </div>
  )
}
