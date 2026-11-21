import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Inbox,
  ListChecks,
  Plus,
  Wrench,
} from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { ServiceThumb } from "@/components/dashboard/service-thumb"
import { StatCard, StatsGrid } from "@/components/dashboard/stats-cards"
import { BookingStatusBadge } from "@/components/dashboard/status-badge"
import { getTechnicianOverview } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = {
  title: "Technician overview",
}

const QUICK_ACTIONS = [
  {
    href: "/dashboard/technician/add-service",
    label: "Add a service",
    description: "Publish a new listing for review.",
    icon: Plus,
  },
  {
    href: "/dashboard/technician/my-services",
    label: "Manage services",
    description: "Edit prices and pause listings.",
    icon: Wrench,
  },
  {
    href: "/dashboard/technician/requests",
    label: "Manage requests",
    description: "Accept, start and complete jobs.",
    icon: ListChecks,
  },
] as const

export default async function TechnicianDashboardPage() {
  const { session } = await requireDashboardRole(
    "technician",
    "/dashboard/technician"
  )

  const overview = await getTechnicianOverview(
    session.user.email,
    session.user.id
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Technician workspace"
        title={`Good to see you, ${session.user.name?.split(/\s+/)[0] || "there"}.`}
        description="Keep an eye on your listings and respond to new customer requests."
        actions={
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)] transition-all hover:brightness-110"
          >
            <Plus className="size-3.5" />
            Add a service
          </Link>
        }
      />

      <StatsGrid>
        <StatCard
          label="Total Services"
          value={overview.totalServices}
          hint="All services you have created."
          icon={Wrench}
          tone="blue"
        />
        <StatCard
          label="Approved Services"
          value={overview.approvedServices}
          hint="Live and visible to customers."
          icon={BadgeCheck}
          tone="emerald"
        />
        <StatCard
          label="Pending Requests"
          value={overview.pendingRequests}
          hint="New bookings waiting for your response."
          icon={Inbox}
          tone="amber"
        />
      </StatsGrid>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-[15px] font-semibold tracking-[-0.025em]">
                Requests waiting for you
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Respond quickly to keep customers happy.
              </p>
            </div>
            <Link
              href="/dashboard/technician/requests"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:text-primary/75"
            >
              Manage all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {overview.recentRequests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No pending requests"
              description="New booking requests will appear here as soon as a customer chooses one of your services."
              className="mt-4 py-9"
            />
          ) : (
            <div className="mt-4 space-y-2">
              {overview.recentRequests.map((booking) => (
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
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <CalendarDays className="size-3" />
                      {booking.customerName || "Customer"} ·{" "}
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
            Keep your business moving.
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
