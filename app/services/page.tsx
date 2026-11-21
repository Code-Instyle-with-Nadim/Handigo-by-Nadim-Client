import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Clock3,
  ShieldCheck,
  Star,
} from "lucide-react"

import { CategoryIcon } from "@/components/site/category-icon"
import { SERVICE_CATEGORIES, SITE } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Home services",
  description:
    "Browse HandiGo! home services — plumbing, electrical, heating and AC, appliance repair, carpentry and cleaning. Upfront prices, vetted pros.",
}

export default function ServicesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(70%_80%_at_18%_0%,#e5efff_0%,rgba(246,248,252,0)_70%)] dark:bg-[radial-gradient(70%_80%_at_18%_0%,#0b2a52_0%,rgba(7,20,38,0)_70%)]"
        />
        <div aria-hidden="true" className="brand-grid absolute inset-0 -z-10 opacity-60" />
        <div className="page-shell relative py-14 sm:py-18 lg:py-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-3 py-1.5 text-[10.5px] font-bold tracking-[0.14em] text-primary uppercase backdrop-blur">
                <span className="size-1.5 rounded-full bg-gold" />
                The service menu
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Star className="size-3.5 fill-gold text-gold" />
                4.9 average across 2,400+ visits
              </span>
            </div>

            <h1 className="display-title mt-5 text-4xl leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-[3.7rem]">
              The right pro for every kind of{" "}
              <span className="text-brand-gradient">wrong.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
              Pick a category, tell us what is going on, and we will handle the
              rest. Every booking comes with a fixed quote, a vetted technician
              and our 12-month workmanship guarantee.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {SERVICE_CATEGORIES.map((category) => (
                <a
                  key={category.slug}
                  href={`#${category.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3.5 py-2 text-[11.5px] font-semibold text-foreground/75 backdrop-blur transition-colors hover:border-primary/25 hover:bg-brand-soft hover:text-primary"
                >
                  <CategoryIcon icon={category.icon} className="size-3.5" />
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {SERVICE_CATEGORIES.map((category) => (
            <article
              key={category.slug}
              id={category.slug}
              className="group relative scroll-mt-28 overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-[0_1px_2px_rgba(11,27,52,0.03)] transition-all duration-300 hover:border-primary/20 hover:shadow-[0_28px_60px_-38px_rgba(11,27,52,0.35)] sm:p-6"
            >
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 size-40 rounded-full bg-brand-soft/80 blur-2xl transition-transform duration-500 group-hover:scale-125"
              />
              <div className="relative flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-primary ring-1 ring-primary/10">
                  <CategoryIcon icon={category.icon} className="size-[22px]" />
                </span>
                <span className="inline-flex items-baseline gap-1 rounded-lg bg-gold-soft px-2.5 py-1 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
                  From
                  <span className="font-display text-[14px] font-bold">
                    ${category.from}
                  </span>
                </span>
              </div>

              <h2 className="relative mt-5 font-display text-xl font-semibold tracking-[-0.035em]">
                {category.name}
              </h2>
              <p className="relative mt-1.5 text-[12.5px] text-muted-foreground">
                {category.blurb}
              </p>

              <ul className="relative mt-5 grid gap-2">
                {category.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-[12px] text-foreground/70"
                  >
                    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-2.5" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="relative mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-muted-foreground">
                  <Clock3 className="size-3.5" />
                  Same-day slots available
                </span>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                    `Booking request: ${category.name}`,
                  )}`}
                  className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary transition-colors hover:text-primary/75"
                >
                  Book a pro
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card px-6 py-8 sm:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_80%_50%,rgba(37,99,235,0.12),transparent_65%)]"
          />
          <div className="relative grid gap-7 md:grid-cols-[1.3fr_0.7fr] md:items-center">
            <div>
              <p className="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.16em] text-primary uppercase">
                <span className="size-1.5 rounded-full bg-gold" />
                The HandiGo! promise
              </p>
              <h2 className="display-title mt-2 text-2xl tracking-[-0.04em] sm:text-[1.9rem]">
                A fair quote before we lift a tool.
              </h2>
              <p className="mt-2 max-w-xl text-[12.5px] leading-relaxed text-muted-foreground">
                No hidden call-out charges. No pressure to approve extras. If it
                is not fixed right, we come back and make it right — for free.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-foreground/70">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Vetted & insured
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="size-3.5 text-primary" />
                  12-month guarantee
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-primary" />
                  On-time or $25 off
                </span>
              </div>
            </div>
            <Link
              href="/about"
              className="group inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 text-[12.5px] font-semibold text-white shadow-[0_12px_26px_-14px_rgba(7,26,51,0.8)] transition-all hover:bg-primary focus-visible:ring-3 focus-visible:ring-primary/30 md:ml-auto"
            >
              How HandiGo! works
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
