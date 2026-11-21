import { cn } from "@/lib/utils"
import { getRoleMeta } from "@/lib/roles"

export function RoleBadge({
  role,
  className,
}: {
  role?: string | null
  className?: string
}) {
  const meta = getRoleMeta(role)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase ring-1 ring-inset",
        meta.badgeClass,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </span>
  )
}
