import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"

import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { TechnicianServices } from "@/components/dashboard/technician-services"
import { getTechnicianServices } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "My services",
}

export default async function TechnicianServicesPage() {
  const { session } = await requireDashboardRole(
    "technician",
    "/dashboard/technician/my-services"
  )
  const services = await getTechnicianServices(
    session.user.email,
    session.user.id
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Technician workspace"
        title="My services"
        description="Edit a listing, pause it from public pages, or delete it entirely. Saving an edit sends it back for approval."
        actions={
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)] transition-all hover:brightness-110"
          >
            <Plus className="size-3.5" />
            Add a service
          </Link>
        }
      />

      <TechnicianServices services={services} />
    </div>
  )
}
