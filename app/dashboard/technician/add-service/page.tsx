import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"

import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { ServiceForm } from "@/components/dashboard/service-form"
import { requireDashboardRole } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Add a service",
}

export default async function AddServicePage() {
  const { session } = await requireDashboardRole(
    "technician",
    "/dashboard/technician/add-service"
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardPageHeader
        eyebrow="Technician workspace"
        title="Add a service"
        description="Describe what you offer, set a fair base price and upload a photo. Your listing goes live after admin approval."
        actions={
          <Link
            href="/dashboard/technician/my-services"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-[12px] font-semibold transition-colors hover:border-primary/25 hover:bg-brand-soft hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            My services
          </Link>
        }
      />

      <div className="flex items-start gap-2.5 rounded-2xl border border-primary/15 bg-brand-soft/60 p-3.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="size-4" />
        </span>
        <div>
          <p className="text-[12px] font-semibold">Every listing is reviewed</p>
          <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">
            New services start as Pending. An admin checks the details before it
            appears on public pages. You can keep editing it while it waits.
          </p>
        </div>
      </div>

      <ServiceForm
        technicianName={session.user.name ?? ""}
        technicianEmail={session.user.email}
      />
    </div>
  )
}
