"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Inbox,
  Loader2,
  MapPin,
  Phone,
  Play,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/dashboard/empty-state"
import { FilterChips } from "@/components/dashboard/filter-chips"
import { FormField, fieldInputClass } from "@/components/dashboard/form-field"
import { Modal } from "@/components/dashboard/modal"
import { ServiceThumb } from "@/components/dashboard/service-thumb"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/dashboard/status-badge"
import {
  acceptBooking,
  completeBooking,
  rejectBooking,
  startBooking,
} from "@/lib/actions/booking-actions"
import type { ActionResult } from "@/lib/actions/action-result"
import type { BookingRecord } from "@/lib/dashboard-types"
import { formatCurrency, formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

type FilterValue = "all" | "requested" | "accepted" | "in-progress" | "completed"

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

const actionButton =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-60"

function RequestActions({
  booking,
  actionKey,
  onAccept,
  onReject,
  onStart,
  onComplete,
}: {
  booking: BookingRecord
  actionKey: string | null
  onAccept: () => void
  onReject: () => void
  onStart: () => void
  onComplete: () => void
}) {
  const isBusy = (key: string) => actionKey === key

  if (booking.status === "requested") {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          disabled={Boolean(actionKey)}
          onClick={onAccept}
          className={cn(
            actionButton,
            "border border-emerald-600/20 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
          )}
        >
          {isBusy(`${booking.id}:accept`) ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Check className="size-3.5" />
          )}
          Accept
        </button>

        <button
          type="button"
          disabled={Boolean(actionKey)}
          onClick={onReject}
          className={cn(
            actionButton,
            "border border-destructive/20 bg-destructive/[0.06] text-destructive hover:bg-destructive/10"
          )}
        >
          {isBusy(`${booking.id}:reject`) ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <X className="size-3.5" />
          )}
          Reject
        </button>
      </div>
    )
  }

  if (booking.status === "accepted") {
    return (
      <button
        type="button"
        disabled={Boolean(actionKey)}
        onClick={onStart}
        className={cn(
          actionButton,
          "bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] text-white shadow-[0_8px_18px_-12px_rgba(37,99,235,0.9)] hover:brightness-110"
        )}
      >
        {isBusy(`${booking.id}:start`) ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Play className="size-3.5" />
        )}
        Start Work
      </button>
    )
  }

  if (booking.status === "in-progress") {
    return (
      <button
        type="button"
        disabled={Boolean(actionKey)}
        onClick={onComplete}
        className={cn(
          actionButton,
          "border border-emerald-600/20 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
        )}
      >
        <CheckCircle2 className="size-3.5" />
        Mark Completed
      </button>
    )
  }

  if (booking.status === "completed") {
    return (
      <div className="flex items-center gap-1.5">
        <PaymentStatusBadge status={booking.paymentStatus} />
        <span className="text-[10px] text-muted-foreground">
          {formatCurrency(booking.finalAmount ?? booking.basePrice)}
        </span>
      </div>
    )
  }

  return (
    <span className="text-[10.5px] text-muted-foreground/60">
      No action needed
    </span>
  )
}

export function TechnicianRequests({
  bookings,
}: {
  bookings: BookingRecord[]
}) {
  const router = useRouter()

  const [filter, setFilter] = useState<FilterValue>("all")
  const [actionKey, setActionKey] = useState<string | null>(null)
  const [completeTarget, setCompleteTarget] = useState<BookingRecord | null>(null)
  const [finalAmount, setFinalAmount] = useState("")
  const [amountError, setAmountError] = useState<string | undefined>()
  const [completing, setCompleting] = useState(false)

  const counts = useMemo(() => {
    const next: Partial<Record<FilterValue, number>> = { all: bookings.length }

    for (const booking of bookings) {
      if (
        booking.status === "requested" ||
        booking.status === "accepted" ||
        booking.status === "in-progress" ||
        booking.status === "completed"
      ) {
        next[booking.status] = (next[booking.status] ?? 0) + 1
      }
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

  async function runAction(
    key: string,
    action: () => Promise<ActionResult>,
    successFallback: string
  ) {
    setActionKey(key)

    try {
      const result = await action()

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success(result.message || successFallback)
      router.refresh()
    } catch {
      toast.error("Unable to update this request. Please try again.")
    } finally {
      setActionKey(null)
    }
  }

  function openComplete(booking: BookingRecord) {
    setCompleteTarget(booking)
    setFinalAmount(String(booking.finalAmount ?? booking.basePrice))
    setAmountError(undefined)
  }

  async function handleComplete() {
    if (!completeTarget) return

    const amount = Number(finalAmount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setAmountError("Enter a positive final amount.")
      return
    }

    setAmountError(undefined)
    setCompleting(true)

    try {
      const result = await completeBooking(completeTarget.id, amount)

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success(result.message)
      setCompleteTarget(null)
      router.refresh()
    } catch {
      toast.error("Unable to complete this job. Please try again.")
    } finally {
      setCompleting(false)
    }
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No requests yet"
        description="When a customer books one of your services, their request will appear here with everything you need to respond."
      />
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          options={FILTER_OPTIONS}
          value={filter}
          onChange={setFilter}
          counts={counts}
        />
        <p className="text-[10.5px] text-muted-foreground">
          {filtered.length} of {bookings.length} request
          {bookings.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/70 bg-muted/30">
                {[
                  "Customer",
                  "Service & date",
                  "Problem",
                  "Status",
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
              {filtered.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <p className="text-[12px] font-semibold">
                      {booking.customerName || "Customer"}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                      <Phone className="size-3" />
                      {booking.customerPhone || "No phone"}
                    </p>
                    <p className="mt-0.5 flex max-w-[15rem] items-start gap-1.5 text-[10.5px] text-muted-foreground">
                      <MapPin className="mt-0.5 size-3 shrink-0" />
                      <span className="line-clamp-2">
                        {booking.customerAddress || "No address"}
                      </span>
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <ServiceThumb
                        title={booking.serviceTitle}
                        image={booking.serviceImage}
                        className="size-9"
                      />
                      <div className="min-w-0">
                        <p className="max-w-[12rem] truncate text-[11.5px] font-semibold">
                          {booking.serviceTitle}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <CalendarDays className="size-3" />
                          {formatDate(booking.preferredDate)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <p
                      title={booking.problemDescription}
                      className="line-clamp-2 max-w-[16rem] text-[11px] leading-relaxed text-muted-foreground"
                    >
                      {booking.problemDescription || "No description provided."}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <BookingStatusBadge status={booking.status} />
                  </td>

                  <td className="px-4 py-3">
                    <RequestActions
                      booking={booking}
                      actionKey={actionKey}
                      onAccept={() =>
                        runAction(
                          `${booking.id}:accept`,
                          () => acceptBooking(booking.id),
                          "Booking accepted."
                        )
                      }
                      onReject={() =>
                        runAction(
                          `${booking.id}:reject`,
                          () => rejectBooking(booking.id),
                          "Booking rejected."
                        )
                      }
                      onStart={() =>
                        runAction(
                          `${booking.id}:start`,
                          () => startBooking(booking.id),
                          "Work started."
                        )
                      }
                      onComplete={() => openComplete(booking)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 lg:hidden">
        {filtered.map((booking) => (
          <article
            key={booking.id}
            className="rounded-2xl border border-border/70 bg-card p-3.5 shadow-[0_1px_2px_rgba(11,27,52,0.03)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold">
                  {booking.customerName || "Customer"}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                  <Phone className="size-3" />
                  {booking.customerPhone || "No phone"}
                </p>
                <p className="mt-0.5 flex items-start gap-1.5 text-[10.5px] text-muted-foreground">
                  <MapPin className="mt-0.5 size-3 shrink-0" />
                  <span>{booking.customerAddress || "No address"}</span>
                </p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-muted/30 p-2.5">
              <ServiceThumb
                title={booking.serviceTitle}
                image={booking.serviceImage}
                className="size-9"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-semibold">
                  {booking.serviceTitle}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <CalendarDays className="size-3" />
                  {formatDate(booking.preferredDate)}
                </p>
              </div>
            </div>

            <div className="mt-2.5">
              <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                Problem
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {booking.problemDescription || "No description provided."}
              </p>
            </div>

            <div className="mt-3 border-t border-border/70 pt-3">
              <RequestActions
                booking={booking}
                actionKey={actionKey}
                onAccept={() =>
                  runAction(
                    `${booking.id}:accept`,
                    () => acceptBooking(booking.id),
                    "Booking accepted."
                  )
                }
                onReject={() =>
                  runAction(
                    `${booking.id}:reject`,
                    () => rejectBooking(booking.id),
                    "Booking rejected."
                  )
                }
                onStart={() =>
                  runAction(
                    `${booking.id}:start`,
                    () => startBooking(booking.id),
                    "Work started."
                  )
                }
                onComplete={() => openComplete(booking)}
              />
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(completeTarget)}
        onClose={() => {
          if (!completing) setCompleteTarget(null)
        }}
        title="Mark job as completed"
        description="Enter the final amount the customer should pay. The base price is filled in for you."
        size="sm"
        footer={
          <>
            <button
              type="button"
              disabled={completing}
              onClick={() => setCompleteTarget(null)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-[12px] font-semibold transition-colors hover:bg-muted disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={completing}
              onClick={handleComplete}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-[12px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              {completing ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3.5" />
              )}
              {completing ? "Completing…" : "Complete job"}
            </button>
          </>
        }
      >
        {completeTarget ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
              <p className="text-[12px] font-semibold">
                {completeTarget.serviceTitle}
              </p>
              <p className="mt-1 text-[10.5px] text-muted-foreground">
                {completeTarget.customerName} ·{" "}
                {formatDate(completeTarget.preferredDate)}
              </p>
              <p className="mt-1 text-[10.5px] text-muted-foreground">
                Base price: {formatCurrency(completeTarget.basePrice)}
              </p>
            </div>

            <FormField
              id="final-amount"
              label="Final amount (USD)"
              error={amountError}
              hint="This is the amount the customer will pay through Stripe."
            >
              <input
                id="final-amount"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={finalAmount}
                disabled={completing}
                onChange={(event) => {
                  setFinalAmount(event.target.value)
                  setAmountError(undefined)
                }}
                className={fieldInputClass}
              />
            </FormField>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
