import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  CirclePlay,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react"

import { CategoryIcon } from "@/components/site/category-icon"
import {
  SERVICE_CATEGORIES,
  SITE,
  TRUST_STATS,
} from "@/lib/site-data"

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(80%_58%_at_50%_0%,#e5efff_0%,rgba(246,248,252,0)_68%)] dark:bg-[radial-gradient(80%_58%_at_50%_0%,#0b2a52_0%,rgba(7,20,38,0)_68%)]"
        />
        <div
          aria-hidden="true"
          className="brand-grid absolute inset-0 -z-10 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-24 -right-28 -z-10 size-[26rem] rounded-full bg-sky-300/20 blur-[100px] dark:bg-sky-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 left-[8%] -z-10 size-2 rounded-full bg-gold/70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-44 left-[4%] -z-10 size-1.5 rounded-full bg-primary/40"
        />

        <div className="page-shell grid items-center gap-14 pt-14 pb-16 sm:pt-20 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8 lg:pt-24 lg:pb-24">
          <div className="relative z-10 max-w-[38rem]">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/75 py-1.5 pr-3 pl-2 text-[11px] font-semibold text-foreground/75 shadow-[0_2px_10px_-4px_rgba(11,27,52,0.12)] backdrop-blur">
              <span className="grid size-5 place-items-center rounded-full bg-primary text-white">
                <Wrench className="size-2.5" />
              </span>
              Trusted home services
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                Pros online now
              </span>
            </div>

            <h1 className="display-title mt-6 text-[2.85rem] leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[4.15rem]">
              Home fixes,
              <span className="block">
                handled <span className="text-brand-gradient">right.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
              From a dripping tap to a full electrical refresh, book verified
              local pros at upfront prices. Every visit is backed by the
              HandiGo! guarantee — no surprises, no shortcuts.
            </p>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/services"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-6 text-[13.5px] font-semibold text-white shadow-[0_16px_32px_-16px_rgba(37,99,235,0.95)] transition-all outline-none hover:brightness-110 hover:shadow-[0_20px_38px_-16px_rgba(37,99,235,0.8)] focus-visible:ring-3 focus-visible:ring-primary/35 active:translate-y-px"
              >
                Find a pro
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-6 text-[13.5px] font-semibold text-foreground shadow-[0_1px_2px_rgba(11,27,52,0.04)] backdrop-blur transition-all outline-none hover:border-primary/25 hover:bg-brand-soft hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <CirclePlay className="size-[17px]" />
                How it works
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    ["MJ", "from-sky-500 to-blue-600"],
                    ["AR", "from-amber-400 to-orange-500"],
                    ["TK", "from-emerald-500 to-teal-600"],
                  ].map(([initials, gradient]) => (
                    <span
                      key={initials}
                      className={`grid size-8 place-items-center rounded-full bg-gradient-to-br ${gradient} font-display text-[9px] font-bold text-white ring-2 ring-background`}
                    >
                      {initials}
                    </span>
                  ))}
                  <span className="grid size-8 place-items-center rounded-full bg-brand-deep font-display text-[8.5px] font-bold text-white ring-2 ring-background">
                    12k
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="size-3 fill-current" />
                    ))}
                    <span className="ml-1 text-[11px] font-bold text-foreground">
                      4.9
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    From 2,400+ reviewed visits
                  </p>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="hidden h-8 w-px bg-border sm:block"
              />

              <div className="flex items-center gap-2 text-[11.5px] font-medium text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Vetted, insured & guaranteed
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[28rem] lg:ml-auto">
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,rgba(56,189,248,0.28),transparent_65%)] blur-2xl"
            />

            <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(155deg,#0d315f_0%,#071e3d_48%,#04101f_100%)] p-4 shadow-[0_40px_90px_-36px_rgba(4,18,38,0.65)] sm:p-5">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,#9ecbff_1px,transparent_1px),linear-gradient(to_bottom,#9ecbff_1px,transparent_1px)] [background-size:38px_38px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
              />
              <div
                aria-hidden="true"
                className="absolute -top-16 left-1/2 h-52 w-72 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl"
              />

              <div className="relative flex items-center justify-between gap-3 px-1 pb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.16em] text-white/60 uppercase">
                    HandiGo! dispatch
                  </span>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-white/45">
                  SF · 94105
                </span>
              </div>

              <div className="relative grid place-items-center rounded-[1.35rem] border border-white/10 bg-white/[0.035] py-7">
                <div className="animate-float-soft relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-5 rounded-full bg-sky-400/30 blur-2xl"
                  />
                  <Image
                    src="/assets/handigo-mark.png"
                    alt="The HandiGo! app mark: a laptop with a wrench and gear"
                    width={210}
                    height={210}
                    priority
                    className="relative rounded-[2rem] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)] ring-1 ring-white/15"
                  />
                </div>

                <div className="mt-5 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#06172e]/80 px-3 py-1.5 text-[10px] font-medium text-white/60 backdrop-blur">
                  <BadgeCheck className="size-3 text-sky-300" />
                  Every pro is background-checked
                </div>
              </div>

              <div className="relative mt-3 grid grid-cols-[1fr_auto] items-center gap-3 rounded-[1.1rem] border border-white/10 bg-white/[0.055] p-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 font-display text-[10px] font-bold text-white">
                    MK
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-semibold text-white">
                      Marcus is on the way
                    </p>
                    <p className="truncate text-[10px] text-white/45">
                      Plumbing · 4.9 ★ · 6 yrs experience
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-emerald-400/10 px-2 py-1 text-right">
                  <p className="font-mono text-[9px] tracking-[0.08em] text-emerald-300/70 uppercase">
                    ETA
                  </p>
                  <p className="text-[11px] font-bold text-emerald-300">12 min</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-2 hidden animate-in items-center gap-2 rounded-xl border border-border/80 bg-card/95 px-3 py-2.5 shadow-[0_18px_40px_-20px_rgba(4,18,38,0.35)] backdrop-blur slide-in-from-right-4 duration-700 sm:flex">
              <span className="grid size-7 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Check className="size-3.5" />
              </span>
              <div>
                <p className="text-[10.5px] font-semibold">Leak repaired</p>
                <p className="text-[9px] text-muted-foreground">Today · 9:40 AM</p>
              </div>
            </div>

            <div className="absolute -bottom-14 -left-4 hidden animate-in items-center gap-2.5 rounded-xl border border-border/80 bg-card/95 px-3 py-2.5 shadow-[0_18px_40px_-20px_rgba(4,18,38,0.35)] backdrop-blur slide-in-from-left-4 duration-700 sm:flex">
              <span className="grid size-8 place-items-center rounded-full bg-gold-soft text-gold">
                <CalendarCheck className="size-4" />
              </span>
              <div>
                <p className="text-[10.5px] font-semibold">Next available slot</p>
                <p className="text-[9px] text-muted-foreground">Today · 2:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-card/55 backdrop-blur">
        <div className="page-shell grid grid-cols-2 divide-x divide-border/70 md:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-4 py-6 text-center md:py-7"
            >
              <span className="font-display text-2xl font-semibold tracking-[-0.04em] sm:text-[1.7rem]">
                {stat.value}
              </span>
              <span className="text-[10.5px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.18em] text-primary uppercase">
              <span className="size-1.5 rounded-full bg-gold" />
              What we fix
            </p>
            <h2 className="display-title mt-3 text-3xl tracking-[-0.045em] sm:text-[2.4rem]">
              One call. Every corner of your home.
            </h2>
          </div>
          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-1.5 text-[12.5px] font-semibold text-primary"
          >
            Explore all services
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/services?category=${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-[0_1px_2px_rgba(11,27,52,0.03)] transition-all duration-300 outline-none hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_24px_50px_-30px_rgba(11,27,52,0.35)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_10px_20px_-10px_rgba(37,99,235,0.7)]">
                  <CategoryIcon icon={category.icon} />
                </span>
                <span className="grid size-7 place-items-center rounded-full border border-border/70 text-muted-foreground/50 transition-all duration-300 group-hover:border-primary/15 group-hover:bg-brand-soft group-hover:text-primary">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
              <h3 className="mt-4 font-display text-[15px] font-semibold tracking-[-0.02em]">
                {category.name}
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {category.blurb}
              </p>
              <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-[10.5px] font-medium text-muted-foreground">
                <span className="size-1 rounded-full bg-gold" />
                From ${category.from}
                <span className="ml-auto text-[10px] text-muted-foreground/60">
                  Same-day options
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell pb-16 sm:pb-20">
        <div className="relative isolate overflow-hidden rounded-3xl bg-brand-deep px-6 py-10 text-white sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_80%_0%,rgba(56,189,248,0.22),transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#9ecbff_1px,transparent_1px),linear-gradient(to_bottom,#9ecbff_1px,transparent_1px)] [background-size:44px_44px]"
          />
          <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.18em] text-sky-300 uppercase">
                <span className="size-1.5 rounded-full bg-gold" />
                Don&apos;t put it off
              </p>
              <h2 className="display-title mt-3 text-3xl tracking-[-0.045em] sm:text-[2.35rem]">
                Something broken? Let&apos;s fix it today.
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-400">
                Tell us what&apos;s wrong and we&apos;ll match you with the right
                local pro in minutes. No call-outs, no guesswork.
              </p>
            </div>
            <Link
              href={`mailto:${SITE.email}`}
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[13px] font-semibold text-brand-deep shadow-[0_12px_28px_-14px_rgba(0,0,0,0.5)] transition-all outline-none hover:bg-sky-50 focus-visible:ring-3 focus-visible:ring-white/40 active:translate-y-px"
            >
              Book a visit
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
