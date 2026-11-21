import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

const MARK_SRC = "/assets/handigo-mark.png"

type BrandLogoProps = {
  href?: string
  inverted?: boolean
  priority?: boolean
  className?: string
  markClassName?: string
  wordmarkClassName?: string
}

export function LogoMark({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[13px] bg-brand-deep shadow-[0_6px_16px_-8px_rgba(2,20,48,0.8)] ring-1 ring-black/5 dark:ring-white/15",
        className,
      )}
    >
      <Image
        src={MARK_SRC}
        alt=""
        fill
        sizes="80px"
        priority={priority}
        className="scale-[1.03] object-cover"
      />
      <span className="pointer-events-none absolute inset-0 rounded-[13px] ring-1 ring-inset ring-white/10" />
    </span>
  )
}

export function BrandLogo({
  href = "/",
  inverted = false,
  priority = false,
  className,
  markClassName,
  wordmarkClassName,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      aria-label="HandiGo! — home"
      className={cn(
        "group inline-flex shrink-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        className,
      )}
    >
      <LogoMark priority={priority} className={markClassName} />
      <span
        className={cn(
          "font-display text-[1.35rem] leading-none font-bold tracking-[-0.055em]",
          inverted ? "text-white" : "text-foreground",
          wordmarkClassName,
        )}
      >
        Handi
        <span className={inverted ? "text-sky-400" : "text-primary"}>Go!</span>
      </span>
    </Link>
  )
}
