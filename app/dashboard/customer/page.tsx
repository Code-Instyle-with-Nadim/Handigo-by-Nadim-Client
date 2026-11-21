import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Search,
  Wrench,
} from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { ServiceThumb } from "@/components/dashboard/service-thumb"
import { StatCard, StatsGrid } from "@/components/dashboard/stats-cards"
import { BookingStatusBadge } from "@/components/dashboard/status-badge"
import { getCustomerOverview } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = {
  title: "Customer overview",
}

const QUICK_ACTIONS = [
  {
    href: "/services",
    label: "Browse services",
    description: "Find the right pro for the job.",
    icon: Search,
  },
  {
    href: "/dashboard/customer/bookings",
    label: "My bookings",
    description: "Track requests and pay completed jobs.",
    icon: CalendarCheck,
  },
  {
    href: "/dashboard/customer/payments",
    label: "Payment history",
    description: "Every receipt in one tidy place.",
    icon: CreditCard,
  },
] as const

export default async function CustomerDashboardPage() {
  const { session } = await requireDashboardRole(
    "customer",
    "/dashboard/customer"
  )

  const overview = await getCustomerOverview(
    session.user.id,
    session.user.email
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Customer workspace"
        title={`Welcome back, ${session.user.name?.split(/\s+/)[0] || "there"}.`}
        description="Here is a quick look at your requests, active jobs and completed work."
        actions={
          <Link
            href="/services"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)] transition-all hover:brightness-110"
          >
            Book a service
            <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      <StatsGrid>
        <StatCard
          label="Total Requests"
          value={overview.totalRequests}
          hint="Every booking you have ever made."
          icon={ClipboardList}
          tone="blue"
        />
        <StatCard
          label="Active Jobs"
          value={overview.activeJobs}
          hint="Requested, accepted or currently in progress."
          icon={Wrench}
          tone="amber"
        />
        <StatCard
          label="Completed Jobs"
          value={overview.completedJobs}
          hint="Jobs finished by your technician."
          icon={CheckCircle2}
          tone="emerald"
        />
      </StatsGrid>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-[15px] font-semibold tracking-[-0.025em]">
                Recent bookings
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Your latest requests and their current state.
              </p>
            </div>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:text-primary/75"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {overview.recentBookings.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No bookings yet"
              description="Your first booking will show up here once you request a service."
              className="mt-4 py-9"
            />
          ) : (
            <div className="mt-4 space-y-2">
              {overview.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/45 p-2.5"
                >
                  <ServiceThumb
                    title={booking.serviceTitle}
                    image={booking.serviceImage}
                    className="size-10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold">
                      {booking.serviceTitle}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {booking.technicianName || "Technician"} ·{" "}
                      {formatDate(booking.preferredDate)}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
          <h2 className="font-display text-[15px] font-semibold tracking-[-0.025em]">
            Quick actions
          </h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            The shortcuts you will use most.
          </p>

          <div className="mt-4 space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/45 p-3 transition-colors hover:border-primary/20 hover:bg-brand-soft/60"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold">
                      {action.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
