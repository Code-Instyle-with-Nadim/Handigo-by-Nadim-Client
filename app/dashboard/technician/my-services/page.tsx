import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Wrench } from "lucide-react"

import { MyServicesTable } from "@/components/dashboard/technician/my-services-table"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { FindMyService } from "@/lib/actions/MyService"
import { getRoleMeta, normalizeRole } from "@/lib/roles"
import { getServerSession } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "My services",
  description:
    "Manage your HandiGo! service listings, update details, pause availability, or remove a listing.",
}

export default async function MyServicePage() {
  const session = await getServerSession()
  const user = session?.user

  if (!user) {
    redirect(
      `/sign-in?redirect=${encodeURIComponent(
        "/dashboard/technician/my-services"
      )}`
    )
  }

  const role = normalizeRole(user.role)

  if (role !== "technician") {
    redirect(getRoleMeta(role).dashboardHref)
  }

  const services = await FindMyService(user.email)

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
            <Badge
              variant="outline"
              className="h-6 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-2.5 text-[9.5px] font-bold tracking-[0.08em] text-primary uppercase"
            >
              <Wrench className="size-3" />
              Technician workspace
            </Badge>

            <Link
              href="/dashboard/technician/add-service"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-10 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(37,99,235,0.9)] transition-all hover:brightness-110 focus-visible:ring-3 focus-visible:ring-primary/35"
              )}
            >
              <Plus className="size-4" />
              Add a service
            </Link>
          </div>

          <div className="mt-5 max-w-3xl">
            <p className="text-[10px] font-bold tracking-[0.18em] text-primary uppercase">
              Service catalogue
            </p>
            <h1 className="display-title mt-2 text-[2rem] leading-[1.05] sm:text-[2.5rem]">
              My services
            </h1>
            <p className="mt-2.5 max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
              Manage every listing you have created. Edit the details, pause
              bookings, or remove a service entirely. Saving an edit sends it
              back for admin approval.
            </p>
          </div>
        </div>
      </section>

      <div className="page-shell py-6 sm:py-8">
        <MyServicesTable services={services} />
      </div>
    </>
  )
}
