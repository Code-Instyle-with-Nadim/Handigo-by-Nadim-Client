import type { Metadata } from "next"

import AuthShell from "@/components/auth/auth-shell"
import SignUpForm from "@/components/auth/sign-up-form"
import { getRedirectFromSearchParams } from "@/lib/redirects"

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join HandiGo! as a customer or technician. Book vetted home pros or find local work that fits your craft.",
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const redirectTo = getRedirectFromSearchParams(await searchParams)

  return (
    <AuthShell mode="sign-up">
      <SignUpForm redirectTo={redirectTo} />
    </AuthShell>
  )
}
