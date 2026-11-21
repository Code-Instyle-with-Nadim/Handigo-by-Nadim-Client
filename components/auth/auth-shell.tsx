import Image from "next/image"
import { CalendarCheck, Check, ShieldCheck, Star } from "lucide-react"

export default function AuthShell({
  mode,
  children,
}: {
  mode: "sign-in" | "sign-up"
  children: React.ReactNode
}) {
  const isSignUp = mode === "sign-up"

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(70%_70%_at_78%_0%,#e5efff_0%,rgba(246,248,252,0)_68%)] dark:bg-[radial-gradient(70%_70%_at_78%_0%,#0b2a52_0%,rgba(7,20,38,0)_68%)]"
      />
      <div aria-hidden="true" className="brand-grid absolute inset-0 -z-10 opacity-60" />

      <div className="page-shell grid gap-10 py-10 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch lg:gap-14 lg:py-16">
        <aside className="relative hidden min-h-[34rem] overflow-hidden rounded-[2rem] bg-brand-deep p-8 text-white shadow-[0_35px_80px_-45px_rgba(4,18,38,0.7)] lg:flex lg:flex-col">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(to_right,#9ecbff_1px,transparent_1px),linear-gradient(to_bottom,#9ecbff_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-10 size-72 rounded-full bg-sky-400/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -left-16 size-72 rounded-full bg-primary/25 blur-3xl"
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[9.5px] font-bold tracking-[0.16em] text-sky-200/80 uppercase backdrop-blur">
              <span className="size-1.5 rounded-full bg-gold" />
              {isSignUp ? "Join the fix" : "Members' entrance"}
            </span>
            <h2 className="display-title mt-5 max-w-xs text-[2rem] leading-[1.05] tracking-[-0.045em]">
              {isSignUp
                ? "A calmer way to care for your home."
                : "Your home is in good hands."}
            </h2>
            <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-slate-400">
              {isSignUp
                ? "One account for vetted pros, upfront quotes and every repair your home will ever need."
                : "Sign in to book a visit, track your pro and keep every warranty in one tidy place."}
            </p>
          </div>

          <div className="relative my-8 grid place-items-center">
            <div
              aria-hidden="true"
              className="absolute size-52 rounded-full bg-sky-400/20 blur-3xl"
            />
            <Image
              src="/assets/handigo-mark.png"
              alt=""
              width={170}
              height={170}
              className="animate-float-soft relative rounded-[1.7rem] shadow-[0_28px_60px_-25px_rgba(0,0,0,0.8)] ring-1 ring-white/15"
            />
            <div className="absolute top-3 right-0 flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-deep/80 px-2.5 py-2 backdrop-blur">
              <span className="grid size-5 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                <Check className="size-3" />
              </span>
              <span className="text-[9px] font-semibold text-white/80">Fixed today</span>
            </div>
            <div className="absolute bottom-2 left-0 flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-deep/80 px-2.5 py-2 backdrop-blur">
              <ShieldCheck className="size-3.5 text-sky-300" />
              <span className="text-[9px] font-semibold text-white/80">12-month cover</span>
            </div>
          </div>

          <ul className="relative space-y-2.5">
            {[
              "Vetted, background-checked local pros",
              "Upfront quotes before any work begins",
              "Every job backed for twelve months",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-[11.5px] text-slate-300/85"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/[0.06] text-sky-300">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="relative mt-auto border-t border-white/10 pt-5">
            <div className="flex items-center gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-3 fill-current" />
              ))}
              <span className="ml-1.5 text-[10px] font-semibold text-white/85">
                4.9 from 2,400+ visits
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
              <CalendarCheck className="size-3.5" />
              Same-day slots across San Francisco
            </div>
          </div>
        </aside>

        <div className="mx-auto w-full max-w-[26rem] self-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-3 py-1.5 text-[9.5px] font-bold tracking-[0.16em] text-primary uppercase backdrop-blur">
            <span className="size-1.5 rounded-full bg-gold" />
            {isSignUp ? "New to HandiGo!" : "Welcome back"}
          </span>
          <h1 className="display-title mt-4 text-[2.1rem] leading-[1.02] tracking-[-0.05em] sm:text-[2.5rem]">
            {isSignUp ? (
              <>
                Make home <span className="text-brand-gradient">easier.</span>
              </>
            ) : (
              <>
                Good to see you <span className="text-brand-gradient">again.</span>
              </>
            )}
          </h1>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            {isSignUp
              ? "Create your account below. It takes less than a minute, and your first booking is on us from $39."
              : "Sign in to pick up where you left off — bookings, pros, warranties, all in one place."}
          </p>

          {children}
        </div>
      </div>
    </section>
  )
}
