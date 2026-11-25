export const SITE = {
  name: "HandiGo!",
  tagline: "Every home has a to-do list. Consider it handled.",
  description:
    "Book vetted local pros for plumbing, electrical, appliance and home repair work — honest pricing, on-time visits, guaranteed results.",
  email: "hello@handigo.com",
  phone: "+1 (415) 555-0134",
  phoneHref: "+14155550134",
  address: "88 Mission Street, Suite 400, San Francisco, CA 94105",
  hours: "Mon – Sat · 8:00 AM – 8:00 PM",
  emergency: "24/7 emergency callouts available",
} as const

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
] as const

export const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Become a Technician", href: "/about#technicians" },
  { label: "Help Center", href: "/about#faq" },
] as const

export const SERVICE_CATEGORIES = [
  {
    slug: "smartphone",
    name: "Smartphone",
    icon: "smartphone",
    blurb: "Screen, battery, charging port & software repairs",
    from: 25,
    includes: ["Screen replacement", "Battery replacement", "Charging port repair"],
  },
  {
    slug: "laptop-pc",
    name: "Laptop & PC",
    icon: "laptop",
    blurb: "Screen, keyboard, motherboard & OS support",
    from: 45,
    includes: ["Screen replacement", "Keyboard repair", "Virus removal & OS install"],
  },
  {
    slug: "ac",
    name: "AC",
    icon: "wind",
    blurb: "Servicing, gas refill & installation",
    from: 69,
    includes: ["AC tune-up & cleaning", "Gas refill", "Installation"],
  },
  {
    slug: "refrigerator",
    name: "Refrigerator",
    icon: "snowflake",
    blurb: "Cooling, defrost & compressor repair",
    from: 55,
    includes: ["Cooling issue fix", "Defrost repair", "Compressor service"],
  },
  {
    slug: "tv",
    name: "TV",
    icon: "tv",
    blurb: "Screen, panel & motherboard repair",
    from: 40,
    includes: ["Screen replacement", "Panel repair", "Motherboard service"],
  },
  {
    slug: "washing-machine",
    name: "Washing Machine",
    icon: "washing-machine",
    blurb: "Drum, motor & drainage repair",
    from: 55,
    includes: ["Drum repair", "Motor service", "Drainage fix"],
  },
  {
    slug: "electrical",
    name: "Electrical",
    icon: "zap",
    blurb: "Wiring, outlets, lighting & panels",
    from: 59,
    includes: ["Outlet & switch repair", "Lighting installation", "Safety inspections"],
  },
] as const

export const SOCIAL_LINKS = [
  { label: "HandiGo! on X", key: "x", href: "https://x.com" },
  { label: "HandiGo! on Facebook", key: "facebook", href: "https://facebook.com" },
  { label: "HandiGo! on Instagram", key: "instagram", href: "https://instagram.com" },
  { label: "HandiGo! on LinkedIn", key: "linkedin", href: "https://linkedin.com" },
] as const

export const TRUST_STATS = [
  { value: "12k+", label: "Homes cared for" },
  { value: "4.9/5", label: "Average rating" },
  { value: "45 min", label: "Fastest response" },
  { value: "100%", label: "Work guaranteed" },
] as const
