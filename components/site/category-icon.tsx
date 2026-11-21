import {
  Droplets,
  Hammer,
  Sparkles,
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
