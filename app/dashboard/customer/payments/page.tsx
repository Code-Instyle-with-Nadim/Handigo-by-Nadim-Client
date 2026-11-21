import type { Metadata } from "next"
import { ReceiptText, Wallet } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { getCustomerPayments } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"
import { formatCurrency, formatDateTime } from "@/lib/format"

export const metadata: Metadata = {
  title: "Payment history",
}

export default async function CustomerPaymentsPage() {
  const { session } = await requireDashboardRole(
    "customer",
    "/dashboard/customer/payments"
  )
  const payments = await getCustomerPayments(
    session.user.id,
    session.user.email
  )
  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Customer workspace"
        title="Payment history"
        description="Every successful Stripe payment, with the technician, amount and transaction reference."
      />

      <section className="relative isolate overflow-hidden rounded-2xl border border-border/70 bg-card p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_80%_50%,rgba(37,99,235,0.1),transparent_65%)]"
        />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground/70 uppercase">
              Total paid
            </p>
            <p className="mt-2 font-display text-[2.2rem] leading-none font-semibold tracking-[-0.05em] tabular-nums">
              {formatCurrency(totalSpent)}
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {payments.length} successful payment
              {payments.length === 1 ? "" : "s"}.
            </p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-primary ring-1 ring-primary/10">
            <Wallet className="size-5" />
          </span>
        </div>
      </section>

      {payments.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="No payments yet"
          description="Once you pay for a completed booking, the receipt and transaction details will appear here."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/30">
                    {[
                      "Service",
                      "Technician",
                      "Amount",
                      "Transaction ID",
                      "Payment date",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-4 py-2.5 text-[9.5px] font-bold tracking-[0.13em] text-muted-foreground/70 uppercase"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-4 py-3">
                        <p className="max-w-[16rem] truncate text-[11.5px] font-semibold">
                          {payment.serviceTitle}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[11.5px] text-foreground/80">
                        {payment.technicianName || "—"}
                      </td>
                      <td className="px-4 py-3 font-display text-[12px] font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          title={payment.transactionId}
                          className="block max-w-[12rem] truncate font-mono text-[10px] text-muted-foreground"
                        >
                          {payment.transactionId || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground">
                        {formatDateTime(payment.paidAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-3 md:hidden">
            {payments.map((payment) => (
              <article
                key={payment.id}
                className="rounded-2xl border border-border/70 bg-card p-3.5 shadow-[0_1px_2px_rgba(11,27,52,0.03)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold">
                      {payment.serviceTitle}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {payment.technicianName || "Technician"}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-[14px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>

                <div className="mt-3 rounded-xl bg-muted/30 p-2.5">
                  <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                    Transaction ID
                  </p>
                  <p
                    title={payment.transactionId}
                    className="mt-1 truncate font-mono text-[10px] text-muted-foreground"
                  >
                    {payment.transactionId || "—"}
                  </p>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {formatDateTime(payment.paidAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
