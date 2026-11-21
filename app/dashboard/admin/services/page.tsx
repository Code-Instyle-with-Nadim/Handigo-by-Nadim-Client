import type { Metadata } from "next"

import { AdminServices } from "@/components/dashboard/admin-services"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { getAdminServices } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Service approval",
}

export default async function AdminServicesPage() {
  await requireDashboardRole("admin", "/dashboard/admin/services")

  const services = await getAdminServices()
  const pending = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Admin workspace"
        title="Service approval"
        description={`Review every technician listing. Pending services are shown first${
          pending > 0 ? ` — ${pending} waiting for you.` : "."
        }`}
      />

      <AdminServices services={services} />
    </div>
  )
}
