"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

const MAX_FILE_SIZE = 5 * 1024 * 1024

type UploadResponse = {
  url?: string
  error?: string
}

export function ImageUpload({
  id,
  label,
  value,
  onChange,
  hint,
  disabled = false,
  shape = "square",
  className,
}: {
  id: string
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
  disabled?: boolean
  shape?: "square" | "circle"
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 5 MB.")
      return
    }

    setError(null)
    setUploading(true)

    try {
      const body = new FormData()
      body.append("image", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      })
      const payload = (await response.json().catch(() => null)) as
        | UploadResponse
        | null

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Image upload failed.")
      }

      onChange(payload.url)
      toast.success("Image uploaded.")
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed. Please try again."

      setError(message)
      toast.error(message)
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0]

    if (file) {
      void uploadFile(file)
    }
  }

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11.5px] font-semibold"
      >
        {label}
      </label>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled && !uploading) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (!disabled && !uploading) handleFiles(event.dataTransfer.files)
        }}
        className={cn(
          "relative flex flex-col gap-4 rounded-2xl border border-dashed p-4 transition-colors sm:flex-row sm:items-center",
          dragging
            ? "border-primary bg-brand-soft/70"
            : "border-border bg-background/45",
          disabled && "opacity-60"
        )}
      >
        <div
          className={cn(
            "relative grid size-20 shrink-0 place-items-center overflow-hidden bg-muted text-muted-foreground ring-1 ring-border",
            shape === "circle" ? "rounded-full" : "rounded-xl"
          )}
        >
          {value ? (
            <span
              role="img"
              aria-label="Selected image preview"
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${JSON.stringify(value)})` }}
            />
          ) : (
            <ImagePlus className="size-6" />
          )}

          {uploading ? (
            <span className="absolute inset-0 grid place-items-center bg-brand-deep/55 text-white backdrop-blur-[2px]">
              <Loader2 className="size-5 animate-spin" />
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold">
            {value ? "Image ready" : "Upload an image"}
          </p>
          <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">
            PNG, JPG or WebP, up to 5 MB. Uploaded securely to ImgBB.
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[11px] font-semibold transition-colors outline-none hover:border-primary/25 hover:bg-brand-soft hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <UploadCloud className="size-3.5" />
              )}
              {value ? "Replace" : "Choose image"}
            </button>

            {value && !uploading ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onChange("")
                  setError(null)
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold text-destructive transition-colors outline-none hover:bg-destructive/[0.08] focus-visible:ring-3 focus-visible:ring-destructive/20 disabled:opacity-60"
              >
                <Trash2 className="size-3.5" />
                Remove
              </button>
            ) : null}
          </div>
        </div>

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          disabled={disabled || uploading}
          onChange={(event) => handleFiles(event.target.files)}
          className="sr-only"
        />
      </div>

      {error ? (
        <p role="alert" className="mt-1.5 text-[11px] font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
