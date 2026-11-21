"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react"

import { DashboardAvatar } from "@/components/dashboard/avatar"
import { LogoMark } from "@/components/site/brand-logo"
import { RoleBadge } from "@/components/site/role-badge"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { authClient } from "@/lib/auth-client"
import {
  getActiveDashboardNav,
  getDashboardNav,
  isDashboardNavActive,
  type DashboardNavItem,
} from "@/lib/dashboard-nav"
import { getRoleMeta, type UserRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

type DashboardShellUser = {
  name: string
  email: string
  image: string
  role: UserRole
}

function SidebarLink({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: DashboardNavItem
  pathname: string
  collapsed: boolean
  onNavigate?: () => void
}) {
  const active = isDashboardNavActive(pathname, item)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[12.5px] font-semibold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        active
          ? "bg-brand-soft text-primary ring-1 ring-primary/10"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg transition-colors",
          active
            ? "bg-primary text-primary-foreground shadow-[0_8px_18px_-10px_rgba(37,99,235,0.9)]"
            : "bg-muted/80 text-muted-foreground group-hover:bg-card group-hover:text-foreground"
        )}
      >
        <Icon className="size-4" />
      </span>

      {!collapsed ? (
        <span className="min-w-0">
          <span className="block truncate">{item.label}</span>
          <span
            className={cn(
              "mt-0.5 block truncate text-[10px] font-medium",
              active ? "text-primary/65" : "text-muted-foreground/65"
            )}
          >
            {item.description}
          </span>
        </span>
      ) : null}
    </Link>
  )
}

function SidebarContent({
  user,
  pathname,
  collapsed,
  onNavigate,
  onToggleCollapse,
  onSignOut,
  signingOut,
  mobile = false,
  onClose,
}: {
  user: DashboardShellUser
  pathname: string
  collapsed: boolean
  onNavigate?: () => void
  onToggleCollapse?: () => void
  onSignOut: () => void
  signingOut: boolean
  mobile?: boolean
  onClose?: () => void
}) {
  const roleMeta = getRoleMeta(user.role)
  const nav = getDashboardNav(user.role)

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-2.5 border-b border-border/70 px-3",
          collapsed && "justify-center px-2"
        )}
      >
        {mobile ? (
          <>
            <LogoMark className="size-9 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-[15px] font-bold tracking-[-0.04em]">
                Handi<span className="text-primary">Go!</span>
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {roleMeta.label} workspace
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <>
            {!collapsed ? (
              <div className="min-w-0 flex-1 px-1">
                <p className="text-[9.5px] font-bold tracking-[0.16em] text-muted-foreground/65 uppercase">
                  Workspace
                </p>
                <p className="mt-0.5 truncate font-display text-[13px] font-semibold tracking-[-0.02em]">
                  {roleMeta.label} dashboard
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="grid size-8 shrink-0 place-items-center rounded-lg border border-border/70 bg-card text-muted-foreground transition-colors outline-none hover:border-primary/25 hover:bg-brand-soft hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {collapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </button>
          </>
        )}
      </div>

      <nav
        aria-label={`${roleMeta.label} dashboard`}
        className="flex-1 space-y-5 overflow-y-auto px-2.5 py-4"
      >
        <div className="space-y-1">
          {!collapsed ? (
            <p className="px-2.5 pb-1 text-[9px] font-bold tracking-[0.16em] text-muted-foreground/55 uppercase">
              Menu
            </p>
          ) : null}

          {nav.main.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className="space-y-1 border-t border-border/70 pt-4">
          {!collapsed ? (
            <p className="px-2.5 pb-1 text-[9px] font-bold tracking-[0.16em] text-muted-foreground/55 uppercase">
              Account
            </p>
          ) : null}

          {nav.account.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}

          <Link
            href="/"
            onClick={onNavigate}
            title={collapsed ? "Back to Home" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[12.5px] font-semibold text-muted-foreground transition-colors outline-none hover:bg-muted/70 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30",
              collapsed && "justify-center px-2"
            )}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted/80">
              <Home className="size-4" />
            </span>
            {!collapsed ? "Back to Home" : null}
          </Link>
        </div>
      </nav>

      <div className="shrink-0 border-t border-border/70 p-2.5">
        <Link
          href="/dashboard/profile"
          onClick={onNavigate}
          title={collapsed ? user.name : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-xl p-1.5 transition-colors outline-none hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/30",
            collapsed && "justify-center"
          )}
        >
          <DashboardAvatar
            name={user.name}
            email={user.email}
            image={user.image}
            className="size-9"
          />
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[12px] font-semibold">
                {user.name || "HandiGo! member"}
              </p>
              <RoleBadge role={user.role} className="mt-1" />
            </div>
          ) : null}
        </Link>

        <button
          type="button"
          disabled={signingOut}
          onClick={onSignOut}
          title={collapsed ? "Sign out" : undefined}
          className={cn(
            "mt-1 flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-[12px] font-semibold text-muted-foreground transition-colors outline-none hover:bg-destructive/[0.07] hover:text-destructive focus-visible:ring-3 focus-visible:ring-destructive/20 disabled:opacity-60",
            collapsed && "justify-center px-2"
          )}
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted/70">
            <LogOut className="size-4" />
          </span>
          {!collapsed ? (signingOut ? "Signing out…" : "Sign out") : null}
        </button>
      </div>
    </div>
  )
}

export function DashboardShell({
  user,
  children,
}: {
  user: DashboardShellUser
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const roleMeta = getRoleMeta(user.role)
  const activeItem = getActiveDashboardNav(pathname, user.role)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [mobileOpen])

  function toggleCollapsed() {
    setCollapsed((current) => !current)
  }

  async function handleSignOut() {
    setSigningOut(true)

    try {
      await authClient.signOut()
    } catch (error) {
      console.error("Unable to sign out", error)
    } finally {
      setSigningOut(false)
      setMobileOpen(false)
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-background sm:min-h-[calc(100svh-5rem)]">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside
          className={cn(
            "sticky top-16 hidden h-[calc(100svh-4rem)] shrink-0 border-r border-border/70 bg-card/55 backdrop-blur-sm transition-[width] duration-300 sm:top-20 sm:h-[calc(100svh-5rem)] lg:flex lg:flex-col",
            collapsed ? "w-[5.25rem]" : "w-[17rem]"
          )}
        >
          <SidebarContent
            user={user}
            pathname={pathname}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapsed}
            onSignOut={handleSignOut}
            signingOut={signingOut}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-16 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sm:top-20">
            <div className="flex h-14 items-center gap-2 px-3 sm:h-16 sm:px-5 lg:px-8">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open dashboard sidebar"
                aria-expanded={mobileOpen}
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/80 bg-card/70 text-foreground transition-colors outline-none hover:border-primary/25 hover:bg-brand-soft hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30 lg:hidden"
              >
                <Menu className="size-4.5" />
              </button>

              <div className="min-w-0">
                <p className="text-[9px] font-bold tracking-[0.15em] text-muted-foreground/60 uppercase">
                  {roleMeta.label}
                </p>
                <p className="truncate font-display text-[13.5px] font-semibold tracking-[-0.02em] sm:text-sm">
                  {activeItem?.label ?? "Dashboard"}
                </p>
              </div>

              <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/80 bg-card/70 px-2.5 text-[11.5px] font-semibold text-foreground/80 transition-colors outline-none hover:border-primary/25 hover:bg-brand-soft hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <Home className="size-3.5" />
                  <span className="hidden sm:inline">Home</span>
                </Link>

                <ThemeToggle className="hidden border-border/80 bg-card/70 sm:grid" />

                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 rounded-full border border-border/70 bg-card/70 p-0.5 pr-2.5 transition-colors outline-none hover:border-primary/25 hover:bg-brand-soft focus-visible:ring-3 focus-visible:ring-ring/30"
                  title="Update profile"
                >
                  <DashboardAvatar
                    name={user.name}
                    email={user.email}
                    image={user.image}
                    className="size-8"
                  />
                  <span className="hidden min-w-0 text-left sm:block">
                    <span className="block max-w-[9rem] truncate font-display text-[11.5px] font-semibold leading-tight">
                      {user.name || "HandiGo! member"}
                    </span>
                    <span className="block text-[9.5px] leading-tight text-muted-foreground">
                      {roleMeta.label}
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </header>

          <div className="px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard sidebar"
            tabIndex={-1}
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 cursor-default bg-brand-deep/40 backdrop-blur-[3px] animate-in fade-in-0 duration-150"
          />
          <aside className="relative z-10 h-full w-[19rem] max-w-[86vw] border-r border-border/70 bg-card shadow-[24px_0_80px_-30px_rgba(4,18,38,0.55)] animate-in slide-in-from-left duration-200">
            <SidebarContent
              user={user}
              pathname={pathname}
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
              onSignOut={handleSignOut}
              signingOut={signingOut}
              mobile
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      ) : null}
    </div>
  )
}
