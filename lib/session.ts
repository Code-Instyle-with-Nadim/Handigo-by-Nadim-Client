import { headers } from "next/headers"

import { auth } from "@/lib/auth"

/**
 * Read the Better Auth session inside server components, server actions and
 * route handlers. `headers()` is async in the App Router, so this helper keeps
 * the call sites short.
 */
export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}
