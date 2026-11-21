"use client"

import { cn } from "@/lib/utils"

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  counts,
  className,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  counts?: Partial<Record<T, number>>
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {options.map((option) => {
        const active = option.value === value
        const count = counts?.[option.value]

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11.5px] font-semibold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_18px_-12px_rgba(37,99,235,0.9)]"
                : "border-border bg-card text-muted-foreground hover:border-primary/25 hover:bg-brand-soft hover:text-primary"
            )}
          >
            {option.label}
            {typeof count === "number" ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9.5px] leading-none tabular-nums",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
