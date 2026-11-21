import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { SITE } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Privacy",
  description: "How HandiGo! collects, uses and protects your personal information.",
}

const SECTIONS = [
  {
    title: "What we collect",
    body: "We collect the details you give us when you create an account or book a visit: your name, email address, phone number, service address and a short description of the job. Technicians also provide identity, insurance and trade-licence details for verification.",
  },
  {
    title: "How we use it",
    body: "Your details are used to match you with the right technician, confirm bookings, process payments, provide support and keep a record of any workmanship guarantee. We never sell personal information.",
  },
  {
    title: "Who can see it",
    body: "Only the technician assigned to your booking receives the contact and access details needed to complete the visit. Our support team can view booking records to resolve issues. Payment details are handled by our payment processor and are never stored on HandiGo! servers.",
  },
  {
    title: "Your choices",
    body: "You can update your profile from your dashboard, request a copy of your data, or ask us to delete your account by emailing us. Marketing messages are optional and can be turned off at any time.",
  },
] as const

export default function PrivacyPage() {
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
        Privacy, in plain English.
      </h1>
      <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
        Your trust is the whole business. Here is what we collect, why we need
        it, and the control you have over it. Last updated November 2026.
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
        <h2 className="font-display text-sm font-semibold">Questions?</h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
          Write to{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-primary hover:underline">
            {SITE.email}
          </a>{" "}
          and a real person will get back to you within one working day.
        </p>
      </div>
    </section>
  )
}
