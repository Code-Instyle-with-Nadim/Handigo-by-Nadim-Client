"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BadgeCheck,
  Clock3,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Wrench,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  deleteMyService,
  toggleMyServiceAvailability,
} from "@/lib/actions/MyService"
import type { ServiceRecord } from "@/lib/dashboard-types"
import { cn } from "@/lib/utils"

import { ServiceEditDialog } from "./service-edit-dialog"

type FilterValue = "all" | ServiceRecord["approvalStatus"]

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const APPROVAL_META = {
  pending: {
    label: "Pending",
    Icon: Clock3,
    className:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  approved: {
    label: "Approved",
    Icon: BadgeCheck,
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    Icon: XCircle,
    className:
      "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
} satisfies Record<
  ServiceRecord["approvalStatus"],
  { label: string; Icon: typeof Clock3; className: string }
>

const STAT_TONES = {
  primary: "bg-primary/10 text-primary ring-primary/10",
  emerald:
    "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15 dark:text-emerald-400",
  amber:
    "bg-amber-500/10 text-amber-600 ring-amber-500/15 dark:text-amber-400",
  slate:
    "bg-slate-500/10 text-slate-600 ring-slate-500/15 dark:text-slate-300",
} as const

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function formatPrice(value: number) {
  return priceFormatter.format(Number.isFinite(value) ? value : 0)
}

function ApprovalBadge({
  status,
}: {
  status: ServiceRecord["approvalStatus"]
}) {
  const meta = APPROVAL_META[status] ?? APPROVAL_META.pending
  const Icon = meta.Icon

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1.5 rounded-full px-2.5 text-[9.5px] font-bold tracking-[0.06em] uppercase",
        meta.className
      )}
    >
      <Icon className="size-3" />
      {meta.label}
    </Badge>
  )
}

function ServiceThumb({
  title,
  image,
  className,
}: {
  title: string
  image: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-soft text-primary ring-1 ring-primary/10",
        className
      )}
    >
      <Wrench className="size-4" />
      {image ? (
        <span
          role="img"
          aria-label={title}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(image)})` }}
        />
      ) : null}
    </span>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  hint: string
  icon: typeof Wrench
  tone: keyof typeof STAT_TONES
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-[0_18px_45px_-42px_rgba(7,26,51,0.6)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[9.5px] font-bold tracking-[0.12em] text-muted-foreground/70 uppercase">
          {label}
        </p>
        <span
          className={cn(
            "grid size-8 place-items-center rounded-xl ring-1",
            STAT_TONES[tone]
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 font-display text-[1.6rem] leading-none font-semibold tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>
    </div>
  )
}

function AvailabilityToggle({
  service,
  busy,
  onToggle,
}: {
  service: ServiceRecord
  busy: boolean
  onToggle: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={service.isAvailable}
        disabled={busy}
        onCheckedChange={onToggle}
        aria-label={
          service.isAvailable
            ? `Hide ${service.title} from public pages`
            : `Make ${service.title} available`
        }
      />

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

function FilterEmpty({
  filter,
  onReset,
}: {
  filter: FilterValue
  onReset: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Filter className="size-5" />
      </span>
      <p className="mt-3 text-[13px] font-semibold">
        No {filter === "all" ? "" : `${filter} `}services
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Nothing matches this filter right now.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReset}
        className="mt-4 h-8 rounded-lg px-3 text-[11px] font-semibold"
      >
        Show all services
      </Button>
    </div>
  )
}

export function MyServicesTable({ services }: { services: ServiceRecord[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [items, setItems] = useState(services)

  const [filter, setFilter] = useState<FilterValue>("all")
  const [editing, setEditing] = useState<ServiceRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ServiceRecord | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const counts = useMemo<Record<FilterValue, number>>(() => {
    const next: Record<FilterValue, number> = {
      all: items.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    }

    for (const service of items) {
      next[service.approvalStatus] += 1
    }

    return next
  }, [items])

  const hiddenCount = useMemo(
    () => items.filter((service) => !service.isAvailable).length,
    [items]
  )

  const filtered = useMemo(
    () =>
      filter === "all"
        ? items
        : items.filter((service) => service.approvalStatus === filter),
    [filter, items]
  )

  function handleToggle(service: ServiceRecord, checked: boolean) {
    if (togglingId === service.id) return

    setTogglingId(service.id)
    setItems((current) =>
      current.map((item) =>
        item.id === service.id ? { ...item, isAvailable: checked } : item
      )
    )

    startTransition(async () => {
      try {
        const result = await toggleMyServiceAvailability(service.id, checked)

        if (!result.success) {
          setItems((current) =>
            current.map((item) =>
              item.id === service.id
                ? { ...item, isAvailable: service.isAvailable }
                : item
            )
          )
          toast.error(result.message)
          return
        }

        toast.success(result.message)
        router.refresh()
      } catch {
        setItems((current) =>
          current.map((item) =>
            item.id === service.id
              ? { ...item, isAvailable: service.isAvailable }
              : item
          )
        )
        toast.error("Unable to change availability. Please try again.")
      } finally {
        setTogglingId(null)
      }
    })
  }

  function handleDelete() {
    if (!deleteTarget || deleting) return

    const target = deleteTarget

    setDeleting(true)

    startTransition(async () => {
      try {
        const result = await deleteMyService(target.id)

        if (!result.success) {
          toast.error(result.message)
          return
        }

        toast.success(result.message)
        setItems((current) =>
          current.filter((item) => item.id !== target.id)
        )
        setDeleteTarget(null)
        router.refresh()
      } catch {
        toast.error("Unable to delete this service. Please try again.")
      } finally {
        setDeleting(false)
      }
    })
  }

  function handleSaved(updated: ServiceRecord) {
    setItems((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    )
    setEditing(null)
    router.refresh()
  }

  if (items.length === 0) {
    return (
      <Empty className="border border-dashed border-border bg-card/70 py-14">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="size-12 rounded-2xl bg-primary/10 text-primary"
          >
            <Wrench className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="text-base">No services yet</EmptyTitle>
          <EmptyDescription className="text-[11.5px] leading-relaxed">
            Add your first service to start receiving booking requests from
            customers.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href="/dashboard/technician/add-service"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-9 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)] transition-all hover:brightness-110"
            )}
          >
            <Plus className="size-3.5" />
            Add your first service
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="w-full space-y-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total listings"
            value={items.length}
            hint="Across all statuses"
            icon={Wrench}
            tone="primary"
          />
          <StatCard
            label="Approved"
            value={counts.approved}
            hint="Cleared by admin"
            icon={BadgeCheck}
            tone="emerald"
          />
          <StatCard
            label="Pending"
            value={counts.pending}
            hint="Waiting for admin review"
            icon={Clock3}
            tone="amber"
          />
          <StatCard
            label="Hidden"
            value={hiddenCount}
            hint="Paused from public pages"
            icon={EyeOff}
            tone="slate"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_OPTIONS.map((option) => {
              const active = filter === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-primary/25",
                    active
                      ? "border-primary/20 bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {option.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] tabular-nums",
                      active
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {counts[option.value]}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="text-[10.5px] text-muted-foreground">
            {filtered.length} of {items.length} service
            {items.length === 1 ? "" : "s"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <FilterEmpty filter={filter} onReset={() => setFilter("all")} />
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_24px_60px_-50px_rgba(7,26,51,0.65)] md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/70 bg-muted/30 hover:bg-muted/30">
                    {[
                      "Service",
                      "Category",
                      "Price",
                      "Approval",
                      "Availability",
                      "Actions",
                    ].map((heading) => (
                      <TableHead
                        key={heading}
                        scope="col"
                        className="px-4 py-2.5 text-[9.5px] font-bold tracking-[0.13em] text-muted-foreground/70 uppercase"
                      >
                        {heading}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((service) => (
                    <TableRow
                      key={service.id}
                      className="border-border/60 hover:bg-muted/20"
                    >
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <ServiceThumb
                            title={service.title}
                            image={service.image}
                            className="size-10"
                          />
                          <div className="min-w-0">
                            <p className="max-w-[16rem] truncate text-[12px] font-semibold">
                              {service.title}
                            </p>
                            <p className="mt-0.5 max-w-[16rem] truncate text-[10px] text-muted-foreground">
                              {service.serviceMode} ·{" "}
                              {service.serviceArea || "Area not set"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="h-6 rounded-full border-border/70 bg-muted/40 px-2.5 text-[10px] font-semibold text-foreground/80"
                        >
                          {service.category}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <p className="font-display text-[12px] font-semibold tabular-nums">
                          {formatPrice(service.basePrice)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {service.estimatedDuration || "Duration not set"}
                        </p>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <ApprovalBadge status={service.approvalStatus} />
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <AvailabilityToggle
                          service={service}
                          busy={togglingId === service.id}
                          onToggle={(checked) =>
                            handleToggle(service, checked)
                          }
                        />
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditing(service)}
                            className="h-8 rounded-lg px-2.5 text-[11px] font-semibold hover:border-primary/25 hover:bg-brand-soft hover:text-primary"
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteTarget(service)}
                            className="h-8 rounded-lg px-2.5 text-[11px] font-semibold"
                          >
                            <Trash2 className="size-3.5" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-3 md:hidden">
              {filtered.map((service) => (
                <article
                  key={service.id}
                  className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_45px_-42px_rgba(7,26,51,0.6)]"
                >
                  <div className="flex items-start gap-3 p-3.5">
                    <ServiceThumb
                      title={service.title}
                      image={service.image}
                      className="size-14 rounded-xl"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] leading-snug font-semibold">
                            {service.title}
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                            {service.category} · {service.serviceMode}
                          </p>
                        </div>
                        <ApprovalBadge status={service.approvalStatus} />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between gap-2 rounded-xl bg-muted/30 p-2.5">
                        <div>
                          <p className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                            Starting price
                          </p>
                          <p className="mt-0.5 font-display text-[13px] font-semibold tabular-nums">
                            {formatPrice(service.basePrice)}
                          </p>
                        </div>
                        <AvailabilityToggle
                          service={service}
                          busy={togglingId === service.id}
                          onToggle={(checked) =>
                            handleToggle(service, checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-border/60 bg-muted/15 p-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(service)}
                      className="h-8 flex-1 rounded-lg text-[11px] font-semibold hover:border-primary/25 hover:bg-brand-soft hover:text-primary"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteTarget(service)}
                      className="h-8 flex-1 rounded-lg text-[11px] font-semibold"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <p className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-muted-foreground">
          <EyeOff className="mt-0.5 size-3.5 shrink-0 text-primary" />
          Unavailable services stay in your dashboard but disappear from public
          pages until you switch them back on.
        </p>
      </div>

      <ServiceEditDialog
        service={editing}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        onSaved={handleSaved}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  You are about to permanently delete{" "}
                  <span className="font-semibold text-foreground">
                    {deleteTarget.title}
                  </span>
                  . This cannot be undone and customers will no longer be able
                  to book it.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Keep service
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30"
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {deleting ? "Deleting…" : "Delete service"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
