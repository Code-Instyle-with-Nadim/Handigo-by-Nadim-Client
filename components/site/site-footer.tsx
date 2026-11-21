import Link from "next/link"
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react"

import { BrandLogo } from "@/components/site/brand-logo"
import { SocialIcon } from "@/components/site/social-icon"
import {
  QUICK_LINKS,
  SERVICE_CATEGORIES,
  SITE,
  SOCIAL_LINKS,
} from "@/lib/site-data"

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-white/45 uppercase">
      <span className="size-1 rounded-full bg-gold" />
      {children}
    </h2>
  )
}

function ContactRow({
  icon,
  label,
  children,
  href,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  href?: string
}) {
  const content = (
    <>
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.055] text-sky-300">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold tracking-[0.14em] text-white/35 uppercase">
          {label}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-relaxed text-slate-300/90">
          {children}
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className="group flex gap-2.5 rounded-xl outline-none transition-colors focus-visible:ring-3 focus-visible:ring-sky-400/40"
      >
        {content}
      </a>
    )
  }

  return <div className="flex gap-2.5">{content}</div>
}

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-brand-deep text-slate-300">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,#2563eb_22%,#38bdf8_50%,#f59e0b_82%,transparent_100%)] opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 size-[29rem] rounded-full bg-primary/20 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 size-[26rem] rounded-full bg-sky-500/10 blur-[100px]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 520 420"
        fill="none"
        className="pointer-events-none absolute top-6 right-0 h-[26rem] w-auto text-sky-300/[0.09]"
      >
        <path d="M420 0v90h-70v70h-60v80h90v70h80" stroke="currentColor" />
        <path d="M500 30h-50v60h-60v60h-50v80h70v70h90" stroke="currentColor" />
        <circle cx="350" cy="160" r="7" stroke="currentColor" />
        <circle cx="490" cy="240" r="7" stroke="currentColor" />
        <circle cx="490" cy="30" r="4" stroke="currentColor" />
        <path d="M390 20h60M360 120h50M340 280h100" stroke="currentColor" strokeDasharray="3 7" />
      </svg>

      <div className="page-shell relative py-14 sm:py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.55fr_0.8fr_1fr_1.25fr] lg:gap-10">
          <div className="max-w-sm">
            <BrandLogo
              inverted
              className="focus-visible:ring-sky-400/40"
              markClassName="ring-white/15"
            />
            <p className="mt-5 font-display text-[17px] leading-snug font-medium tracking-[-0.015em] text-white/90">
              {SITE.tagline}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-400">
              Vetted local technicians, upfront pricing and work that is
              guaranteed. From a dripping tap to a full home refresh.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1.5 text-[10.5px] font-semibold tracking-[0.04em] text-emerald-200/90">
              <ShieldCheck className="size-3.5" />
              Background-checked & insured pros
            </div>

            <div className="mt-7">
              <p className="text-[10px] font-bold tracking-[0.16em] text-white/35 uppercase">
                Find us elsewhere
              </p>
              <div className="mt-3 flex items-center gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.045] text-slate-300 transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-white/[0.09] hover:text-white focus-visible:ring-3 focus-visible:ring-sky-400/40"
                  >
                    <SocialIcon name={social.key} className="size-[15px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <FooterHeading>Quick links</FooterHeading>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-[13px] text-slate-400 transition-colors outline-none hover:text-white focus-visible:text-white"
                  >
                    <span className="h-px w-0 bg-sky-400 transition-all duration-200 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Popular categories</FooterHeading>
            <ul className="mt-5 space-y-2.5">
              {SERVICE_CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/services#${category.slug}`}
                    className="group flex items-center justify-between gap-2 text-[13px] text-slate-400 transition-colors outline-none hover:text-white focus-visible:text-white"
                  >
                    {category.name}
                    <ArrowUpRight className="size-3.5 -translate-x-1 text-slate-600 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-sky-300 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Get in touch</FooterHeading>
            <div className="mt-5 space-y-4">
              <ContactRow
                icon={<Mail className="size-3.5" />}
                label="Email"
                href={`mailto:${SITE.email}`}
              >
                {SITE.email}
              </ContactRow>
              <ContactRow
                icon={<Phone className="size-3.5" />}
                label="Phone"
                href={`tel:${SITE.phoneHref}`}
              >
                {SITE.phone}
              </ContactRow>
              <ContactRow
                icon={<MapPin className="size-3.5" />}
                label="Studio"
              >
                {SITE.address}
              </ContactRow>
              <ContactRow icon={<Clock3 className="size-3.5" />} label="Hours">
                {SITE.hours}
                <span className="mt-1 block text-[11px] text-sky-300/70">
                  {SITE.emergency}
                </span>
              </ContactRow>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11.5px] text-slate-500">
            © {year} {SITE.name} · All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-slate-500">
            <Link href="/privacy" className="transition-colors hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-slate-300">
              Terms
            </Link>
            <Link href="/about#faq" className="transition-colors hover:text-slate-300">
              Support
            </Link>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="inline-flex items-center gap-1.5">
              Built for better homes
              <span className="size-1 rounded-full bg-gold" />
            </span>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 -bottom-8 hidden font-display text-[9rem] leading-none font-bold tracking-[-0.07em] text-white/[0.025] select-none lg:block xl:text-[12rem]"
      >
        HANDIGO!
      </div>
    </footer>
  )
}
