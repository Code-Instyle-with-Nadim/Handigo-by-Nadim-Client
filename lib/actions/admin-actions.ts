"use server"

import { revalidatePath } from "next/cache"

import type { ActionResult } from "@/lib/actions/action-result"
import { requireActionUser } from "@/lib/actions/guard"
import { toObjectId, usersCollection } from "@/lib/collections"
import type { UserRole } from "@/lib/roles"

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<ActionResult> {
  const guard = await requireActionUser("admin")

  if (!guard.ok) {
    return { ok: false, error: guard.error }
  }

  if (role !== "customer" && role !== "technician" && role !== "admin") {
    return { ok: false, error: "Please choose a valid role." }
  }

  if (userId === guard.user.id) {
    return { ok: false, error: "You cannot change your own role." }
  }

  const id = toObjectId(userId)

  if (!id) {
    return { ok: false, error: "That user could not be found." }
  }

  const result = await usersCollection.updateOne(
    { _id: id },
    {
      $set: {
        role,
        updatedAt: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return { ok: false, error: "That user could not be found." }
  }

  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/admin/users")

  return {
    ok: true,
    message: `Role updated to ${role}.`,
  }
}
