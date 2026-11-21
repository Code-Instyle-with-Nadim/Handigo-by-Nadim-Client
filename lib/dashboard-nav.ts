import {
  CalendarCheck,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import type { UserRole } from "@/lib/roles"

export type DashboardNavItem = {
  href: string
  label: string
  description: string
  icon: LucideIcon
  exact?: boolean
}

export type DashboardNav = {
  main: DashboardNavItem[]
  account: DashboardNavItem[]
}

const PROFILE_ITEM: DashboardNavItem = {
  href: "/dashboard/profile",
  label: "Update Profile",
  description: "Name, photo and contact details",
  icon: UserRound,
  exact: true,
}

const NAV_BY_ROLE: Record<UserRole, DashboardNav> = {
  customer: {
    main: [
      {
        href: "/dashboard/customer",
        label: "Overview",
        description: "Your requests at a glance",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/dashboard/customer/bookings",
        label: "My Bookings",
        description: "Track and pay for bookings",
        icon: CalendarCheck,
      },
      {
        href: "/dashboard/customer/payments",
        label: "Payment History",
        description: "Every receipt in one place",
        icon: CreditCard,
      },
    ],
    account: [PROFILE_ITEM],
  },
  technician: {
    main: [
      {
        href: "/dashboard/technician",
        label: "Overview",
        description: "Your services and requests",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/dashboard/technician/add-service",
        label: "Add a Service",
        description: "Publish a new service",
        icon: PlusCircle,
      },
      {
        href: "/dashboard/technician/my-services",
        label: "My Services",
        description: "Edit, delete and availability",
        icon: Wrench,
      },
      {
        href: "/dashboard/technician/requests",
        label: "Manage Requests",
        description: "Accept and complete jobs",
        icon: ListChecks,
      },
    ],
    account: [PROFILE_ITEM],
  },
  admin: {
    main: [
      {
        href: "/dashboard/admin",
        label: "Overview",
        description: "Platform health at a glance",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/dashboard/admin/users",
        label: "Manage Users",
        description: "Roles and accounts",
        icon: Users,
      },
      {
        href: "/dashboard/admin/services",
        label: "Service Approval",
        description: "Review technician listings",
        icon: ShieldCheck,
      },
      {
        href: "/dashboard/admin/bookings",
        label: "All Bookings",
        description: "Every job on the platform",
        icon: ClipboardList,
      },
      {
        href: "/dashboard/admin/transactions",
        label: "Transactions",
        description: "Payments and revenue",
        icon: ReceiptText,
      },
    ],
    account: [PROFILE_ITEM],
  },
}

export function getDashboardNav(role: UserRole): DashboardNav {
  return NAV_BY_ROLE[role]
}

export function isDashboardNavActive(
  pathname: string,
  item: DashboardNavItem
) {
  if (item.exact) {
    return pathname === item.href
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function getActiveDashboardNav(
  pathname: string,
  role: UserRole
): DashboardNavItem | undefined {
  const nav = getDashboardNav(role)
  const items = [...nav.main, ...nav.account]

  return items
    .filter((item) => isDashboardNavActive(pathname, item))
    .sort((a, b) => b.href.length - a.href.length)[0]
}

export const DASHBOARD_ROLE_ICON: Record<UserRole, LucideIcon> = {
  customer: CalendarCheck,
  technician: Wrench,
  admin: Wallet,
}
