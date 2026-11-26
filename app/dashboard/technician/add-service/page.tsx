import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Clock3 } from "lucide-react"

import AddServiceForm from "@/components/dashboard/technician/add-service-form"
import { Badge } from "@/components/ui/badge"
import { getRoleMeta, normalizeRole } from "@/lib/roles"
import { getServerSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Add a service",
  description:
    "Create a new repair service on HandiGo! and submit it for admin approval.",
}

export default async function AddServicePage() {
  const session = await getServerSession()
  const user = session?.user

  if (!user) {
    redirect(
      `/sign-in?redirect=${encodeURIComponent(
        "/dashboard/technician/add-service"
      )}`
    )
  }

  const role = normalizeRole(user.role)

  if (role !== "technician") {
    redirect(getRoleMeta(role).dashboardHref)
  }

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(75%_120%_at_88%_0%,#e5efff_0%,rgba(246,248,252,0)_66%)] dark:bg-[radial-gradient(75%_120%_at_88%_0%,#0b2a52_0%,rgba(7,20,38,0)_66%)]"
        />
        <div
          aria-hidden="true"
          className="brand-grid absolute inset-0 -z-10 opacity-50"
        />

        <div className="page-shell py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/dashboard/technician/my-services"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-muted-foreground transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/20"
            >
              <ArrowLeft className="size-3.5" />
              Back to my services
            </Link>

            <Badge
              variant="outline"
              className="h-6 gap-1.5 rounded-full border-amber-500/25 bg-amber-500/10 px-2.5 text-[9.5px] font-bold tracking-[0.08em] text-amber-700 uppercase dark:text-amber-300"
            >
              <Clock3 className="size-3" />
              Admin review required
            </Badge>
          </div>

          <div className="mt-5 max-w-3xl">
            <p className="text-[10px] font-bold tracking-[0.18em] text-primary uppercase">
              Technician workspace
            </p>
            <h1 className="display-title mt-2 text-[2rem] leading-[1.05] sm:text-[2.5rem]">
              Add a new service
            </h1>
            <p className="mt-2.5 max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
              Turn your craft into a listing customers can book. Add the
              essentials, set your starting price, and submit it for a quick
              admin review.
            </p>
          </div>
        </div>
      </section>

      <div className="page-shell py-6 sm:py-8">
        <AddServiceForm
          technicianName={user.name || "Technician"}
          technicianEmail={user.email}
        />
      </div>
    </>
  )
}
