import { cn } from "@/lib/utils"

export const fieldInputClass =
  "h-10 w-full rounded-xl border border-input bg-background/60 px-3 text-base transition-all outline-none placeholder:text-muted-foreground/55 focus:border-primary/50 focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13px]"

export const fieldSelectClass =
  "h-10 w-full rounded-xl border border-input bg-background/60 px-3 text-[13px] transition-all outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"

export const fieldTextareaClass =
  "w-full resize-y rounded-xl border border-input bg-background/60 px-3 py-2.5 text-base transition-all outline-none placeholder:text-muted-foreground/55 focus:border-primary/50 focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13px]"

export function FormField({
  id,
  label,
  error,
  hint,
  children,
  className,
  labelAccessory,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
  labelAccessory?: React.ReactNode
}) {
  const errorId = `${id}-error`

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="block text-[11.5px] font-semibold">
          {label}
        </label>
        {labelAccessory}
      </div>

      <div
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
      >
        {children}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[11px] font-medium text-destructive"
        >
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

export function FieldGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>
  )
}
