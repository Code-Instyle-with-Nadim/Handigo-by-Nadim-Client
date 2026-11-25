import {
  Droplets,
  Hammer,
  Laptop,
  Smartphone,
  Snowflake,
  Sparkles,
  Tv,
  WashingMachine,
  Wind,
  Wrench,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"

const ICONS = {
  droplets: Droplets,
  zap: Zap,
  wind: Wind,
  "washing-machine": WashingMachine,
  hammer: Hammer,
  sparkles: Sparkles,
  smartphone: Smartphone,
  laptop: Laptop,
  snowflake: Snowflake,
  tv: Tv,
} as const

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string
  className?: string
}) {
  const Icon = ICONS[icon as keyof typeof ICONS] ?? Wrench

  return <Icon className={cn("size-5", className)} />
}
