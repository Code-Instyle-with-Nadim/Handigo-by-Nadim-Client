"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xl border border-transparent text-muted-foreground transition-colors outline-none hover:border-border hover:bg-card hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        className,
      )}
    >
      <Sun className="hidden size-[17px] dark:block" />
      <Moon className="size-[17px] dark:hidden" />
    </button>
  )
}
