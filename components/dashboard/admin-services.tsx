"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, ShieldCheck, X } from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/dashboard/empty-state"
import { FilterChips } from "@/components/dashboard/filter-chips"
import { ServiceThumb } from "@/components/dashboard/service-thumb"
import {
  ApprovalStatusBadge,
  AvailabilityBadge,
} from "@/components/dashboard/status-badge"
import { setServiceApproval } from "@/lib/actions/service-actions"
import { APPROVAL_STATUS_OPTIONS, SERVICE_MODE_META } from "@/lib/dashboard-constants"
import type {
  ApprovalStatus,
  ServiceRecord,
} from "@/lib/dashboard-types"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

type FilterValue = ApprovalStatus | "all"

const actionButton =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-60"

function ApprovalActions({
  service,
  busy,
  onApprove,
  onReject,
}: {
  service: ServiceRecord
  busy: boolean
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {service.approvalStatus !== "approved" ? (
        <button
          type="button"
          disabled={busy}
          onClick={onApprove}
          className={cn(
            actionButton,
            "border border-emerald-600/20 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
          )}
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Check className="size-3.5" />
          )}
          Approve
        </button>
      ) : null}

      {service.approvalStatus !== "rejected" ? (
        <button
          type="button"
          disabled={busy}
          onClick={onReject}
          className={cn(
            actionButton,
            "border border-destructive/20 bg-destructive/[0.06] text-destructive hover:bg-destructive/10"
          )}
        >
          <X className="size-3.5" />
          Reject
        </button>
      ) : null}
    </div>
  )
}

export function AdminServices({ services }: { services: ServiceRecord[] }) {
  const router = useRouter()

  const [filter, setFilter] = useState<FilterValue>("all")
  const [actionKey, setActionKey] = useState<string | null>(null)

  const counts = useMemo(() => {
    const next: Partial<Record<FilterValue, number>> = { all: services.length }

    for (const service of services) {
      next[service.approvalStatus] = (next[service.approvalStatus] ?? 0) + 1
    }

    return next
  }, [services])

  const filtered = useMemo(
    () =>
      filter === "all"
        ? services
        : services.filter((service) => service.approvalStatus === filter),
    [filter, services]
  )

  async function handleApproval(
    service: ServiceRecord,
    approvalStatus: "approved" | "rejected"
  ) {
    const key = `${service.id}:${approvalStatus}`
    setActionKey(key)

    try {
      const result = await setServiceApproval(service.id, approvalStatus)

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success(result.message)
      router.refresh()
    } catch {
      toast.error("Unable to update this service. Please try again.")
    } finally {
      setActionKey(null)
    }
  }

  if (services.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No services to review"
        description="Technician listings will appear here for approval as soon as they are submitted."
      />
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          options={APPROVAL_STATUS_OPTIONS}
          value={filter}
          onChange={setFilter}
          counts={counts}
        />
        <p className="text-[10.5px] text-muted-foreground">
          Pending services are shown first · {filtered.length} of{" "}
          {services.length}
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/70 bg-muted/30">
                {[
                  "Service",
                  "Technician",
                  "Price",
                  "Approval",
                  "Availability",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-4 py-2.5 text-[9.5px] font-bold tracking-[0.13em] text-muted-foreground/70 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((service) => {
                const approving = actionKey === `${service.id}:approved`
                const rejecting = actionKey === `${service.id}:rejected`
                const busy = approving || rejecting

                return (
                  <tr
                    key={service.id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <ServiceThumb
                          title={service.title}
                          image={service.image}
                          className="size-10"
                        />
                        <div className="min-w-0">
                          <p className="max-w-[14rem] truncate text-[12px] font-semibold">
                            {service.title}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {service.category} ·{" "}
                            {SERVICE_MODE_META[service.serviceMode]}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-[11.5px] font-medium">
                        {service.technicianName || "Technician"}
                      </p>
                      <p className="mt-0.5 max-w-[13rem] truncate text-[10px] text-muted-foreground">
                        {service.technicianEmail}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-display text-[12px] font-semibold tabular-nums">
                        {formatCurrency(service.basePrice)}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {service.serviceArea}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <ApprovalStatusBadge status={service.approvalStatus} />
                    </td>

                    <td className="px-4 py-3">
                      <AvailabilityBadge isAvailable={service.isAvailable} />
                    </td>

                    <td className="px-4 py-3">
                      <ApprovalActions
                        service={service}
                        busy={busy}
                        onApprove={() => handleApproval(service, "approved")}
                        onReject={() => handleApproval(service, "rejected")}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((service) => {
          const approving = actionKey === `${service.id}:approved`
          const rejecting = actionKey === `${service.id}:rejected`
          const busy = approving || rejecting

          return (
            <article
              key={service.id}
              className="rounded-2xl border border-border/70 bg-card p-3.5 shadow-[0_1px_2px_rgba(11,27,52,0.03)]"
            >
              <div className="flex items-start gap-2.5">
                <ServiceThumb
                  title={service.title}
                  image={service.image}
                  className="size-11"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">{service.title}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                    {service.category} · {SERVICE_MODE_META[service.serviceMode]}
                  </p>
                </div>
                <ApprovalStatusBadge status={service.approvalStatus} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-muted/30 p-2.5">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                    Technician
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium">
                    {service.technicianName || "Technician"}
                  </p>
                  <p className="mt-0.5 truncate text-[9.5px] text-muted-foreground">
                    {service.technicianEmail}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                    Price
                  </p>
                  <p className="mt-0.5 font-display text-[12px] font-semibold">
                    {formatCurrency(service.basePrice)}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-muted-foreground">
                    {service.serviceArea}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <AvailabilityBadge isAvailable={service.isAvailable} />
                <ApprovalActions
                  service={service}
                  busy={busy}
                  onApprove={() => handleApproval(service, "approved")}
                  onReject={() => handleApproval(service, "rejected")}
                />
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
