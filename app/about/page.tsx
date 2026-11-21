import type { Metadata } from "next"
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  CircleHelp,
  HeartHandshake,
  Plus,
  Search,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react"

import { BrandLogo } from "@/components/site/brand-logo"
import { SITE, TRUST_STATS } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Learn how HandiGo! matches you with vetted local technicians, keeps pricing upfront, and backs every job with a 12-month guarantee.",
}

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Tell us what is wrong",
    copy: "Describe the job, add a photo if you can, and pick a time that suits your day. It takes about two minutes.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Meet your matched pro",
    copy: "We match you with a background-checked local technician who has the right skills — not whoever is closest.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Relax. It is handled.",
    copy: "You approve a fixed quote before work starts. When the job is done, our 12-month guarantee kicks in.",
  },
] as const

const VALUES = [
  {
    icon: Users,
    title: "People, not profiles",
    copy: "Every HandiGo! technician is interviewed, background-checked, insured, and rated by real customers after every visit.",
  },
  {
    icon: Wallet,
    title: "Pricing you can see",
    copy: "No call-out fees hidden in the small print. You see the full quote first, and we do not start until you approve it.",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed, in writing",
    copy: "If something is not right within 12 months of the visit, we send a pro back to fix it at no extra cost. Simple.",
  },
] as const

const FAQS = [
  {
    question: "How are HandiGo! technicians vetted?",
    answer:
      "Every technician completes an interview, identity and background check, licence and insurance verification, and a paid trial job before joining. Their rating is reviewed after every visit.",
  },
  {
    question: "What does a visit cost?",
    answer:
      "Diagnostics start from $39 and are credited toward the repair if you go ahead. You always see a fixed quote before any work begins, so there are no surprises on the invoice.",
  },
  {
    question: "What if I am not happy with the work?",
    answer:
      "Tell us within 12 months and we will arrange a return visit to make it right at no extra cost. If we cannot fix it, our guarantee covers the cost of the original job.",
  },
  {
    question: "Can I request the same technician again?",
    answer:
      "Yes. When you book, request the technician by name and we will check their availability. Favourite pros can also be saved to your account for one-tap rebooking.",
  },
] as const

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(70%_70%_at_75%_0%,#e5efff_0%,rgba(246,248,252,0)_68%)] dark:bg-[radial-gradient(70%_70%_at_75%_0%,#0b2a52_0%,rgba(7,20,38,0)_68%)]"
        />
        <div aria-hidden="true" className="brand-grid absolute inset-0 -z-10 opacity-60" />

        <div className="page-shell grid items-center gap-12 py-14 sm:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/75 px-3 py-1.5 text-[10.5px] font-bold tracking-[0.14em] text-primary uppercase backdrop-blur">
              <span className="size-1.5 rounded-full bg-gold" />
              How HandiGo! works
            </div>
            <h1 className="display-title mt-5 max-w-2xl text-4xl leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-[3.75rem]">
              Home repairs, minus the{" "}
              <span className="text-brand-gradient">runaround.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
              Finding a good tradesperson should not feel like a gamble. HandiGo!
              brings vetted pros, transparent pricing and a real guarantee into
              one calm, simple booking.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[11.5px] font-medium text-foreground/70">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-3.5 text-primary" />
                Vetted & insured
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                12-month guarantee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <HeartHandshake className="size-3.5 text-primary" />
                Real human support
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_60%_40%,rgba(56,189,248,0.22),transparent_65%)] blur-2xl"
            />
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-[0_30px_70px_-40px_rgba(4,18,38,0.4)] sm:p-6">
              <div className="flex items-center justify-between">
                <BrandLogo />
                <span className="rounded-full border border-emerald-500/15 bg-emerald-500/[0.07] px-2 py-1 text-[9px] font-bold tracking-[0.1em] text-emerald-600 uppercase dark:text-emerald-400">
                  Standard visit
                </span>
              </div>

              <div className="mt-6 rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  What is included
                </p>
                <ul className="mt-3.5 space-y-3">
                  {[
                    "A fixed quote before work starts",
                    "A background-checked technician",
                    "Clean-up when the job is done",
                    "12 months of workmanship cover",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-[12px] text-foreground/75"
                    >
                      <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-2.5" strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-brand-deep p-4 text-white">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-sky-300">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <p className="text-[11.5px] font-semibold">
                    The HandiGo! guarantee
                  </p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-slate-400">
                    Not right? We come back and fix it. No arguments.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -bottom-9 hidden items-center gap-2.5 rounded-xl border border-border/80 bg-card/95 px-3 py-2.5 shadow-[0_18px_40px_-20px_rgba(4,18,38,0.35)] backdrop-blur sm:flex">
              <span className="grid size-8 place-items-center rounded-full bg-gold-soft text-gold">
                <BadgeCheck className="size-4" />
              </span>
              <div>
                <p className="text-[10.5px] font-semibold">Every pro vetted</p>
                <p className="text-[9px] text-muted-foreground">
                  Interviewed & insured
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20">
        <div className="grid grid-cols-2 divide-x divide-border/70 rounded-2xl border border-border/70 bg-card/60 md:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-4 py-6 text-center"
            >
              <span className="font-display text-2xl font-semibold tracking-[-0.04em]">
                {stat.value}
              </span>
              <span className="text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.18em] text-primary uppercase">
              <span className="size-1.5 rounded-full bg-gold" />
              Three steps, no stress
            </p>
            <h2 className="display-title mt-3 text-3xl tracking-[-0.045em] sm:text-[2.4rem]">
              From “that needs fixing” to fixed.
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              We designed HandiGo! around the parts of booking a tradesperson
              that usually go wrong. Here is what replaces them.
            </p>
          </div>

          <div className="relative mt-9 grid gap-4 md:grid-cols-3">
            <div
              aria-hidden="true"
              className="absolute top-[3.35rem] right-[16%] left-[16%] hidden border-t border-dashed border-border md:block"
            />
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-border/80 bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-primary ring-1 ring-primary/10">
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-muted-foreground/45">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-base font-semibold tracking-[-0.025em]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.18em] text-primary uppercase">
              <span className="size-1.5 rounded-full bg-gold" />
              Built on trust
            </p>
            <h2 className="display-title mt-3 text-3xl tracking-[-0.045em] sm:text-[2.4rem]">
              Better standards, by design.
            </h2>
          </div>

          <div className="mt-8 grid gap-3.5 md:grid-cols-3">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border/80 bg-card p-5"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-gold-soft text-amber-700 dark:text-amber-300">
                  <value.icon className="size-[18px]" />
                </span>
                <h3 className="mt-4 font-display text-[15px] font-semibold tracking-[-0.02em]">
                  {value.title}
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                  {value.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="technicians" className="page-shell scroll-mt-28 pb-16 sm:pb-20">
        <div className="relative isolate overflow-hidden rounded-3xl bg-brand-deep px-6 py-9 text-white sm:px-10 sm:py-11">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_90%_0%,rgba(56,189,248,0.2),transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#9ecbff_1px,transparent_1px),linear-gradient(to_bottom,#9ecbff_1px,transparent_1px)] [background-size:42px_42px]"
          />
          <div className="relative flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.18em] text-sky-300 uppercase">
                <span className="size-1.5 rounded-full bg-gold" />
                For technicians
              </p>
              <h2 className="display-title mt-3 text-3xl tracking-[-0.045em] sm:text-[2.35rem]">
                Good work deserves a better platform.
              </h2>
              <p className="mt-3 max-w-xl text-[12.5px] leading-relaxed text-slate-400">
                Keep your craft, lose the chasing. Set your own availability,
                get matched with local jobs, and get paid on time. We handle the
                admin so you can stay on the tools.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-400" />
                  Flexible schedule
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-400" />
                  Reliable local jobs
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-400" />
                  No chasing invoices
                </span>
              </div>
            </div>
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                "Technician application",
              )}`}
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[13px] font-semibold text-brand-deep shadow-[0_12px_28px_-14px_rgba(0,0,0,0.5)] transition-all hover:bg-sky-50 focus-visible:ring-3 focus-visible:ring-white/40"
            >
              Apply to join
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-28 border-t border-border/70 bg-card/40">
        <div className="page-shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-primary ring-1 ring-primary/10">
              <CircleHelp className="size-5" />
            </span>
            <h2 className="display-title mt-4 text-3xl tracking-[-0.045em]">
              Questions, answered.
            </h2>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              Still unsure about something? Our team is one message away, seven
              days a week.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-[12px]">
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex w-fit items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                {SITE.email}
                <ArrowUpRight className="size-3.5" />
              </a>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {SITE.phone}
              </a>
            </div>
          </div>

          <div className="divide-y divide-border/70 border-y border-border/70">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4.5 text-[13.5px] font-semibold outline-none transition-colors hover:text-primary focus-visible:text-primary">
                  {faq.question}
                  <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="pr-8 pb-4.5 text-[12.5px] leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
