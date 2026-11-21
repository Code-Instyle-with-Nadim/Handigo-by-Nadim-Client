"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Wrench,
} from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/dashboard/empty-state"
import { FilterChips } from "@/components/dashboard/filter-chips"
import { Modal } from "@/components/dashboard/modal"
import { ServiceForm } from "@/components/dashboard/service-form"
import { ServiceThumb } from "@/components/dashboard/service-thumb"
import { ApprovalStatusBadge } from "@/components/dashboard/status-badge"
import {
  deleteService,
  toggleServiceAvailability,
} from "@/lib/actions/service-actions"
import type {
  ApprovalStatus,
  ServiceRecord,
} from "@/lib/dashboard-types"
import { SERVICE_MODE_META } from "@/lib/dashboard-constants"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

type FilterValue = ApprovalStatus | "all"

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

function AvailabilitySwitch({
  service,
  busy,
  onToggle,
}: {
  service: ServiceRecord
  busy: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={service.isAvailable}
        aria-label={
          service.isAvailable
            ? `Make ${service.title} unavailable`
            : `Make ${service.title} available`
        }
        disabled={busy}
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-60",
          service.isAvailable
            ? "border-emerald-600/25 bg-emerald-500"
            : "border-border bg-muted-foreground/25"
        )}
      >
        <span
          className={cn(
            "block size-3.5 rounded-full bg-white shadow-sm transition-transform",
            service.isAvailable ? "translate-x-[1.1rem]" : "translate-x-0.5"
          )}
        />
      </button>

      <span
        className={cn(
          "inline-flex items-center gap-1 text-[10.5px] font-medium",
          service.isAvailable
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground"
        )}
      >
        {busy ? (
          <Loader2 className="size-3 animate-spin" />
        ) : service.isAvailable ? (
          <Eye className="size-3" />
        ) : (
          <EyeOff className="size-3" />
        )}
        {service.isAvailable ? "Available" : "Hidden"}
      </span>
    </div>
  )
}

export function TechnicianServices({
  services,
}: {
  services: ServiceRecord[]
}) {
  const router = useRouter()

  const [filter, setFilter] = useState<FilterValue>("all")
  const [editing, setEditing] = useState<ServiceRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ServiceRecord | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

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

  async function handleToggle(service: ServiceRecord) {
    setTogglingId(service.id)

    try {
      const result = await toggleServiceAvailability(
        service.id,
        !service.isAvailable
      )

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success(result.message)
      router.refresh()
    } catch {
      toast.error("Unable to change availability. Please try again.")
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)

    try {
      const result = await deleteService(deleteTarget.id)

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success(result.message)
      setDeleteTarget(null)
      router.refresh()
    } catch {
      toast.error("Unable to delete this service. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  if (services.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No services yet"
        description="Add your first service to start receiving booking requests from customers."
        action={
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            Add a service
          </Link>
        }
      />
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          options={FILTER_OPTIONS}
          value={filter}
          onChange={setFilter}
          counts={counts}
        />
        <p className="text-[10.5px] text-muted-foreground">
          {filtered.length} of {services.length} service
          {services.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/70 bg-muted/30">
                {[
                  "Service",
                  "Category",
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
              {filtered.map((service) => (
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
                        <p className="max-w-[13rem] truncate text-[12px] font-semibold">
                          {service.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {SERVICE_MODE_META[service.serviceMode]}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-[11.5px] text-foreground/80">
                    {service.category}
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-display text-[12px] font-semibold tabular-nums">
                      {formatCurrency(service.basePrice)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {service.duration}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <ApprovalStatusBadge status={service.approvalStatus} />
                  </td>

                  <td className="px-4 py-3">
                    <AvailabilitySwitch
                      service={service}
                      busy={togglingId === service.id}
                      onToggle={() => handleToggle(service)}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditing(service)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[11px] font-semibold transition-colors hover:border-primary/25 hover:bg-brand-soft hover:text-primary"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(service)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/[0.06] px-2.5 text-[11px] font-semibold text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((service) => (
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

            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-muted/30 p-2.5">
              <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                  Base price
                </p>
                <p className="mt-0.5 font-display text-[13px] font-semibold">
                  {formatCurrency(service.basePrice)}
                </p>
              </div>
              <AvailabilitySwitch
                service={service}
                busy={togglingId === service.id}
                onToggle={() => handleToggle(service)}
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(service)}
                className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[11px] font-semibold transition-colors hover:border-primary/25 hover:bg-brand-soft hover:text-primary"
              >
                <Pencil className="size-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(service)}
                className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/[0.06] px-2.5 text-[11px] font-semibold text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit service"
        description="Update the details below. Saving sends the service back for admin approval."
        size="lg"
      >
        {editing ? (
          <ServiceForm
            key={editing.id}
            service={editing}
            technicianName={editing.technicianName}
            technicianEmail={editing.technicianEmail}
            compact
            onSaved={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!deleting) setDeleteTarget(null)
        }}
        title="Delete this service?"
        description="This permanently removes the listing. Existing bookings keep their service details."
        size="sm"
        footer={
          <>
            <button
              type="button"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-[12px] font-semibold transition-colors hover:bg-muted disabled:opacity-60"
            >
              Keep service
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-destructive px-4 text-[12px] font-semibold text-white transition-colors hover:bg-destructive/90 disabled:opacity-60"
            >
              {deleting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              {deleting ? "Deleting…" : "Delete service"}
            </button>
          </>
        }
      >
        {deleteTarget ? (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.05] p-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-4" />
            </span>
            <div>
              <p className="text-[12px] font-semibold">{deleteTarget.title}</p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground">
                This action cannot be undone. Customers will no longer be able
                to book this service.
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
