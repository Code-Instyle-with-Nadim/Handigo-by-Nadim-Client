"use client"

import { useState, useTransition } from "react"
import {
  Clock3,
  Loader2,
  Save,
  ShieldAlert,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import ImageUpload from "@/components/shared/ImageUpload"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateMyService } from "@/lib/actions/MyService"
import type { ServiceRecord } from "@/lib/dashboard-types"
import {
  SERVICE_CATEGORIES,
  SERVICE_MODES,
  isServiceCategory,
  isServiceMode,
} from "@/lib/service-constants"

type ServiceEditDialogProps = {
  service: ServiceRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (service: ServiceRecord) => void
}

export function ServiceEditDialog({
  service,
  open,
  onOpenChange,
  onSaved,
}: ServiceEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/70 p-5 pr-12">
          <DialogTitle className="text-[16px]">Edit service</DialogTitle>
          <DialogDescription className="text-[11.5px] leading-relaxed">
            Update the details below. Saving sends this service back to the
            admin queue as{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              Pending
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {service ? (
          <ServiceEditForm
            key={service.id}
            service={service}
            onSaved={onSaved}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function ServiceEditForm({
  service,
  onSaved,
  onCancel,
}: {
  service: ServiceRecord
  onSaved: (service: ServiceRecord) => void
  onCancel: () => void
}) {
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState(service.title)
  const [category, setCategory] = useState(service.category)
  const [description, setDescription] = useState(service.description)
  const [basePrice, setBasePrice] = useState(String(service.basePrice))
  const [estimatedDuration, setEstimatedDuration] = useState(
    service.estimatedDuration
  )
  const [serviceMode, setServiceMode] = useState<
    ServiceRecord["serviceMode"]
  >(service.serviceMode)
  const [serviceArea, setServiceArea] = useState(service.serviceArea)
  const [image, setImage] = useState(service.image)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState("")

  const categoryOptions = isServiceCategory(category)
    ? SERVICE_CATEGORIES
    : [category, ...SERVICE_CATEGORIES].filter(Boolean)

  function clearError(field: string) {
    setErrors((current) => {
      if (!current[field]) return current

      const next = { ...current }
      delete next[field]

      return next
    })
  }

  function validate() {
    const nextErrors: Record<string, string> = {}
    const price = Number(basePrice)

    if (title.trim().length < 5) {
      nextErrors.title = "Use at least 5 characters."
    }

    if (title.trim().length > 80) {
      nextErrors.title = "Keep the title under 80 characters."
    }

    if (!isServiceCategory(category)) {
      nextErrors.category = "Choose a valid category."
    }

    if (description.trim().length < 20) {
      nextErrors.description =
        "Describe the service in at least 20 characters."
    }

    if (description.trim().length > 600) {
      nextErrors.description = "Keep the description under 600 characters."
    }

    if (!Number.isFinite(price) || price <= 0) {
      nextErrors.basePrice = "Enter a price greater than 0."
    }

    if (!estimatedDuration.trim()) {
      nextErrors.estimatedDuration = "Add an estimated duration."
    }

    if (!isServiceMode(serviceMode)) {
      nextErrors.serviceMode = "Choose a valid service mode."
    }

    if (!serviceArea.trim()) {
      nextErrors.serviceArea = "Add the area you cover."
    }

    if (!/^https?:\/\//i.test(image)) {
      nextErrors.image = "Upload a service banner before saving."
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError("")

    if (!validate()) {
      return
    }

    const input = {
      title: title.trim(),
      category,
      description: description.trim(),
      image,
      basePrice: Number(basePrice),
      estimatedDuration: estimatedDuration.trim(),
      serviceMode,
      serviceArea: serviceArea.trim(),
    }

    startTransition(async () => {
      try {
        const result = await updateMyService(service.id, input)

        if (!result.success) {
          setFormError(result.message)
          toast.error(result.message)
          return
        }

        toast.success("Service updated", {
          description: "It is back in the admin review queue.",
        })

        onSaved({
          ...service,
          ...input,
          approvalStatus: "pending",
          updatedAt: new Date().toISOString(),
        })
      } catch {
        const message = "Unable to update this service. Please try again."
        setFormError(message)
        toast.error(message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 p-5">
      {formError ? (
        <p
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/[0.06] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-destructive"
        >
          {formError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          className="gap-1.5 sm:col-span-2"
          data-invalid={Boolean(errors.title)}
        >
          <FieldLabel
            htmlFor="edit-service-title"
            className="text-[12px] font-semibold"
          >
            Service title <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="edit-service-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              clearError("title")
            }}
            maxLength={80}
            disabled={isPending}
            placeholder="e.g. iPhone screen replacement"
            className="h-10 rounded-xl"
          />
          {errors.title ? (
            <p className="text-[11px] font-medium text-destructive">
              {errors.title}
            </p>
          ) : (
            <FieldDescription className="text-[10.5px]">
              Keep it short and specific.
            </FieldDescription>
          )}
        </Field>

        <Field
          className="gap-1.5"
          data-invalid={Boolean(errors.category)}
        >
          <FieldLabel
            id="edit-service-category-label"
            className="text-[12px] font-semibold"
          >
            Category <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(String(value))
              clearError("category")
            }}
            disabled={isPending}
          >
            <SelectTrigger
              aria-labelledby="edit-service-category-label"
              className="h-10 w-full rounded-xl"
            >
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category ? (
            <p className="text-[11px] font-medium text-destructive">
              {errors.category}
            </p>
          ) : null}
        </Field>

        <Field
          className="gap-1.5"
          data-invalid={Boolean(errors.basePrice)}
        >
          <FieldLabel
            htmlFor="edit-service-price"
            className="text-[12px] font-semibold"
          >
            Starting price <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[12px] font-semibold text-muted-foreground">
              $
            </span>
            <Input
              id="edit-service-price"
              type="number"
              min={1}
              step="0.01"
              inputMode="decimal"
              value={basePrice}
              onChange={(event) => {
                setBasePrice(event.target.value)
                clearError("basePrice")
              }}
              disabled={isPending}
              placeholder="49"
              className="h-10 rounded-xl pl-7"
            />
          </div>
          {errors.basePrice ? (
            <p className="text-[11px] font-medium text-destructive">
              {errors.basePrice}
            </p>
          ) : null}
        </Field>

        <Field
          className="gap-1.5"
          data-invalid={Boolean(errors.estimatedDuration)}
        >
          <FieldLabel
            htmlFor="edit-service-duration"
            className="text-[12px] font-semibold"
          >
            Estimated duration <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="edit-service-duration"
            value={estimatedDuration}
            onChange={(event) => {
              setEstimatedDuration(event.target.value)
              clearError("estimatedDuration")
            }}
            maxLength={40}
            disabled={isPending}
            placeholder="e.g. 2-3 hours"
            className="h-10 rounded-xl"
          />
          {errors.estimatedDuration ? (
            <p className="text-[11px] font-medium text-destructive">
              {errors.estimatedDuration}
            </p>
          ) : null}
        </Field>

        <Field
          className="gap-1.5"
          data-invalid={Boolean(errors.serviceMode)}
        >
          <FieldLabel
            id="edit-service-mode-label"
            className="text-[12px] font-semibold"
          >
            Service mode <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={serviceMode}
            onValueChange={(value) => {
              setServiceMode(value as ServiceRecord["serviceMode"])
              clearError("serviceMode")
            }}
            disabled={isPending}
          >
            <SelectTrigger
              aria-labelledby="edit-service-mode-label"
              className="h-10 w-full rounded-xl"
            >
              <SelectValue placeholder="Choose a service mode" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_MODES.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.serviceMode ? (
            <p className="text-[11px] font-medium text-destructive">
              {errors.serviceMode}
            </p>
          ) : null}
        </Field>

        <Field
          className="gap-1.5 sm:col-span-2"
          data-invalid={Boolean(errors.serviceArea)}
        >
          <FieldLabel
            htmlFor="edit-service-area"
            className="text-[12px] font-semibold"
          >
            Service area <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="edit-service-area"
            value={serviceArea}
            onChange={(event) => {
              setServiceArea(event.target.value)
              clearError("serviceArea")
            }}
            maxLength={100}
            disabled={isPending}
            placeholder="e.g. Dhanmondi, Dhaka"
            className="h-10 rounded-xl"
          />
          {errors.serviceArea ? (
            <p className="text-[11px] font-medium text-destructive">
              {errors.serviceArea}
            </p>
          ) : null}
        </Field>

        <Field
          className="gap-1.5 sm:col-span-2"
          data-invalid={Boolean(errors.description)}
        >
          <FieldLabel
            htmlFor="edit-service-description"
            className="text-[12px] font-semibold"
          >
            Description <span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            id="edit-service-description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value)
              clearError("description")
            }}
            rows={5}
            maxLength={600}
            disabled={isPending}
            placeholder="Describe what is included, what you need on site, and anything the customer should know."
            className="min-h-28 rounded-xl"
          />
          {errors.description ? (
            <p className="text-[11px] font-medium text-destructive">
              {errors.description}
            </p>
          ) : (
            <FieldDescription className="text-[10.5px]">
              Mention parts, warranty and any callout fees. 20-600 characters.
            </FieldDescription>
          )}
        </Field>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-3">
        <ImageUpload
          variant="banner"
          label="Service banner"
          title="Update the cover image"
          hint="Upload a new 16:9 banner. JPG, PNG or WebP, max 5MB."
          defaultImage={image}
          onUpload={(url) => {
            setImage(url)
            clearError("image")
          }}
          required
        />
        {errors.image ? (
          <p className="mt-2 text-[11px] font-medium text-destructive">
            {errors.image}
          </p>
        ) : null}
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-[10.5px] leading-relaxed text-amber-800 dark:text-amber-200">
        <Clock3 className="mt-0.5 size-3.5 shrink-0" />
        <p>
          Saving changes sends this service back to the admin queue as Pending.
          It stays hidden from public pages until it is approved again.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
          <ShieldAlert className="size-3.5 text-primary" />
          You can pause or delete this listing at any time.
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="h-9 rounded-xl px-4 text-[12px] font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)] transition-all hover:brightness-110 focus-visible:ring-3 focus-visible:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isPending ? "Saving…" : "Save & resubmit"}
          </Button>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Sparkles className="size-3 text-primary" />
        Approved listings are more likely to receive booking requests.
      </p>
    </form>
  )
}
