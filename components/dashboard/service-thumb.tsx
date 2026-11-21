import { Wrench } from "lucide-react"

import { cn } from "@/lib/utils"

export function ServiceThumb({
  title,
  image,
  className,
}: {
  title: string
  image?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-soft text-primary ring-1 ring-primary/10",
        className
      )}
    >
      <Wrench className="size-4" />
      {image ? (
        <span
          role="img"
          aria-label={title}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(image)})` }}
        />
      ) : null}
    </span>
  )
}
