import { cn } from "@/lib/utils"
import {
  APPROVAL_STATUS_META,
  BOOKING_STATUS_META,
  PAYMENT_STATUS_META,
} from "@/lib/dashboard-constants"
import type {
  ApprovalStatus,
  BookingStatus,
  PaymentStatus,
} from "@/lib/dashboard-types"

function Badge({
  label,
  badgeClass,
  dotClass,
  className,
}: {
  label: string
  badgeClass: string
  dotClass: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] whitespace-nowrap uppercase ring-1 ring-inset",
        badgeClass,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClass)} />
      {label}
    </span>
  )
}

export function BookingStatusBadge({
  status,
  className,
}: {
  status: BookingStatus
  className?: string
}) {
  const meta = BOOKING_STATUS_META[status] ?? BOOKING_STATUS_META.requested

  return (
    <Badge
      label={meta.label}
      badgeClass={meta.badgeClass}
      dotClass={meta.dotClass}
      className={className}
    />
  )
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus
  className?: string
}) {
  const meta = PAYMENT_STATUS_META[status] ?? PAYMENT_STATUS_META.unpaid

  return (
    <Badge
      label={meta.label}
      badgeClass={meta.badgeClass}
      dotClass={meta.dotClass}
      className={className}
    />
  )
}

export function ApprovalStatusBadge({
  status,
  className,
}: {
  status: ApprovalStatus
  className?: string
}) {
  const meta = APPROVAL_STATUS_META[status] ?? APPROVAL_STATUS_META.pending

  return (
    <Badge
      label={meta.label}
      badgeClass={meta.badgeClass}
      dotClass={meta.dotClass}
      className={className}
    />
  )
}

export function AvailabilityBadge({
  isAvailable,
  className,
}: {
  isAvailable: boolean
  className?: string
}) {
  return (
    <Badge
      label={isAvailable ? "Available" : "Unavailable"}
      badgeClass={
        isAvailable
          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20"
          : "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20"
      }
      dotClass={isAvailable ? "bg-emerald-500" : "bg-slate-400"}
      className={className}
    />
  )
}
