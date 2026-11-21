"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { ImageUpload } from "@/components/dashboard/image-upload"
import {
  FieldGrid,
  FormField,
  fieldInputClass,
  fieldSelectClass,
  fieldTextareaClass,
} from "@/components/dashboard/form-field"
import {
  createService,
  updateService,
  type ServiceInput,
} from "@/lib/actions/service-actions"
import { SERVICE_MODE_OPTIONS } from "@/lib/dashboard-constants"
import type { ServiceMode, ServiceRecord } from "@/lib/dashboard-types"
import { SERVICE_CATEGORIES } from "@/lib/site-data"
import { cn } from "@/lib/utils"

type FieldErrors = Partial<Record<keyof ServiceInput, string>>

export function ServiceForm({
  service,
  technicianName,
  technicianEmail,
  compact = false,
  onSaved,
  onCancel,
}: {
  service?: ServiceRecord
  technicianName: string
  technicianEmail: string
  compact?: boolean
  onSaved?: () => void
  onCancel?: () => void
}) {
  const router = useRouter()

  const [title, setTitle] = useState(service?.title ?? "")
  const [category, setCategory] = useState(
    service?.category ?? SERVICE_CATEGORIES[0].name
  )
  const [description, setDescription] = useState(service?.description ?? "")
  const [basePrice, setBasePrice] = useState(
    service ? String(service.basePrice) : ""
  )
  const [duration, setDuration] = useState(service?.duration ?? "")
  const [serviceMode, setServiceMode] = useState<ServiceMode>(
    service?.serviceMode ?? "home-visit"
  )
  const [serviceArea, setServiceArea] = useState(service?.serviceArea ?? "")
  const [image, setImage] = useState(service?.image ?? "")

  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function validate() {
    const nextErrors: FieldErrors = {}
    const price = Number(basePrice)

    if (title.trim().length < 3) {
      nextErrors.title = "Title must be at least 3 characters."
    }

    if (!category) {
      nextErrors.category = "Please choose a category."
    }

    if (description.trim().length < 10) {
      nextErrors.description = "Description must be at least 10 characters."
    }

    if (!Number.isFinite(price) || price <= 0) {
      nextErrors.basePrice = "Enter a positive base price."
    }

    if (!duration.trim()) {
      nextErrors.duration = "Estimated duration is required."
    }

    if (!serviceArea.trim()) {
      nextErrors.serviceArea = "Service area is required."
    }

    if (!image) {
      nextErrors.image = "Please upload a service image."
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (!validate()) return

    setSaving(true)

    const input: ServiceInput = {
      title: title.trim(),
      category,
      description: description.trim(),
      basePrice: Number(basePrice),
      duration: duration.trim(),
      serviceMode,
      serviceArea: serviceArea.trim(),
      image,
    }

    try {
      const result = service
        ? await updateService(service.id, input)
        : await createService(input)

      if (!result.ok) {
        setFormError(result.error)
        toast.error(result.error)
        return
      }

      toast.success(result.message)

      if (onSaved) {
        onSaved()
      } else {
        router.push("/dashboard/technician/my-services")
      }

      router.refresh()
    } catch {
      const message = "Unable to save this service. Please try again."
      setFormError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(11,27,52,0.03)] sm:p-6",
        compact && "border-0 bg-transparent p-0 shadow-none"
      )}
    >
      {formError ? (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-destructive/20 bg-destructive/[0.06] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-destructive"
        >
          {formError}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 space-y-4">
          <FieldGrid>
            <FormField
              id="service-title"
              label="Service title"
              error={errors.title}
              className="sm:col-span-2"
            >
              <input
                id="service-title"
                type="text"
                value={title}
                disabled={saving}
                placeholder="e.g. Emergency pipe leak repair"
                onChange={(event) => {
                  setTitle(event.target.value)
                  setErrors((current) => ({ ...current, title: undefined }))
                }}
                className={fieldInputClass}
              />
            </FormField>

            <FormField
              id="service-category"
              label="Category"
              error={errors.category}
            >
              <select
                id="service-category"
                value={category}
                disabled={saving}
                onChange={(event) => setCategory(event.target.value)}
                className={fieldSelectClass}
              >
                {SERVICE_CATEGORIES.map((item) => (
                  <option key={item.slug} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id="service-price"
              label="Base price (USD)"
              error={errors.basePrice}
              hint="Customers see this price before booking."
            >
              <input
                id="service-price"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={basePrice}
                disabled={saving}
                placeholder="49"
                onChange={(event) => {
                  setBasePrice(event.target.value)
                  setErrors((current) => ({ ...current, basePrice: undefined }))
                }}
                className={fieldInputClass}
              />
            </FormField>

            <FormField
              id="service-description"
              label="Description"
              error={errors.description}
              className="sm:col-span-2"
            >
              <textarea
                id="service-description"
                rows={5}
                value={description}
                disabled={saving}
                placeholder="What is included, what you need on site, and anything the customer should know."
                onChange={(event) => {
                  setDescription(event.target.value)
                  setErrors((current) => ({
                    ...current,
                    description: undefined,
                  }))
                }}
                className={fieldTextareaClass}
              />
            </FormField>

            <FormField
              id="service-duration"
              label="Estimated duration"
              error={errors.duration}
            >
              <input
                id="service-duration"
                type="text"
                value={duration}
                disabled={saving}
                placeholder="e.g. 1–2 hours"
                onChange={(event) => {
                  setDuration(event.target.value)
                  setErrors((current) => ({ ...current, duration: undefined }))
                }}
                className={fieldInputClass}
              />
            </FormField>

            <FormField
              id="service-mode"
              label="Service mode"
              error={errors.serviceMode}
            >
              <select
                id="service-mode"
                value={serviceMode}
                disabled={saving}
                onChange={(event) =>
                  setServiceMode(event.target.value as ServiceMode)
                }
                className={fieldSelectClass}
              >
                {SERVICE_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id="service-area"
              label="Service area"
              error={errors.serviceArea}
              hint="The neighbourhood or city where you can do this work."
              className="sm:col-span-2"
            >
              <input
                id="service-area"
                type="text"
                value={serviceArea}
                disabled={saving}
                placeholder="e.g. Dhanmondi, Dhaka"
                onChange={(event) => {
                  setServiceArea(event.target.value)
                  setErrors((current) => ({
                    ...current,
                    serviceArea: undefined,
                  }))
                }}
                className={fieldInputClass}
              />
            </FormField>
          </FieldGrid>

          <ImageUpload
            id="service-image"
            label="Service image"
            value={image}
            disabled={saving}
            onChange={(url) => {
              setImage(url)
              setErrors((current) => ({ ...current, image: undefined }))
            }}
            hint="A clear photo of the work or the finished result helps customers choose you."
          />
          {errors.image ? (
            <p role="alert" className="text-[11px] font-medium text-destructive">
              {errors.image}
            </p>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-muted/25 p-3.5">
            <p className="text-[9.5px] font-bold tracking-[0.14em] text-muted-foreground/65 uppercase">
              Technician
            </p>

            <div className="mt-3 space-y-3">
              <div>
                <label
                  htmlFor="service-technician-name"
                  className="mb-1 block text-[10.5px] font-semibold text-muted-foreground"
                >
                  Name
                </label>
                <input
                  id="service-technician-name"
                  type="text"
                  value={technicianName}
                  disabled
                  readOnly
                  className={fieldInputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="service-technician-email"
                  className="mb-1 block text-[10.5px] font-semibold text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="service-technician-email"
                  type="email"
                  value={technicianEmail}
                  disabled
                  readOnly
                  className={fieldInputClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-50/60 p-3.5 dark:bg-amber-500/[0.07]">
            <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-800 dark:text-amber-300">
              <Sparkles className="size-3.5" />
              Approval required
            </p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber-800/75 dark:text-amber-200/70">
              {service
                ? "Saving changes sends this service back to the admin queue as Pending."
                : "New services start as Pending and go live after an admin approves them."}
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10.5px] text-muted-foreground">
          You can edit, delete or pause this listing at any time.
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-[12px] font-semibold transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-60"
            >
              Cancel
            </button>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)] transition-all outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-primary/35 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                {service ? "Save & resubmit" : "Submit for approval"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
