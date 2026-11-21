import type { Metadata } from "next"

import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Customer dashboard",
}

export default async function CustomerDashboardPage() {
  const { session } = await requireDashboardRole(
    "customer",
    "/dashboard/customer"
  )

  return <DashboardWelcome role="customer" name={session.user.name} />
}
