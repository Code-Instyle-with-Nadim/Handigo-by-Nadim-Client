import type { Metadata } from "next"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Search, XCircle } from "lucide-react"

import { CustomerBookings } from "@/components/dashboard/customer-bookings"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { getCustomerBookings } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "My bookings",
}

type SearchParams = {
  payment?: string | string[]
}

function getPaymentNotice(payment?: string | string[]) {
  const value = Array.isArray(payment) ? payment[0] : payment

  if (value === "success") {
    return {
      tone: "success" as const,
      title: "Payment received",
      description:
        "Your payment was confirmed and the receipt is now in your payment history.",
      icon: CheckCircle2,
    }
  }

  if (value === "cancelled") {
    return {
      tone: "warning" as const,
      title: "Checkout cancelled",
      description:
        "No payment was taken. You can use Pay Now again whenever you are ready.",
      icon: AlertCircle,
    }
  }

  if (value === "failed") {
    return {
      tone: "error" as const,
      title: "Payment not confirmed",
      description:
        "We could not verify that payment. If you were charged, please contact support before trying again.",
      icon: XCircle,
    }
  }

  return null
}

export default async function CustomerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { session } = await requireDashboardRole(
    "customer",
    "/dashboard/customer/bookings"
  )
  const params = await searchParams
  const notice = getPaymentNotice(params.payment)
  const NoticeIcon = notice?.icon
  const bookings = await getCustomerBookings(
    session.user.id,
    session.user.email
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Customer workspace"
        title="My bookings"
        description="Track every request, cancel while it is still pending, and pay for completed jobs securely through Stripe."
        actions={
          <Link
            href="/services"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-[12px] font-semibold transition-colors hover:border-primary/25 hover:bg-brand-soft hover:text-primary"
          >
            <Search className="size-3.5" />
            Book another service
          </Link>
        }
      />

      {notice ? (
        <div
          role="status"
          className={
            notice.tone === "success"
              ? "flex items-start gap-3 rounded-2xl border border-emerald-600/20 bg-emerald-50/70 p-3.5 dark:bg-emerald-500/[0.08]"
              : notice.tone === "warning"
                ? "flex items-start gap-3 rounded-2xl border border-amber-600/20 bg-amber-50/70 p-3.5 dark:bg-amber-500/[0.08]"
                : "flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/[0.05] p-3.5"
          }
        >
          <span
            className={
              notice.tone === "success"
                ? "grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : notice.tone === "warning"
                  ? "grid size-8 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "grid size-8 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive"
            }
          >
            {NoticeIcon ? <NoticeIcon className="size-4" /> : null}
          </span>
          <div>
            <p className="text-[12px] font-semibold">{notice.title}</p>
            <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">
              {notice.description}
            </p>
          </div>
        </div>
      ) : null}

      <CustomerBookings bookings={bookings} />
    </div>
  )
}
