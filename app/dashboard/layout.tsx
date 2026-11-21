import type { Metadata } from "next"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { normalizeRole } from "@/lib/roles"
import { requireServerSession } from "@/lib/session"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s · HandiGo!",
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireServerSession("/dashboard")
  const role = normalizeRole(session.user.role)

  return (
    <DashboardShell
      user={{
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
        role,
      }}
    >
      {children}
    </DashboardShell>
  )
}
