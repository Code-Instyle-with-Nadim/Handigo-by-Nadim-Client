import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export const getServerSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
})

export async function requireServerSession(redirectTo?: string) {
  const session = await getServerSession()

  if (!session) {
    const query = redirectTo
      ? `?redirect=${encodeURIComponent(redirectTo)}`
      : ""

    redirect(`/sign-in${query}`)
  }

  return session
}
