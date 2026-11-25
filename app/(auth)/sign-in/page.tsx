import type { Metadata } from "next"

import AuthShell from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"
import { getRedirectFromSearchParams } from "@/lib/redirects"

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your HandiGo! account to book and manage home service visits.",
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const redirectTo = getRedirectFromSearchParams(await searchParams)

  return (
    <AuthShell mode="sign-in">
      <SignInForm redirectTo={redirectTo} />
    </AuthShell>
  )
}
