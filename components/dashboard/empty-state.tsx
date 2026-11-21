import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 px-6 py-12 text-center",
        className
      )}
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-primary ring-1 ring-primary/10">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 font-display text-[15px] font-semibold tracking-[-0.02em]">
        {title}
      </h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-[12px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
