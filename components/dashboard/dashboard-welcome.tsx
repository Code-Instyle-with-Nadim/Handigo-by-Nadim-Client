import Link from "next/link"
import { ArrowRight, CalendarCheck, Sparkles } from "lucide-react"

import { RoleBadge } from "@/components/site/role-badge"
import { getRoleMeta, type UserRole } from "@/lib/roles"

const ROLE_COPY: Record<
  UserRole,
  { eyebrow: string; description: string; note: string }
> = {
  customer: {
    eyebrow: "Your home, handled",
    description:
      "Book trusted local pros, keep every visit in one place and track your warranties without the paperwork.",
    note: "Your bookings, saved addresses and service history will appear here as you use HandiGo!.",
  },
  technician: {
    eyebrow: "Your craft, booked",
    description:
      "Manage the jobs you accept, keep your availability fresh and grow a trusted local reputation.",
    note: "Job requests, your schedule and earnings will appear here as customers book your services.",
  },
  admin: {
    eyebrow: "Keeping HandiGo! running",
    description:
      "Oversee customers, technicians and service activity from one calm, focused workspace.",
    note: "Platform analytics and user management tools will appear here as the marketplace grows.",
  },
}

export function DashboardWelcome({
  role,
  name,
}: {
  role: UserRole
  name?: string | null
}) {
  const meta = getRoleMeta(role)
  const copy = ROLE_COPY[role]
  const firstName = name?.trim().split(/\s+/)[0]

  return (
    <section className="page-shell py-10 sm:py-14">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-[0_30px_80px_-50px_rgba(4,18,38,0.45)] sm:p-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(75%_75%_at_85%_0%,#e5efff_0%,rgba(246,248,252,0)_70%)] dark:bg-[radial-gradient(75%_75%_at_85%_0%,#0b2a52_0%,rgba(7,20,38,0)_70%)]"
        />
        <div
          aria-hidden="true"
          className="brand-grid absolute inset-0 -z-10 opacity-50"
        />

        <div className="flex flex-wrap items-center gap-2">
          <RoleBadge role={role} />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
            <Sparkles className="size-3 text-gold" />
            {copy.eyebrow}
          </span>
        </div>

        <h1 className="display-title mt-4 max-w-2xl text-[2rem] leading-[1.05] tracking-[-0.05em] sm:text-[2.75rem]">
          {firstName
            ? `Welcome, ${firstName}.`
            : `Welcome to your ${meta.label} dashboard.`}
        </h1>

        <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
          {copy.description}
        </p>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/services"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-5 text-[12.5px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(37,99,235,0.9)] transition-all outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-primary/35 active:translate-y-px"
          >
            Browse services
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard/profile"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-5 text-[12.5px] font-semibold text-foreground transition-all outline-none hover:border-primary/25 hover:bg-brand-soft hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <CalendarCheck className="size-4" />
            Complete your profile
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-border/70 bg-background/55 p-4 sm:p-5">
          <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground/70 uppercase">
            What&apos;s next
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            {copy.note}
          </p>
        </div>
      </div>
    </section>
  )
}
