"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  CreditCard,
  Loader2,
  ReceiptText,
  UserRound,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/dashboard/empty-state"
import { FilterChips } from "@/components/dashboard/filter-chips"
import { Modal } from "@/components/dashboard/modal"
import { ServiceThumb } from "@/components/dashboard/service-thumb"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/dashboard/status-badge"
import { cancelBooking } from "@/lib/actions/booking-actions"
import { startBookingPayment } from "@/lib/actions/payment-actions"
import { BOOKING_STATUS_OPTIONS } from "@/lib/dashboard-constants"
import type { BookingRecord, BookingStatus } from "@/lib/dashboard-types"
import { formatCurrency, formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

type FilterValue = BookingStatus | "all"

const buttonBase =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-60"

function Amount({
  booking,
  className,
}: {
  booking: BookingRecord
  className?: string
}) {
  const finalAmount = booking.finalAmount
  const amount = finalAmount ?? booking.basePrice

  return (
    <div className={className}>
      <p className="font-display text-[13px] font-semibold tabular-nums">
        {formatCurrency(amount)}
      </p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">
        {finalAmount !== null && finalAmount !== booking.basePrice
          ? `Base ${formatCurrency(booking.basePrice)}`
          : "Base price"}
      </p>
    </div>
  )
}

export function CustomerBookings({ bookings }: { bookings: BookingRecord[] }) {
  const router = useRouter()

  const [filter, setFilter] = useState<FilterValue>("all")
  const [cancelTarget, setCancelTarget] = useState<BookingRecord | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [payingId, setPayingId] = useState<string | null>(null)

  const counts = useMemo(() => {
    const next: Partial<Record<FilterValue, number>> = { all: bookings.length }

    for (const booking of bookings) {
      next[booking.status] = (next[booking.status] ?? 0) + 1
    }

    return next
  }, [bookings])

  const filtered = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filter),
    [bookings, filter]
  )

  async function handleCancel() {
    if (!cancelTarget) return

    setCancelling(true)

    try {
      const result = await cancelBooking(cancelTarget.id)

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success(result.message)
      setCancelTarget(null)
      router.refresh()
    } catch {
      toast.error("Unable to cancel this booking. Please try again.")
    } finally {
      setCancelling(false)
    }
  }

  async function handlePay(booking: BookingRecord) {
    setPayingId(booking.id)

    try {
      const result = await startBookingPayment(booking.id)

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      if (result.data?.url) {
        toast.success("Taking you to Stripe Checkout…")
        window.location.assign(result.data.url)
      }
    } catch {
      toast.error("Unable to start payment. Please try again.")
    } finally {
      setPayingId(null)
    }
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="No bookings yet"
        description="When you book a service, it will appear here with its status, payment state and technician."
        action={
          <a
            href="/services"
            className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse services
          </a>
        }
      />
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          options={BOOKING_STATUS_OPTIONS}
          value={filter}
          onChange={setFilter}
          counts={counts}
        />
        <p className="text-[10.5px] text-muted-foreground">
          {filtered.length} of {bookings.length} booking
          {bookings.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/70 bg-muted/30">
                {[
                  "Service",
                  "Technician",
                  "Preferred date",
                  "Amount",
                  "Status",
                  "Payment",
                  "Actions",
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
              {filtered.map((booking) => {
                const canCancel = booking.status === "requested"
                const canPay =
                  booking.status === "completed" &&
                  booking.paymentStatus === "unpaid"
                const isPaying = payingId === booking.id

                return (
                  <tr
                    key={booking.id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <ServiceThumb
                          title={booking.serviceTitle}
                          image={booking.serviceImage}
                          className="size-10"
                        />
                        <div className="min-w-0">
                          <p className="max-w-[13rem] truncate text-[12px] font-semibold">
                            {booking.serviceTitle}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {booking.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-[11.5px] font-medium">
                        {booking.technicianName || "—"}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="flex items-center gap-1.5 text-[11.5px] text-foreground/80">
                        <CalendarDays className="size-3.5 text-muted-foreground" />
                        {formatDate(booking.preferredDate)}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <Amount booking={booking} />
                    </td>

                    <td className="px-4 py-3">
                      <BookingStatusBadge status={booking.status} />
                    </td>

                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={booking.paymentStatus} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {canCancel ? (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(booking)}
                            className={cn(
                              buttonBase,
                              "border border-destructive/20 bg-destructive/[0.06] text-destructive hover:bg-destructive/10"
                            )}
                          >
                            <XCircle className="size-3.5" />
                            Cancel
                          </button>
                        ) : null}

                        {canPay ? (
                          <button
                            type="button"
                            disabled={isPaying}
                            onClick={() => handlePay(booking)}
                            className={cn(
                              buttonBase,
                              "bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] text-white shadow-[0_8px_18px_-12px_rgba(37,99,235,0.9)] hover:brightness-110"
                            )}
                          >
                            {isPaying ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <CreditCard className="size-3.5" />
                            )}
                            {isPaying ? "Opening…" : "Pay Now"}
                          </button>
                        ) : null}

                        {booking.status === "completed" &&
                        booking.paymentStatus === "paid" ? (
                          <span className="text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400">
                            Receipt ready
                          </span>
                        ) : null}

                        {!canCancel && !canPay && booking.paymentStatus !== "paid" ? (
                          <span className="text-[10.5px] text-muted-foreground/60">
                            No action
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((booking) => {
          const canCancel = booking.status === "requested"
          const canPay =
            booking.status === "completed" && booking.paymentStatus === "unpaid"
          const isPaying = payingId === booking.id

          return (
            <article
              key={booking.id}
              className="rounded-2xl border border-border/70 bg-card p-3.5 shadow-[0_1px_2px_rgba(11,27,52,0.03)]"
            >
              <div className="flex items-start gap-2.5">
                <ServiceThumb
                  title={booking.serviceTitle}
                  image={booking.serviceImage}
                  className="size-11"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">{booking.serviceTitle}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                    {booking.category}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-muted/30 p-2.5">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                    Technician
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium">
                    <UserRound className="size-3.5 text-muted-foreground" />
                    {booking.technicianName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                    Preferred date
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium">
                    <CalendarDays className="size-3.5 text-muted-foreground" />
                    {formatDate(booking.preferredDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                    Amount
                  </p>
                  <Amount booking={booking} className="mt-1" />
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                    Payment
                  </p>
                  <PaymentStatusBadge
                    status={booking.paymentStatus}
                    className="mt-1"
                  />
                </div>
              </div>

              {canCancel || canPay ? (
                <div className="mt-3 flex gap-2">
                  {canCancel ? (
                    <button
                      type="button"
                      onClick={() => setCancelTarget(booking)}
                      className={cn(
                        buttonBase,
                        "flex-1 border border-destructive/20 bg-destructive/[0.06] text-destructive hover:bg-destructive/10"
                      )}
                    >
                      <XCircle className="size-3.5" />
                      Cancel
                    </button>
                  ) : null}

                  {canPay ? (
                    <button
                      type="button"
                      disabled={isPaying}
                      onClick={() => handlePay(booking)}
                      className={cn(
                        buttonBase,
                        "flex-1 bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] text-white hover:brightness-110"
                      )}
                    >
                      {isPaying ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <CreditCard className="size-3.5" />
                      )}
                      {isPaying ? "Opening…" : "Pay Now"}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </article>
          )
        })}
      </div>

      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => {
          if (!cancelling) setCancelTarget(null)
        }}
        title="Cancel this booking?"
        description="This tells the technician you no longer need the visit. You can always book again later."
        size="sm"
        footer={
          <>
            <button
              type="button"
              disabled={cancelling}
              onClick={() => setCancelTarget(null)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-[12px] font-semibold transition-colors hover:bg-muted disabled:opacity-60"
            >
              Keep booking
            </button>
            <button
              type="button"
              disabled={cancelling}
              onClick={handleCancel}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-destructive px-4 text-[12px] font-semibold text-white transition-colors hover:bg-destructive/90 disabled:opacity-60"
            >
              {cancelling ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <XCircle className="size-3.5" />
              )}
              {cancelling ? "Cancelling…" : "Yes, cancel"}
            </button>
          </>
        }
      >
        {cancelTarget ? (
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
            <p className="text-[12px] font-semibold">{cancelTarget.serviceTitle}</p>
            <p className="mt-1 text-[10.5px] text-muted-foreground">
              {cancelTarget.technicianName || "Technician"} ·{" "}
              {formatDate(cancelTarget.preferredDate)}
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
