"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import { AuthInput } from "@/components/auth/auth-field"
import { ImageUpload } from "@/components/dashboard/image-upload"
import { RoleBadge } from "@/components/site/role-badge"
import { authClient } from "@/lib/auth-client"
import { getRoleMeta } from "@/lib/roles"
import { notifySessionUpdated } from "@/lib/session-events"
import { cn } from "@/lib/utils"

type ProfileUser = {
  name: string
  email: string
  image: string
  role?: string | null
  phone: string
  area: string
  bio: string
}

const BIO_LIMIT = 320

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter()

  const [name, setName] = useState(user.name)
  const [image, setImage] = useState(user.image)
  const [phone, setPhone] = useState(user.phone)
  const [area, setArea] = useState(user.area)
  const [bio, setBio] = useState(user.bio)

  const [nameError, setNameError] = useState<string | undefined>()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) {
      setNameError("Full name is required.")
      return
    }

    setNameError(undefined)
    setSaving(true)

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
        phone: phone.trim(),
        area: area.trim(),
        bio: bio.trim(),
      })

      if (error) {
        toast.error(error.message || "Unable to update your profile.")
        return
      }

      toast.success("Profile updated successfully.")
      notifySessionUpdated()
      router.refresh()
    } catch {
      toast.error("Unable to update your profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page-shell py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.14em] text-primary uppercase">
            Account
          </span>
          <RoleBadge role={user.role} />
        </div>

        <h1 className="display-title mt-3 text-[2rem] leading-[1.05] tracking-[-0.05em] sm:text-[2.5rem]">
          Your profile
        </h1>
        <p className="mt-2 max-w-lg text-[12.5px] leading-relaxed text-muted-foreground">
          Keep your contact details up to date so customers and technicians can
          reach you when a job is booked.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-7 rounded-3xl border border-border/70 bg-card/85 p-5 shadow-[0_24px_70px_-48px_rgba(4,18,38,0.45)] sm:p-7"
        >
          <div className="mb-5">
            <ImageUpload
              id="profile-image"
              label="Profile photo"
              value={image}
              disabled={saving}
              shape="circle"
              onChange={setImage}
              hint="Upload a clear photo of yourself. It appears in the navbar and dashboard straight away."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AuthInput
              id="profile-name"
              name="name"
              type="text"
              label="Full name"
              autoComplete="name"
              value={name}
              disabled={saving}
              icon={<UserRound className="size-4" />}
              error={nameError}
              onChange={(event) => {
                setName(event.target.value)
                setNameError(undefined)
              }}
              onBlur={() =>
                setNameError(name.trim() ? undefined : "Full name is required.")
              }
            />

            <AuthInput
              id="profile-phone"
              name="phone"
              type="tel"
              label="Phone number"
              autoComplete="tel"
              placeholder="+880 1700 000000"
              value={phone}
              disabled={saving}
              icon={<Phone className="size-4" />}
              onChange={(event) => setPhone(event.target.value)}
            />

            <AuthInput
              id="profile-email"
              name="email"
              type="email"
              label="Email address"
              value={user.email}
              disabled
              icon={<Mail className="size-4" />}
              hint="Your sign-in email can't be changed here."
            />

            <AuthInput
              id="profile-role"
              name="role"
              type="text"
              label="Account role"
              value={getRoleMeta(user.role).label}
              disabled
              icon={<ShieldCheck className="size-4" />}
              hint="Roles are managed by an admin."
            />

            <div className="sm:col-span-2">
              <AuthInput
                id="profile-area"
                name="area"
                type="text"
                label="Service area"
                placeholder="e.g. Dhanmondi, Dhaka"
                value={area}
                disabled={saving}
                icon={<MapPin className="size-4" />}
                hint="The neighbourhood or city you work in or book services for."
                onChange={(event) => setArea(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label
                htmlFor="profile-bio"
                className="block text-[11.5px] font-semibold"
              >
                About you
              </label>
              <span
                className={cn(
                  "text-[10.5px] tabular-nums",
                  bio.length > BIO_LIMIT
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {bio.length}/{BIO_LIMIT}
              </span>
            </div>

            <textarea
              id="profile-bio"
              name="bio"
              rows={4}
              maxLength={BIO_LIMIT}
              value={bio}
              disabled={saving}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Tell people a little about yourself, your craft or the kind of help you need."
              className="w-full resize-y rounded-xl border border-input bg-background/60 px-3.5 py-3 text-base transition-all outline-none placeholder:text-muted-foreground/55 focus:border-primary/50 focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13px]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="group mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2f6df6_0%,#1e56e0_56%,#173fb8_100%)] px-5 text-[12.5px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(37,99,235,0.9)] transition-all outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-primary/35 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
