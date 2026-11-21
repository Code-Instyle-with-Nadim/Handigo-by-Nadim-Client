"use client"

import { Loader2 } from "lucide-react"

export function GoogleButton({
  onClick,
  loading,
  disabled,
  label = "Continue with Google",
}: {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card/70 text-[12.5px] font-semibold text-foreground shadow-[0_1px_2px_rgba(11,27,52,0.04)] transition-all outline-none hover:border-primary/25 hover:bg-brand-soft focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <svg viewBox="0 0 48 48" className="size-4.5" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.08 13.22l7.98 6.19C12.95 13.72 18.03 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.27 5.64c4.25-3.92 6.49-9.69 6.49-17.29z"
          />
          <path
            fill="#FBBC05"
            d="M11.06 28.59A14.4 14.4 0 0 1 10.3 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.86.93 7.5 3.08 10.78l7.98-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.47 0 11.9-2.13 15.87-5.8l-7.27-5.64c-2.01 1.35-4.58 2.15-8.6 2.15-5.97 0-11.05-4.22-12.94-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48z"
          />
        </svg>
      )}
      {loading ? "Connecting…" : label}
    </button>
  )
}
