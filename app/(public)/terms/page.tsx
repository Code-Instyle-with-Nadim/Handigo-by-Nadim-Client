import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { SITE } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms that apply when you book a HandiGo! home service visit.",
}

const SECTIONS = [
  {
    title: "Using HandiGo!",
    body: "HandiGo! connects customers with independent, vetted technicians. You must provide accurate contact and access details so the assigned technician can complete the job safely. Accounts are personal and may not be shared.",
  },
  {
    title: "Quotes and payments",
    body: "Diagnostics start from the price shown on the relevant service page. You will always receive a fixed quote before chargeable work begins. The quote is valid for 14 days, and payment is due when the job is completed unless agreed otherwise in writing.",
  },
  {
    title: "Changes and cancellations",
    body: "You can reschedule or cancel free of charge up to 24 hours before the visit. Later cancellations may incur a small call-out fee to compensate the technician for the reserved time. We will always try to be reasonable.",
  },
  {
    title: "Workmanship guarantee",
    body: "Repairs carried out through HandiGo! are covered for 12 months from the visit date. If the same issue returns, we will arrange a return visit at no extra cost. The guarantee does not cover new faults, accidental damage or work requested outside the original scope.",
  },
  {
    title: "Fair use",
    body: "HandiGo! may suspend an account that repeatedly cancels confirmed bookings, abuses technicians, or attempts to bypass the platform. Technicians who falsify credentials or insurance details are removed immediately.",
  },
] as const

export default function TermsPage() {
  return (
    <section className="page-shell max-w-3xl py-14 sm:py-18">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-3.5" />
        Back home
      </Link>

      <p className="mt-8 flex items-center gap-2 text-[10.5px] font-bold tracking-[0.18em] text-primary uppercase">
        <span className="size-1.5 rounded-full bg-gold" />
        Legal
      </p>
      <h1 className="display-title mt-3 text-4xl tracking-[-0.05em] sm:text-5xl">
        The short version.
      </h1>
      <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
        These are the terms you agree to when you book a HandiGo! visit. We have
        kept them short enough to actually read. Last updated November 2026.
      </p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((section, index) => (
          <div key={section.title}>
            <h2 className="flex items-baseline gap-3 font-display text-lg font-semibold tracking-[-0.02em]">
              <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground/50">
                0{index + 1}
              </span>
              {section.title}
            </h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border/80 bg-card p-5">
        <h2 className="font-display text-sm font-semibold">Need something clarified?</h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
          Email{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-primary hover:underline">
            {SITE.email}
          </a>{" "}
          or call{" "}
          <a
            href={`tel:${SITE.phoneHref}`}
            className="font-semibold text-primary hover:underline"
          >
            {SITE.phone}
          </a>
          . We are happy to talk it through.
        </p>
      </div>
    </section>
  )
}
