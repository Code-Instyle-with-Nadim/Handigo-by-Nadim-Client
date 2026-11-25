"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarCheck2,
  CalendarDays,
  CirclePlus,
  ClipboardList,
  CreditCard,
  House,
  LayoutDashboard,
  LogIn,
  ReceiptText,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import { BrandLogo } from "@/components/site/brand-logo"
import { RoleBadge } from "@/components/site/role-badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { getRoleMeta, normalizeRole, type UserRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    {
      title: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { title: "Service Approval", href: "/dashboard/admin/services", icon: Wrench },
    {
      title: " All Bookings",
      href: "/dashboard/admin/bookings",
      icon: CalendarDays,
    },
    {
      title: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: ReceiptText,
    },
  ],
  technician: [
    {
      title: "Overview",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Requests",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
    {
      title: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      title: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: CirclePlus,
    },
  ],
  customer: [
    {
      title: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: CalendarCheck2,
    },
    {
      title: "Payments",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
  ],
}

const ACCOUNT_ITEMS: NavItem[] = [
  {
    title: "Profile & settings",
    href: "/dashboard/profile",
    icon: UserRound,
    exact: true,
  },
  {
    title: "Back to website",
    href: "/",
    icon: House,
    exact: true,
  },
]

function isItemActive(pathname: string, item: NavItem) {
  if (item.exact) {
    return pathname === item.href
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "HG"
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}

function SidebarNavItem({
  item,
  pathname,
}: {
  item: NavItem
  pathname: string
}) {
  const Icon = item.icon
  const active = isItemActive(pathname, item)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.href} />}
        isActive={active}
        tooltip={item.title}
        className={cn(
          "relative h-10 rounded-xl px-3 text-[13px] font-medium text-sidebar-foreground/75 transition-all",
          "before:absolute before:top-1/2 before:left-0 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "group-data-[collapsible=icon]:justify-center",
          active &&
            "bg-primary/10 font-semibold text-primary ring-1 ring-primary/15 ring-inset before:opacity-100"
        )}
      >
        <Icon className="size-4.5" />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarNavSkeleton({ width }: { width: string }) {
  return (
    <SidebarMenuItem aria-hidden="true">
      <div className="flex h-10 items-center gap-2 rounded-xl px-3">
        <span className="size-4.5 shrink-0 animate-pulse rounded-md bg-sidebar-accent" />
        <span
          className="h-3 animate-pulse rounded-full bg-sidebar-accent group-data-[collapsible=icon]:hidden"
          style={{ width }}
        />
      </div>
    </SidebarMenuItem>
  )
}

function SidebarFooterSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-2 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 p-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0"
    >
      <span className="size-8 shrink-0 animate-pulse rounded-full bg-sidebar-accent" />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
        <span className="h-2.5 w-24 animate-pulse rounded-full bg-sidebar-accent" />
        <span className="h-2 w-14 animate-pulse rounded-full bg-sidebar-accent" />
      </span>
    </div>
  )
}

export default function DeshboardSidebar() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  const user = session?.user
  const role = normalizeRole(user?.role)
  const roleMeta = getRoleMeta(role)
  const navItems = NAV_BY_ROLE[role]

  return (
    <Sidebar collapsible="icon" className="top-[82px] h-auto">
      <SidebarHeader className="border-b border-sidebar-border/70 p-2.5">
        <BrandLogo
          href={roleMeta.dashboardHref}
          markClassName="size-9 rounded-xl"
          wordmarkClassName="text-[1.2rem] group-data-[collapsible=icon]:hidden"
        />

        <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/45 p-2 group-data-[collapsible=icon]:hidden">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <LayoutDashboard className="size-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[8.5px] font-bold tracking-[0.14em] text-sidebar-foreground/45 uppercase">
              Workspace
            </p>
            <p className="truncate text-[11px] font-semibold">
              {isPending ? "Loading…" : `${roleMeta.label} dashboard`}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[9.5px] font-bold tracking-[0.14em] text-sidebar-foreground/45 uppercase">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {isPending
                ? ["72%", "56%", "64%", "48%"].map((width) => (
                    <SidebarNavSkeleton key={width} width={width} />
                  ))
                : navItems.map((item) => (
                    <SidebarNavItem
                      key={item.href}
                      item={item}
                      pathname={pathname}
                    />
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-1" />

        <SidebarGroup className="pt-0">
          <SidebarGroupLabel className="px-2 text-[9.5px] font-bold tracking-[0.14em] text-sidebar-foreground/45 uppercase">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {ACCOUNT_ITEMS.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-2">
        {isPending ? (
          <SidebarFooterSkeleton />
        ) : user ? (
          <div className="flex items-center gap-2 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 p-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
            <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-deep font-display text-[9px] font-bold tracking-[0.06em] text-white ring-1 ring-black/10 dark:ring-white/15">
              {getInitials(user.name, user.email)}
              {user.image ? (
                <span
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${JSON.stringify(user.image)})`,
                  }}
                />
              ) : null}
            </span>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-[11.5px] font-semibold">
                {user.name || "HandiGo! member"}
              </p>
              <RoleBadge
                role={role}
                className="mt-1 px-1.5 py-0 text-[8.5px] tracking-[0.1em]"
              />
            </div>
          </div>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/sign-in" />}
                tooltip="Sign in"
                className="h-10 justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              >
                <LogIn className="size-4" />
                <span>Sign in</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
