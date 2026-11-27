"use client"
    import {Icon} from "@iconify/react";
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, LockKeyhole, Mail } from "lucide-react"
import { toast } from "sonner"

import { AuthInput, PasswordToggle } from "@/components/auth/auth-field"
import { authClient } from "@/lib/auth-client"
import { getSafeRedirectPath } from "@/lib/redirects"
import { getRoleMeta, normalizeRole } from "@/lib/roles"

type FieldErrors = {
  email?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SignInForm({
  redirectTo,
}: {
  redirectTo?: string | null
}) {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})

  const safeRedirect = getSafeRedirectPath(redirectTo)

  function validate() {
    const nextErrors: FieldErrors = {}
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      nextErrors.email = "Email is required."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address."
    }

    if (!password) {
      nextErrors.password = "Password is required."
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  function validateField(field: keyof FieldErrors) {
    if (field === "email") {
      const trimmedEmail = email.trim()

      setErrors((current) => ({
        ...current,
        email: !trimmedEmail
          ? "Email is required."
          : !EMAIL_PATTERN.test(trimmedEmail)
            ? "Please enter a valid email address."
            : undefined,
      }))
      return
    }

    setErrors((current) => ({
      ...current,
      password: password ? undefined : "Password is required.",
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      })

      if (error) {
        const message =
          error.status === 401
            ? "Invalid email or password. Please try again."
            : error.message || "Unable to sign in. Please try again."

        setFormError(message)
        toast.error(message)
        return
      }

      const role = normalizeRole(data?.user?.role)
      const destination = safeRedirect ?? getRoleMeta(role).dashboardHref

      toast.success("Welcome back!")
      router.push(destination)
      router.refresh()
    } catch {
      const message =
        "Something went wrong. Please check your connection and try again."

      setFormError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const signUpHref = safeRedirect
    ? `/sign-up?redirect=${encodeURIComponent(safeRedirect)}`
    : "/sign-up"


    const GoogleSignIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};
   

  return (
    <div className="mt-7">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[1.15rem] font-semibold tracking-[-0.03em]">
            Sign in to your account
          </h2>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
            Pick up right where you left off — bookings, pros and warranties in
            one place.
          </p>
        </div>
        <span className="mb-0.5 hidden shrink-0 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[9.5px] font-semibold tracking-[0.08em] text-muted-foreground uppercase sm:inline-flex">
          Secure
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={loading}
        className="mt-5 space-y-4"
      >
        {formError ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/[0.06] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-destructive"
          >
            {formError}
          </p>
        ) : null}

        <AuthInput
          id="signin-email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          required
          disabled={loading}
          icon={<Mail className="size-4" />}
          error={errors.email}
          onChange={(event) => {
            setEmail(event.target.value)
            setFormError(null)
            setErrors((current) => ({ ...current, email: undefined }))
          }}
          onBlur={() => validateField("email")}
        />

        <AuthInput
          id="signin-password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          required
          disabled={loading}
          icon={<LockKeyhole className="size-4" />}
          error={errors.password}
          className="pr-11"
          labelAccessory={
            <Link
              href="/about#faq"
              className="text-[10.5px] font-medium text-primary hover:underline"
            >
              Need help?
            </Link>
          }
          rightSlot={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword((visible) => !visible)}
              disabled={loading}
            />
          }
          onChange={(event) => {
            setPassword(event.target.value)
            setFormError(null)
            setErrors((current) => ({ ...current, password: undefined }))
          }}
          onBlur={() => validateField("password")}
        />

        <button
          type="submit"
          disabled={loading}
          className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] text-[13px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(37,99,235,0.9)] transition-all outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-primary/35 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
        <button
          onClick={GoogleSignIn}
          className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] text-[13px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(37,99,235,0.9)] transition-all outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-primary/35 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70">
        <Icon icon="devicon:google" />
        Sign in with Google
      </button>

        <p className="pt-1 text-center text-[11.5px] text-muted-foreground">
          New to HandiGo!?{" "}
          <Link
            href={signUpHref}
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}
