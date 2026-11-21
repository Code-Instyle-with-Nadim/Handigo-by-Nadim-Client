"use client"

import { useMemo, useState } from "react"
import { CalendarDays, ClipboardList, UserRound, Wrench } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { FilterChips } from "@/components/dashboard/filter-chips"
import { ServiceThumb } from "@/components/dashboard/service-thumb"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/dashboard/status-badge"
import { BOOKING_STATUS_OPTIONS } from "@/lib/dashboard-constants"
import type { BookingRecord, BookingStatus } from "@/lib/dashboard-types"
import { formatCurrency, formatDate } from "@/lib/format"

type FilterValue = BookingStatus | "all"

function BookingAmount({ booking }: { booking: BookingRecord }) {
  const finalAmount = booking.finalAmount
  const amount = finalAmount ?? booking.basePrice

  return (
    <div>
      <p className="font-display text-[12px] font-semibold tabular-nums">
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

export function AdminBookings({ bookings }: { bookings: BookingRecord[] }) {
  const [filter, setFilter] = useState<FilterValue>("all")

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

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No bookings yet"
        description="Every booking made on the platform will appear here as a read-only record."
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
          <table className="w-full min-w-[1040px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/70 bg-muted/30">
                {[
                  "Service",
                  "Customer",
                  "Technician",
                  "Date",
                  "Status",
                  "Payment",
                  "Amount",
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
                    <div className="flex items-center gap-2.5">
                      <ServiceThumb
                        title={booking.serviceTitle}
                        image={booking.serviceImage}
                        className="size-9"
                      />
                      <div className="min-w-0">
                        <p className="max-w-[13rem] truncate text-[11.5px] font-semibold">
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
                      {booking.customerName || "Customer"}
                    </p>
                    <p className="mt-0.5 max-w-[12rem] truncate text-[10px] text-muted-foreground">
                      {booking.customerEmail}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-[11.5px] font-medium">
                      {booking.technicianName || "Technician"}
                    </p>
                    <p className="mt-0.5 max-w-[12rem] truncate text-[10px] text-muted-foreground">
                      {booking.technicianEmail}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-[11px] text-muted-foreground">
                    {formatDate(booking.preferredDate)}
                  </td>

                  <td className="px-4 py-3">
                    <BookingStatusBadge status={booking.status} />
                  </td>

                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </td>

                  <td className="px-4 py-3">
                    <BookingAmount booking={booking} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((booking) => (
          <article
            key={booking.id}
            className="rounded-2xl border border-border/70 bg-card p-3.5 shadow-[0_1px_2px_rgba(11,27,52,0.03)]"
          >
            <div className="flex items-start gap-2.5">
              <ServiceThumb
                title={booking.serviceTitle}
                image={booking.serviceImage}
                className="size-10"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold">
                  {booking.serviceTitle}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {booking.category}
                </p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-muted/30 p-2.5">
              <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                  Customer
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium">
                  <UserRound className="size-3 text-muted-foreground" />
                  {booking.customerName || "Customer"}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                  Technician
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium">
                  <Wrench className="size-3 text-muted-foreground" />
                  {booking.technicianName || "Technician"}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                  Date
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium">
                  <CalendarDays className="size-3 text-muted-foreground" />
                  {formatDate(booking.preferredDate)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                  Amount
                </p>
                <div className="mt-0.5">
                  <BookingAmount booking={booking} />
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Payment status
              </span>
              <PaymentStatusBadge status={booking.paymentStatus} />
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
