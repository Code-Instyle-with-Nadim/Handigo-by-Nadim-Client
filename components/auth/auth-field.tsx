"use client"

import type { ComponentProps, ReactNode } from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

type AuthInputProps = Omit<ComponentProps<"input">, "className"> & {
  id: string
  label: string
  icon: ReactNode
  error?: string
  hint?: ReactNode
  labelAccessory?: ReactNode
  rightSlot?: ReactNode
  className?: string
}

export function AuthInput({
  id,
  label,
  icon,
  error,
  hint,
  labelAccessory,
  rightSlot,
  className,
  ...props
}: AuthInputProps) {
  const errorId = `${id}-error`

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="block text-[11.5px] font-semibold">
          {label}
        </label>
        {labelAccessory}
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground/70">
          {icon}
        </span>

        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-11 w-full rounded-xl border border-input bg-background/60 pr-3.5 pl-10 text-base transition-all outline-none placeholder:text-muted-foreground/55 focus:border-primary/50 focus:ring-3 focus:ring-primary/10 sm:text-[13px]",
            error &&
              "border-destructive/60 focus:border-destructive focus:ring-destructive/10",
            className
          )}
          {...props}
        />

        {rightSlot}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[11px] leading-relaxed font-medium text-destructive"
        >
          {error}
        </p>
      ) : hint ? (
        <div className="mt-1.5 text-[10.5px] leading-relaxed text-muted-foreground">
          {hint}
        </div>
      ) : null}
    </div>
  )
}

export function PasswordToggle({
  visible,
  onToggle,
  disabled,
}: {
  visible: boolean
  onToggle: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={visible ? "Hide password" : "Show password"}
      className="absolute top-1/2 right-2.5 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50"
    >
      {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  )
}
