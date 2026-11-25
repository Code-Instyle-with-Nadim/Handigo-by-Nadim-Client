"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react"

import { BrandLogo } from "@/components/site/brand-logo"
import { RoleBadge } from "@/components/site/role-badge"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { authClient } from "@/lib/auth-client"
import { NAV_LINKS } from "@/lib/site-data"
import { getRoleMeta } from "@/lib/roles"

import { cn } from "@/lib/utils"

type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

function getInitials(user: SessionUser) {
  const source = user.name?.trim() || user.email?.split("@")[0] || "FM"
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}

function UserAvatar({
  user,
  className,
}: {
  user: SessionUser
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-deep font-display text-[11px] font-bold tracking-[0.08em] text-white ring-1 ring-black/[0.08] dark:ring-white/15",
        className,
      )}
    >
      <span>{getInitials(user)}</span>
      {user.image ? (
        <span
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(user.image)})` }}
        />
      ) : null}
    </span>
  )
}

function NavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string
  label: string
  active: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold tracking-[-0.005em] transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        active
          ? "bg-brand-soft text-primary"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
      )}
    >
      {label}
      <span
        className={cn(
          "absolute bottom-[3px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-primary transition-all duration-300",
          active ? "w-4 opacity-100" : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-40",
        )}
      />
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, refetch } = authClient.useSession()
  const user = (session?.user ?? null) as SessionUser | null
  const roleMeta = getRoleMeta(user?.role)



  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const menuRootRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!mobileOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!menuOpen && !mobileOpen) return

    function onPointerDown(event: PointerEvent) {
      if (
        menuOpen &&
        menuRootRef.current &&
        !menuRootRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return

      if (menuOpen) {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }

      if (mobileOpen) {
        setMobileOpen(false)
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen, mobileOpen])

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  function closeAll() {
    setMobileOpen(false)
    setMenuOpen(false)
  }

  async function handleSignOut() {
    setSigningOut(true)

    try {
      await authClient.signOut()
    } catch (error) {
      console.error("Unable to sign out", error)
    } finally {
      setSigningOut(false)
      closeAll()
      router.push("/")
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <div
        aria-hidden="true"
        className="h-[2px] w-full bg-[linear-gradient(90deg,#1d4ed8_0%,#2563eb_30%,#38bdf8_66%,#f59e0b_100%)] opacity-90"
      />
      <div className="border-b border-border/70 bg-background/85 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
        <div className="page-shell relative flex h-16 items-center justify-between gap-3 sm:h-20">
          <BrandLogo priority className="relative z-10" />

          <nav
            aria-label="Primary navigation"
            className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(link.href)}
              />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle className="hidden sm:grid" />

            <span
              aria-hidden="true"
              className="mx-0.5 hidden h-6 w-px bg-border sm:block"
            />

            {user ? (
              <div className="relative" ref={menuRootRef}>
                <button
                  ref={menuButtonRef}
                  id="account-menu-button"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-controls="account-menu"
                  aria-label={`Open account menu for ${user.name ?? "your account"}`}
                  onClick={() => {
                    setMobileOpen(false)
                    setMenuOpen((open) => !open)
                  }}
                  className={cn(
                    "group flex items-center gap-1.5 rounded-full p-0.5 pr-1.5 transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
                    menuOpen ? "bg-brand-soft" : "hover:bg-muted",
                  )}
                >
                  <UserAvatar user={user} className="size-9 sm:size-10" />
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-muted-foreground transition-transform duration-200",
                      menuOpen && "rotate-180",
                    )}
                  />
                </button>

                {menuOpen ? (
                  <div
                    id="account-menu"
                    role="menu"
                    aria-labelledby="account-menu-button"
                    className="absolute top-[calc(100%+0.7rem)] right-0 z-50 w-[19rem] origin-top-right overflow-hidden rounded-2xl border border-border/80 bg-popover p-2 shadow-[0_24px_70px_-24px_rgba(4,18,38,0.4)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
                  >
                    <div className="rounded-xl border border-border/70 bg-gradient-to-br from-brand-soft via-card to-card p-3.5">
                      <div className="flex items-start gap-3">
                        <UserAvatar user={user} className="size-11" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm font-semibold tracking-[-0.02em]">
                            {user.name || "HandiGo! member"}
                          </p>
                          {user.email ? (
                            <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                              {user.email}
                            </p>
                          ) : null}
                          <RoleBadge role={user.role} className="mt-2" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-1.5 space-y-0.5">
                      <Link
                        role="menuitem"
                        href={roleMeta.dashboardHref}
                        onClick={closeAll}
                        className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground/85 transition-colors outline-none hover:bg-muted focus-visible:bg-muted"
                      >
                        <span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <LayoutDashboard className="size-3.5" />
                        </span>
                        Dashboard
                        <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground/60" />
                      </Link>
                      <Link
                        role="menuitem"
                        href="/dashboard/profile"
                        onClick={closeAll}
                        className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground/85 transition-colors outline-none hover:bg-muted focus-visible:bg-muted"
                      >
                        <span className="grid size-7 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                          <UserRound className="size-3.5" />
                        </span>
                        Update Profile
                      </Link>
                    </div>

                    <div className="my-1.5 h-px bg-border" />

                    <button
                      type="button"
                      role="menuitem"
                      disabled={signingOut}
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-destructive transition-colors outline-none hover:bg-destructive/[0.08] focus-visible:bg-destructive/[0.08] disabled:opacity-60"
                    >
                      <span className="grid size-7 place-items-center rounded-lg bg-destructive/[0.08]">
                        <LogOut className="size-3.5" />
                      </span>
                      {signingOut ? "Signing out…" : "Sign Out"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden h-10 items-center justify-center rounded-xl border border-border bg-card/70 px-4 text-[13px] font-semibold text-foreground shadow-[0_1px_2px_rgba(11,27,52,0.04)] transition-all outline-none hover:border-primary/25 hover:bg-brand-soft hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 sm:inline-flex"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="group hidden h-10 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-4 text-[13px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.9)] transition-all outline-none hover:brightness-110 hover:shadow-[0_14px_30px_-12px_rgba(37,99,235,0.8)] focus-visible:ring-3 focus-visible:ring-primary/35 active:translate-y-px sm:inline-flex"
                >
                  Sign Up
                  <Sparkles className="size-3.5 transition-transform duration-300 group-hover:rotate-12" />
                </Link>
              </>
            )}

            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => {
                setMenuOpen(false)
                setMobileOpen((open) => !open)
              }}
              className="grid size-10 place-items-center rounded-xl border border-border/80 bg-card/70 text-foreground transition-colors outline-none hover:border-primary/25 hover:bg-brand-soft hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 lg:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            tabIndex={-1}
            onClick={closeAll}
            className="fixed inset-0 top-16 z-40 cursor-default bg-brand-deep/25 backdrop-blur-[2px] animate-in fade-in-0 duration-200 sm:top-20 lg:hidden"
          />
          <div
            id="mobile-navigation"
            className="absolute inset-x-0 top-full z-50 px-3 pb-3 sm:px-4 lg:hidden"
          >
            <div className="max-h-[calc(100svh-5.5rem)] overflow-y-auto rounded-2xl border border-border/80 bg-popover p-3 shadow-[0_28px_80px_-24px_rgba(4,18,38,0.45)] animate-in fade-in-0 slide-in-from-top-2 duration-200 sm:max-h-[calc(100svh-6.5rem)]">
              <nav aria-label="Mobile navigation" className="space-y-1">
                {NAV_LINKS.map((link, index) => {
                  const active = isActive(link.href)

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeAll}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3.5 py-3 text-[15px] font-semibold transition-colors",
                        active
                          ? "bg-brand-soft text-primary"
                          : "text-foreground/85 hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "font-mono text-[10px] font-medium tracking-[0.16em]",
                            active ? "text-primary/60" : "text-muted-foreground/60",
                          )}
                        >
                          0{index + 1}
                        </span>
                        {link.label}
                      </span>
                      {active ? (
                        <span className="size-1.5 rounded-full bg-primary" />
                      ) : (
                        <ArrowUpRight className="size-4 text-muted-foreground/40" />
                      )}
                    </Link>
                  )
                })}
              </nav>

              <div className="my-3 h-px bg-border" />

              {user ? (
                <div>
                  <div className="flex items-center gap-3 rounded-xl bg-brand-soft/70 p-3">
                    <UserAvatar user={user} className="size-11" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold">
                        {user.name || "HandiGo! member"}
                      </p>
                      <p className="truncate text-[11.5px] text-muted-foreground">
                        {user.email}
                      </p>
                      <RoleBadge role={user.role} className="mt-1.5" />
                    </div>
                  </div>

                  <div className="mt-2 grid gap-1.5">
                    <Link
                      href={roleMeta.dashboardHref}
                      onClick={closeAll}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4 text-primary" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={closeAll}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium hover:bg-muted"
                    >
                      <UserRound className="size-4 text-muted-foreground" />
                      Update Profile
                    </Link>
                    <button
                      type="button"
                      disabled={signingOut}
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium text-destructive hover:bg-destructive/[0.08] disabled:opacity-60"
                    >
                      <LogOut className="size-4" />
                      {signingOut ? "Signing out…" : "Sign Out"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/sign-in"
                    onClick={closeAll}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card text-[13px] font-semibold transition-colors hover:border-primary/25 hover:bg-brand-soft hover:text-primary"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={closeAll}
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] text-[13px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.9)] transition-all hover:brightness-110 active:translate-y-px"
                  >
                    Sign Up
                    <Sparkles className="size-3.5" />
                  </Link>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between rounded-xl border border-border/70 px-3.5 py-2">
                <div>
                  <p className="text-[12px] font-semibold">Appearance</p>
                  <p className="text-[10.5px] text-muted-foreground">Light or dark, your call.</p>
                </div>
                <ThemeToggle className="border-border/70 bg-card" />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </header>
  )
}
