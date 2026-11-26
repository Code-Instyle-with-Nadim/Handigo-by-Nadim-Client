"use client"

import { useId, useState } from "react"
import { Camera, ImagePlus, Loader2, TriangleAlert, Upload } from "lucide-react"

import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onUpload?: (imageUrl: string) => void
  defaultImage?: string
  name?: string
  label?: string
  title?: string
  hint?: string
  required?: boolean
  variant?: "avatar" | "banner"
}

export default function ImageUpload({
  onUpload,
  defaultImage,
  name,
  label = "Profile image",
  title = "Add a profile photo",
  hint = "JPG, PNG or WebP. Max 5MB.",
  required = false,
  variant = "avatar",
}: ImageUploadProps) {
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const isBanner = variant === "banner"

  const [preview, setPreview] = useState(defaultImage || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget
    const file = input.files?.[0]

    if (!file) return

    // Allow picking the same file again after a failed or successful upload.
    input.value = ""
    setError("")

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.")
      return
    }

    const previousPreview = preview
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    const formData = new FormData()
    formData.append("image", file)

    try {
      setLoading(true)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Image upload failed")
      }

      // Swap the temporary blob URL for the hosted image before the blob is
      // revoked, otherwise the preview would go blank after uploading.
      setPreview(result.imageUrl)
      onUpload?.(result.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setPreview(previousPreview)
    } finally {
      setLoading(false)
      URL.revokeObjectURL(localPreview)
    }
  }

  return (
    <div className="space-y-2">
      {name ? (
        <input type="hidden" name={name} value={preview} readOnly />
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[9.5px] font-semibold tracking-[0.08em] uppercase",
            required
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-border bg-muted/60 text-muted-foreground"
          )}
        >
          {required ? "Required" : "Optional"}
        </span>
      </div>

      <div
        className={cn(
          "rounded-2xl border border-dashed border-border bg-muted/20 transition-colors focus-within:border-primary/40 focus-within:ring-3 focus-within:ring-primary/10",
          isBanner ? "p-3 sm:p-4" : "p-4",
          error && "border-destructive/40 bg-destructive/[0.03]",
          loading && "opacity-90"
        )}
      >
        <div className={cn(isBanner ? "space-y-3" : "flex items-center gap-4")}>
          <label
            htmlFor={inputId}
            className={cn(
              "group relative grid shrink-0 cursor-pointer place-items-center overflow-hidden border border-border bg-gradient-to-br from-brand-soft via-card to-card text-primary shadow-[0_8px_20px_-14px_rgba(11,27,52,0.55)] transition-all outline-none hover:border-primary/40 hover:shadow-[0_12px_26px_-14px_rgba(37,99,235,0.55)]",
              isBanner
                ? "aspect-[16/9] w-full rounded-xl"
                : "size-20 rounded-full sm:size-24",
              loading && "pointer-events-none"
            )}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt={isBanner ? "Service banner preview" : "Profile preview"}
                  className="h-full w-full object-cover"
                />

                <span className="absolute inset-0 grid place-items-center bg-brand-deep/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex flex-col items-center gap-1.5">
                    <Camera className={isBanner ? "size-7" : "size-6"} />
                    {isBanner ? (
                      <span className="text-[9px] font-bold tracking-[0.12em] uppercase">
                        Change banner
                      </span>
                    ) : null}
                  </span>
                </span>
              </>
            ) : (
              <span
                className={cn(
                  "flex flex-col items-center",
                  isBanner ? "gap-2" : "gap-1.5"
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center rounded-full bg-card/80 text-primary shadow-sm ring-1 ring-border/70",
                    isBanner ? "size-12" : "size-10"
                  )}
                >
                  <ImagePlus className={isBanner ? "size-6" : "size-5"} />
                </span>
                <span className="text-[9.5px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                  {isBanner ? "Add cover image" : "Add image"}
                </span>
              </span>
            )}

            {loading ? (
              <span className="absolute inset-0 grid place-items-center bg-brand-deep/60 text-white backdrop-blur-[1px]">
                <Loader2 className="size-5 animate-spin" />
              </span>
            ) : null}
          </label>

          <div
            className={cn(
              "min-w-0 flex-1",
              isBanner &&
                "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            )}
          >
            <div>
              <p className="text-[12.5px] font-semibold">
                {preview
                  ? isBanner
                    ? "Banner ready"
                    : "Looking good!"
                  : title}
              </p>
              <p
                id={hintId}
                className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground"
              >
                {hint}
              </p>
            </div>

            <label
              htmlFor={inputId}
              className={cn(
                "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 text-[11.5px] font-semibold text-foreground shadow-[0_1px_2px_rgba(11,27,52,0.04)] transition-all outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 hover:border-primary/30 hover:bg-brand-soft hover:text-primary",
                isBanner ? "w-fit shrink-0" : "mt-2.5",
                loading && "pointer-events-none opacity-60"
              )}
            >
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              {loading
                ? "Uploading…"
                : preview
                  ? isBanner
                    ? "Change banner"
                    : "Change image"
                  : isBanner
                    ? "Upload banner"
                    : "Choose image"}
            </label>
          </div>
        </div>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
          aria-label={label}
          aria-required={required}
          aria-describedby={error ? errorId : hintId}
          className="sr-only"
        />
      </div>

      {loading ? (
        <p
          role="status"
          className="flex items-center gap-1.5 text-[11px] font-medium text-primary"
        >
          <Loader2 className="size-3 animate-spin" />
          Uploading your image…
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-[11.5px] leading-relaxed font-medium text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
