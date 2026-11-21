import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL

export const authClient = createAuthClient({
  // In the browser the client falls back to the current origin, which is what
  // we want in development and on any deployment domain.
  ...(baseURL ? { baseURL } : {}),
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, useSession, updateUser } = authClient
