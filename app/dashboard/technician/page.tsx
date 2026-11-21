import type { Metadata } from "next"

import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Technician dashboard",
}

export default async function TechnicianDashboardPage() {
  const { session } = await requireDashboardRole(
    "technician",
    "/dashboard/technician"
  )

  return <DashboardWelcome role="technician" name={session.user.name} />
}
