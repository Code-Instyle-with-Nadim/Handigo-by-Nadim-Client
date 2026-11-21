import type {
  ApprovalStatus,
  BookingStatus,
  PaymentStatus,
  ServiceMode,
} from "@/lib/dashboard-types"
import type { UserRole } from "@/lib/roles"

type StatusMeta = {
  label: string
  badgeClass: string
  dotClass: string
}

export const BOOKING_STATUS_META: Record<BookingStatus, StatusMeta> = {
  requested: {
    label: "Requested",
    badgeClass:
      "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
    dotClass: "bg-amber-500",
  },
  accepted: {
    label: "Accepted",
    badgeClass:
      "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
    dotClass: "bg-sky-500",
  },
  "in-progress": {
    label: "In Progress",
    badgeClass:
      "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20",
    dotClass: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    badgeClass:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    dotClass: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    badgeClass:
      "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20",
    dotClass: "bg-rose-500",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass:
      "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20",
    dotClass: "bg-slate-400",
  },
}

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusMeta> = {
  unpaid: {
    label: "Unpaid",
    badgeClass:
      "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
    dotClass: "bg-amber-500",
  },
  paid: {
    label: "Paid",
    badgeClass:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    dotClass: "bg-emerald-500",
  },
}

export const APPROVAL_STATUS_META: Record<ApprovalStatus, StatusMeta> = {
  pending: {
    label: "Pending",
    badgeClass:
      "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
    dotClass: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    badgeClass:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    dotClass: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    badgeClass:
      "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20",
    dotClass: "bg-rose-500",
  },
}

export const SERVICE_MODE_META: Record<ServiceMode, string> = {
  "home-visit": "Home Visit",
  "shop-drop-off": "Shop Drop-off",
}

export const SERVICE_MODE_OPTIONS: { value: ServiceMode; label: string }[] = [
  { value: "home-visit", label: "Home Visit" },
  { value: "shop-drop-off", label: "Shop Drop-off" },
]

export const BOOKING_STATUS_OPTIONS: {
  value: BookingStatus | "all"
  label: string
}[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
]

export const APPROVAL_STATUS_OPTIONS: {
  value: ApprovalStatus | "all"
  label: string
}[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "technician", label: "Technician" },
  { value: "admin", label: "Admin" },
]
