import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type StatTone = "blue" | "emerald" | "amber" | "rose" | "violet" | "sky"

const TONE_CLASSES: Record<
  StatTone,
  { icon: string; glow: string; line: string }
> = {
  blue: {
    icon: "bg-blue-50 text-blue-600 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20",
    glow: "from-blue-500/[0.08]",
    line: "bg-blue-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    glow: "from-emerald-500/[0.08]",
    line: "bg-emerald-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
    glow: "from-amber-500/[0.09]",
    line: "bg-amber-500",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20",
    glow: "from-rose-500/[0.08]",
    line: "bg-rose-500",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 ring-violet-600/10 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
    glow: "from-violet-500/[0.08]",
    line: "bg-violet-500",
  },
  sky: {
    icon: "bg-sky-50 text-sky-600 ring-sky-600/10 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
    glow: "from-sky-500/[0.08]",
    line: "bg-sky-500",
  },
}

export function StatsGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "blue",
  className,
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  tone?: StatTone
  className?: string
}) {
  const tones = TONE_CLASSES[tone]

  return (
    <article
      className={cn(
        "group relative isolate overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(11,27,52,0.03)] transition-all duration-300 hover:border-primary/20 hover:shadow-[0_22px_50px_-34px_rgba(11,27,52,0.4)] sm:p-5",
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br to-transparent opacity-80",
          tones.glow
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-4 left-0 w-[3px] rounded-r-full opacity-70",
          tones.line
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground/75 uppercase">
            {label}
          </p>
          <p className="mt-2 font-display text-[2rem] leading-none font-semibold tracking-[-0.05em] tabular-nums">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset transition-transform duration-300 group-hover:-rotate-3",
            tones.icon
          )}
        >
          <Icon className="size-[18px]" />
        </span>
      </div>

      {hint ? (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </article>
  )
}
