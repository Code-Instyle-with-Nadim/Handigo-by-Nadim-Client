import type { Metadata } from "next"

import { AdminTransactions } from "@/components/dashboard/admin-transactions"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { getAdminTransactions } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Transactions",
}

export default async function AdminTransactionsPage() {
  await requireDashboardRole("admin", "/dashboard/admin/transactions")

  const { payments, totalRevenue } = await getAdminTransactions()

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Admin workspace"
        title="Transactions"
        description="Every payment collected through Stripe, with the customer, technician and transaction reference."
      />

      <AdminTransactions payments={payments} totalRevenue={totalRevenue} />
    </div>
  )
}
