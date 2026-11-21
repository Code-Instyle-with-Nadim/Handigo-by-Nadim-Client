import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/format"

export function DashboardAvatar({
  name,
  email,
  image,
  className,
}: {
  name?: string | null
  email?: string | null
  image?: string | null
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-deep font-display text-[11px] font-bold tracking-[0.08em] text-white ring-1 ring-black/[0.08] dark:ring-white/15",
        className
      )}
    >
      <span>{getInitials(name, email)}</span>
      {image ? (
        <span
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(image)})` }}
        />
      ) : null}
    </span>
  )
}
