import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ReceiptText,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react"

import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { ServiceThumb } from "@/components/dashboard/service-thumb"
import { StatCard, StatsGrid } from "@/components/dashboard/stats-cards"
import { ApprovalStatusBadge } from "@/components/dashboard/status-badge"
import { getAdminOverview } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Admin overview",
}

const QUICK_ACTIONS = [
  {
    href: "/dashboard/admin/services",
    label: "Review services",
    description: "Approve or reject technician listings.",
    icon: ShieldCheck,
  },
  {
    href: "/dashboard/admin/users",
    label: "Manage users",
    description: "Update customer and technician roles.",
    icon: Users,
  },
  {
    href: "/dashboard/admin/bookings",
    label: "All bookings",
    description: "Read-only view of every job.",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/admin/transactions",
    label: "Transactions",
    description: "Revenue and payment records.",
    icon: ReceiptText,
  },
] as const

export default async function AdminDashboardPage() {
  const { session } = await requireDashboardRole("admin", "/dashboard/admin")
  const overview = await getAdminOverview()

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Admin workspace"
        title={`Platform overview`}
        description={`Welcome back, ${session.user.name?.split(/\s+/)[0] || "admin"}. Keep the marketplace healthy and the queue moving.`}
        actions={
          <Link
            href="/dashboard/admin/services"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)] transition-all hover:brightness-110"
          >
            <ShieldCheck className="size-3.5" />
            Review services
          </Link>
        }
      />

      <StatsGrid>
        <StatCard
          label="Total Users"
          value={overview.totalUsers}
          hint="Customers, technicians and admins."
          icon={Users}
          tone="blue"
        />
        <StatCard
          label="Total Technicians"
          value={overview.totalTechnicians}
          hint="Accounts currently offering services."
          icon={Wrench}
          tone="violet"
        />
        <StatCard
          label="Pending Services"
          value={overview.pendingServices}
          hint="Listings waiting for your review."
          icon={ShieldCheck}
          tone="amber"
        />
      </StatsGrid>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-[15px] font-semibold tracking-[-0.025em]">
                Waiting for approval
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                New listings appear here first, newest at the top.
              </p>
            </div>
            <Link
              href="/dashboard/admin/services"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:text-primary/75"
            >
              Review all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {overview.pendingServiceList.length === 0 ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-600/20 bg-emerald-50/60 p-3.5 dark:bg-emerald-500/[0.07]">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
              </span>
              <div>
                <p className="text-[12px] font-semibold">All caught up</p>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">
                  There are no services waiting for approval right now.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {overview.pendingServiceList.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/45 p-2.5"
                >
                  <ServiceThumb
                    title={service.title}
                    image={service.image}
                    className="size-10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold">
                      {service.title}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      {service.technicianName || "Technician"} ·{" "}
                      {service.category}
                    </p>
                  </div>
                  <ApprovalStatusBadge status={service.approvalStatus} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
          <h2 className="font-display text-[15px] font-semibold tracking-[-0.025em]">
            Admin shortcuts
          </h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Everything you need to keep things tidy.
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
