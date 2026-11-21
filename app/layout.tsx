import type { Metadata, Viewport } from "next"
import { Geist_Mono, Manrope, Sora } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SITE } from "@/lib/site-data"
import { cn } from "@/lib/utils"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { Toaster } from "sonner"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "HandiGo! — Home fixes, handled.",
    template: "%s · HandiGo!",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "home services",
    "plumber",
    "electrician",
    "handyman",
    "appliance repair",
    "HVAC",
    "HandiGo!",
  ],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#071426" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "antialiased",
        manrope.variable,
        sora.variable,
        geistMono.variable,
        "font-sans",
      )}
    >
      <body>
        
       <main className="flex min-h-svh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <Toaster position="top-right" richColors />
            <SiteFooter/>
          </main>
      </body>
    </html>
  )
}
