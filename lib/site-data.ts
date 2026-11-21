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
    slug: "plumbing",
    name: "Plumbing",
    icon: "droplets",
    blurb: "Leaks, taps, drains & water heaters",
    from: 49,
    includes: ["Leak detection & repair", "Tap and fixture installs", "Drain clearing"],
  },
  {
    slug: "electrical",
    name: "Electrical",
    icon: "zap",
    blurb: "Wiring, outlets, lighting & panels",
    from: 59,
    includes: ["Outlet & switch repair", "Lighting installation", "Safety inspections"],
  },
  {
    slug: "hvac",
    name: "Heating & AC",
    icon: "wind",
    blurb: "Servicing, repair & installation",
    from: 69,
    includes: ["AC tune-ups & repair", "Heating diagnostics", "Filter replacement"],
  },
  {
    slug: "appliances",
    name: "Appliance Repair",
    icon: "washing-machine",
    blurb: "Fridges, washers, ovens & more",
    from: 55,
    includes: ["Fridge & freezer repair", "Washer & dryer fixes", "Oven diagnostics"],
  },
  {
    slug: "carpentry",
    name: "Carpentry",
    icon: "hammer",
    blurb: "Shelves, doors, decks & furniture",
    from: 45,
    includes: ["Shelf & cabinet fitting", "Door adjustments", "Small furniture repairs"],
  },
  {
    slug: "cleaning",
    name: "Home Cleaning",
    icon: "sparkles",
    blurb: "Deep cleans & move-out resets",
    from: 39,
    includes: ["Deep kitchen & bath clean", "Move-in / move-out reset", "Recurring home care"],
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
