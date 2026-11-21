import type { Metadata } from "next"

import { ProfileForm } from "@/components/dashboard/profile-form"
import { requireServerSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Your profile",
}

export default async function ProfilePage() {
  const session = await requireServerSession("/dashboard/profile")
  const user = session.user

  return (
    <ProfileForm
      user={{
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
        role: user.role,
        phone: user.phone ?? "",
        area: user.area ?? "",
        bio: user.bio ?? "",
      }}
    />
  )
}
