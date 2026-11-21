import type { Metadata } from "next"

import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { TechnicianRequests } from "@/components/dashboard/technician-requests"
import { getTechnicianBookings } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Manage requests",
}

export default async function TechnicianRequestsPage() {
  const { session } = await requireDashboardRole(
    "technician",
    "/dashboard/technician/requests"
  )
  const bookings = await getTechnicianBookings(
    session.user.email,
    session.user.id
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Technician workspace"
        title="Manage requests"
        description="Accept or reject new requests, start work when you arrive, and mark a job completed with the final amount."
      />

      <TechnicianRequests bookings={bookings} />
    </div>
  )
}
