"use client"

import { useState } from "react"
import Link from "next/link"

import ImageUpload from "@/components/shared/ImageUpload";
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Check,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react"
import { toast } from "sonner"
import {Icon} from "@iconify/react";

import { AuthInput, PasswordToggle } from "@/components/auth/auth-field"
import { authClient } from "@/lib/auth-client"
import { getSafeRedirectPath } from "@/lib/redirects"
import { getRoleMeta, normalizeRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

type Role = "customer" | "technician"

type FieldErrors = {
  name?: string
  email?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ROLES: {
  value: Role
  title: string
  description: string
  icon: typeof UserRound
}[] = [
  {
    value: "customer",
    title: "Customer",
    description: "I need help at home",
    icon: UserRound,
  },
  {
    value: "technician",
    title: "Technician",
    description: "I offer home services",
    icon: Wrench,
  },
]

function getPasswordError(value: string) {
  if (!value) {
    return "Password is required."
  }

  if (value.length < 6) {
    return "Password must be at least 6 characters."
  }

  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter."
  }

  if (!/[a-z]/.test(value)) {
    return "Password must contain at least one lowercase letter."
  }

  return ""
}

export default function SignUpForm({
  redirectTo,
}: {
  redirectTo?: string | null
}) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
 const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("customer")
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})

  const safeRedirect = getSafeRedirectPath(redirectTo)

  function validate() {
    const nextErrors: FieldErrors = {}
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      nextErrors.name = "Full name is required."
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address."
    }

    const passwordError = getPasswordError(password)

    if (passwordError) {
      nextErrors.password = passwordError
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  function validateField(field: keyof FieldErrors) {
    if (field === "name") {
      setErrors((current) => ({
        ...current,
        name: name.trim() ? undefined : "Full name is required.",
      }))
      return
    }

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
      password: getPasswordError(password) || undefined,
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
      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        image: imageUrl,
        
        email: email.trim(),
        password,
        role,
      })

      if (error) {
        const message =
          error.status === 422 ||
          /already exists|use another email/i.test(error.message ?? "")
            ? "An account with this email already exists. Try signing in instead."
            : error.message ||
              "Unable to create your account. Please try again."

        setFormError(message)
        toast.error(message)
        return
      }

      const savedRole = normalizeRole(data?.user?.role)
      const destination =
        safeRedirect ?? getRoleMeta(savedRole).dashboardHref

      toast.success("Account created successfully! Welcome to HandiGo!")
      router.push(destination)
      router.refresh()
    } catch {
      const message =
        "Unable to create your account. Please check your connection and try again."

      setFormError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const signInHref = safeRedirect
    ? `/sign-in?redirect=${encodeURIComponent(safeRedirect)}`
    : "/sign-in"


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
            Create your account
          </h2>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
            Choose how you want to use HandiGo! — you can update your profile
            later.
          </p>
        </div>
        <span className="mb-0.5 hidden shrink-0 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[9.5px] font-semibold tracking-[0.08em] text-muted-foreground uppercase sm:inline-flex">
          ~1 min
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
          id="signup-name"
          name="name"
          type="text"
          label="Full name"
          autoComplete="name"
          placeholder="e.g. Nadim Hasan"
          value={name}
          required
          disabled={loading}
          icon={<UserRound className="size-4" />}
          error={errors.name}
          onChange={(event) => {
            setName(event.target.value)
            setFormError(null)
            setErrors((current) => ({ ...current, name: undefined }))
          }}
          onBlur={() => validateField("name")}
        />
          <ImageUpload onUpload={setImageUrl} />

      {/* Your other signup fields */}

      <button
        onClick={() => console.log(imageUrl)}
      >
        Check Image URL
      </button>

        <AuthInput
          id="signup-email"
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
          id="signup-password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          required
          disabled={loading}
          icon={<LockKeyhole className="size-4" />}
          error={errors.password}
          hint="At least 6 characters, including one uppercase and one lowercase letter."
          className="pr-11"
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

        <fieldset>
          <legend
            id="signup-role-label"
            className="mb-2 flex items-center gap-2 text-[11.5px] font-semibold"
          >
            I am joining as
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
              <ShieldCheck className="size-2.5" />
              Admin is invite-only
            </span>
          </legend>

          <div
            role="radiogroup"
            aria-labelledby="signup-role-label"
            className="grid grid-cols-2 gap-3"
          >
            {ROLES.map((item) => {
              const Icon = item.icon
              const selected = role === item.value

              return (
                <label
                  key={item.value}
                  className={cn(
                    "relative cursor-pointer rounded-xl border p-3.5 transition-all outline-none focus-within:ring-3 focus-within:ring-primary/25",
                    selected
                      ? "border-primary bg-brand-soft shadow-[0_10px_24px_-18px_rgba(37,99,235,0.8)] ring-1 ring-primary/40"
                      : "border-border bg-card/60 hover:border-primary/30 hover:bg-muted/40",
                    loading && "cursor-not-allowed opacity-60"
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={item.value}
                    checked={selected}
                    disabled={loading}
                    onChange={() => setRole(item.value)}
                    className="sr-only"
                  />

                  <span className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-lg",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                    </span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-4 place-items-center rounded-full border transition-colors",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40 bg-background"
                      )}
                    >
                      {selected ? (
                        <Check className="size-2.5" strokeWidth={3} />
                      ) : null}
                    </span>
                  </span>

                  <span className="mt-2.5 block text-[12.5px] font-semibold">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[10.5px] leading-snug text-muted-foreground">
                    {item.description}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] text-[13px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(37,99,235,0.9)] transition-all outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-primary/35 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create Account
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
          Already have an account?{" "}
          <Link
            href={signInHref}
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}
