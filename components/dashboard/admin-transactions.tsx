"use client"

import { useState } from "react"
import { Check, Copy, ReceiptText, Wallet } from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/dashboard/empty-state"
import type { PaymentRecord } from "@/lib/dashboard-types"
import { formatCurrency, formatDateTime } from "@/lib/format"

function TransactionId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success("Transaction ID copied.")
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.error("Unable to copy the transaction ID.")
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <span
        title={value}
        className="max-w-[9rem] truncate font-mono text-[10px] text-muted-foreground"
      >
        {value || "—"}
      </span>
      {value ? (
        <button
          type="button"
          onClick={copy}
          aria-label="Copy transaction ID"
          className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <Check className="size-3 text-emerald-500" />
          ) : (
            <Copy className="size-3" />
          )}
        </button>
      ) : null}
    </div>
  )
}

export function AdminTransactions({
  payments,
  totalRevenue,
}: {
  payments: PaymentRecord[]
  totalRevenue: number
}) {
  return (
    <>
      <section className="relative isolate mb-5 overflow-hidden rounded-2xl border border-border/70 bg-brand-deep p-5 text-white shadow-[0_24px_60px_-40px_rgba(4,18,38,0.7)] sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-10 size-56 rounded-full bg-primary/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 size-56 rounded-full bg-sky-400/15 blur-3xl"
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-sky-200/70 uppercase">
              <span className="size-1.5 rounded-full bg-gold" />
              Total revenue
            </p>
            <p className="mt-2 font-display text-[2.4rem] leading-none font-semibold tracking-[-0.05em] tabular-nums">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="mt-2 text-[11.5px] text-slate-400">
              Across {payments.length} successful payment
              {payments.length === 1 ? "" : "s"} on the platform.
            </p>
          </div>

          <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-sky-300">
            <Wallet className="size-6" />
          </span>
        </div>
      </section>

      {payments.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="No transactions yet"
          description="Completed Stripe payments will appear here with the customer, technician and transaction details."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/30">
                    {[
                      "Customer",
                      "Technician",
                      "Service",
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
                        <p className="text-[11.5px] font-semibold">
                          {payment.customerName || "Customer"}
                        </p>
                        <p className="mt-0.5 max-w-[12rem] truncate text-[10px] text-muted-foreground">
                          {payment.customerEmail}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-[11.5px] font-medium">
                          {payment.technicianName || "Technician"}
                        </p>
                        <p className="mt-0.5 max-w-[12rem] truncate text-[10px] text-muted-foreground">
                          {payment.technicianEmail}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="max-w-[13rem] truncate text-[11.5px] font-medium">
                          {payment.serviceTitle}
                        </p>
                      </td>

                      <td className="px-4 py-3 font-display text-[12px] font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(payment.amount)}
                      </td>

                      <td className="px-4 py-3">
                        <TransactionId value={payment.transactionId} />
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
                      {formatDateTime(payment.paidAt)}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-[14px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-muted/30 p-2.5">
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                      Customer
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium">
                      {payment.customerName || "Customer"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                      Technician
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium">
                      {payment.technicianName || "Technician"}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    Transaction
                  </span>
                  <TransactionId value={payment.transactionId} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  )
}
