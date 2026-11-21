import { normalizeRole, type UserRole } from "@/lib/roles"
import { getServerSession } from "@/lib/session"

export type ActionUser = {
  id: string
  name: string
  email: string
  image: string
  role: UserRole
}

type GuardResult =
  | { ok: true; user: ActionUser }
  | { ok: false; error: string }

export async function requireActionUser(role?: UserRole): Promise<GuardResult> {
  const session = await getServerSession()

  if (!session?.user) {
    return { ok: false, error: "Please sign in to continue." }
  }

  const currentRole = normalizeRole(session.user.role)

  if (role && currentRole !== role) {
    return { ok: false, error: "You do not have permission to do that." }
  }

  return {
    ok: true,
    user: {
      id: session.user.id,
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      image: session.user.image ?? "",
      role: currentRole,
    },
  }
}
